import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useStore } from '../store/useStore'
import { Store, Upload, ArrowLeft, CheckCircle, X, CreditCard } from 'lucide-react'
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
        Los datos de tu tienda han sido guardados exitosamente.
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

export default function StoreProfile() {
  const navigate = useNavigate()
  const { user, storeConfig, updateStoreConfig, saveStoreData } = useStore()
  
  const [isSaving, setIsSaving] = useState(false)
  const [showSuccess, setShowSuccess] = useState(false)

  const handleImageUpload = (e, callback) => {
    const file = e.target.files[0]
    if (file) {
      const reader = new FileReader()
      reader.onloadend = () => {
        const img = new Image()
        img.src = reader.result
        img.onload = () => {
          const canvas = document.createElement('canvas')
          const MAX_SIZE = 800
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
          callback(dataUrl)
        }
      }
      reader.readAsDataURL(file)
    }
  }

  const handleSave = async (e) => {
    e.preventDefault()
    setIsSaving(true)
    await saveStoreData()
    setIsSaving(false)
    setShowSuccess(true)
  }

  const labelStyle = { display: 'block', marginBottom: '0.4rem', fontSize: '0.9rem', fontWeight: 'bold', color: '#475569' }
  const inputStyle = { width: '100%', padding: '0.8rem', borderRadius: '8px', border: '1px solid #E2E8F0', outline: 'none', background: '#F8FAFC', color: '#0F172A' }

  return (
    <div style={{ background: '#F8F9F3', minHeight: '100vh', fontFamily: "'Inter', sans-serif" }}>
      <div style={{ background: 'white', padding: '1.5rem 2rem', boxShadow: '0 2px 4px rgba(0,0,0,0.05)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <button onClick={() => navigate('/builder')} style={{ background: 'none', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', color: '#64748B' }}>
            <ArrowLeft size={24} />
          </button>
          <h1 style={{ margin: 0, fontSize: '1.5rem', color: '#0F172A' }}>Perfil de Tienda</h1>
        </div>
        <NotificationBell />
      </div>

      <div style={{ maxWidth: '800px', margin: '2rem auto', padding: '0 1rem' }}>
        
        <div style={{ background: 'white', borderRadius: '16px', padding: '2rem', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.05)', border: '1px solid #E2E8F0', marginBottom: '2rem' }}>
          <h2 style={{ margin: '0 0 1.5rem 0', display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '1.2rem', color: '#0F172A' }}>
            <Store size={20} color="var(--primary)" /> Información Básica
          </h2>
          
          <form onSubmit={handleSave} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            
            <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
              <div style={{ flex: '1 1 300px' }}>
                <label style={labelStyle}>Nombre de la Tienda</label>
                <input 
                  type="text" 
                  value={storeConfig.name || ''}
                  onChange={e => updateStoreConfig({ name: e.target.value })}
                  placeholder="Ej. Mi Super Tienda"
                  style={inputStyle}
                  required
                />
              </div>
              <div style={{ flex: '1 1 300px' }}>
                <label style={labelStyle}>Teléfono de Contacto</label>
                <input 
                  type="tel" 
                  value={storeConfig.phone || ''}
                  onChange={e => updateStoreConfig({ phone: e.target.value })}
                  placeholder="Ej. +58 414 1234567"
                  style={inputStyle}
                  required
                />
              </div>
            </div>

            <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
              <div style={{ flex: '1 1 300px' }}>
                <label style={labelStyle}>Logo</label>
                {storeConfig.logoText && (storeConfig.logoText.startsWith('http') || storeConfig.logoText.startsWith('data:')) ? (
                  <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                    <img src={storeConfig.logoText} alt="Logo" style={{ width: '64px', height: '64px', objectFit: 'cover', borderRadius: '12px', border: '1px solid #E2E8F0', background: '#F8FAFC' }} />
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                      <label style={{ background: '#F8FAFC', padding: '0.4rem 0.8rem', borderRadius: '8px', cursor: 'pointer', border: '1px solid #E2E8F0', fontSize: '0.85rem', fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#0F172A' }}>
                        <Upload size={14} /> Cambiar Logo
                        <input type="file" accept="image/*" style={{ display: 'none' }} onChange={(e) => handleImageUpload(e, (base64) => updateStoreConfig({ logoText: base64 }))} />
                      </label>
                      <button type="button" onClick={() => updateStoreConfig({ logoText: '' })} style={{ background: 'none', border: 'none', color: '#EF4444', cursor: 'pointer', fontSize: '0.85rem', fontWeight: 'bold', textAlign: 'left', padding: '0 0.2rem' }}>Quitar Logo</button>
                    </div>
                  </div>
                ) : (
                  <div style={{ display: 'flex', gap: '0.5rem' }}>
                    <input type="text" value={storeConfig.logoText || ''} onChange={(e) => updateStoreConfig({ logoText: e.target.value })} style={{...inputStyle, flex: 1}} placeholder="URL, Base64 o Emoji" />
                    <label style={{ background: '#F1F5F9', padding: '0.8rem', borderRadius: '8px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }} title="Subir Logo">
                      <Upload size={16} />
                      <input type="file" accept="image/*" style={{ display: 'none' }} onChange={(e) => handleImageUpload(e, (base64) => updateStoreConfig({ logoText: base64 }))} />
                    </label>
                  </div>
                )}
              </div>

              <div style={{ flex: '1 1 300px' }}>
                <label style={labelStyle}>Portada</label>
                {storeConfig.coverUrl && (storeConfig.coverUrl.startsWith('http') || storeConfig.coverUrl.startsWith('data:')) ? (
                  <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                    <img src={storeConfig.coverUrl} alt="Portada" style={{ width: '120px', height: '64px', objectFit: 'cover', borderRadius: '8px', border: '1px solid #E2E8F0', background: '#F8FAFC' }} />
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                      <label style={{ background: '#F8FAFC', padding: '0.4rem 0.8rem', borderRadius: '8px', cursor: 'pointer', border: '1px solid #E2E8F0', fontSize: '0.85rem', fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#0F172A' }}>
                        <Upload size={14} /> Cambiar Portada
                        <input type="file" accept="image/*" style={{ display: 'none' }} onChange={(e) => handleImageUpload(e, (base64) => updateStoreConfig({ coverUrl: base64 }))} />
                      </label>
                      <button type="button" onClick={() => updateStoreConfig({ coverUrl: '' })} style={{ background: 'none', border: 'none', color: '#EF4444', cursor: 'pointer', fontSize: '0.85rem', fontWeight: 'bold', textAlign: 'left', padding: '0 0.2rem' }}>Quitar Portada</button>
                    </div>
                  </div>
                ) : (
                  <div style={{ display: 'flex', gap: '0.5rem' }}>
                    <input type="text" value={storeConfig.coverUrl || ''} onChange={(e) => updateStoreConfig({ coverUrl: e.target.value })} style={{...inputStyle, flex: 1}} placeholder="URL o subir portada" />
                    <label style={{ background: '#F1F5F9', padding: '0.8rem', borderRadius: '8px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }} title="Subir Portada">
                      <Upload size={16} />
                      <input type="file" accept="image/*" style={{ display: 'none' }} onChange={(e) => handleImageUpload(e, (base64) => updateStoreConfig({ coverUrl: base64 }))} />
                    </label>
                  </div>
                )}
              </div>
            </div>
            
            <hr style={{ border: 'none', borderTop: '1px solid #E2E8F0', margin: '1rem 0' }} />

            <h2 style={{ margin: '0 0 0.5rem 0', display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '1.2rem', color: '#0F172A' }}>
              <CreditCard size={20} color="var(--primary)" /> Datos de Pago Móvil
            </h2>
            <p style={{ color: '#64748B', fontSize: '0.9rem', marginBottom: '1rem' }}>Esta información será mostrada a tus clientes para que puedan realizarte el pago.</p>

            <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
              <div style={{ flex: '1 1 200px' }}>
                <label style={labelStyle}>Banco</label>
                <select value={storeConfig.pagoMovilBank || ''} onChange={(e) => updateStoreConfig({ pagoMovilBank: e.target.value })} style={inputStyle}>
                  <option value="">Selecciona Banco</option>
                  <option value="0102">Banco de Venezuela (0102)</option>
                  <option value="0104">Venezolano de Crédito (0104)</option>
                  <option value="0105">Banco Mercantil (0105)</option>
                  <option value="0108">BBVA Provincial (0108)</option>
                  <option value="0114">Bancaribe (0114)</option>
                  <option value="0115">Banco Exterior (0115)</option>
                  <option value="0128">Banco Caroní (0128)</option>
                  <option value="0134">Banesco (0134)</option>
                  <option value="0138">Banco Plaza (0138)</option>
                  <option value="0151">BFC Banco Fondo Común (0151)</option>
                  <option value="0156">100% Banco (0156)</option>
                  <option value="0157">Banco del Sur (0157)</option>
                  <option value="0163">Banco del Tesoro (0163)</option>
                  <option value="0169">Mi Banco (0169)</option>
                  <option value="0171">Banco Activo (0171)</option>
                  <option value="0172">Bancamiga (0172)</option>
                  <option value="0175">Banco Bicentenario (0175)</option>
                  <option value="0177">Banfanb (0177)</option>
                  <option value="0191">BNC Nacional de Crédito (0191)</option>
                </select>
              </div>
              <div style={{ flex: '1 1 200px' }}>
                <label style={labelStyle}>Teléfono Asociado</label>
                <input type="text" value={storeConfig.pagoMovilPhone || ''} onChange={(e) => updateStoreConfig({ pagoMovilPhone: e.target.value })} style={inputStyle} placeholder="Ej. 04141234567" />
              </div>
              <div style={{ flex: '1 1 200px' }}>
                <label style={labelStyle}>Cédula o RIF</label>
                <input type="text" value={storeConfig.pagoMovilId || ''} onChange={(e) => updateStoreConfig({ pagoMovilId: e.target.value })} style={inputStyle} placeholder="Ej. V12345678" />
              </div>
            </div>

            <button 
              type="submit" 
              disabled={isSaving}
              style={{ background: 'var(--primary)', color: 'white', border: 'none', padding: '1rem', borderRadius: '12px', fontWeight: 'bold', fontSize: '1rem', cursor: isSaving ? 'not-allowed' : 'pointer', marginTop: '1rem', opacity: isSaving ? 0.7 : 1, transition: 'transform 0.2s' }}
            >
              {isSaving ? 'Guardando...' : 'Guardar Información'}
            </button>
          </form>
        </div>

      </div>

      {/* Success Overlay */}
      {showSuccess && <SuccessModal onClose={() => setShowSuccess(false)} />}
    </div>
  )
}
