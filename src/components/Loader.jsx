import React from 'react';

export default function Loader({ text = "Cargando...", fullScreen = false }) {
  return (
    <div style={{
      display: 'flex', 
      flexDirection: 'column', 
      alignItems: 'center', 
      justifyContent: 'center', 
      minHeight: fullScreen ? '100vh' : '200px',
      width: '100%',
      background: fullScreen ? '#F8F9F3' : 'transparent',
      fontFamily: 'Inter, sans-serif'
    }}>
      <div style={{
        position: 'relative',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
      }}>
        <img 
          src="/waby_logo.png" 
          alt="Waby Logo" 
          style={{
            height: '80px',
            objectFit: 'contain',
            animation: 'wabyPulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite',
            mixBlendMode: 'multiply'
          }}
        />
      </div>
      {text && (
        <div style={{
          marginTop: '1rem',
          color: '#64748B',
          fontSize: '0.95rem',
          fontWeight: '500',
          animation: 'wabyFade 2s infinite'
        }}>
          {text}
        </div>
      )}
      <style>
        {`
          @keyframes wabyPulse {
            0%, 100% { opacity: 1; transform: scale(1); }
            50% { opacity: .8; transform: scale(0.95); }
          }
          @keyframes wabyFade {
            0%, 100% { opacity: 0.5; }
            50% { opacity: 1; }
          }
        `}
      </style>
    </div>
  )
}
