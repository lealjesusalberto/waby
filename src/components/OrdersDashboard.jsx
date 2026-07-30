import React, { useState } from 'react'
import { useStore } from '../store/useStore'
import { X, CheckCircle, Clock, PackageOpen, Inbox, Search } from 'lucide-react'

export default function OrdersDashboard() {
  const { orders, setOrdersDashboardOpen, updateOrderStatus } = useStore()
  const [filterStatus, setFilterStatus] = useState('Todos')
  const [searchTerm, setSearchTerm] = useState('')

  const handleClose = () => {
    setOrdersDashboardOpen(false)
  }

  const filteredOrders = orders.filter(order => {
    const matchesStatus = filterStatus === 'Todos' || order.status === filterStatus;
    const searchLower = searchTerm.toLowerCase();
    const matchesSearch = 
      (order.id && String(order.id).toLowerCase().includes(searchLower)) || 
      (order.customer?.name && String(order.customer.name).toLowerCase().includes(searchLower)) ||
      (order.pagoMovil?.reference && String(order.pagoMovil.reference).toLowerCase().includes(searchLower));
    return matchesStatus && matchesSearch;
  });

  const getStatusColor = (status) => {
    switch(status) {
      case 'Aprobado': return { bg: '#D1FAE5', text: '#065F46' };
      case 'Rechazado': return { bg: '#FEE2E2', text: '#991B1B' };
      case 'Entregado': return { bg: '#DBEAFE', text: '#1E40AF' };
      default: return { bg: '#FEF3C7', text: '#92400E' }; // Validando Pago / Pendiente
    }
  }

  return (
    <div style={{
      position: 'fixed', inset: 0, background: '#F8FAFC', zIndex: 9999, display: 'flex', flexDirection: 'column', animation: 'fadeIn 0.2s ease-out'
    }}>
      {/* Header */}
      <div style={{ background: 'white', padding: '1.5rem 2rem', borderBottom: '1px solid #E2E8E0', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h2 style={{ margin: 0, display: 'flex', alignItems: 'center', gap: '0.8rem', color: '#0F172A', fontSize: '1.5rem' }}>
            <Inbox size={28} color="var(--primary)" /> Panel de Órdenes
          </h2>
          <p style={{ margin: '0.3rem 0 0 0', color: '#64748B', fontSize: '0.9rem' }}>Gestiona y filtra los pedidos de tu tienda.</p>
        </div>
        <button onClick={handleClose} style={{ background: '#F1F5F9', border: 'none', width: '40px', height: '40px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', color: '#475569' }}>
          <X size={20} />
        </button>
      </div>

      {/* Main Content */}
      <div style={{ flex: 1, padding: '2rem', overflowY: 'auto' }}>
        
        {/* Filters & Search */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem', flexWrap: 'wrap', gap: '1rem' }}>
          <div style={{ display: 'flex', gap: '0.5rem' }}>
            {['Todos', 'Validando Pago', 'Aprobado', 'Entregado', 'Rechazado'].map(status => (
              <button 
                key={status}
                onClick={() => setFilterStatus(status)}
                style={{ 
                  padding: '0.6rem 1.2rem', borderRadius: '20px', fontWeight: 'bold', fontSize: '0.9rem', cursor: 'pointer', border: 'none', transition: 'all 0.2s',
                  background: filterStatus === status ? 'var(--primary)' : '#E2E8F0',
                  color: filterStatus === status ? 'white' : '#475569'
                }}
              >
                {status}
              </button>
            ))}
          </div>
          <div style={{ position: 'relative' }}>
            <Search size={18} color="#94A3B8" style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)' }} />
            <input 
              type="text" 
              placeholder="Buscar por ID o Cliente..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              style={{ padding: '0.8rem 1rem 0.8rem 2.5rem', borderRadius: '12px', border: '1px solid #CBD5E1', width: '300px', outline: 'none' }}
            />
          </div>
        </div>

        {/* Orders Grid */}
        {filteredOrders.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '5rem', color: '#94A3B8', background: 'white', borderRadius: '24px', border: '1px dashed #CBD5E1' }}>
            <PackageOpen size={64} style={{ opacity: 0.5, marginBottom: '1rem' }} />
            <h3 style={{ margin: '0 0 0.5rem 0', color: '#475569' }}>No se encontraron órdenes</h3>
            <p style={{ margin: 0 }}>Intenta con otro filtro o término de búsqueda.</p>
          </div>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(400px, 1fr))', gap: '1.5rem' }}>
            {filteredOrders.map(order => {
              const colors = getStatusColor(order.status)
              return (
                <div key={order.id} style={{ background: 'white', borderRadius: '16px', border: '1px solid #E2E8E0', display: 'flex', flexDirection: 'column', overflow: 'hidden', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.05)' }}>
                  
                  {/* Card Header */}
                  <div style={{ padding: '1.25rem', borderBottom: '1px solid #F1F5F9', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div>
                      <span style={{ fontWeight: 'bold', fontSize: '1.1rem', color: '#0F172A', display: 'block' }}>{order.id}</span>
                      <span style={{ fontSize: '0.8rem', color: '#64748B' }}>{new Date(order.date).toLocaleString()}</span>
                    </div>
                    <span style={{ background: colors.bg, color: colors.text, padding: '0.4rem 1rem', borderRadius: '20px', fontSize: '0.85rem', fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                      {order.status === 'Aprobado' || order.status === 'Entregado' ? <CheckCircle size={14} /> : <Clock size={14} />} 
                      {order.status}
                    </span>
                  </div>
                  
                  {/* Card Body */}
                  <div style={{ padding: '1.25rem', flex: 1 }}>
                    {order.customer && (
                      <div style={{ marginBottom: '1rem' }}>
                        <p style={{ margin: '0 0 0.3rem 0', color: '#64748B', fontSize: '0.85rem', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Cliente</p>
                        <p style={{ margin: '0 0 0.2rem 0', fontWeight: 'bold', color: '#0F172A' }}>{order.customer.name}</p>
                        <p style={{ margin: '0 0 0.2rem 0', color: '#475569', fontSize: '0.9rem' }}>📞 {order.customer.phone}</p>
                        <p style={{ margin: '0', color: '#475569', fontSize: '0.9rem' }}>📍 {order.customer.address}</p>
                      </div>
                    )}

                    <div style={{ marginBottom: '1rem', background: '#F8FAFC', padding: '1rem', borderRadius: '12px' }}>
                      <p style={{ margin: '0 0 0.5rem 0', color: '#64748B', fontSize: '0.85rem', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Productos ({order.items?.length || 0})</p>
                      {order.items?.slice(0, 2).map((item, idx) => (
                        <div key={idx} style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.9rem', marginBottom: '0.3rem' }}>
                          <span style={{ color: '#0F172A' }}>{item.quantity}x {item.name}</span>
                          <span style={{ fontWeight: 'bold' }}>${(item.quantity * item.price).toFixed(2)}</span>
                        </div>
                      ))}
                      {order.items?.length > 2 && <p style={{ margin: '0.5rem 0 0 0', fontSize: '0.8rem', color: '#64748B' }}>+ {order.items.length - 2} productos más...</p>}
                      <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '0.8rem', paddingTop: '0.8rem', borderTop: '1px dashed #CBD5E1', fontWeight: 'bold', fontSize: '1.1rem' }}>
                        <span>Total Pagado:</span>
                        <span style={{ color: 'var(--primary)' }}>${order.total ? order.total.toFixed(2) : '0.00'}</span>
                      </div>
                    </div>

                    {order.pagoMovil && (
                      <div style={{ background: '#FFF7ED', padding: '1rem', borderRadius: '12px', border: '1px dashed #FFEDD5' }}>
                        <p style={{ margin: '0 0 0.3rem 0', color: '#9A3412', fontSize: '0.85rem', fontWeight: 'bold', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Reporte de Pago Móvil</p>
                        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.9rem', color: '#9A3412' }}>
                          <span><strong>Ref:</strong> {order.pagoMovil.reference}</span>
                          <span><strong>Banco:</strong> {order.pagoMovil.bank}</span>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Card Footer Actions */}
                  <div style={{ padding: '1rem 1.25rem', borderTop: '1px solid #F1F5F9', background: '#F8FAFC', display: 'flex', gap: '0.5rem' }}>
                    <button 
                      onClick={() => updateOrderStatus(order.id, 'Aprobado')}
                      style={{ flex: 1, padding: '0.6rem', background: '#10B981', color: 'white', border: 'none', borderRadius: '8px', fontWeight: 'bold', cursor: 'pointer' }}
                    >
                      Aprobar
                    </button>
                    <button 
                      onClick={() => updateOrderStatus(order.id, 'Entregado')}
                      style={{ flex: 1, padding: '0.6rem', background: '#3B82F6', color: 'white', border: 'none', borderRadius: '8px', fontWeight: 'bold', cursor: 'pointer' }}
                    >
                      Entregar
                    </button>
                    <button 
                      onClick={() => updateOrderStatus(order.id, 'Rechazado')}
                      style={{ flex: 1, padding: '0.6rem', background: 'transparent', color: '#EF4444', border: '1px solid #FCA5A5', borderRadius: '8px', fontWeight: 'bold', cursor: 'pointer' }}
                    >
                      Rechazar
                    </button>
                  </div>

                </div>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}
