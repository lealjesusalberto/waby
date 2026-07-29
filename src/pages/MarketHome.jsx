import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useStore } from '../store/useStore'
import { Star, Search, MapPin, Package, X, LogOut, User } from 'lucide-react'

export default function MarketHome() {
  const navigate = useNavigate()
  const { marketplaceStores, orders, logout, fetchMarketplaceStores, userProfile } = useStore()
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
            onClick={() => navigate('/profile')}
            style={{ background: '#F1F5F9', color: '#0F172A', border: 'none', padding: '0.6rem 1rem', borderRadius: '20px', fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: '0.4rem', cursor: 'pointer', transition: 'background 0.2s' }}
            onMouseOver={e => e.currentTarget.style.background = '#E2E8E0'}
            onMouseOut={e => e.currentTarget.style.background = '#F1F5F9'}
          >
            {userProfile?.avatar ? (
              <img src={userProfile.avatar} alt="Profile" style={{ width: '24px', height: '24px', borderRadius: '50%', objectFit: 'cover' }} />
            ) : (
              <User size={18} /> 
            )}
            <span className="market-btn-text">Mi Perfil</span>
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
              <div style={{ padding: '1.5rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                  <div style={{ 
                    width: '50px', height: '50px', background: '#F8FAFC', borderRadius: '12px', 
                    display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.8rem',
                    boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)', marginTop: '-40px', border: '3px solid white', overflow: 'hidden'
                  }}>
                    {store.logo?.startsWith('http') || store.logo?.startsWith('data:image') ? (
                      <img src={store.logo} alt="Logo" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                    ) : (
                      <span>{store.logo}</span>
                    )}
                  </div>
                </div>
                
                <h4 style={{ margin: '1.5rem 0 0.2rem 0', fontSize: '1.2rem', color: '#0F172A' }}>{store.name}</h4>
                <p style={{ margin: '0 0 1rem 0', color: '#64748B', fontSize: '0.9rem' }}>{store.category}</p>
                
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: '1rem', borderTop: '1px solid #F1F5F9' }}>
                  <span style={{ fontSize: '0.8rem', color: '#94A3B8', display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                    <MapPin size={12} /> {store.location || 'Online'}
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

      {/* El Modal de Mis Órdenes fue movido a ClientProfile.jsx */}

    </div>
  )
}
