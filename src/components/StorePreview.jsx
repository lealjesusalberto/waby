import React, { useState, useEffect } from 'react'
import { useStore } from '../store/useStore'
import { useNavigate, useParams } from 'react-router-dom'
import { ShoppingCart, Star, Settings, X, Plus, Minus, Trash2, CreditCard, LogOut } from 'lucide-react'
import { mockStoreData } from '../store/mockStoreData'

// --- CARRITO (DRAWER) ---
const CartDrawer = ({ onClose, onCheckout }) => {
  const { cart, removeFromCart, updateQuantity } = useStore()
  const subtotal = cart.reduce((acc, item) => acc + (item.price * item.quantity), 0)
  const envio = subtotal > 0 ? 5.00 : 0
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
                    <button onClick={() => updateQuantity(item.id, -1)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#64748B', display: 'flex' }}><Minus size={14}/></button>
                    <span style={{ fontSize: '0.9rem', fontWeight: 'bold', width: '20px', textAlign: 'center' }}>{item.quantity}</span>
                    <button onClick={() => updateQuantity(item.id, 1)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#64748B', display: 'flex' }}><Plus size={14}/></button>
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

// --- CATEGORY PRODUCTS MODAL ---
const CategoryProductsModal = ({ category, products, onClose }) => {
  const { addToCart } = useStore()
  
  return (
    <div style={{
      position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.6)', display: 'flex', alignItems: 'center', justifyContent: 'center',
      zIndex: 1000, backdropFilter: 'blur(4px)'
    }}>
      <div style={{
        background: '#F8F9F3', borderRadius: '24px', width: '90%', maxWidth: '1000px',
        maxHeight: '85vh', display: 'flex', flexDirection: 'column', overflow: 'hidden',
        boxShadow: '0 25px 50px -12px rgba(0,0,0,0.5)', animation: 'fadeIn 0.2s ease-out'
      }}>
        {/* Header Modal */}
        <div style={{ background: category.color, padding: '2rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', color: 'white' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <span style={{ fontSize: '3rem' }}>{category.icon}</span>
            <div>
              <h2 style={{ margin: 0, fontSize: '2rem', fontFamily: 'Fraunces' }}>{category.name}</h2>
              <p style={{ margin: 0, opacity: 0.9 }}>{products.length} productos disponibles</p>
            </div>
          </div>
          <button onClick={onClose} style={{ background: 'rgba(255,255,255,0.2)', border: 'none', borderRadius: '50%', width: '40px', height: '40px', color: 'white', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <X size={24} />
          </button>
        </div>

        {/* Products Grid */}
        <div style={{ flex: 1, overflowY: 'auto', padding: '2rem' }}>
          {products.length === 0 ? (
            <p style={{ textAlign: 'center', color: '#64748B', fontSize: '1.2rem', marginTop: '2rem' }}>No hay productos en esta categoría por ahora.</p>
          ) : (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: '1.5rem' }}>
              {products.map(prod => (
                <div key={prod.id} style={{ background: 'white', borderRadius: '16px', overflow: 'hidden', border: '1px solid #eee', position: 'relative' }}>
                  <div style={{ height: '180px', background: '#F8F9F3', display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden' }}>
                    <img src={prod.image} alt={prod.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                  </div>
                  <div style={{ padding: '1rem' }}>
                    <h5 style={{ margin: '0 0 0.3rem 0', fontSize: '0.95rem', color: 'var(--text-main)' }}>{prod.name}</h5>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '0.5rem' }}>
                      <div style={{ display: 'flex', flexDirection: 'column' }}>
                        <span style={{ fontWeight: 'bold', fontSize: '1.1rem', color: 'var(--primary)' }}>${prod.price.toFixed(2)}</span>
                        <span style={{ fontSize: '0.75rem', color: '#94A3B8' }}>{(prod.price * useStore.getState().bcvRate).toFixed(2)} Bs</span>
                      </div>
                      <button 
                        onClick={() => addToCart(prod)}
                        style={{ background: '#E8F5E9', border: 'none', width: '32px', height: '32px', borderRadius: '50%', color: '#2E7D32', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}
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
      </div>
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
        <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="M20 6L9 17l-5-5"/></svg>
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

const HeroTemplate = ({ config, storeConfig }) => (
  <div className="hero-padding hero-min-height" style={{
    position: 'relative', borderRadius: '24px', overflow: 'hidden',
    backgroundImage: `linear-gradient(to right, rgba(13, 92, 59, 0.9) 30%, rgba(13, 92, 59, 0.4) 100%), url(${config.bgImage})`,
    backgroundSize: 'cover', backgroundPosition: 'center', color: 'white',
    display: 'flex', flexDirection: 'column', alignItems: 'flex-start', justifyContent: 'center'
  }}>
    <span style={{ border: '1px solid rgba(255,255,255,0.5)', padding: '0.4rem 1rem', borderRadius: '20px', fontSize: '0.8rem', fontWeight: 'bold', marginBottom: '1.5rem', color: '#FFD166' }}>
      ✨ NUEVA TEMPORADA 2024
    </span>
    <h1 className="hero-title" style={{ margin: '0 0 1rem 0', lineHeight: 1.1, maxWidth: '600px' }}>
      {config.title.split('Paraíso Tropical')[0]}
      <span style={{ color: '#FFC107' }}>Paraíso</span> Tropical
    </h1>
    <p style={{ fontSize: '1.1rem', maxWidth: '500px', marginBottom: '2rem', lineHeight: 1.5, opacity: 0.9 }}>
      {config.subtitle}
    </p>
    <div className="hero-buttons" style={{ display: 'flex', gap: '1rem' }}>
      <button style={{ background: '#FF3B30', color: 'white', border: 'none', padding: '1rem 2rem', borderRadius: '30px', fontWeight: 'bold', cursor: 'pointer', fontSize: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
        {config.buttonText} &rarr;
      </button>
      <button style={{ background: 'transparent', color: 'white', border: '1px solid white', padding: '1rem 2rem', borderRadius: '30px', fontWeight: 'bold', cursor: 'pointer', fontSize: '1rem' }}>
        Ver Ofertas
      </button>
    </div>
  </div>
)

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

const ProductsTemplate = ({ products, config, storeConfig, addToCart }) => {
  return (
    <div>
      <SectionHeader title={config.sectionTitle} subtitle={config.sectionSubtitle} link="Ver todos &rarr;" titleColor={storeConfig?.titleColor} buttonColor={storeConfig?.buttonColor} />
      <div style={{ display: 'grid', gridTemplateColumns: `repeat(auto-fit, minmax(min(100%, 250px), 1fr))`, gap: '1.5rem' }}>
        {products.map(prod => (
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
            <div style={{ height: '200px', background: '#F8F9F3', display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden', cursor: 'pointer' }}>
              <img src={prod.image} alt={prod.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
            </div>
            <div style={{ padding: '1rem' }}>
              <h5 style={{ margin: '0 0 0.3rem 0', fontSize: '1rem', color: 'var(--text-main)', cursor: 'pointer' }}>{prod.name}</h5>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.3rem', marginBottom: '1rem' }}>
                <Star size={14} color="#FFC107" fill="#FFC107" />
                <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>{prod.rating} (120)</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                  <span style={{ fontWeight: 'bold', fontSize: '1.2rem', color: 'var(--primary)' }}>${prod.price.toFixed(2)}</span>
                  {prod.oldPrice && <span style={{ fontSize: '0.8rem', color: '#999', textDecoration: 'line-through', marginLeft: '0.5rem' }}>${prod.oldPrice}</span>}
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
              {[1,2,3,4,5].map(s => <Star key={s} size={14} color="#FFC107" fill="#FFC107" />)}
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

const SectionHeader = ({ title, subtitle, link, center, titleColor, buttonColor }) => (
  <div style={{ display: 'flex', justifyContent: center ? 'center' : 'space-between', alignItems: center ? 'center' : 'flex-end', marginBottom: '2rem', flexDirection: center ? 'column' : 'row', textAlign: center ? 'center' : 'left' }}>
    <div>
      <h2 style={{ margin: '0 0 0.3rem 0', fontSize: '2rem', color: titleColor || 'var(--primary)' }}>{title}</h2>
      <p style={{ margin: 0, color: 'var(--text-muted)' }}>{subtitle}</p>
    </div>
    {link && <a href="#" style={{ color: buttonColor || 'var(--primary)', fontWeight: 'bold', textDecoration: 'none', fontSize: '0.9rem' }}>{link}</a>}
  </div>
)

// --- COMPONENTE PRINCIPAL ---
export default function StorePreview({ isReadOnly = false }) {
  const navigate = useNavigate()
  const { storeId } = useParams()
  const globalState = useStore()
  
  const { publicStoreData, fetchPublicStoreData, clearPublicStoreData, activeSectionId, setActiveSectionId, cart, isCartOpen, toggleCart, clearCart, logout, addOrder, addToCart } = globalState

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
  const [selectedCategory, setSelectedCategory] = useState(null)

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

  const cartTotalQty = cart.reduce((acc, item) => acc + item.quantity, 0)
  const cartSubtotal = cart.reduce((acc, item) => acc + (item.price * item.quantity), 0)
  const cartTotal = cartSubtotal > 0 ? cartSubtotal + 5 : 0; // +5 envio

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
      
      {/* Store Header */}
      <div className="store-header" style={{ background: storeConfig.headerColor || 'white', display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid #eee', position: 'sticky', top: 0, zIndex: 100 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          {isReadOnly && (
            <button 
              onClick={() => navigate('/market')}
              style={{ background: '#F1F5F9', color: '#64748B', border: 'none', padding: '0.5rem', borderRadius: '50%', cursor: 'pointer', marginRight: '0.5rem' }}
              title="Volver al Marketplace"
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m15 18-6-6 6-6"/></svg>
            </button>
          )}
          {storeConfig.logoText?.startsWith('http') || storeConfig.logoText?.startsWith('data:image') ? (
            <img src={storeConfig.logoText} alt="Logo" style={{ height: '40px', objectFit: 'contain' }} />
          ) : (
            <span style={{ fontSize: '2.5rem', filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.1))' }}>{storeConfig.logoText}</span>
          )}
          <div>
            <h2 style={{ margin: 0, fontSize: '1.8rem', fontFamily: 'Fraunces, serif', fontWeight: '900', letterSpacing: '-0.5px', color: 'var(--primary)', dropShadow: '0 2px 2px rgba(0,0,0,0.05)' }}>{storeConfig.name}</h2>
            <div style={{ display: 'flex', gap: '1rem', fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: '0.2rem' }}>
              <span style={{display:'flex', alignItems:'center', gap:'0.2rem'}}><Star size={12} fill="#FFC107" color="#FFC107"/> 5.0 (Nuevas)</span>
              <span>📦 {products.length} productos</span>
              <span>👥 {storeConfig.followers || '0'} seguidores</span>
              <span>📍 {storeConfig.location || 'Online'}</span>
            </div>
          </div>
        </div>
        
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <button 
            onClick={toggleCart}
            style={{ background: storeConfig.buttonColor || storeConfig.primaryColor || 'var(--primary)', color: 'white', border: 'none', padding: '0.8rem 1.5rem', borderRadius: '30px', fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer', transition: 'transform 0.1s' }}
            onMouseDown={(e) => e.currentTarget.style.transform = 'scale(0.95)'}
            onMouseUp={(e) => e.currentTarget.style.transform = 'scale(1)'}
          >
            <ShoppingCart size={18} /> Ver Carrito {cartTotalQty > 0 ? `(${cartTotalQty}) - $${cartTotal.toFixed(2)}` : '(0)'}
          </button>
          
          <button 
            onClick={handleLogout}
            style={{ background: '#FEE2E2', color: '#DC2626', border: 'none', padding: '0.8rem', borderRadius: '50%', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
            title="Cerrar Sesión"
          >
            <LogOut size={18} />
          </button>
        </div>
      </div>

      <div className="store-section-padding" style={{ display: 'flex', flexDirection: 'column', gap: '3rem', paddingBottom: '6rem' }}>
        {layoutSections.map((section) => {
          const isActive = !isReadOnly && activeSectionId === section.id
          const config = section.config || {}

          return (
            <section 
              key={section.id} 
              className={isReadOnly ? '' : `section-hover ${isActive ? 'section-active' : ''}`}
              onClick={(e) => { 
                if(!isReadOnly) {
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
              {section.templateType === 'categories' && <CategoriesTemplate categories={categories} config={config} storeConfig={storeConfig} onCategoryClick={(cat) => setSelectedCategory(cat)} />}
              {section.templateType === 'products_grid' && <ProductsTemplate products={products.filter(p => p.tags.includes(section.tag || 'all'))} config={config} storeConfig={storeConfig} addToCart={addToCart} />}
              {section.templateType === 'promo' && <PromoTemplate config={config} storeConfig={storeConfig} />}
              {section.templateType === 'features' && <FeaturesTemplate features={features} config={config} storeConfig={storeConfig} />}
              {section.templateType === 'testimonials' && <TestimonialsTemplate testimonials={testimonials} config={config} storeConfig={storeConfig} />}
              
            </section>
          )
        })}
      </div>

      {/* Category Modal */}
      {selectedCategory && (
        <CategoryProductsModal 
          category={selectedCategory} 
          products={products.filter(p => p.categoryId === selectedCategory.id)} 
          onClose={() => setSelectedCategory(null)} 
        />
      )}

      {/* Cart & Checkout Overlays */}
      {isCartOpen && (
        <>
          <div onClick={toggleCart} style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', zIndex: 999 }} />
          <CartDrawer 
            onClose={toggleCart} 
            onCheckout={() => {
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
            addOrder({ total: cartTotal, items: [...cart], ...checkoutData });
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
