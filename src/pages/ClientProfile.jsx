import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useStore } from '../store/useStore'
import { Package, User, Upload, ArrowLeft, CheckCircle, X } from 'lucide-react'

const SuccessModal = ({ onClose }) => (
  <div style={{
    position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
    background: 'rgba(0,0,0,0.6)', display: 'flex', alignItems: 'center', justifyContent: 'center',
    zIndex: 2000, backdropFilter: 'blur(4px)'
  }}>
    <div style={{
      background: 'white', borderRadius: '24px', padding: '3rem 2rem', width: '90%', maxWidth: '400px',
      textAlign: 'center', animation: 'fadeIn 0.3s ease-out', boxShadow: '0 25px 50px -12px rgba(0,0,0,0.5)',
      position: 'relative'
    }}>
      <button onClick={onClose} style={{ position: 'absolute', top: '1.5rem', right: '1.5rem', background: 'none', border: 'none', cursor: 'pointer', color: '#94A3B8' }}>
        <X size={24} />
      </button>
      <div style={{ width: '80px', height: '80px', background: '#F0FDF4', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1.5rem auto' }}>
        <CheckCircle size={40} color="#16A34A" />
      </div>
      <h2 style={{ margin: '0 0 1rem 0', color: '#166534', fontSize: '1.5rem' }}>¡Perfil Actualizado!</h2>
      <p style={{ color: '#475569', marginBottom: '2rem', lineHeight: '1.5' }}>
        Tus cambios han sido guardados exitosamente.
      </p>
      <button 
        onClick={onClose}
        style={{ width: '100%', padding: '1rem', background: '#16A34A', color: 'white', border: 'none', borderRadius: '12px', fontWeight: 'bold', fontSize: '1rem', cursor: 'pointer' }}
      >
        Continuar
      </button>
    </div>
  </div>
)

export default function ClientProfile() {
  const navigate = useNavigate()
  const { userProfile, updateUserProfile, orders } = useStore()
  
  const [name, setName] = useState(userProfile.name || '')
  const [avatar, setAvatar] = useState(userProfile.avatar || '')
  const [isSaving, setIsSaving] = useState(false)
  const [showSuccess, setShowSuccess] = useState(false)

  const handleImageUpload = (e) => {
    const file = e.target.files[0]
    if (file) {
      const reader = new FileReader()
      reader.onloadend = () => {
        const img = new Image()
        img.src = reader.result
        img.onload = () => {
          const canvas = document.createElement('canvas')
          const MAX_SIZE = 200
          let width = img.width
          let height = img.height

          if (width > height) {
            if (width > MAX_SIZE) {
              height *= MAX_SIZE / width
              width = MAX_SIZE
            }
          } else {
            if (height > MAX_SIZE) {
              width *= MAX_SIZE / height
              height = MAX_SIZE
            }
          }

          canvas.width = width
          canvas.height = height
          const ctx = canvas.getContext('2d')
          ctx.drawImage(img, 0, 0, width, height)
          const dataUrl = canvas.toDataURL('image/jpeg', 0.8)
          setAvatar(dataUrl)
        }
      }
      reader.readAsDataURL(file)
    }
  }

  const handleSave = async (e) => {
    e.preventDefault()
    setIsSaving(true)
    await updateUserProfile(name, avatar)
    setIsSaving(false)
    setShowSuccess(true)
  }

  return (
    <div style={{ background: '#F8F9F3', minHeight: '100vh', fontFamily: "'Inter', sans-serif" }}>
      <div style={{ background: 'white', padding: '1.5rem 2rem', boxShadow: '0 2px 4px rgba(0,0,0,0.05)', display: 'flex', alignItems: 'center', gap: '1rem' }}>
        <button onClick={() => navigate('/market')} style={{ background: 'none', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', color: '#64748B' }}>
          <ArrowLeft size={24} />
        </button>
        <h1 style={{ margin: 0, fontSize: '1.5rem', color: '#0F172A' }}>Mi Perfil</h1>
      </div>

      <div className="client-profile-grid">
        
        {/* Ajustes de Cuenta */}
        <div className="client-profile-card">
          <h2 style={{ margin: '0 0 1.5rem 0', display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '1.2rem', color: '#0F172A' }}>
            <User size={20} /> Ajustes de Cuenta
          </h2>
          
          <form onSubmit={handleSave} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1rem' }}>
              <div style={{ width: '120px', height: '120px', borderRadius: '50%', background: '#F1F5F9', overflow: 'hidden', display: 'flex', alignItems: 'center', justifyContent: 'center', border: '4px solid white', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.1)' }}>
                {avatar ? (
                  <img src={avatar} alt="Avatar" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                ) : (
                  <User size={48} color="#94A3B8" />
                )}
              </div>
              <div>
                <input type="file" id="avatarUpload" accept="image/*" onChange={handleImageUpload} style={{ display: 'none' }} />
                <label htmlFor="avatarUpload" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', background: '#F8FAFC', padding: '0.5rem 1rem', borderRadius: '20px', fontSize: '0.9rem', color: '#0F172A', cursor: 'pointer', border: '1px solid #E2E8F0', fontWeight: 'bold' }}>
                  <Upload size={16} /> Cambiar Foto
                </label>
              </div>
            </div>

            <div>
              <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.9rem', fontWeight: 'bold', color: '#64748B' }}>Nombre Completo</label>
              <input 
                type="text" 
                value={name}
                onChange={e => setName(e.target.value)}
                placeholder="Ej. Juan Pérez"
                style={{ width: '100%', padding: '0.8rem', borderRadius: '8px', border: '1px solid #E2E8F0', outline: 'none', fontSize: '1rem' }}
              />
            </div>

            <button 
              type="submit" 
              disabled={isSaving}
              style={{ background: 'var(--primary)', color: 'white', border: 'none', padding: '0.8rem', borderRadius: '8px', fontWeight: 'bold', cursor: isSaving ? 'not-allowed' : 'pointer', marginTop: '1rem', opacity: isSaving ? 0.7 : 1 }}
            >
              {isSaving ? 'Guardando...' : 'Guardar Cambios'}
            </button>
          </form>
        </div>

        {/* Historial de Órdenes */}
        <div className="client-profile-card">
          <h2 style={{ margin: '0 0 1.5rem 0', display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '1.2rem', color: '#0F172A' }}>
            <Package size={20} /> Historial de Órdenes
          </h2>

          {orders.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '3rem 0', color: '#94A3B8' }}>
              <Package size={48} style={{ opacity: 0.5, marginBottom: '1rem' }} />
              <p>No tienes órdenes previas.</p>
              <button onClick={() => navigate('/market')} style={{ background: '#F1F5F9', color: '#0F172A', border: 'none', padding: '0.6rem 1.2rem', borderRadius: '8px', marginTop: '0.5rem', fontWeight: 'bold', cursor: 'pointer' }}>Explorar Tiendas</button>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              {orders.map((order, idx) => (
                <div key={idx} style={{ border: '1px solid #E2E8F0', borderRadius: '12px', padding: '1.5rem', background: '#F8FAFC' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1rem' }}>
                    <div>
                      <span style={{ fontSize: '0.8rem', color: '#64748B', display: 'block' }}>ID: {order.id}</span>
                      <strong style={{ fontSize: '1.2rem', color: 'var(--primary)' }}>${order.total.toFixed(2)}</strong>
                    </div>
                    <span style={{ background: '#FEF3C7', color: '#D97706', padding: '0.4rem 0.8rem', borderRadius: '20px', fontSize: '0.8rem', fontWeight: 'bold' }}>
                      {order.status}
                    </span>
                  </div>
                  
                  <div style={{ borderTop: '1px dashed #CBD5E1', paddingTop: '1rem' }}>
                    <p style={{ margin: '0 0 0.5rem 0', fontSize: '0.9rem', fontWeight: 'bold', color: '#0F172A' }}>Productos:</p>
                    <ul style={{ margin: 0, paddingLeft: '1.2rem', fontSize: '0.9rem', color: '#475569' }}>
                      {order.items.map((item, i) => (
                        <li key={i}>{item.quantity}x {item.name}</li>
                      ))}
                    </ul>
                  </div>
                  <div style={{ fontSize: '0.8rem', color: '#94A3B8', textAlign: 'right', marginTop: '1rem' }}>
                    {new Date(order.date).toLocaleDateString()}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

      </div>

      {/* Success Overlay */}
      {showSuccess && <SuccessModal onClose={() => setShowSuccess(false)} />}
    </div>
  )
}
