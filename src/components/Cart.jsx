import React from 'react'
import { useStore } from '../store/useStore'
import { X, Plus, Minus, Trash2 } from 'lucide-react'

export default function Cart() {
  const { cart, isCartOpen, toggleCart, removeFromCart, updateQuantity } = useStore()
  
  const total = cart.reduce((acc, item) => acc + (item.price * item.quantity), 0)

  if (!isCartOpen) return null;

  return (
    <>
      {/* Overlay oscuro */}
      <div 
        onClick={toggleCart}
        style={{
          position: 'absolute',
          top: 0, left: 0, right: 0, bottom: 0,
          background: 'rgba(0,0,0,0.5)',
          zIndex: 10
        }}
      />
      
      {/* Panel del carrito */}
      <div style={{
        position: 'absolute',
        top: 0, right: 0, bottom: 0,
        width: '350px',
        background: '#fff',
        zIndex: 20,
        boxShadow: '-5px 0 15px rgba(0,0,0,0.1)',
        display: 'flex',
        flexDirection: 'column',
        animation: 'slideIn 0.3s ease'
      }}>
        <div style={{ 
          padding: '1.5rem', 
          borderBottom: '1px solid #eee',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center'
        }}>
          <h3 style={{ margin: 0, color: '#333' }}>Tu Carrito</h3>
          <button onClick={toggleCart} style={{ background: 'none', border: 'none', cursor: 'pointer' }}>
            <X size={24} color="#666" />
          </button>
        </div>

        <div style={{ flex: 1, overflowY: 'auto', padding: '1.5rem' }}>
          {cart.length === 0 ? (
            <p style={{ textAlign: 'center', color: '#999', marginTop: '2rem' }}>El carrito está vacío</p>
          ) : (
            cart.map(item => (
              <div key={item.id} style={{
                display: 'flex',
                alignItems: 'center',
                gap: '1rem',
                marginBottom: '1.5rem',
                borderBottom: '1px solid #f5f5f5',
                paddingBottom: '1rem'
              }}>
                <div style={{ fontSize: '2rem' }}>{item.image}</div>
                <div style={{ flex: 1 }}>
                  <h4 style={{ margin: '0 0 0.5rem 0', color: '#333' }}>{item.name}</h4>
                  <p style={{ margin: 0, color: 'var(--store-primary)', fontWeight: 'bold' }}>
                    ${(item.price * item.quantity).toFixed(2)}
                  </p>
                  
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginTop: '0.5rem' }}>
                    <button onClick={() => updateQuantity(item.id, -1)} style={qtyBtnStyle}><Minus size={14}/></button>
                    <span style={{ color: '#333' }}>{item.quantity}</span>
                    <button onClick={() => updateQuantity(item.id, 1)} style={qtyBtnStyle}><Plus size={14}/></button>
                    <button onClick={() => removeFromCart(item.id)} style={{...qtyBtnStyle, marginLeft: 'auto', color: 'red'}}>
                      <Trash2 size={14}/>
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        <div style={{ padding: '1.5rem', borderTop: '1px solid #eee', background: '#fafafa' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1rem', color: '#333', fontSize: '1.2rem', fontWeight: 'bold' }}>
            <span>Total:</span>
            <span>${total.toFixed(2)}</span>
          </div>
          <button style={{
            width: '100%',
            padding: '1rem',
            background: 'var(--store-primary)',
            color: '#fff',
            border: 'none',
            borderRadius: '8px',
            fontSize: '1.1rem',
            fontWeight: 'bold',
            cursor: cart.length === 0 ? 'not-allowed' : 'pointer',
            opacity: cart.length === 0 ? 0.5 : 1
          }}>
            Pagar
          </button>
        </div>
      </div>
      
      <style>{`
        @keyframes slideIn {
          from { transform: translateX(100%); }
          to { transform: translateX(0); }
        }
      `}</style>
    </>
  )
}

const qtyBtnStyle = {
  background: '#eee',
  border: 'none',
  borderRadius: '4px',
  width: '24px',
  height: '24px',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  cursor: 'pointer',
  color: '#333'
}
