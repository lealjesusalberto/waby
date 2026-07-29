import React from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { CheckCircle, Store, Sparkles, Box, CreditCard, ShoppingBag, ArrowRight } from 'lucide-react'

export default function Pricing() {
  const navigate = useNavigate()

  return (
    <div style={{ minHeight: '100vh', background: '#F8FAFC', color: 'var(--text-main)', display: 'flex', flexDirection: 'column' }}>
      
      {/* Header */}
      <header style={{ padding: '1.5rem 4rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'white', borderBottom: '1px solid #E2E8E0', position: 'sticky', top: 0, zIndex: 10 }}>
        <Link to="/market" style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <img src="/waby_logo.png" alt="Waby" style={{ height: '40px', mixBlendMode: 'multiply' }} />
          <span style={{ fontSize: '1.8rem', fontWeight: '900', fontFamily: 'Fraunces', letterSpacing: '-1px', background: 'linear-gradient(90deg, #11683E 0%, #FFC107 50%, #F97316 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>Waby</span>
        </Link>
        <Link to="/login" style={{ color: 'var(--text-muted)', textDecoration: 'none', fontWeight: 'bold' }}>Iniciar Sesión</Link>
      </header>

      {/* Main Content */}
      <main style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '4rem 2rem', position: 'relative', overflow: 'hidden' }}>
        
        {/* Decoraciones de fondo */}
        <div style={{ position: 'absolute', top: '-10%', left: '-5%', width: '400px', height: '400px', background: '#FFC107', borderRadius: '50%', filter: 'blur(100px)', opacity: 0.15, zIndex: 0 }} />
        <div style={{ position: 'absolute', bottom: '-10%', right: '-5%', width: '500px', height: '500px', background: '#F97316', borderRadius: '50%', filter: 'blur(120px)', opacity: 0.15, zIndex: 0 }} />
        <div style={{ position: 'absolute', top: '20%', right: '15%', width: '300px', height: '300px', background: '#11683E', borderRadius: '50%', filter: 'blur(100px)', opacity: 0.1, zIndex: 0 }} />

        <div style={{ position: 'relative', zIndex: 1, textAlign: 'center', maxWidth: '800px', marginBottom: '4rem' }}>
          <span style={{ background: '#FEF3C7', color: '#D97706', padding: '0.4rem 1rem', borderRadius: '20px', fontWeight: 'bold', fontSize: '0.9rem', marginBottom: '1.5rem', display: 'inline-block' }}>Para Dueños de Tiendas</span>
          <h1 style={{ fontSize: '3.5rem', margin: '0 0 1rem 0', lineHeight: 1.1, color: '#0F172A' }}>
            Empieza a vender hoy en <br />
            <span style={{ background: 'linear-gradient(90deg, #11683E 0%, #F97316 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>tu propia tienda online</span>
          </h1>
          <p style={{ fontSize: '1.2rem', color: '#64748B', maxWidth: '600px', margin: '0 auto' }}>
            Todo lo que necesitas para vender, gestionar tu inventario y recibir pagos, reunido en una sola plataforma ridículamente fácil de usar.
          </p>
        </div>

        {/* Pricing Card */}
        <div style={{ 
          position: 'relative', zIndex: 1, background: 'rgba(255, 255, 255, 0.9)', backdropFilter: 'blur(16px)', 
          border: '1px solid rgba(255, 255, 255, 0.5)', borderRadius: '24px', padding: '3rem',
          boxShadow: '0 25px 50px -12px rgba(0,0,0,0.1), 0 0 0 4px rgba(249, 115, 22, 0.1)',
          maxWidth: '500px', width: '100%', textAlign: 'center'
        }}>
          
          <h2 style={{ fontSize: '1.5rem', color: '#0F172A', margin: '0 0 1rem 0', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem' }}>
            <Store style={{ color: 'var(--primary)' }} /> Waby Pro
          </h2>
          
          <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'baseline', marginBottom: '0.5rem' }}>
            <span style={{ fontSize: '3rem', fontWeight: '900', color: '#0F172A' }}>$3</span>
            <span style={{ fontSize: '1.2rem', color: '#64748B', fontWeight: '600' }}>/mes</span>
          </div>
          <p style={{ color: '#64748B', marginBottom: '2rem', fontSize: '0.9rem' }}>Facturado mensualmente. Cancela cuando quieras.</p>
          
          <button 
            onClick={() => navigate('/register')}
            style={{ 
              width: '100%', padding: '1rem', borderRadius: '12px', border: 'none',
              background: 'linear-gradient(90deg, #F97316 0%, #FF9800 100%)', color: 'white',
              fontSize: '1.1rem', fontWeight: 'bold', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem',
              boxShadow: '0 10px 15px -3px rgba(249, 115, 22, 0.3)', transition: 'transform 0.2s', marginBottom: '2.5rem'
            }}
            onMouseOver={e => e.currentTarget.style.transform = 'scale(1.02)'}
            onMouseOut={e => e.currentTarget.style.transform = 'scale(1)'}
          >
            Crear mi Tienda Ahora <ArrowRight size={20} />
          </button>

          <div style={{ textAlign: 'left', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <p style={{ fontWeight: 'bold', margin: '0 0 0.5rem 0', color: '#0F172A' }}>Todo incluido:</p>
            
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.8rem', color: '#334155' }}>
              <Sparkles size={20} style={{ color: 'var(--primary)' }} />
              <span>Diseño 100% personalizable (colores y logo)</span>
            </div>
            
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.8rem', color: '#334155' }}>
              <Box size={20} style={{ color: 'var(--primary)' }} />
              <span>Inventario ilimitado y gestión por categorías</span>
            </div>
            
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.8rem', color: '#334155' }}>
              <ShoppingBag size={20} style={{ color: 'var(--primary)' }} />
              <span>Presencia automática en el Marketplace público</span>
            </div>
            
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.8rem', color: '#334155' }}>
              <CreditCard size={20} style={{ color: 'var(--primary)' }} />
              <span>Checkout e integración con Pago Móvil</span>
            </div>
            
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.8rem', color: '#334155' }}>
              <CheckCircle size={20} style={{ color: 'var(--primary)' }} />
              <span>Panel de control de ventas (Dashboard)</span>
            </div>
          </div>
        </div>

      </main>
    </div>
  )
}
