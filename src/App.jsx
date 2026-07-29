import React, { useEffect, useState } from 'react'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import EditorPanel from './components/EditorPanel'
import StorePreview from './components/StorePreview'
import SuperAdminPanel from './pages/SuperAdminPanel'
import AuthLayout from './pages/AuthLayout'
import Login from './pages/Login'
import Register from './pages/Register'
import MarketHome from './pages/MarketHome'
import Pricing from './pages/Pricing'
import { useStore } from './store/useStore'
import { auth, db } from './firebase'
import { onAuthStateChanged } from 'firebase/auth'
import { doc, getDoc } from 'firebase/firestore'

// Componente para el Builder (Dueño de Tienda)
function BuilderLayout() {
  return (
    <div className="layout">
      {/* Sidebar - Panel de Diseño (Izquierda) */}
      <EditorPanel />

      {/* Main Content - Preview de la Tienda (Derecha) */}
      <main className="main-preview-area">
        <StorePreview />
      </main>
    </div>
  )
}

// Componente Público / Cliente
function StorefrontLayout() {
  return (
    <div style={{ background: '#F8F9F3', minHeight: '100vh', width: '100vw' }}>
      <StorePreview isReadOnly={true} />
    </div>
  )
}

function App() {
  const userRole = useStore(state => state.userRole)
  const setUser = useStore(state => state.setUser)
  const [authInitialized, setAuthInitialized] = useState(false)

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        try {
          const userDoc = await getDoc(doc(db, 'users', user.uid))
          if (userDoc.exists()) {
            const data = userDoc.data()
            setUser(user, data.role, data.status || 'active')
            if (data.role === 'tienda') {
              useStore.getState().fetchStoreData(user.uid)
            } else if (data.role === 'cliente') {
              useStore.getState().fetchClientOrders(user.uid)
            }
          } else {
            setUser(user, 'cliente', 'active')
            useStore.getState().fetchClientOrders(user.uid)
          }
        } catch (error) {
          console.error("Error fetching user data:", error)
          setUser(user, 'cliente', 'active')
          useStore.getState().fetchClientOrders(user.uid)
        }
      } else {
        useStore.getState().logout()
      }
      setAuthInitialized(true)
    })

    return () => unsubscribe()
  }, [setUser])

  if (!authInitialized) {
    return <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', background: '#F8F9F3' }}>Cargando Waby...</div>
  }

  return (
    <BrowserRouter>
      <Routes>
        {/* Redirigir el inicio a login por defecto */}
        <Route path="/" element={<Navigate to="/login" replace />} />

        {/* Rutas de Autenticación */}
        <Route element={<AuthLayout />}>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
        </Route>

        {/* Ruta de Precios / Membresía (Pública) */}
        <Route path="/planes" element={<Pricing />} />

        {/* Ruta del Creador de Tiendas (protegida para tiendas) */}
        <Route 
          path="/builder" 
          element={
            userRole === 'tienda' ? <BuilderLayout /> : <Navigate to="/login" replace />
          } 
        />

        {/* Ruta del Súper Administrador */}
        <Route 
          path="/admin" 
          element={
            userRole === 'admin' ? <SuperAdminPanel /> : <Navigate to="/login" replace />
          } 
        />

        {/* Directorio Principal / Marketplace */}
        <Route 
          path="/market" 
          element={<MarketHome />} 
        />

        {/* Ruta Pública / Tienda (para clientes o dueños) */}
        <Route 
          path="/store/:storeId" 
          element={<StorefrontLayout />} 
        />
        
        {/* Redirección por defecto si entran a /store sin ID */}
        <Route path="/store" element={<Navigate to="/store/1" />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
