import React, { useState, useEffect } from 'react'
import { useStore } from '../store/useStore'
import { useNavigate, useParams } from 'react-router-dom'
import { ShoppingCart, Star, Settings, X, Plus, Minus, Trash2, CreditCard, LogOut, ArrowLeft, Search } from 'lucide-react'
import { mockStoreData } from '../store/mockStoreData'

// --- CARRITO (DRAWER) ---
const CartDrawer = ({ onClose, onCheckout, shippingCost = 0 }) => {
  const { cart, removeFromCart, updateQuantity } = useStore()
  const subtotal = cart.reduce((acc, item) => acc + (item.price * item.quantity), 0)
  const envio = subtotal > 0 ? shippingCost : 0
  const total = subtotal + envio

  return (
    <div style={{
      position: 'fixed', top: 0, right: 0, bottom: 0, width: '400px', maxWidth: '100vw',
      background: 'white', zIndex: 1000, boxShadow: '-5px 0 25px rgba(0,0,0,0.1)',
      display: 'flex', flexDirection: 'column', animation: 'slideInRight 0.3s ease-out'
    }}>
      {/* Header */}
      <div style={{ padding: '1.5rem', borderBottom: '1px solid #E2E8E0', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h3 style={{ margin: 0, fontSize: '1.2rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <ShoppingCart size={20} /> Tu Carrito ({cart.length})
        </h3>
        <button onClick={onClose} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#64748B' }}>
          <X size={24} />
        </button>
      </div>

      {/* Items */}
      <div style={{ flex: 1, overflowY: 'auto', padding: '1.5rem' }}>
        {cart.length === 0 ? (
          <div style={{ textAlign: 'center', color: '#94A3B8', marginTop: '3rem' }}>
            <ShoppingCart size={48} style={{ opacity: 0.5, marginBottom: '1rem' }} />
            <p>Tu carrito está vacío.</p>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            {cart.map(item => (
              <div key={item.id} style={{ display: 'flex', gap: '1rem' }}>
                <img src={item.image} alt={item.name} style={{ width: '80px', height: '80px', objectFit: 'cover', borderRadius: '12px', background: '#F8F9F3' }} />
                <div style={{ flex: 1 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <h4 style={{ margin: '0 0 0.3rem 0', fontSize: '1rem' }}>{item.name}</h4>
                    <button onClick={() => removeFromCart(item.id)} style={{ background: 'none', border: 'none', color: '#EF4444', cursor: 'pointer', padding: 0 }}>
                      <Trash2 size={16} />
                    </button>
                  </div>
                  <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                    <span style={{ color: 'var(--primary)', fontWeight: 'bold' }}>${item.price.toFixed(2)}</span>
                    <span style={{ color: 'var(--text-muted)', fontSize: '0.8rem' }}>({(item.price * useStore.getState().bcvRate).toFixed(2)} Bs)</span>
                  </div>

                  {/* Quantity Control */}
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', background: '#F8FAFC', width: 'fit-content', borderRadius: '20px', padding: '0.2rem 0.5rem' }}>
                    <button onClick={() => updateQuantity(item.id, -1)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#64748B', display: 'flex' }}><Minus size={14} /></button>
                    <span style={{ fontSize: '0.9rem', fontWeight: 'bold', width: '20px', textAlign: 'center' }}>{item.quantity}</span>
                    <button onClick={() => updateQuantity(item.id, 1)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#64748B', display: 'flex' }}><Plus size={14} /></button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Footer */}
      {cart.length > 0 && (
        <div style={{ padding: '1.5rem', background: '#F8FAFC', borderTop: '1px solid #E2E8E0' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem', fontSize: '0.9rem', color: '#64748B' }}>
            <span>Subtotal</span>
            <span>${subtotal.toFixed(2)}</span>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1rem', fontSize: '0.9rem', color: '#64748B' }}>
            <span>Envío Estimado</span>
            <span>${envio.toFixed(2)}</span>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '1.2rem', fontWeight: '900' }}>
            <span>Total a pagar</span>
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end' }}>
              <span>${total.toFixed(2)}</span>
              <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontWeight: 'normal' }}>{(total * useStore.getState().bcvRate).toFixed(2)} Bs</span>
            </div>
          </div>

          <button
            onClick={onCheckout}
            style={{ width: '100%', marginTop: '1.5rem', padding: '1rem', background: 'var(--primary)', color: 'white', border: 'none', borderRadius: '12px', fontWeight: 'bold', fontSize: '1rem', cursor: 'pointer', display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '0.5rem' }}
          >
            Proceder al Pago <CreditCard size={18} />
          </button>
        </div>
      )}
      <style>{`@keyframes slideInRight { from { transform: translateX(100%); } to { transform: translateX(0); } }`}</style>
    </div>
  )
}

// --- CATEGORY INLINE VIEW ---
const CategoryInlineView = ({ category, products, onBack, addToCart }) => {
  return (
    <div style={{ animation: 'fadeIn 0.3s ease-out' }}>
      {/* Back Button */}
      <button 
        onClick={onBack} 
        style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', background: 'none', border: 'none', color: '#64748B', fontWeight: 'bold', fontSize: '1rem', cursor: 'pointer', marginBottom: '1.5rem', padding: 0 }}
      >
        <ArrowLeft size={20} /> Volver a la tienda
      </button>

      {/* Header */}
      <div style={{ background: category.color, padding: '2rem', borderRadius: '24px', display: 'flex', alignItems: 'center', gap: '1.5rem', color: 'white', marginBottom: '2rem', position: 'relative', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', right: '-10%', bottom: '-20%', fontSize: '10rem', opacity: 0.1, pointerEvents: 'none' }}>{category.icon}</div>
        <span style={{ fontSize: '3.5rem', zIndex: 1 }}>{category.icon}</span>
        <div style={{ zIndex: 1 }}>
          <h2 style={{ margin: 0, fontSize: '2.2rem', fontFamily: 'Fraunces' }}>{category.name}</h2>
          <p style={{ margin: 0, opacity: 0.9, fontSize: '1.1rem' }}>{products.length} productos disponibles</p>
        </div>
      </div>

      {/* Products Grid */}
      {products.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '4rem 0', color: '#64748B' }}>
          <p style={{ fontSize: '1.2rem' }}>No hay productos en esta categoría por ahora.</p>
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(min(100%, 260px), 1fr))', gap: '1.5rem' }}>
          {products.map(prod => (
            <div key={prod.id} style={{ background: 'white', borderRadius: '16px', overflow: 'hidden', border: '1px solid #eee', position: 'relative' }}>
              <div style={{ height: '200px', background: '#F8F9F3', display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden' }}>
                <img src={prod.image} alt={prod.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
              </div>
              <div style={{ padding: '1rem' }}>
                <h5 style={{ margin: '0 0 0.3rem 0', fontSize: '1rem', color: 'var(--text-main)' }}>{prod.name}</h5>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '0.5rem' }}>
                  <div style={{ display: 'flex', flexDirection: 'column' }}>
                    <span style={{ fontWeight: 'bold', fontSize: '1.2rem', color: 'var(--primary)' }}>${prod.price.toFixed(2)}</span>
                    <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>{(prod.price * useStore.getState().bcvRate).toFixed(2)} Bs</span>
                  </div>
                  <button
                    onClick={() => addToCart(prod)}
                    style={{ background: '#E8F5E9', border: 'none', width: '36px', height: '36px', borderRadius: '50%', color: '#2E7D32', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}
                  >
                    <Plus size={18} />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

// --- ALL PRODUCTS VIEW ---
const AllProductsView = ({ products, categories, onBack, addToCart, storeConfig }) => {
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('all')

  const filteredProducts = products.filter(prod => {
    const matchesSearch = prod.name.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesCategory = selectedCategory === 'all' || prod.category === selectedCategory
    return matchesSearch && matchesCategory
  })

  return (
    <div style={{ animation: 'fadeIn 0.3s ease-in-out' }}>
      <button onClick={onBack} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', marginBottom: '2rem', fontSize: '1rem', padding: 0 }}>
        <ArrowLeft size={18} /> Volver al Inicio
      </button>

      <div style={{ marginBottom: '2rem' }}>
        <h2 style={{ fontSize: '2.5rem', margin: '0 0 1.5rem 0', color: storeConfig?.titleColor || 'var(--primary)', fontFamily: 'Fraunces' }}>Todos nuestros productos</h2>
        
        {/* Search Bar */}
        <div style={{ position: 'relative', maxWidth: '600px', marginBottom: '2rem' }}>
          <Search style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: '#64748B' }} size={20} />
          <input 
            type="text" 
            placeholder="Busca por nombre..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            style={{ width: '100%', padding: '1rem 1rem 1rem 3rem', borderRadius: '12px', border: '1px solid #E2E8F0', fontSize: '1rem', outline: 'none' }}
          />
        </div>

        {/* Category Pills */}
        <div style={{ display: 'flex', gap: '0.8rem', flexWrap: 'wrap', paddingBottom: '0.5rem' }}>
          <button 
            onClick={() => setSelectedCategory('all')}
            style={{ 
              padding: '0.6rem 1.5rem', borderRadius: '30px', fontWeight: '500', cursor: 'pointer', transition: 'all 0.2s', 
              border: selectedCategory === 'all' ? 'none' : '1px solid #E2E8F0',
              background: selectedCategory === 'all' ? (storeConfig?.primaryColor || '#11683E') : 'white',
              color: selectedCategory === 'all' ? 'white' : '#475569',
              boxShadow: selectedCategory === 'all' ? '0 4px 10px rgba(0,0,0,0.1)' : 'none',
              display: 'flex', alignItems: 'center', gap: '0.5rem'
            }}
          >
            Todas
          </button>
          {categories.map(cat => (
            <button 
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              style={{ 
                padding: '0.6rem 1.5rem', borderRadius: '30px', fontWeight: '500', cursor: 'pointer', transition: 'all 0.2s', 
                border: selectedCategory === cat.id ? 'none' : '1px solid #E2E8F0',
                background: selectedCategory === cat.id ? (storeConfig?.primaryColor || '#11683E') : 'white',
                color: selectedCategory === cat.id ? 'white' : '#475569',
                boxShadow: selectedCategory === cat.id ? '0 4px 10px rgba(0,0,0,0.1)' : 'none',
                display: 'flex', alignItems: 'center', gap: '0.5rem'
              }}
            >
              <span>{cat.icon}</span> {cat.name}
            </button>
          ))}
        </div>
      </div>

      {/* Products Grid */}
      {filteredProducts.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '4rem 0', color: '#64748B' }}>
          <Search size={48} style={{ opacity: 0.3, marginBottom: '1rem' }} />
          <p style={{ fontSize: '1.2rem' }}>No se encontraron productos con esos criterios.</p>
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(min(100%, 260px), 1fr))', gap: '1.5rem' }}>
          {filteredProducts.map(prod => (
            <div key={prod.id} style={{ background: 'white', borderRadius: '16px', overflow: 'hidden', border: '1px solid #eee', position: 'relative' }}>
              <div style={{ position: 'absolute', top: '10px', left: '10px', display: 'flex', gap: '0.5rem', zIndex: 1 }}>
                <span style={{ background: '#E8F5E9', color: '#2E7D32', padding: '0.2rem 0.6rem', borderRadius: '12px', fontSize: '0.7rem', fontWeight: 'bold' }}>
                  {prod.badge}
                </span>
                {prod.oldPrice && (
                  <span style={{ background: '#FFEBEE', color: '#C62828', padding: '0.2rem 0.6rem', borderRadius: '12px', fontSize: '0.7rem', fontWeight: 'bold' }}>
                    -20%
                  </span>
                )}
              </div>
              <div style={{ height: '200px', background: '#F8F9F3', display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden' }}>
                <img src={prod.image} alt={prod.name} style={{ width: '100%', height: '100%', objectFit: 'cover', transition: 'transform 0.3s' }} onMouseOver={e => e.currentTarget.style.transform = 'scale(1.05)'} onMouseOut={e => e.currentTarget.style.transform = 'scale(1)'} />
              </div>
              <div style={{ padding: '1rem' }}>
                <h5 style={{ margin: '0 0 0.3rem 0', fontSize: '1rem', color: 'var(--text-main)' }}>{prod.name}</h5>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '0.5rem' }}>
                  <div style={{ display: 'flex', flexDirection: 'column' }}>
                    <span style={{ fontWeight: 'bold', fontSize: '1.2rem', color: 'var(--primary)' }}>${prod.price.toFixed(2)}</span>
                    <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>{(prod.price * useStore.getState().bcvRate).toFixed(2)} Bs</span>
                  </div>
                  <button
                    onClick={() => addToCart(prod)}
                    style={{ background: '#E8F5E9', border: 'none', width: '36px', height: '36px', borderRadius: '50%', color: '#2E7D32', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', transition: 'background 0.2s' }}
                    onMouseOver={e => e.currentTarget.style.background = '#C8E6C9'}
                    onMouseOut={e => e.currentTarget.style.background = '#E8F5E9'}
                  >
                    <Plus size={18} />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

const CheckoutModal = ({ onClose, total, onSuccess }) => {
  const [isProcessing, setIsProcessing] = useState(false);
  const bcvRate = useStore.getState().bcvRate;

  // Customer details
  const [customerName, setCustomerName] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');
  const [customerAddress, setCustomerAddress] = useState('');

  // Payment details
  const [paymentBank, setPaymentBank] = useState('');
  const [paymentReference, setPaymentReference] = useState('');
  const [paymentDate, setPaymentDate] = useState(new Date().toISOString().split('T')[0]);

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsProcessing(true);
    setTimeout(() => {
      setIsProcessing(false);
      onSuccess({
        customer: { name: customerName, phone: customerPhone, address: customerAddress },
        pagoMovil: { bank: paymentBank, reference: paymentReference, date: paymentDate }
      });
    }, 1500);
  }

  return (
    <div style={{
      position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
      background: 'rgba(0,0,0,0.6)', display: 'flex', alignItems: 'center', justifyContent: 'center',
      zIndex: 2000, backdropFilter: 'blur(4px)'
    }}>
      <div style={{
        background: 'white', borderRadius: '16px', width: '90%', maxWidth: '500px',
        overflow: 'hidden', boxShadow: '0 25px 50px -12px rgba(0,0,0,0.5)',
        animation: 'fadeIn 0.2s ease-out', position: 'relative',
        maxHeight: '90vh', overflowY: 'auto'
      }}>
        <div style={{ padding: '1.5rem', borderBottom: '1px solid #E2E8E0', display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: '#F8FAFC' }}>
          <h2 style={{ margin: 0, fontSize: '1.2rem', fontFamily: 'Inter' }}>Finalizar Compra</h2>
          <button onClick={onClose} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#64748B' }}>
            <X size={24} />
          </button>
        </div>

        <form onSubmit={handleSubmit} style={{ padding: '2rem' }}>

          <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
            <h3 style={{ margin: '0 0 0.5rem 0', fontSize: '2rem', color: 'var(--primary)' }}>${total.toFixed(2)}</h3>
            <p style={{ margin: 0, color: '#64748B', fontSize: '0.9rem' }}>Monto total a pagar</p>
          </div>

          <div style={{ background: '#FFF7ED', border: '1px solid #FFEDD5', padding: '1rem', borderRadius: '12px', marginBottom: '2rem' }}>
            <h4 style={{ margin: '0 0 0.5rem 0', color: '#C2410C', fontSize: '0.95rem' }}>Datos de Pago Móvil de la Tienda</h4>
            <div style={{ fontSize: '0.85rem', color: '#9A3412', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.5rem' }}>
              <div><strong>Banco:</strong> Banesco (0134)</div>
              <div><strong>Teléfono:</strong> 0414-1234567</div>
              <div><strong>Cédula/RIF:</strong> V-12345678</div>
              <div><strong>Tasa (BCV):</strong> {bcvRate.toFixed(2)} Bs</div>
            </div>
            <div style={{ marginTop: '0.5rem', paddingTop: '0.5rem', borderTop: '1px dashed #FFEDD5', fontWeight: 'bold', color: '#C2410C' }}>
              Monto en Bs: {(total * bcvRate).toFixed(2)} Bs.
            </div>
          </div>

          <h4 style={{ margin: '0 0 1rem 0', fontSize: '1rem' }}>Datos de Envío</h4>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginBottom: '2rem' }}>
            <div>
              <label style={{ display: 'block', marginBottom: '0.3rem', fontSize: '0.85rem', fontWeight: 'bold', color: '#64748B' }}>Nombre Completo</label>
              <input type="text" value={customerName} onChange={e => setCustomerName(e.target.value)} style={{ width: '100%', padding: '0.8rem', borderRadius: '8px', border: '1px solid #E2E8E0', outline: 'none' }} required />
            </div>
            <div>
              <label style={{ display: 'block', marginBottom: '0.3rem', fontSize: '0.85rem', fontWeight: 'bold', color: '#64748B' }}>Teléfono</label>
              <input type="text" value={customerPhone} onChange={e => setCustomerPhone(e.target.value)} style={{ width: '100%', padding: '0.8rem', borderRadius: '8px', border: '1px solid #E2E8E0', outline: 'none' }} required />
            </div>
            <div>
              <label style={{ display: 'block', marginBottom: '0.3rem', fontSize: '0.85rem', fontWeight: 'bold', color: '#64748B' }}>Dirección de Entrega</label>
              <textarea value={customerAddress} onChange={e => setCustomerAddress(e.target.value)} style={{ width: '100%', padding: '0.8rem', borderRadius: '8px', border: '1px solid #E2E8E0', outline: 'none', resize: 'vertical' }} required />
            </div>
          </div>

          <h4 style={{ margin: '0 0 1rem 0', fontSize: '1rem' }}>Reporta tu pago</h4>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <div>
              <label style={{ display: 'block', marginBottom: '0.3rem', fontSize: '0.85rem', fontWeight: 'bold', color: '#64748B' }}>Banco Emisor</label>
              <select value={paymentBank} onChange={e => setPaymentBank(e.target.value)} style={{ width: '100%', padding: '0.8rem', borderRadius: '8px', border: '1px solid #E2E8E0', outline: 'none', background: 'white' }} required>
                <option value="">Selecciona tu banco...</option>
                <option value="0102">Banco de Venezuela (0102)</option>
                <option value="0105">Mercantil (0105)</option>
                <option value="0108">Provincial (0108)</option>
                <option value="0134">Banesco (0134)</option>
                <option value="0114">Bancaribe (0114)</option>
              </select>
            </div>
            <div>
              <label style={{ display: 'block', marginBottom: '0.3rem', fontSize: '0.85rem', fontWeight: 'bold', color: '#64748B' }}>Número de Referencia (Últimos 6 dígitos)</label>
              <input type="text" value={paymentReference} onChange={e => setPaymentReference(e.target.value)} placeholder="Ej. 938472" maxLength={6} pattern="\d{4,6}" style={{ width: '100%', padding: '0.8rem', borderRadius: '8px', border: '1px solid #E2E8E0', outline: 'none' }} required />
            </div>
            <div>
              <label style={{ display: 'block', marginBottom: '0.3rem', fontSize: '0.85rem', fontWeight: 'bold', color: '#64748B' }}>Fecha del Pago</label>
              <input type="date" value={paymentDate} onChange={e => setPaymentDate(e.target.value)} style={{ width: '100%', padding: '0.8rem', borderRadius: '8px', border: '1px solid #E2E8E0', outline: 'none' }} required />
            </div>
          </div>

          <button
            type="submit"
            disabled={isProcessing}
            style={{
              width: '100%', padding: '1rem', background: isProcessing ? '#94A3B8' : 'var(--primary)',
              color: 'white', border: 'none', borderRadius: '12px', fontWeight: 'bold',
              fontSize: '1rem', cursor: isProcessing ? 'not-allowed' : 'pointer', marginTop: '2rem',
              display: 'flex', justifyContent: 'center', alignItems: 'center'
            }}
          >
            {isProcessing ? 'Procesando...' : 'Confirmar Pago'}
          </button>
        </form>
      </div>
    </div>
  )
}

const SuccessModal = ({ onClose }) => (
  <div style={{
    position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
    background: 'rgba(0,0,0,0.6)', display: 'flex', alignItems: 'center', justifyContent: 'center',
    zIndex: 2000, backdropFilter: 'blur(4px)'
  }}>
    <div style={{
      background: 'white', borderRadius: '24px', width: '90%', maxWidth: '400px',
      padding: '3rem 2rem', textAlign: 'center',
      animation: 'fadeIn 0.4s ease-out'
    }}>
      <div style={{ background: '#DCFCE7', width: '80px', height: '80px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1.5rem', color: '#16A34A' }}>
        <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="M20 6L9 17l-5-5" /></svg>
      </div>
      <h2 style={{ margin: '0 0 0.5rem 0', fontFamily: 'Fraunces', color: '#1C2B23', fontSize: '1.8rem' }}>¡Orden Recibida!</h2>
      <p style={{ color: '#64748B', marginBottom: '2rem', lineHeight: 1.5 }}>
        Hemos recibido el reporte de tu pago. La tienda lo validará en breve y preparará tu envío.
      </p>
      <button
        onClick={onClose}
        style={{ width: '100%', padding: '1rem', background: '#F1F5F9', color: '#0F172A', border: 'none', borderRadius: '12px', fontWeight: 'bold', fontSize: '1rem', cursor: 'pointer' }}
      >
        Seguir Comprando
      </button>
    </div>
  </div>
)



// --- PLANTILLAS DE SECCIÓN ---

const hexToRgba = (hex, alpha = 0.8) => {
  if (!hex || typeof hex !== 'string') return `rgba(17, 104, 62, ${alpha})`;
  let c = hex.replace('#', '');
  if (c.length === 3) c = c.split('').map(x => x + x).join('');
  const num = parseInt(c, 16);
  if (isNaN(num)) return `rgba(17, 104, 62, ${alpha})`;
  return `rgba(${(num >> 16) & 255}, ${(num >> 8) & 255}, ${num & 255}, ${alpha})`;
}

const HeroTemplate = ({ config, storeConfig }) => {
  const baseColor = config.overlayColor || storeConfig?.primaryColor || '#11683E';
  const colorStart = hexToRgba(baseColor, 0.95);
  const colorEnd = hexToRgba(baseColor, 0.1);

  return (
    <div className="hero-padding hero-min-height" style={{
      position: 'relative', borderRadius: '24px', overflow: 'hidden',
      backgroundImage: config.hideGradient ? `url(${config.bgImage})` : `linear-gradient(to right, ${colorStart} 35%, ${colorEnd} 100%), url(${config.bgImage})`,
      backgroundSize: 'cover', backgroundPosition: 'center', color: config.hideGradient ? 'inherit' : 'white',
      textShadow: config.hideGradient ? '0px 2px 4px rgba(0,0,0,0.6)' : 'none',
      display: 'flex', flexDirection: 'column', alignItems: 'flex-start', justifyContent: 'center'
    }}>
      <span style={{ border: '1px solid rgba(255,255,255,0.5)', padding: '0.4rem 1rem', borderRadius: '20px', fontSize: '0.8rem', fontWeight: 'bold', marginBottom: '1.5rem', color: '#FFD166' }}>
        {config.tagText || '✨ NUEVA TEMPORADA 2024'}
      </span>
      <h1 className="hero-title" style={{ margin: '0 0 1rem 0', lineHeight: 1.1, maxWidth: '600px' }}>
        {config.title || '¡Bienvenido a nuestra Tienda!'}
      </h1>
      <p style={{ fontSize: '1.1rem', maxWidth: '500px', marginBottom: '2rem', lineHeight: 1.5, opacity: 0.9 }}>
        {config.subtitle || 'Descubre los mejores productos y ofertas exclusivas seleccionadas para ti.'}
      </p>
      <div className="hero-buttons" style={{ display: 'flex', gap: '1rem' }}>
        <button style={{ background: storeConfig?.buttonColor || '#FF3B30', color: 'white', border: 'none', padding: '1rem 2rem', borderRadius: '30px', fontWeight: 'bold', cursor: 'pointer', fontSize: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          {config.buttonText || 'Explorar'} &rarr;
        </button>
        <button style={{ background: 'transparent', color: 'white', border: '1px solid white', padding: '1rem 2rem', borderRadius: '30px', fontWeight: 'bold', cursor: 'pointer', fontSize: '1rem' }}>
          Ver Ofertas
        </button>
      </div>
    </div>
  )
}

const CategoriesTemplate = ({ categories, config, storeConfig, onCategoryClick }) => {
  return (
    <div>
      <SectionHeader title={config.sectionTitle} subtitle={config.sectionSubtitle} link="Ver todas &rarr;" titleColor={storeConfig?.titleColor} buttonColor={storeConfig?.buttonColor} />
      <div style={{ display: 'grid', gridTemplateColumns: `repeat(auto-fit, minmax(min(100%, 220px), 1fr))`, gap: '1rem' }}>
        {categories.map(cat => (
          <div key={cat.id}
            onClick={() => onCategoryClick && onCategoryClick(cat)}
            style={{
              background: cat.color, borderRadius: '16px', padding: '1.5rem', color: 'white',
              display: 'flex', flexDirection: 'column', justifyContent: 'center', position: 'relative',
              overflow: 'hidden', cursor: 'pointer', minHeight: '120px', transition: 'transform 0.2s'
            }}
            onMouseOver={(e) => e.currentTarget.style.transform = 'translateY(-5px)'}
            onMouseOut={(e) => e.currentTarget.style.transform = 'translateY(0)'}
          >
            <div style={{ position: 'absolute', right: '-10px', bottom: '-20px', fontSize: '6rem', opacity: 0.2 }}>{cat.icon}</div>
            <div style={{ position: 'absolute', top: '1rem', right: '1rem', fontSize: '2rem' }}>{cat.icon}</div>
            <h4 style={{ margin: '0 0 0.3rem 0', fontSize: '1.1rem', zIndex: 1 }}>{cat.name}</h4>
            <p style={{ margin: 0, fontSize: '0.8rem', opacity: 0.9, zIndex: 1 }}>{cat.count} productos</p>
          </div>
        ))}
      </div>
    </div>
  )
}
const SingleProductModal = ({ product, onClose, addToCart, bcvRate }) => {
  const [activeImgIdx, setActiveImgIdx] = useState(0)
  const [quantity, setQuantity] = useState(1)
  const images = [product.image, ...(product.gallery || [])].filter(Boolean)

  const handleAdd = () => {
    for (let i = 0; i < quantity; i++) {
      addToCart(product)
    }
    onClose()
  }

  return (
    <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.6)', zIndex: 3000, display: 'flex', alignItems: 'center', justifyContent: 'center', backdropFilter: 'blur(4px)' }}>
      <div className="single-product-modal" style={{ background: 'white', borderRadius: '24px', width: '90%', maxWidth: '800px', overflow: 'hidden', position: 'relative', maxHeight: '90vh' }}>
        <button onClick={onClose} style={{ position: 'absolute', top: '1rem', right: '1rem', background: 'white', border: 'none', borderRadius: '50%', width: '36px', height: '36px', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', zIndex: 2, boxShadow: '0 2px 4px rgba(0,0,0,0.1)' }}>
          <X size={20} color="#64748B" />
        </button>

        {/* Galería Izquierda */}
        <div style={{ flex: '1', background: '#F8FAFC', display: 'flex', flexDirection: 'column', padding: '1.5rem' }}>
          <div style={{ flex: 1, borderRadius: '16px', overflow: 'hidden', background: 'white', marginBottom: '1rem', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <img src={images[activeImgIdx]} alt={product.name} style={{ width: '100%', height: '100%', objectFit: 'contain' }} />
          </div>
          {images.length > 1 && (
            <div style={{ display: 'flex', gap: '0.5rem', overflowX: 'auto', paddingBottom: '0.5rem' }}>
              {images.map((img, idx) => (
                <div key={idx} onClick={() => setActiveImgIdx(idx)} style={{ width: '60px', height: '60px', borderRadius: '8px', overflow: 'hidden', border: activeImgIdx === idx ? '2px solid var(--primary)' : '2px solid transparent', cursor: 'pointer', opacity: activeImgIdx === idx ? 1 : 0.6, transition: 'all 0.2s', flexShrink: 0 }}>
                  <img src={img} alt={`Thumb ${idx}`} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Detalles Derecha */}
        <div style={{ flex: '1', padding: '2.5rem 2rem', overflowY: 'auto' }}>
          <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1rem' }}>
            <span style={{ background: '#E8F5E9', color: '#2E7D32', padding: '0.3rem 0.8rem', borderRadius: '20px', fontSize: '0.75rem', fontWeight: 'bold' }}>{product.badge}</span>
          </div>
          <h2 style={{ margin: '0 0 0.5rem 0', fontSize: '1.8rem', color: '#0F172A' }}>{product.name}</h2>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1.5rem' }}>
            <Star size={16} color="#FFC107" fill="#FFC107" />
            <span style={{ fontSize: '0.9rem', color: '#64748B' }}>{product.rating} (120 Reseñas)</span>
          </div>

          <div style={{ marginBottom: '2rem' }}>
            <div style={{ fontSize: '2rem', fontWeight: 'bold', color: 'var(--primary)' }}>${product.price.toFixed(2)}</div>
            <div style={{ fontSize: '1.1rem', color: '#64748B' }}>{(product.price * bcvRate).toFixed(2)} Bs</div>
          </div>

          <p style={{ color: '#475569', lineHeight: '1.6', marginBottom: '2rem', fontSize: '0.95rem' }}>
            {product.description || 'Este producto no tiene una descripción detallada, pero es uno de los mejores de nuestro catálogo.'}
          </p>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ fontWeight: 'bold', color: '#64748B', fontSize: '0.95rem' }}>Cantidad:</span>
              <div style={{ display: 'flex', alignItems: 'center', border: '1px solid #E2E8F0', borderRadius: '12px', overflow: 'hidden' }}>
                <button onClick={() => setQuantity(Math.max(1, quantity - 1))} style={{ padding: '0.8rem 1rem', background: '#F8FAFC', border: 'none', cursor: 'pointer', color: '#0F172A', fontWeight: 'bold' }}>-</button>
                <div style={{ padding: '0.8rem 1rem', minWidth: '40px', textAlign: 'center', fontWeight: 'bold' }}>{quantity}</div>
                <button onClick={() => setQuantity(quantity + 1)} style={{ padding: '0.8rem 1rem', background: '#F8FAFC', border: 'none', cursor: 'pointer', color: '#0F172A', fontWeight: 'bold' }}>+</button>
              </div>
            </div>

            <button
              onClick={handleAdd}
              style={{ width: '100%', background: 'var(--primary)', color: 'white', border: 'none', padding: '1rem', borderRadius: '12px', fontWeight: 'bold', fontSize: '1rem', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem', transition: 'opacity 0.2s' }}
            >
              <Plus size={20} /> Agregar - ${(product.price * quantity).toFixed(2)}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

const ProductsTemplate = ({ products, config, storeConfig, addToCart, onViewAll }) => {
  const [selectedProduct, setSelectedProduct] = useState(null)

  const cleanTitle = (config.sectionTitle === 'Tu Catálogo') ? 'Nuestros Productos' : (config.sectionTitle || 'Nuestros Productos')
  const cleanSubtitle = (config.sectionSubtitle && config.sectionSubtitle.includes('Sube tus primeros')) ? 'Explora nuestra colección exclusiva con entrega rápida y garantía de calidad.' : (config.sectionSubtitle || '')

  const displayProducts = products.slice(0, 6)

  return (
    <>
      <div>
      <SectionHeader title={cleanTitle} subtitle={cleanSubtitle} link="Ver todos &rarr;" onLinkClick={onViewAll} titleColor={storeConfig?.titleColor} buttonColor={storeConfig?.buttonColor} />
      <div style={{ display: 'grid', gridTemplateColumns: `repeat(auto-fill, minmax(min(100%, 260px), 1fr))`, gap: '1.5rem' }}>
        {displayProducts.map(prod => (
          <div key={prod.id} style={{ background: 'white', borderRadius: '16px', overflow: 'hidden', border: '1px solid #eee', position: 'relative' }}>
            <div style={{ position: 'absolute', top: '10px', left: '10px', display: 'flex', gap: '0.5rem', zIndex: 1 }}>
              <span style={{ background: '#E8F5E9', color: '#2E7D32', padding: '0.2rem 0.6rem', borderRadius: '12px', fontSize: '0.7rem', fontWeight: 'bold' }}>
                {prod.badge}
              </span>
              {prod.oldPrice && (
                <span style={{ background: '#FFEBEE', color: '#C62828', padding: '0.2rem 0.6rem', borderRadius: '12px', fontSize: '0.7rem', fontWeight: 'bold' }}>
                  -20%
                </span>
              )}
            </div>
            <div
              style={{ height: '200px', background: '#F8F9F3', display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden', cursor: 'pointer' }}
              onClick={() => setSelectedProduct(prod)}
            >
              <img src={prod.image} alt={prod.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
            </div>
            <div style={{ padding: '1rem' }}>
              <h5
                style={{ margin: '0 0 0.3rem 0', fontSize: '1rem', color: 'var(--text-main)', cursor: 'pointer' }}
                onClick={() => setSelectedProduct(prod)}
              >
                {prod.name}
              </h5>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.3rem', marginBottom: '1rem' }}>
                <Star size={14} color="#FFC107" fill="#FFC107" />
                <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>{prod.rating} (120)</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                  <span style={{ fontWeight: 'bold', fontSize: '1.2rem', color: 'var(--primary)' }}>${prod.price.toFixed(2)}</span>
                  {prod.oldPrice && <span style={{ fontSize: '0.8rem', color: '#999', textDecoration: 'line-through', marginLeft: '0.5rem' }}>${prod.oldPrice}</span>}
                  <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>{(prod.price * useStore.getState().bcvRate).toFixed(2)} Bs</div>
                </div>
                <button
                  onClick={() => addToCart(prod)}
                  style={{ background: '#E8F5E9', border: 'none', width: '32px', height: '32px', borderRadius: '50%', color: '#2E7D32', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', transition: 'all 0.2s' }}
                  onMouseOver={(e) => { e.currentTarget.style.background = '#2E7D32'; e.currentTarget.style.color = 'white'; }}
                  onMouseOut={(e) => { e.currentTarget.style.background = '#E8F5E9'; e.currentTarget.style.color = '#2E7D32'; }}
                >
                  <Plus size={18} />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
      
      {
    selectedProduct && (
      <SingleProductModal
        product={selectedProduct}
        onClose={() => setSelectedProduct(null)}
        addToCart={addToCart}
        bcvRate={useStore.getState().bcvRate}
      />
    )
  }
    </>
  )
}

const PromoTemplate = ({ config }) => (
  <div style={{
    background: 'linear-gradient(135deg, #FF9800 0%, #FFC107 100%)',
    borderRadius: '24px', padding: '3rem', color: 'white', display: 'flex', justifyContent: 'space-between', alignItems: 'center'
  }}>
    <div>
      <div style={{ fontSize: '0.8rem', fontWeight: 'bold', letterSpacing: '1px', marginBottom: '0.5rem', textTransform: 'uppercase' }}>Oferta Especial - Tiempo Limitado</div>
      <h2 style={{ fontSize: '2.5rem', margin: '0 0 0.5rem 0' }}>{config.title}</h2>
      <p style={{ margin: 0, opacity: 0.9 }}>{config.subtitle}</p>
    </div>
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', alignItems: 'center' }}>
      <div style={{ background: 'rgba(255,255,255,0.2)', padding: '0.5rem 1rem', borderRadius: '8px', fontSize: '1.2rem', fontWeight: 'bold', border: '2px dashed rgba(255,255,255,0.5)' }}>
        CÓDIGO: {config.code}
      </div>
      <button style={{ background: 'white', color: '#FF9800', border: 'none', padding: '0.8rem 2rem', borderRadius: '30px', fontWeight: 'bold', cursor: 'pointer' }}>
        Aplicar Oferta &rarr;
      </button>
    </div>
  </div>
)

const FeaturesTemplate = ({ features, config, storeConfig }) => {
  return (
    <div style={{ textAlign: 'center' }}>
      <SectionHeader title={config.sectionTitle} subtitle={config.sectionSubtitle} center titleColor={storeConfig?.titleColor} buttonColor={storeConfig?.buttonColor} />
      <div style={{ display: 'grid', gridTemplateColumns: `repeat(auto-fit, minmax(min(100%, 220px), 1fr))`, gap: '1.5rem' }}>
        {features.map(feat => (
          <div key={feat.id} style={{ background: 'white', borderRadius: '16px', padding: '2rem 1.5rem', textAlign: 'left', border: '1px solid #eee' }}>
            <div style={{ background: '#F8F9F3', width: '50px', height: '50px', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.5rem', marginBottom: '1rem' }}>
              {feat.icon}
            </div>
            <h5 style={{ margin: '0 0 0.5rem 0', fontSize: '1.1rem' }}>{feat.title}</h5>
            <p style={{ margin: 0, fontSize: '0.9rem', color: 'var(--text-muted)', lineHeight: 1.5 }}>{feat.desc}</p>
          </div>
        ))}
      </div>
    </div>
  )
}

const TestimonialsTemplate = ({ testimonials, config, storeConfig }) => {
  return (
    <div style={{ textAlign: 'center' }}>
      <SectionHeader title={config.sectionTitle} subtitle={config.sectionSubtitle} center titleColor={storeConfig?.titleColor} buttonColor={storeConfig?.buttonColor} />
      <div style={{ display: 'grid', gridTemplateColumns: `repeat(auto-fit, minmax(min(100%, 300px), 1fr))`, gap: '1.5rem' }}>
        {testimonials.map(test => (
          <div key={test.id} style={{ background: 'white', borderRadius: '16px', padding: '2rem', textAlign: 'left', border: '1px solid #eee' }}>
            <div style={{ display: 'flex', gap: '0.2rem', marginBottom: '1rem' }}>
              {[1, 2, 3, 4, 5].map(s => <Star key={s} size={14} color="#FFC107" fill="#FFC107" />)}
            </div>
            <p style={{ margin: '0 0 1.5rem 0', fontSize: '0.95rem', fontStyle: 'italic', color: 'var(--text-main)', lineHeight: 1.6 }}>
              "{test.text}"
            </p>
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
              <img src={test.avatar} alt={test.name} style={{ width: '40px', height: '40px', borderRadius: '50%' }} />
              <div>
                <h6 style={{ margin: 0, fontSize: '0.9rem' }}>{test.name}</h6>
                <p style={{ margin: 0, fontSize: '0.8rem', color: 'var(--text-muted)' }}>{test.role}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

const SectionHeader = ({ title, subtitle, link, onLinkClick, center, titleColor, buttonColor }) => (
  <div style={{ display: 'flex', justifyContent: center ? 'center' : 'space-between', alignItems: center ? 'center' : 'flex-end', marginBottom: '2rem', flexDirection: center ? 'column' : 'row', textAlign: center ? 'center' : 'left' }}>
    <div>
      <h2 style={{ margin: '0 0 0.3rem 0', fontSize: '2rem', color: titleColor || 'var(--primary)' }}>{title}</h2>
      <p style={{ margin: 0, color: 'var(--text-muted)' }}>{subtitle}</p>
    </div>
    {link && (
      <button 
        onClick={(e) => { e.preventDefault(); if (onLinkClick) onLinkClick(); }} 
        style={{ background: 'none', border: 'none', color: buttonColor || 'var(--primary)', fontWeight: 'bold', fontSize: '0.9rem', cursor: 'pointer', padding: 0 }}
      >
        {link}
      </button>
    )}
  </div>
)

// --- COMPONENTE PRINCIPAL ---
export default function StorePreview({ isReadOnly = false }) {
  const navigate = useNavigate()
  const { storeId } = useParams()
  const globalState = useStore()

  const { publicStoreData, fetchPublicStoreData, clearPublicStoreData, activeSectionId, setActiveSectionId, cart, isCartOpen, toggleCart, clearCart, logout, addOrder, addToCart, user } = globalState

  useEffect(() => {
    if (isReadOnly && storeId && !mockStoreData[storeId]) {
      fetchPublicStoreData(storeId)
    }
    return () => {
      if (isReadOnly) clearPublicStoreData()
    }
  }, [storeId, isReadOnly, fetchPublicStoreData, clearPublicStoreData])

  const [showCheckout, setShowCheckout] = useState(false)
  const [showSuccess, setShowSuccess] = useState(false)
  const [activeCategoryView, setActiveCategoryView] = useState(null)
  const [showAllProducts, setShowAllProducts] = useState(false)

  let activeStoreData;
  if (!isReadOnly) {
    activeStoreData = globalState;
  } else if (storeId && mockStoreData[storeId]) {
    activeStoreData = { ...globalState, ...mockStoreData[storeId] };
  } else if (publicStoreData) {
    activeStoreData = { ...globalState, ...publicStoreData };
  } else {
    return <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'Inter' }}>Cargando datos de la tienda...</div>
  }

  // Datos específicos de la tienda (visual)
  const { storeConfig, layoutSections, categories, products, features, testimonials } = activeStoreData

  const shippingCost = storeConfig?.shippingCost !== undefined ? parseFloat(storeConfig.shippingCost) : 0
  const cartTotalQty = cart.reduce((acc, item) => acc + item.quantity, 0)
  const cartSubtotal = cart.reduce((acc, item) => acc + (item.price * item.quantity), 0)
  const cartTotal = cartSubtotal > 0 ? cartSubtotal + shippingCost : 0

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  return (
    <div className="store-container" style={{
      margin: isReadOnly ? '0 auto' : '0',
      '--primary': storeConfig.primaryColor || '#11683E',
      '--accent-yellow': storeConfig.secondaryColor || '#FFC107'
    }}>

      {/* 1. Top Announcement Bar */}
      <div className="store-top-announcement">
        <span>🚀 Envíos a todo el país &nbsp;|&nbsp; 💳 Pago Móvil Inmediato &nbsp;|&nbsp; ⭐ Calidad Garantizada</span>
      </div>

      {/* 2. Store Hero Profile Header */}
      <div className="store-hero-header">
        {/* Cover Banner */}
        <div className="store-cover-banner">
          {isReadOnly && (
            <button
              onClick={() => navigate('/market')}
              className="store-back-floating-btn"
              title="Volver al Marketplace"
            >
              <ArrowLeft size={16} />
              <span>Volver al Marketplace</span>
            </button>
          )}

          {storeConfig.coverUrl ? (
            <img src={storeConfig.coverUrl} alt="Portada" className="store-cover-img" />
          ) : (
            <div 
              className="store-cover-gradient" 
              style={{ background: `linear-gradient(135deg, ${storeConfig.primaryColor || '#11683E'} 0%, #0F172A 100%)` }}
            />
          )}
          <div className="store-cover-overlay" />
        </div>

        {/* Store Profile Card */}
        <div className="store-profile-card">
          {/* Store Avatar / Logo */}
          <div className="store-avatar-box">
            {storeConfig.logoText?.startsWith('http') || storeConfig.logoText?.startsWith('data:image') ? (
              <img src={storeConfig.logoText} alt="Logo" className="store-avatar-img" />
            ) : (
              <span className="store-avatar-emoji">{storeConfig.logoText || '🏪'}</span>
            )}
          </div>

          {/* Store Information */}
          <div className="store-profile-details">
            <div className="store-title-row">
              <h1 className="store-name-title" style={{ color: storeConfig.titleColor || 'var(--text-main)' }}>
                {storeConfig.name}
              </h1>
              <span className="store-verified-badge" title="Tienda Verificada">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="var(--primary)" color="white"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/></svg>
                Verificada
              </span>
            </div>

            <div className="store-profile-meta">
              {storeConfig.category && (
                <span className="meta-pill category-pill">
                  🏷️ {storeConfig.category}
                </span>
              )}
              <span className="meta-pill rating-pill">
                ⭐ 5.0 (Reseñas)
              </span>
              <span className="meta-pill info-pill">
                📦 {products.length} Productos
              </span>
              {storeConfig.location && (
                <span className="meta-pill info-pill">
                  📍 {storeConfig.location}
                </span>
              )}
              {storeConfig.followers && (
                <span className="meta-pill info-pill">
                  👥 {storeConfig.followers} seguidores
                </span>
              )}
            </div>
          </div>

          {/* Actions & Navigation */}
          <div className="store-profile-actions">
            <button 
              onClick={toggleCart} 
              className="store-cart-btn-primary"
              style={{ background: storeConfig.buttonColor || storeConfig.primaryColor || 'var(--primary)' }}
            >
              <ShoppingCart size={18} />
              <span>Ver Carrito ({cartTotalQty})</span>
              {cartTotal > 0 && <span className="cart-total-badge">${cartTotal.toFixed(2)}</span>}
            </button>
          </div>
        </div>
      </div>

      {showAllProducts ? (
        <div className="store-section-padding" style={{ paddingBottom: '6rem' }}>
          <AllProductsView 
            products={products}
            categories={categories}
            onBack={() => setShowAllProducts(false)}
            addToCart={addToCart}
            storeConfig={storeConfig}
          />
        </div>
      ) : activeCategoryView ? (
        <div className="store-section-padding" style={{ paddingBottom: '6rem' }}>
          <CategoryInlineView 
            category={activeCategoryView} 
            products={products.filter(p => {
              // Fix for products created with the old categoryId bug
              const catId = (p.categoryId === 1 || p.categoryId === '1' || Number.isNaN(p.categoryId)) ? 'camisetas' : p.categoryId;
              return catId === activeCategoryView.id;
            })} 
            onBack={() => setActiveCategoryView(null)}
            addToCart={addToCart}
          />
        </div>
      ) : (
        <div className="store-section-padding" style={{ display: 'flex', flexDirection: 'column', gap: '3rem', paddingBottom: '6rem' }}>
          {layoutSections.map((section) => {
            const isActive = !isReadOnly && activeSectionId === section.id
            const config = section.config || {}

            return (
              <section
                key={section.id}
                className={isReadOnly ? '' : `section-hover ${isActive ? 'section-active' : ''}`}
                onClick={(e) => {
                  if (!isReadOnly) {
                    e.stopPropagation();
                    setActiveSectionId(section.id)
                  }
                }}
                style={{ position: 'relative', borderRadius: '24px' }}
              >

                {!isReadOnly && (
                  <div className="section-badge" style={{ background: isActive ? 'var(--primary)' : '#475569' }}>
                    {section.title} <Settings size={12} />
                  </div>
                )}

                {section.templateType === 'hero' && <HeroTemplate config={config} storeConfig={storeConfig} />}
                {section.templateType === 'categories' && <CategoriesTemplate categories={categories} config={config} storeConfig={storeConfig} onCategoryClick={(cat) => setActiveCategoryView(cat)} />}
                {section.templateType === 'products_grid' && <ProductsTemplate products={products.filter(p => (p.tags || ['all']).includes(section.tag || 'all'))} config={config} storeConfig={storeConfig} addToCart={addToCart} onViewAll={() => setShowAllProducts(true)} />}
                {section.templateType === 'promo' && <PromoTemplate config={config} storeConfig={storeConfig} />}
                {section.templateType === 'features' && <FeaturesTemplate features={features} config={config} storeConfig={storeConfig} />}
                {section.templateType === 'testimonials' && <TestimonialsTemplate testimonials={testimonials} config={config} storeConfig={storeConfig} />}

              </section>
            )
          })}
        </div>
      )}

      {/* Cart & Checkout Overlays */}
      {isCartOpen && (
        <>
          <div onClick={toggleCart} style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', zIndex: 999 }} />
          <CartDrawer
            shippingCost={shippingCost}
            onClose={toggleCart}
            onCheckout={() => {
              if (isReadOnly && (!user || user.isAnonymous)) {
                toggleCart();
                navigate('/register', { state: { role: 'cliente', returnTo: `/store/${storeId}` } });
                return;
              }
              toggleCart();
              setShowCheckout(true);
            }}
          />
        </>
      )}

      {showCheckout && (
        <CheckoutModal
          total={cartTotal}
          onClose={() => setShowCheckout(false)}
          onSuccess={(checkoutData) => {
            setShowCheckout(false);
            addOrder({ 
              total: cartTotal, 
              items: [...cart], 
              storeId: storeId || '1',
              storeName: storeConfig?.name || 'Waby Store',
              storeLogo: storeConfig?.logoText || '🏪',
              storeCategory: storeConfig?.category || 'Ropa & Accesorios',
              storeLocation: storeConfig?.location || 'Caracas',
              ...checkoutData 
            });
            clearCart();
            setShowSuccess(true);
          }}
        />
      )}

      {showSuccess && (
        <SuccessModal onClose={() => setShowSuccess(false)} />
      )}

    </div>
  )
}
