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
import ClientProfile from './pages/ClientProfile'
import StoreProfile from './pages/StoreProfile'
import { useStore } from './store/useStore'
import { auth, db } from './firebase'
import { onAuthStateChanged } from 'firebase/auth'
import { doc, getDoc } from 'firebase/firestore'

import { ToastBanner } from './components/NotificationBell'

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
    <div style={{ background: '#F8F9F3', minHeight: '100vh', width: '100%' }}>
      <StorePreview isReadOnly={true} />
    </div>
  )
}

function App() {
  const userRole = useStore(state => state.userRole)
  const setUser = useStore(state => state.setUser)
  const [authInitialized, setAuthInitialized] = useState(false)

  useEffect(() => {
    // Cargar configuraciones globales (ej. Tasa BCV) al iniciar
    useStore.getState().fetchGlobalSettings()

    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        try {
          const userDoc = await getDoc(doc(db, 'users', user.uid))
          if (userDoc.exists()) {
            const data = userDoc.data()
            setUser(user, data.role, data.status || 'active', { name: data.name || '', avatar: data.avatar || '' })
            if (data.role === 'tienda') {
              useStore.getState().fetchStoreData(user.uid)
            } else if (data.role === 'cliente') {
              useStore.getState().fetchClientOrders(user.uid)
            }
          } else {
            setUser(user, 'cliente', 'active', { name: user.displayName || '', avatar: user.photoURL || '' })
            useStore.getState().fetchClientOrders(user.uid)
          }
        } catch (error) {
          console.error("Error fetching user data:", error)
          setUser(user, 'cliente', 'active', { name: user.displayName || '', avatar: user.photoURL || '' })
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
      <ToastBanner />
      <Routes>
        {/* Directorio Principal / Marketplace por defecto */}
        <Route path="/" element={<MarketHome />} />

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

        {/* Perfil (Cliente o Tienda) */}
        <Route
          path="/profile"
          element={
            userRole === 'cliente' ? <ClientProfile /> : 
            userRole === 'tienda' ? <StoreProfile /> : 
            <Navigate to="/login" replace />
          }
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
