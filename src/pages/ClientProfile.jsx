import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useStore } from '../store/useStore'
import { Package, User, Upload, ArrowLeft, CheckCircle, X } from 'lucide-react'
import { NotificationBell } from '../components/NotificationBell'

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
  const { user, userProfile, updateUserProfile, orders, logout } = useStore()
  
  const [name, setName] = useState(userProfile?.name || '')
  const [avatar, setAvatar] = useState(userProfile?.avatar || '')
  const [isSaving, setIsSaving] = useState(false)
  const [showSuccess, setShowSuccess] = useState(false)

  useEffect(() => {
    if (userProfile) {
      setName(userProfile.name || '')
      setAvatar(userProfile.avatar || '')
    }
  }, [userProfile])

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
      <div style={{ background: 'white', padding: '1.5rem 2rem', boxShadow: '0 2px 4px rgba(0,0,0,0.05)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <button onClick={() => navigate('/market')} style={{ background: 'none', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', color: '#64748B' }}>
            <ArrowLeft size={24} />
          </button>
          <h1 style={{ margin: 0, fontSize: '1.5rem', color: '#0F172A' }}>Mi Perfil</h1>
        </div>
        <NotificationBell />
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
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.2rem' }}>
              {orders.map((order, idx) => (
                <div key={idx} style={{ background: '#F8FAFC', border: '1px solid #E2E8F0', borderRadius: '16px', padding: '1.25rem' }}>
                  {/* Header de la Tienda */}
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid #E2E8F0', paddingBottom: '0.8rem', marginBottom: '1rem', flexWrap: 'wrap', gap: '0.5rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                      <div style={{ width: '38px', height: '38px', borderRadius: '10px', background: 'white', border: '1px solid #CBD5E1', display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden', flexShrink: 0 }}>
                        {order.storeLogo && (order.storeLogo.startsWith('http') || order.storeLogo.startsWith('data:')) ? (
                          <img src={order.storeLogo} alt="Logo" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                        ) : (
                          <span style={{ fontSize: '1.2rem' }}>{order.storeLogo || '🏪'}</span>
                        )}
                      </div>
                      <div>
                        <h5 style={{ margin: 0, fontSize: '0.95rem', fontWeight: 'bold', color: '#0F172A' }}>{order.storeName || 'Tienda Waby'}</h5>
                        <span style={{ fontSize: '0.75rem', color: '#64748B' }}>📍 {order.storeLocation || 'Venta Online'} {order.storeCategory ? `• ${order.storeCategory}` : ''}</span>
                      </div>
                    </div>

                    <div style={{ textAlign: 'right' }}>
                      <span style={{ 
                        background: order.status === 'Aprobado' || order.status === 'Completado' ? '#D1FAE5' : '#FEF3C7', 
                        color: order.status === 'Aprobado' || order.status === 'Completado' ? '#065F46' : '#D97706', 
                        padding: '0.3rem 0.7rem', borderRadius: '20px', fontSize: '0.75rem', fontWeight: 'bold', display: 'inline-block'
                      }}>
                        {order.status || 'Validando Pago'}
                      </span>
                      <span style={{ fontSize: '0.75rem', color: '#94A3B8', display: 'block', marginTop: '0.2rem' }}>
                        {new Date(order.date).toLocaleDateString()}
                      </span>
                    </div>
                  </div>

                  {/* Productos comprados */}
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.8rem', marginBottom: '1rem' }}>
                    {order.items && order.items.map((item, i) => (
                      <div key={i} style={{ display: 'flex', gap: '0.8rem', alignItems: 'center', background: 'white', padding: '0.6rem 0.8rem', borderRadius: '10px', border: '1px solid #E2E8F0' }}>
                        <img 
                          src={item.image || 'https://images.unsplash.com/photo-1550258987-190a2d41a8ba?q=80&w=200'} 
                          alt={item.name} 
                          style={{ width: '48px', height: '48px', objectFit: 'cover', borderRadius: '8px', flexShrink: 0 }} 
                        />
                        <div style={{ flex: 1, minWidth: 0 }}>
                          <h6 style={{ margin: '0 0 0.1rem 0', fontSize: '0.9rem', color: '#0F172A', fontWeight: 'bold', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{item.name}</h6>
                          <p style={{ margin: 0, fontSize: '0.75rem', color: '#64748B', display: '-webkit-box', WebkitLineClamp: 1, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                            {item.description || 'Garantía de calidad y envío directo'}
                          </p>
                        </div>
                        <div style={{ textAlign: 'right', flexShrink: 0 }}>
                          <span style={{ fontSize: '0.85rem', fontWeight: 'bold', color: 'var(--primary)', display: 'block' }}>${((item.price || 0) * (item.quantity || 1)).toFixed(2)}</span>
                          <span style={{ fontSize: '0.75rem', color: '#94A3B8' }}>{item.quantity} x ${item.price?.toFixed(2) || '0.00'}</span>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Footer con Resumen de Pago */}
                  <div style={{ borderTop: '1px dashed #CBD5E1', paddingTop: '0.8rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div style={{ fontSize: '0.8rem', color: '#64748B' }}>
                      {order.pagoMovil?.reference && (
                        <span>💳 Ref: <strong>{order.pagoMovil.reference}</strong> ({order.pagoMovil.bank || 'Pago Móvil'})</span>
                      )}
                    </div>
                    <div style={{ textAlign: 'right' }}>
                      <span style={{ fontSize: '0.8rem', color: '#64748B', marginRight: '0.4rem' }}>Total:</span>
                      <strong style={{ fontSize: '1.1rem', color: '#0F172A' }}>${order.total ? order.total.toFixed(2) : '0.00'}</strong>
                    </div>
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
