import React from 'react'
import { Outlet } from 'react-router-dom'

export default function AuthLayout() {
  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: '#F8FAFC', position: 'relative', overflow: 'hidden' }}>
      
      {/* Decoraciones de fondo premium */}
      <div style={{ position: 'absolute', top: '-10%', left: '-5%', width: '400px', height: '400px', background: '#FFC107', borderRadius: '50%', filter: 'blur(100px)', opacity: 0.15, zIndex: 0 }} />
      <div style={{ position: 'absolute', bottom: '-10%', right: '-5%', width: '500px', height: '500px', background: '#F97316', borderRadius: '50%', filter: 'blur(120px)', opacity: 0.15, zIndex: 0 }} />
      <div style={{ position: 'absolute', top: '20%', right: '15%', width: '300px', height: '300px', background: '#11683E', borderRadius: '50%', filter: 'blur(100px)', opacity: 0.1, zIndex: 0 }} />

      {/* Lado Izquierdo: Imagen Inmersiva Tropical */}
      <div style={{
        flex: 1,
        backgroundImage: 'url("https://images.unsplash.com/photo-1542273917363-3b1817f69a2d?q=80&w=2074")',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        position: 'relative',
        zIndex: 1
      }}>
        {/* Capa Oscura */}
        <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to bottom, rgba(17, 104, 62, 0.4), rgba(17, 104, 62, 0.8))' }} />
        
        {/* Contenido sobre la imagen */}
        <div style={{ position: 'relative', zIndex: 1, height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'center', padding: '4rem', color: 'white' }}>
          <h1 style={{ fontSize: '4rem', marginBottom: '1rem', lineHeight: 1.1 }}>Vende con <span style={{ color: '#FFC107' }}>Waby</span></h1>
          <p style={{ fontSize: '1.2rem', opacity: 0.9, maxWidth: '500px' }}>
            La plataforma líder para tiendas locales. Crea experiencias increíbles y conecta con miles de clientes hoy mismo.
          </p>
        </div>
      </div>

      {/* Lado Derecho: Formulario (Outlet renderiza Login o Register) */}
      <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '2rem', position: 'relative', zIndex: 1 }}>
        <div style={{ width: '100%', maxWidth: '450px', background: 'rgba(255, 255, 255, 0.9)', backdropFilter: 'blur(16px)', padding: '3rem', borderRadius: '24px', boxShadow: '0 25px 50px -12px rgba(0,0,0,0.05), 0 0 0 1px rgba(0,0,0,0.02)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.2rem', marginBottom: '2.5rem', justifyContent: 'center' }}>
            <img src="/waby_logo.png" alt="Waby Logo" style={{ height: '90px', width: '90px', objectFit: 'contain', mixBlendMode: 'multiply' }} />
            <span style={{ fontSize: '2.8rem', fontWeight: '900', fontFamily: 'Fraunces, serif', letterSpacing: '-1px', background: 'linear-gradient(90deg, #11683E 0%, #FFC107 50%, #F97316 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>Waby</span>
          </div>
          <Outlet />
        </div>
      </div>
    </div>
  )
}
