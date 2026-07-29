import React, { useState } from 'react'
import { Bell, Sparkles } from 'lucide-react'
import { useStore } from '../store/useStore'

export function NotificationBell() {
  const { notifications, markNotificationsAsRead } = useStore()
  const [isOpen, setIsOpen] = useState(false)

  const unreadCount = notifications.filter(n => !n.read).length

  return (
    <div style={{ position: 'relative' }}>
      <button
        onClick={() => {
          setIsOpen(!isOpen)
          if (!isOpen && unreadCount > 0) {
            markNotificationsAsRead()
          }
        }}
        style={{
          background: '#F1F5F9', color: '#0F172A', border: 'none', padding: '0.6rem',
          borderRadius: '50%', cursor: 'pointer', display: 'flex', alignItems: 'center',
          justifyContent: 'center', position: 'relative', transition: 'background 0.2s'
        }}
        title="Notificaciones"
      >
        <Bell size={18} />
        {unreadCount > 0 && (
          <span style={{
            position: 'absolute', top: '-2px', right: '-2px', background: '#EF4444',
            color: 'white', fontSize: '0.7rem', fontWeight: 'bold', borderRadius: '10px',
            padding: '0.1rem 0.35rem', minWidth: '16px', height: '16px', display: 'flex',
            alignItems: 'center', justifyContent: 'center', border: '2px solid white'
          }}>
            {unreadCount}
          </span>
        )}
      </button>

      {isOpen && (
        <>
          <div onClick={() => setIsOpen(false)} style={{ position: 'fixed', inset: 0, zIndex: 998 }} />
          <div style={{
            position: 'absolute', right: 0, top: '45px', width: '320px', background: 'white',
            borderRadius: '16px', boxShadow: '0 20px 25px -5px rgba(0,0,0,0.15), 0 8px 10px -6px rgba(0,0,0,0.1)',
            border: '1px solid #E2E8F0', zIndex: 999, overflow: 'hidden', animation: 'fadeIn 0.2s ease-out'
          }}>
            <div style={{ padding: '1rem 1.2rem', background: '#F8FAFC', borderBottom: '1px solid #E2E8F0', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <h4 style={{ margin: 0, fontSize: '0.95rem', display: 'flex', alignItems: 'center', gap: '0.4rem', color: '#0F172A' }}>
                <Bell size={16} color="var(--primary)" /> Notificaciones
              </h4>
              {unreadCount > 0 && (
                <button onClick={markNotificationsAsRead} style={{ background: 'none', border: 'none', color: '#0284C7', fontSize: '0.75rem', cursor: 'pointer', fontWeight: 'bold' }}>
                  Marcar leídas
                </button>
              )}
            </div>

            <div style={{ maxHeight: '350px', overflowY: 'auto' }}>
              {notifications.length === 0 ? (
                <div style={{ textAlign: 'center', padding: '2rem 1rem', color: '#94A3B8' }}>
                  <Bell size={32} style={{ opacity: 0.3, marginBottom: '0.5rem' }} />
                  <p style={{ margin: 0, fontSize: '0.85rem' }}>No tienes notificaciones por ahora.</p>
                </div>
              ) : (
                notifications.map((n) => (
                  <div key={n.id} style={{
                    padding: '0.9rem 1.2rem', borderBottom: '1px solid #F1F5F9',
                    background: n.read ? 'white' : '#F0FDF4', transition: 'background 0.2s'
                  }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.2rem' }}>
                      <strong style={{ fontSize: '0.85rem', color: '#0F172A' }}>{n.title}</strong>
                      <span style={{ fontSize: '0.7rem', color: '#94A3B8' }}>{new Date(n.date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                    </div>
                    <p style={{ margin: 0, fontSize: '0.8rem', color: '#475569', lineHeight: 1.4 }}>{n.message}</p>
                  </div>
                ))
              )}
            </div>
          </div>
        </>
      )}
    </div>
  )
}

export function ToastBanner() {
  const { toast } = useStore()
  if (!toast) return null

  return (
    <div style={{
      position: 'fixed', top: '1.5rem', right: '1.5rem', zIndex: 9999,
      background: 'white', border: '1px solid #10B981', borderRadius: '14px',
      padding: '1rem 1.25rem', boxShadow: '0 20px 25px -5px rgba(16, 185, 129, 0.2)',
      display: 'flex', alignItems: 'center', gap: '0.8rem', maxWidth: '380px',
      animation: 'slideInRight 0.3s cubic-bezier(0.16, 1, 0.3, 1)'
    }}>
      <div style={{ width: '36px', height: '36px', borderRadius: '50%', background: '#D1FAE5', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
        <Sparkles size={20} color="#059669" />
      </div>
      <div>
        <h5 style={{ margin: '0 0 0.1rem 0', fontSize: '0.9rem', color: '#065F46', fontWeight: 'bold' }}>{toast.title}</h5>
        <p style={{ margin: 0, fontSize: '0.8rem', color: '#047857', lineHeight: 1.3 }}>{toast.message}</p>
      </div>
    </div>
  )
}
