import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useStore } from '../store/useStore'
import { Store, ShoppingBag, ArrowLeft, Loader2 } from 'lucide-react'
import { auth, db } from '../firebase'
import { createUserWithEmailAndPassword } from 'firebase/auth'
import { doc, setDoc } from 'firebase/firestore'

export default function Register() {
  const navigate = useNavigate()
  const setUserRole = useStore(state => state.setUserRole)
  const [step, setStep] = useState(1) // 1: Role Selection, 2: Form
  const [selectedRole, setSelectedRole] = useState(null) // 'tienda' or 'cliente'

  // Form fields
  const [name, setName] = useState('')
  const [storeName, setStoreName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleRoleSelect = (role) => {
    setSelectedRole(role)
    setStep(2)
  }

  const handleRegister = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password)
      const user = userCredential.user

      // Save additional user info in Firestore
      await setDoc(doc(db, 'users', user.uid), {
        uid: user.uid,
        name: name,
        role: selectedRole,
        email: email,
        storeName: selectedRole === 'tienda' ? storeName : null,
        status: selectedRole === 'tienda' ? 'pending_activation' : 'active',
        createdAt: new Date().toISOString()
      })

      // Update local state
      useStore.getState().setUser(user, selectedRole, selectedRole === 'tienda' ? 'pending_activation' : 'active')

      if (selectedRole === 'tienda') {
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

      {step === 1 && (
        <>
          <h2 style={{ fontSize: '2rem', marginBottom: '0.5rem', color: '#1C2B23', fontFamily: 'Fraunces' }}>Crea tu cuenta</h2>
          <p style={{ color: '#5F7368', marginBottom: '2rem' }}>¿Cómo planeas usar Sabores del Paraíso?</p>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <div
              onClick={() => handleRoleSelect('tienda')}
              style={{ border: '2px solid #E2E8E0', borderRadius: '12px', padding: '1.5rem', cursor: 'pointer', display: 'flex', gap: '1rem', alignItems: 'center', transition: 'all 0.2s', background: 'white' }}
              onMouseOver={(e) => e.currentTarget.style.borderColor = '#11683E'}
              onMouseOut={(e) => e.currentTarget.style.borderColor = '#E2E8E0'}
            >
              <div style={{ background: '#F4FBF7', padding: '1rem', borderRadius: '50%', color: '#11683E' }}>
                <Store size={28} />
              </div>
              <div>
                <h4 style={{ margin: '0 0 0.3rem 0', color: '#1C2B23', fontSize: '1.1rem' }}>Quiero crear mi tienda</h4>
                <p style={{ margin: 0, color: '#5F7368', fontSize: '0.85rem' }}>Vende tus productos tropicales al mundo.</p>
              </div>
            </div>

            <div
              onClick={() => handleRoleSelect('cliente')}
              style={{ border: '2px solid #E2E8E0', borderRadius: '12px', padding: '1.5rem', cursor: 'pointer', display: 'flex', gap: '1rem', alignItems: 'center', transition: 'all 0.2s', background: 'white' }}
              onMouseOver={(e) => e.currentTarget.style.borderColor = '#FF3B30'}
              onMouseOut={(e) => e.currentTarget.style.borderColor = '#E2E8E0'}
            >
              <div style={{ background: '#FFF1F0', padding: '1rem', borderRadius: '50%', color: '#FF3B30' }}>
                <ShoppingBag size={28} />
              </div>
              <div>
                <h4 style={{ margin: '0 0 0.3rem 0', color: '#1C2B23', fontSize: '1.1rem' }}>Quiero comprar productos</h4>
                <p style={{ margin: 0, color: '#5F7368', fontSize: '0.85rem' }}>Explora y compra directo de los productores.</p>
              </div>
            </div>
          </div>
        </>
      )}

      {step === 2 && (
        <div style={{ animation: 'fadeIn 0.2s ease' }}>
          <button onClick={() => setStep(1)} style={{ background: 'none', border: 'none', display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#5F7368', cursor: 'pointer', marginBottom: '1.5rem', padding: 0 }}>
            <ArrowLeft size={16} /> Volver a roles
          </button>

          <h2 style={{ fontSize: '2rem', marginBottom: '0.5rem', color: '#1C2B23', fontFamily: 'Fraunces' }}>
            {selectedRole === 'tienda' ? 'Abre tu Tienda' : 'Únete como Cliente'}
          </h2>
          <p style={{ color: '#5F7368', marginBottom: '2rem' }}>Ingresa tus datos para continuar.</p>

          <form onSubmit={handleRegister} style={{ display: 'flex', flexDirection: 'column', gap: '1.2rem' }}>
            {error && <div style={{ color: 'red', fontSize: '0.9rem', textAlign: 'center', background: '#FEE2E2', padding: '0.5rem', borderRadius: '8px' }}>{error}</div>}

            <div>
              <label style={{ display: 'block', marginBottom: '0.3rem', fontSize: '0.9rem', fontWeight: 'bold', color: '#1C2B23' }}>Nombre Completo</label>
              <input type="text" value={name} onChange={e => setName(e.target.value)} placeholder="Juan Pérez" style={{ width: '100%', padding: '0.8rem 1.2rem', borderRadius: '50px', border: '1px solid #CBD5E1', outline: 'none', background: '#F8FAFC' }} required />
            </div>
            {selectedRole === 'tienda' && (
              <div>
                <label style={{ display: 'block', marginBottom: '0.3rem', fontSize: '0.9rem', fontWeight: 'bold', color: '#1C2B23' }}>Nombre de la Tienda</label>
                <input type="text" value={storeName} onChange={e => setStoreName(e.target.value)} placeholder="Ej. Frutas Don Juan" style={{ width: '100%', padding: '0.8rem 1.2rem', borderRadius: '50px', border: '1px solid #CBD5E1', outline: 'none', background: '#F8FAFC' }} required />
              </div>
            )}
            <div>
              <label style={{ display: 'block', marginBottom: '0.3rem', fontSize: '0.9rem', fontWeight: 'bold', color: '#1C2B23' }}>Correo Electrónico</label>
              <input type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="ejemplo@correo.com" style={{ width: '100%', padding: '0.8rem 1.2rem', borderRadius: '50px', border: '1px solid #CBD5E1', outline: 'none', background: '#F8FAFC' }} required />
            </div>
            <div>
              <label style={{ display: 'block', marginBottom: '0.3rem', fontSize: '0.9rem', fontWeight: 'bold', color: '#1C2B23' }}>Contraseña</label>
              <input type="password" value={password} onChange={e => setPassword(e.target.value)} placeholder="••••••••" style={{ width: '100%', padding: '0.8rem 1.2rem', borderRadius: '50px', border: '1px solid #CBD5E1', outline: 'none', background: '#F8FAFC' }} required minLength={6} />
            </div>

            <button type="submit" disabled={loading} style={{ display: 'flex', justifyContent: 'center', gap: '0.5rem', background: selectedRole === 'tienda' ? '#11683E' : '#FF3B30', color: 'white', border: 'none', padding: '1rem', borderRadius: '50px', fontWeight: 'bold', fontSize: '1rem', cursor: loading ? 'not-allowed' : 'pointer', marginTop: '1rem', opacity: loading ? 0.7 : 1, transition: 'transform 0.2s', boxShadow: '0 4px 10px rgba(0, 0, 0, 0.1)' }}
              onMouseOver={e => e.currentTarget.style.transform = 'scale(1.02)'}
              onMouseOut={e => e.currentTarget.style.transform = 'scale(1)'}
            >
              {loading ? <Loader2 className="spinner" size={20} /> : 'Crear Cuenta'}
            </button>
          </form>
        </div>
      )}

      <div style={{ textAlign: 'center', marginTop: '1.5rem', color: '#5F7368' }}>
        ¿Ya tienes cuenta? <Link to="/login" style={{ color: '#11683E', fontWeight: 'bold', textDecoration: 'none' }}>Inicia Sesión</Link>
      </div>

      <div style={{ textAlign: 'center', marginTop: '0.5rem', fontSize: '0.9rem' }}>
        ¿Eres vendedor? <Link to="/planes" style={{ color: '#F97316', fontWeight: 'bold', textDecoration: 'none' }}>Descubre nuestros planes</Link>
      </div>
    </div>
  )
}
