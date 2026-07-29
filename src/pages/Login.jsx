import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useStore } from '../store/useStore'
import { auth, db } from '../firebase'
import { signInWithEmailAndPassword, setPersistence, browserLocalPersistence, browserSessionPersistence } from 'firebase/auth'
import { doc, getDoc } from 'firebase/firestore'
import { Loader2 } from 'lucide-react'

export default function Login() {
  const navigate = useNavigate()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [rememberMe, setRememberMe] = useState(true)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleLogin = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      // Set session persistence (local for desktop & mobile, or session if unchecked)
      await setPersistence(auth, rememberMe ? browserLocalPersistence : browserSessionPersistence)
      const userCredential = await signInWithEmailAndPassword(auth, email, password)
      const user = userCredential.user

      // Fetch user role from Firestore
      const userDoc = await getDoc(doc(db, 'users', user.uid))

      let role = 'cliente'
      let status = 'active'

      if (email.toLowerCase() === 'wabyadmin@waby.com') {
        role = 'admin'
      } else if (userDoc.exists()) {
        const data = userDoc.data()
        role = data.role
        status = data.status || 'active'
      }

      useStore.getState().setUser(user, role, status)

      if (role === 'admin') {
        navigate('/admin')
      } else if (role === 'tienda') {
        await useStore.getState().fetchStoreData(user.uid)
        navigate('/builder')
      } else {
        navigate('/market')
      }
    } catch (err) {
      console.error(err)
      setError(`Error: ${err.message}`)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div style={{ animation: 'fadeIn 0.3s ease' }}>
      <h2 style={{ fontSize: '2rem', marginBottom: '0.5rem', color: '#1C2B23', fontFamily: 'Fraunces' }}>Bienvenido de nuevo</h2>
      <p style={{ color: '#5F7368', marginBottom: '2rem' }}>Ingresa a tu cuenta para continuar.</p>

      <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: '1.2rem' }}>
        {error && <div style={{ color: 'red', fontSize: '0.9rem', textAlign: 'center', background: '#FEE2E2', padding: '0.5rem', borderRadius: '8px' }}>{error}</div>}
        <div>
          <label style={{ display: 'block', marginBottom: '0.3rem', fontSize: '0.9rem', fontWeight: 'bold', color: '#1C2B23' }}>Correo Electrónico</label>
          <input
            type="email"
            placeholder="ejemplo@correo.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            style={{ width: '100%', padding: '0.8rem 1.2rem', borderRadius: '50px', border: '1px solid #CBD5E1', outline: 'none', background: '#F8FAFC' }}
            required
          />
        </div>
        <div>
          <label style={{ display: 'block', marginBottom: '0.3rem', fontSize: '0.9rem', fontWeight: 'bold', color: '#1C2B23' }}>Contraseña</label>
          <input
            type="password"
            placeholder="••••••••"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            style={{ width: '100%', padding: '0.8rem 1.2rem', borderRadius: '50px', border: '1px solid #CBD5E1', outline: 'none', background: '#F8FAFC' }}
            required
          />
        </div>

        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', margin: '0.2rem 0', flexWrap: 'wrap', gap: '0.5rem' }}>
          <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.85rem', color: '#5F7368', cursor: 'pointer', userSelect: 'none' }}>
            <input
              type="checkbox"
              checked={rememberMe}
              onChange={(e) => setRememberMe(e.target.checked)}
              style={{ width: '16px', height: '16px', accentColor: '#11683E', cursor: 'pointer' }}
            />
            Recordar mi sesión
          </label>
          <a href="#" style={{ color: '#11683E', fontSize: '0.85rem', textDecoration: 'none', fontWeight: 'bold' }}>¿Olvidaste tu contraseña?</a>
        </div>

        <button type="submit" disabled={loading} style={{ display: 'flex', justifyContent: 'center', gap: '0.5rem', background: '#11683E', color: 'white', border: 'none', padding: '1rem', borderRadius: '50px', fontWeight: 'bold', fontSize: '1rem', cursor: loading ? 'not-allowed' : 'pointer', marginTop: '1rem', opacity: loading ? 0.7 : 1, transition: 'transform 0.2s', boxShadow: '0 4px 10px rgba(17, 104, 62, 0.2)' }}
          onMouseOver={e => e.currentTarget.style.transform = 'scale(1.02)'}
          onMouseOut={e => e.currentTarget.style.transform = 'scale(1)'}
        >
          {loading ? <Loader2 className="spinner" size={20} /> : 'Iniciar Sesión'}
        </button>
      </form>

      <div style={{ textAlign: 'center', marginTop: '1.5rem', color: '#5F7368' }}>
        ¿No tienes una cuenta? <Link to="/register" style={{ color: 'var(--primary)', fontWeight: 'bold', textDecoration: 'none' }}>Regístrate</Link>
      </div>

      <div style={{ textAlign: 'center', marginTop: '0.5rem', fontSize: '0.9rem' }}>
        ¿Eres vendedor? <Link to="/planes" style={{ color: '#F97316', fontWeight: 'bold', textDecoration: 'none' }}>Descubre nuestros planes</Link>
      </div>
    </div>
  )
}
