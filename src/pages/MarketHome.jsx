import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useStore } from '../store/useStore'
import { Star, Search, MapPin, Package, X, LogOut } from 'lucide-react'

export default function MarketHome() {
  const navigate = useNavigate()
  const { marketplaceStores, orders, logout, fetchMarketplaceStores } = useStore()
  const [showOrders, setShowOrders] = useState(false)
  const [searchTerm, setSearchTerm] = useState('')

  useEffect(() => {
    fetchMarketplaceStores()
  }, [fetchMarketplaceStores])

  const filteredStores = marketplaceStores.filter(store => 
    store.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    store.category.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  return (
    <div style={{ background: '#F8F9F3', minHeight: '100vh', paddingBottom: '4rem' }}>
      
      {/* Header del Marketplace */}
      <div className="market-header">
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.2rem' }}>
          <img src="/waby_logo.png" alt="Waby Logo" className="market-header-logo" />
          <h1 className="market-header-title">
            Waby
          </h1>
        </div>
        
        <div className="market-header-buttons">
          <button 
            onClick={() => setShowOrders(true)}
            style={{ background: '#F1F5F9', color: '#0F172A', border: 'none', padding: '0.6rem 1rem', borderRadius: '20px', fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: '0.4rem', cursor: 'pointer', transition: 'background 0.2s' }}
            onMouseOver={e => e.currentTarget.style.background = '#E2E8E0'}
            onMouseOut={e => e.currentTarget.style.background = '#F1F5F9'}
          >
            <Package size={18} /> <span className="market-btn-text">Mis Órdenes</span> ({orders.length})
          </button>
          
          <button 
            onClick={handleLogout}
            style={{ background: '#FEE2E2', color: '#DC2626', border: 'none', padding: '0.6rem', borderRadius: '50%', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
            title="Cerrar Sesión"
          >
            <LogOut size={18} />
          </button>
        </div>
      </div>

      {/* Hero Search Section */}
      <div style={{ 
        background: 'linear-gradient(135deg, #11683E 0%, #FFC107 100%)', 
        color: 'white', padding: '5rem 2rem', textAlign: 'center',
        borderBottomLeftRadius: '40px', borderBottomRightRadius: '40px',
        marginBottom: '3rem', position: 'relative', overflow: 'hidden'
      }}>
        {/* Decoraciones de fondo abstracto */}
        <div style={{ position: 'absolute', top: '-10%', left: '-5%', width: '300px', height: '300px', background: 'rgba(255, 255, 255, 0.1)', borderRadius: '50%', filter: 'blur(40px)' }}></div>
        <div style={{ position: 'absolute', bottom: '-20%', right: '-5%', width: '400px', height: '400px', background: 'rgba(255, 255, 255, 0.15)', borderRadius: '50%', filter: 'blur(60px)' }}></div>

        <div style={{ position: 'relative', zIndex: 1 }}>
          <h2 style={{ fontSize: '3rem', margin: '0 0 1rem 0', fontFamily: 'Fraunces', textShadow: '0 2px 4px rgba(0,0,0,0.1)' }}>Descubre lo mejor de tu ciudad</h2>
          <p style={{ opacity: 0.9, fontSize: '1.2rem', marginBottom: '2.5rem', fontWeight: '500' }}>Apoya a los negocios locales y compra directamente.</p>
          
          <div style={{ maxWidth: '650px', margin: '0 auto', position: 'relative' }}>
            <Search style={{ position: 'absolute', left: '1.2rem', top: '50%', transform: 'translateY(-50%)', color: '#11683E', zIndex: 2 }} />
            <input 
              type="text" 
              placeholder="Buscar tiendas, categorías, etc..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              style={{ 
                width: '100%', padding: '1.2rem 1.2rem 1.2rem 3.5rem', borderRadius: '30px', 
                border: 'none', fontSize: '1.1rem', outline: 'none',
                boxShadow: '0 20px 40px rgba(0,0,0,0.15)', color: '#0F172A',
                position: 'relative', zIndex: 1
              }}
            />
          </div>
        </div>
      </div>

      {/* Directorio de Tiendas */}
      <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 2rem' }}>
        <h3 style={{ fontSize: '1.5rem', marginBottom: '2rem', color: '#0F172A', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          Tiendas Destacadas
          <span style={{ fontSize: '0.9rem', color: 'var(--primary)', cursor: 'pointer' }}>Ver Todas &rarr;</span>
        </h3>
        
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '2rem' }}>
          {filteredStores.map(store => (
            <div 
              key={store.id} 
              onClick={() => navigate(`/store/${store.id}`)}
              style={{ 
                background: 'white', borderRadius: '20px', overflow: 'hidden', 
                boxShadow: '0 4px 6px -1px rgba(0,0,0,0.05), 0 2px 4px -1px rgba(0,0,0,0.03)',
                cursor: 'pointer', transition: 'transform 0.2s, boxShadow 0.2s',
                border: '1px solid #F1F5F9'
              }}
              onMouseOver={e => {
                e.currentTarget.style.transform = 'translateY(-5px)';
                e.currentTarget.style.boxShadow = '0 20px 25px -5px rgba(0,0,0,0.1), 0 10px 10px -5px rgba(0,0,0,0.04)';
              }}
              onMouseOut={e => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = '0 4px 6px -1px rgba(0,0,0,0.05), 0 2px 4px -1px rgba(0,0,0,0.03)';
              }}
            >
              <div style={{ height: '160px', overflow: 'hidden', position: 'relative' }}>
                <img src={store.cover} alt={store.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                <div style={{ position: 'absolute', top: '1rem', right: '1rem', background: 'rgba(255,255,255,0.9)', padding: '0.3rem 0.6rem', borderRadius: '12px', fontSize: '0.75rem', fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: '0.2rem' }}>
                  <Star size={12} fill="#FFC107" color="#FFC107" /> {store.rating}
                </div>
              </div>
              <div style={{ padding: '1.5rem', position: 'relative' }}>
                <div style={{ 
                  position: 'absolute', top: '-25px', left: '1.5rem', 
                  background: 'white', width: '50px', height: '50px', borderRadius: '12px',
                  display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.5rem',
                  boxShadow: '0 4px 6px -1px rgba(0,0,0,0.1)'
                }}>
                  {store.logo}
                </div>
                
                <h4 style={{ margin: '1.5rem 0 0.2rem 0', fontSize: '1.2rem', color: '#0F172A' }}>{store.name}</h4>
                <p style={{ margin: '0 0 1rem 0', color: '#64748B', fontSize: '0.9rem' }}>{store.category}</p>
                
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: '1rem', borderTop: '1px solid #F1F5F9' }}>
                  <span style={{ fontSize: '0.8rem', color: '#94A3B8', display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                    <MapPin size={12} /> Caracas
                  </span>
                  <button style={{ background: '#F4FBF7', color: 'var(--primary)', border: 'none', padding: '0.4rem 0.8rem', borderRadius: '8px', fontSize: '0.8rem', fontWeight: 'bold' }}>
                    Visitar
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Modal Mis Órdenes */}
      {showOrders && (
        <div style={{
          position: 'fixed', top: 0, right: 0, bottom: 0, width: '450px', maxWidth: '100vw',
          background: 'white', zIndex: 1000, boxShadow: '-5px 0 25px rgba(0,0,0,0.1)',
          display: 'flex', flexDirection: 'column', animation: 'slideInRight 0.3s ease-out'
        }}>
          <div style={{ padding: '1.5rem', borderBottom: '1px solid #E2E8E0', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <h3 style={{ margin: 0, fontSize: '1.2rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Package size={20} /> Mis Órdenes
            </h3>
            <button onClick={() => setShowOrders(false)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#64748B' }}>
              <X size={24} />
            </button>
          </div>

          <div style={{ flex: 1, overflowY: 'auto', padding: '1.5rem' }}>
            {orders.length === 0 ? (
              <div style={{ textAlign: 'center', color: '#94A3B8', marginTop: '3rem' }}>
                <Package size={48} style={{ opacity: 0.5, marginBottom: '1rem' }} />
                <p>Aún no has realizado ninguna compra.</p>
                <button 
                  onClick={() => setShowOrders(false)}
                  style={{ background: 'var(--primary)', color: 'white', border: 'none', padding: '0.8rem 1.5rem', borderRadius: '8px', marginTop: '1rem', cursor: 'pointer', fontWeight: 'bold' }}
                >
                  Explorar Tiendas
                </button>
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                {orders.map((order, idx) => (
                  <div key={idx} style={{ border: '1px solid #E2E8E0', borderRadius: '12px', padding: '1rem' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1rem' }}>
                      <div>
                        <span style={{ fontSize: '0.75rem', color: '#64748B', display: 'block' }}>ID: {order.id}</span>
                        <strong style={{ fontSize: '1.1rem', color: 'var(--primary)' }}>${order.total.toFixed(2)}</strong>
                      </div>
                      <span style={{ background: '#FEF3C7', color: '#D97706', padding: '0.3rem 0.6rem', borderRadius: '20px', fontSize: '0.75rem', fontWeight: 'bold' }}>
                        {order.status}
                      </span>
                    </div>
                    
                    <div style={{ borderTop: '1px dashed #E2E8E0', paddingTop: '1rem' }}>
                      <p style={{ margin: '0 0 0.5rem 0', fontSize: '0.85rem', fontWeight: 'bold', color: '#0F172A' }}>Productos:</p>
                      <ul style={{ margin: 0, paddingLeft: '1.2rem', fontSize: '0.85rem', color: '#64748B' }}>
                        {order.items.map((item, i) => (
                          <li key={i}>{item.quantity}x {item.name}</li>
                        ))}
                      </ul>
                    </div>
                    <div style={{ fontSize: '0.75rem', color: '#94A3B8', textAlign: 'right', marginTop: '1rem' }}>
                      {new Date(order.date).toLocaleDateString()}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
      
      {/* Overlays */}
      {showOrders && <div onClick={() => setShowOrders(false)} style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', zIndex: 999 }} />}

    </div>
  )
}
