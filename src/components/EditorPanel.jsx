import React, { useState, useEffect } from 'react'
import { useStore } from '../store/useStore'
import { Trash2, GripVertical, Settings, Plus, X, PackageOpen, LayoutTemplate, Inbox, CheckCircle, Clock, ChevronLeft, ChevronRight, Search, Filter, Rocket, CreditCard, Save, Upload } from 'lucide-react'
import { DragDropContext, Droppable, Draggable } from '@hello-pangea/dnd'
import { NotificationBell } from './NotificationBell'
import { MapContainer, TileLayer, Marker, useMapEvents } from 'react-leaflet'
import L from 'leaflet'

const STORE_CATEGORY_SUBCATEGORIES = {
  'Ropa & Accesorios': [
    { id: 'camisetas', name: 'Camisetas & Tops', icon: '👕' },
    { id: 'pantalones', name: 'Pantalones & Jeans', icon: '👖' },
    { id: 'vestidos', name: 'Vestidos & Faldas', icon: '👗' },
    { id: 'chaquetas', name: 'Chaquetas & Abrigos', icon: '🧥' },
    { id: 'calzado', name: 'Calzado & Zapatos', icon: '👟' },
    { id: 'accesorios', name: 'Accesorios & Bolsos', icon: '👜' },
  ],
  'Frutas & Superfoods': [
    { id: 1, name: 'Frutas Tropicales', icon: '🥭' },
    { id: 2, name: 'Especias & Hierbas', icon: '🌿' },
    { id: 3, name: 'Bebidas Naturales', icon: '🥥' },
    { id: 4, name: 'Superfoods', icon: '✨' },
    { id: 5, name: 'Snacks Tostados', icon: '🥜' },
  ],
  'Comida Rápida': [
    { id: 'hamburguesas', name: 'Hamburguesas', icon: '🍔' },
    { id: 'pizzas', name: 'Pizzas', icon: '🍕' },
    { id: 'perros', name: 'Perros Calientes', icon: '🌭' },
    { id: 'bebidas', name: 'Bebidas & Refrescos', icon: '🥤' },
    { id: 'postres', name: 'Postres', icon: '🍰' },
  ],
  'Tecnología': [
    { id: 'celulares', name: 'Celulares & Smartphones', icon: '📱' },
    { id: 'laptops', name: 'Laptops & Computadoras', icon: '💻' },
    { id: 'audio', name: 'Audio & Audífonos', icon: '🎧' },
    { id: 'accesorios_tech', name: 'Cargadores & Cables', icon: '🔌' },
    { id: 'gadgets', name: 'Gadgets & Smartwatches', icon: '⌚' },
  ],
  'Mascotas': [
    { id: 'alimentos_pet', name: 'Alimentos & Croquetas', icon: '🥩' },
    { id: 'juguetes_pet', name: 'Juguetes & Accesorios', icon: '🎾' },
    { id: 'higiene_pet', name: 'Higiene & Cuidado', icon: '🧴' },
    { id: 'camas_pet', name: 'Camas & Transportines', icon: '🐕' },
  ],
  'Hogar & Jardín': [
    { id: 'decoracion', name: 'Decoración & Iluminación', icon: '💡' },
    { id: 'cocina', name: 'Cocina & Menaje', icon: '🍳' },
    { id: 'jardin', name: 'Plantas & Jardinería', icon: '🪴' },
    { id: 'muebles', name: 'Muebles & Organización', icon: '🪑' },
  ],
  'Salud & Belleza': [
    { id: 'skincare', name: 'Cuidado Facial & Skincare', icon: '✨' },
    { id: 'maquillaje', name: 'Maquillaje & Cosméticos', icon: '💄' },
    { id: 'capilar', name: 'Cuidado Capilar', icon: '💇' },
    { id: 'perfumes', name: 'Perfumes & Fragancias', icon: '🧴' },
  ],
  'General': [
    { id: 'destacados', name: 'Productos Destacados', icon: '⭐' },
    { id: 'ofertas', name: 'Ofertas & Promociones', icon: '🔥' },
    { id: 'nuevos', name: 'Novedades', icon: '✨' },
    { id: 'varios', name: 'Varios / General', icon: '📦' },
  ]
}

export default function EditorPanel() {
  const { 
    layoutSections, reorderSections, activeSectionId, setActiveSectionId, 
    updateSectionConfig, deleteSection, addSection,
    products, addNewProduct, deleteProduct,
    orders, updateOrderStatus,
    storeStatus, reportSubscriptionPayment,
    storeConfig, updateStoreConfig,
    hasUnsavedChanges, saveDesignToFirestore,
    categories
  } = useStore()
  
  const getAvailableCategories = () => {
    if (storeConfig?.categories && storeConfig.categories.length > 0) {
      return storeConfig.categories
    }
    const currentCategory = storeConfig?.category || 'Ropa & Accesorios'
    return STORE_CATEGORY_SUBCATEGORIES[currentCategory] || STORE_CATEGORY_SUBCATEGORIES['Ropa & Accesorios']
  }
  
  const [activeTab, setActiveTab] = useState('design') // 'design' | 'catalog' | 'orders'
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [isCollapsed, setIsCollapsed] = useState(false)
  
  // Inventory Modal states
  const [isInventoryModalOpen, setIsInventoryModalOpen] = useState(false)
  const [inventorySearch, setInventorySearch] = useState('')
  const [inventoryCategory, setInventoryCategory] = useState('all')

  // Activation states
  const [isActivationModalOpen, setIsActivationModalOpen] = useState(false)
  const [paymentRef, setPaymentRef] = useState('')
  const [paymentBank, setPaymentBank] = useState('')

  const [activeSubTab, setActiveSubTab] = useState('header')

  // Location Autocomplete states
  const [locationSuggestions, setLocationSuggestions] = useState([])
  const [showSuggestions, setShowSuggestions] = useState(false)
  const [showMapPicker, setShowMapPicker] = useState(false)
  const [mapPickerCoords, setMapPickerCoords] = useState([10.4806, -66.9036])

  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      if (storeConfig.location && showSuggestions) {
        fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(storeConfig.location)}`)
          .then(res => res.json())
          .then(data => {
            setLocationSuggestions(data)
          })
          .catch(err => console.error(err))
      }
    }, 500)
    return () => clearTimeout(delayDebounceFn)
  }, [storeConfig.location, showSuggestions])

  const handleSelectLocation = (loc) => {
    updateStoreConfig({ location: loc.display_name })
    setShowSuggestions(false)
  }

  const LocationMapEvents = () => {
    useMapEvents({
      click(e) {
        setMapPickerCoords([e.latlng.lat, e.latlng.lng])
      },
    })
    return null
  }

  const confirmMapSelection = async () => {
    try {
      const response = await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${mapPickerCoords[0]}&lon=${mapPickerCoords[1]}`)
      const data = await response.json()
      if (data && data.display_name) {
        updateStoreConfig({ location: data.display_name })
      }
    } catch (err) {
      console.error(err)
    }
    setShowMapPicker(false)
  }

  const detectCurrentLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(async (position) => {
        const { latitude, longitude } = position.coords;
        try {
          const response = await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}`);
          const data = await response.json();
          if (data && data.display_name) {
            updateStoreConfig({ location: data.display_name });
            setMapPickerCoords([latitude, longitude]);
          }
        } catch (err) {
          console.error(err);
        }
      }, (error) => {
        console.error("Geolocation error", error);
        let errorMsg = "No se pudo detectar tu ubicación. Revisa los permisos de tu navegador.";
        if (error.code === 1) errorMsg = "Permiso denegado. Haz clic en el icono del candado en la barra de direcciones de tu navegador y permite el acceso a la ubicación.";
        if (error.code === 2) errorMsg = "Ubicación no disponible. Tu dispositivo no pudo determinar tu ubicación (el GPS o los servicios de ubicación de tu sistema operativo pueden estar apagados).";
        if (error.code === 3) errorMsg = "Tiempo de espera agotado al intentar obtener la ubicación.";
        alert(errorMsg);
      }, { enableHighAccuracy: true, timeout: 15000, maximumAge: 10000 });
    } else {
      alert("Tu navegador no soporta la geolocalización.");
    }
  };

  // Product form state
  const [newProdName, setNewProdName] = useState('')
  const [newProdPrice, setNewProdPrice] = useState('')
  const [newProdImage, setNewProdImage] = useState('')
  const [newProdBadge, setNewProdBadge] = useState('Nuevo')
  const [newProdCategory, setNewProdCategory] = useState(1)
  const [isFeatured, setIsFeatured] = useState(false)
  const [isBestseller, setIsBestseller] = useState(false)
  const [newProdDesc, setNewProdDesc] = useState('')
  const [newProdGallery, setNewProdGallery] = useState([])

  const activeSection = layoutSections.find(s => s.id === activeSectionId)

  const handleImageUpload = (e, callback) => {
    const file = e.target.files[0];
    if (file) compressImage(file, callback);
  }

  const compressImage = (file, callback, maxSize = 600) => {
    const reader = new FileReader();
    reader.onloadend = () => {
      const img = new Image();
      img.src = reader.result;
      img.onload = () => {
        const canvas = document.createElement('canvas');
        let width = img.width;
        let height = img.height;
        if (width > height) {
          if (width > maxSize) {
            height *= maxSize / width;
            width = maxSize;
          }
        } else {
          if (height > maxSize) {
            width *= maxSize / height;
            height = maxSize;
          }
        }
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        ctx.drawImage(img, 0, 0, width, height);
        callback(canvas.toDataURL('image/jpeg', 0.8));
      };
    };
    reader.readAsDataURL(file);
  }

  const handleGalleryUpload = (e) => {
    const files = Array.from(e.target.files);
    files.forEach(file => {
      compressImage(file, (dataUrl) => {
        setNewProdGallery(prev => [...prev, dataUrl]);
      });
    });
  }

  const onDragEnd = (result) => {
    if (!result.destination) return;
    reorderSections(result.source.index, result.destination.index)
  }

  const handleAddSection = (type) => {
    addSection(type);
    setIsModalOpen(false);
  }

  const handleUpdateSectionTag = (id, newTag) => {
    // Para actualizar el tag a nivel de sección, no dentro de config
    useStore.setState(state => ({
      layoutSections: state.layoutSections.map(s => s.id === id ? { ...s, tag: newTag } : s)
    }))
  }

  const handleAddProduct = (e) => {
    e.preventDefault()
    if (!newProdName || !newProdPrice) return
    
    let tags = ['all']
    if (isFeatured) tags.push('featured')
    if (isBestseller) tags.push('bestseller')
    
    // Si hay galería pero no imagen principal, usamos la primera de la galería
    const mainImage = newProdImage || (newProdGallery.length > 0 ? newProdGallery[0] : 'https://images.unsplash.com/photo-1550258987-190a2d41a8ba?q=80&w=500')

    addNewProduct({ 
      name: newProdName, 
      price: parseFloat(newProdPrice), 
      image: mainImage,
      gallery: newProdGallery,
      description: newProdDesc,
      tags: tags,
      rating: 5.0,
      badge: newProdBadge,
      categoryId: newProdCategory
    })
    setNewProdName('')
    setNewProdPrice('')
    setNewProdImage('')
    setNewProdDesc('')
    setNewProdGallery([])
    setIsFeatured(false)
    setIsBestseller(false)
  }

  const getIcon = (type) => {
    switch(type) {
      case 'hero': return <span style={{fontSize: '1.2rem'}}>🌅</span>
      case 'categories': return <span style={{fontSize: '1.2rem'}}>🗂️</span>
      case 'products_grid': return <span style={{fontSize: '1.2rem'}}>🛍️</span>
      case 'promo': return <span style={{fontSize: '1.2rem'}}>🎯</span>
      case 'features': return <span style={{fontSize: '1.2rem'}}>⭐</span>
      case 'testimonials': return <span style={{fontSize: '1.2rem'}}>💬</span>
      default: return <span style={{fontSize: '1.2rem'}}>📦</span>
    }
  }

  const templateOptions = [
    { id: 'hero', title: 'Banner Principal', desc: 'Imagen grande con CTA', icon: '🌅' },
    { id: 'categories', title: 'Categorías', desc: 'Grid de categorías', icon: '🗂️' },
    { id: 'products_grid', title: 'Productos', desc: 'Grilla de productos', icon: '🛍️' },
    { id: 'promo', title: 'Promo Banner', desc: 'Banner de oferta', icon: '🎯' },
    { id: 'features', title: 'Beneficios', desc: 'Ventajas de la tienda', icon: '⭐' },
    { id: 'testimonials', title: 'Testimonios', desc: 'Reseñas de clientes', icon: '💬' }
  ]

  return (
    <>
      <div className={`design-panel ${isCollapsed ? 'collapsed' : ''}`}>
        
        {/* Banner de Activación */}
        {storeStatus === 'pending_activation' && (
          <div style={{ background: 'linear-gradient(90deg, #F97316 0%, #FFC107 100%)', color: 'white', padding: '1rem', textAlign: 'center', position: 'relative' }}>
            <p style={{ margin: '0 0 0.5rem 0', fontWeight: 'bold', fontSize: '0.9rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem' }}>
              <Rocket size={18} /> Tu tienda no es visible al público
            </p>
            <button 
              onClick={() => setIsActivationModalOpen(true)}
              style={{ background: 'white', color: '#F97316', border: 'none', padding: '0.5rem 1rem', borderRadius: '20px', fontWeight: '900', fontSize: '0.85rem', cursor: 'pointer', boxShadow: '0 4px 6px rgba(0,0,0,0.1)' }}
            >
              Activar mi Tienda
            </button>
          </div>
        )}

        {storeStatus === 'validation_pending' && (
          <div style={{ background: '#E0F2FE', color: '#0369A1', padding: '1rem', textAlign: 'center', borderBottom: '1px solid #BAE6FD' }}>
            <p style={{ margin: '0', fontWeight: 'bold', fontSize: '0.9rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem' }}>
              <Clock size={18} /> Validando tu pago... pronto estarás online.
            </p>
          </div>
        )}

        {/* Navigation Tabs */}
        <div style={{ display: 'flex', alignItems: 'center', borderBottom: '1px solid var(--border-color)', background: '#F8FAFC', paddingRight: '0.8rem' }}>
          <button 
            onClick={() => setActiveTab('design')} 
            style={{ flex: 1, padding: '1rem', border: 'none', background: activeTab === 'design' ? 'white' : 'transparent', fontWeight: 'bold', color: activeTab === 'design' ? 'var(--primary)' : 'var(--text-muted)', borderBottom: activeTab === 'design' ? '2px solid var(--primary)' : '2px solid transparent', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem' }}
          >
            <LayoutTemplate size={18} /> Diseño
          </button>
          <button 
            onClick={() => setActiveTab('catalog')} 
            style={{ flex: 1, padding: '1rem', border: 'none', background: activeTab === 'catalog' ? 'white' : 'transparent', fontWeight: 'bold', color: activeTab === 'catalog' ? 'var(--primary)' : 'var(--text-muted)', borderBottom: activeTab === 'catalog' ? '2px solid var(--primary)' : '2px solid transparent', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem' }}
          >
            <PackageOpen size={18} /> Catálogo
          </button>
          <button 
            onClick={() => setActiveTab('orders')} 
            style={{ flex: 1, padding: '1rem', border: 'none', background: activeTab === 'orders' ? 'white' : 'transparent', fontWeight: 'bold', color: activeTab === 'orders' ? 'var(--primary)' : 'var(--text-muted)', borderBottom: activeTab === 'orders' ? '2px solid var(--primary)' : '2px solid transparent', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem' }}
          >
            <Inbox size={18} /> Órdenes
          </button>
          <NotificationBell />
        </div>

        {/* --- PESTAÑA DE DISEÑO (Visual Builder) --- */}
        {activeTab === 'design' && (
          <div style={{ flex: 1, overflowY: 'auto', padding: '1.5rem', display: 'flex', flexDirection: 'column' }}>
            
            {hasUnsavedChanges && (
              <div style={{ background: '#FFFBEB', padding: '1rem', borderRadius: '12px', marginBottom: '1.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', border: '1px solid #FDE68A', boxShadow: '0 4px 6px -1px rgba(251, 191, 36, 0.2)' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <div style={{ width: '8px', height: '8px', background: '#F59E0B', borderRadius: '50%', animation: 'pulse 2s infinite' }} />
                  <span style={{ fontSize: '0.85rem', color: '#92400E', fontWeight: 'bold' }}>Tienes cambios sin guardar.</span>
                </div>
                <button 
                  onClick={saveDesignToFirestore}
                  style={{ 
                    background: 'linear-gradient(135deg, #10B981 0%, #059669 100%)', 
                    color: 'white', border: 'none', padding: '0.6rem 1.2rem', borderRadius: '50px', 
                    fontWeight: 'bold', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.4rem',
                    boxShadow: '0 4px 10px rgba(16, 185, 129, 0.3)', transition: 'transform 0.2s',
                  }}
                  onMouseOver={(e) => e.currentTarget.style.transform = 'translateY(-2px)'}
                  onMouseOut={(e) => e.currentTarget.style.transform = 'translateY(0)'}
                  onMouseDown={(e) => e.currentTarget.style.transform = 'scale(0.95)'}
                  onMouseUp={(e) => e.currentTarget.style.transform = 'translateY(-2px)'}
                >
                  <Save size={16} /> Guardar Cambios
                </button>
              </div>
            )}

            <div style={{ background: '#F8FAFC', padding: '1.5rem', borderRadius: '12px', marginBottom: '2rem' }}>
              <div style={{ fontSize: '0.8rem', fontWeight: 'bold', color: 'var(--primary)', marginBottom: '1rem', letterSpacing: '1px' }}>
                CONFIGURACIÓN GLOBAL
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                <div>
                  <label style={labelStyle}>Nombre de la Tienda</label>
                  <input type="text" value={storeConfig.name} onChange={(e) => updateStoreConfig({ name: e.target.value })} style={inputStyle} placeholder="Ej. Mi Super Tienda" />
                </div>
                <div className="form-row-responsive">
                  <div style={{ flex: 1 }}>
                    <label style={labelStyle}>Logo (URL, Emoji o Archivo)</label>
                    <div style={{ display: 'flex', gap: '0.5rem' }}>
                      <input type="text" value={storeConfig.logoText} onChange={(e) => updateStoreConfig({ logoText: e.target.value })} style={{...inputStyle, flex: 1}} placeholder="URL, Base64 o Emoji" />
                      <label style={{ background: '#E2E8E0', padding: '0.8rem', borderRadius: '8px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <Upload size={16} />
                        <input type="file" accept="image/*" style={{ display: 'none' }} onChange={(e) => handleImageUpload(e, (base64) => updateStoreConfig({ logoText: base64 }))} />
                      </label>
                    </div>
                  </div>
                  <div style={{ flex: 1 }}>
                    <label style={labelStyle}>Portada de la Tarjeta (URL o Archivo)</label>
                    <div style={{ display: 'flex', gap: '0.5rem' }}>
                      <input type="text" value={storeConfig.coverUrl || ''} onChange={(e) => updateStoreConfig({ coverUrl: e.target.value })} style={{...inputStyle, flex: 1}} placeholder="URL o subir portada" />
                      <label style={{ background: '#E2E8E0', padding: '0.8rem', borderRadius: '8px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <Upload size={16} />
                        <input type="file" accept="image/*" style={{ display: 'none' }} onChange={(e) => handleImageUpload(e, (base64) => updateStoreConfig({ coverUrl: base64 }))} />
                      </label>
                    </div>
                  </div>
                </div>
                <div className="form-row-responsive">
                  <div style={{ flex: 1 }}>
                    <label style={labelStyle}>Color Primario</label>
                    <input type="color" value={storeConfig.primaryColor} onChange={(e) => updateStoreConfig({ primaryColor: e.target.value })} style={{ width: '100%', height: '40px', border: 'none', borderRadius: '8px', cursor: 'pointer' }} />
                  </div>
                </div>
                <div className="form-row-responsive">
                  <div style={{ flex: 1, position: 'relative' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <label style={labelStyle}>Ubicación (con autocompletado)</label>
                      <div style={{ display: 'flex', gap: '0.5rem' }}>
                        <button onClick={detectCurrentLocation} style={{ background: 'none', border: 'none', color: 'var(--primary)', cursor: 'pointer', fontSize: '0.8rem', fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: '0.2rem' }}>
                          🎯 Mi ubicación
                        </button>
                        <button onClick={() => setShowMapPicker(true)} style={{ background: 'none', border: 'none', color: 'var(--primary)', cursor: 'pointer', fontSize: '0.8rem', fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: '0.2rem' }}>
                          📍 Seleccionar en mapa
                        </button>
                      </div>
                    </div>
                    <input 
                      type="text" 
                      value={storeConfig.location || ''} 
                      onChange={(e) => {
                        updateStoreConfig({ location: e.target.value })
                        setShowSuggestions(true)
                      }} 
                      style={inputStyle} 
                      placeholder="Ej. Caracas" 
                      onBlur={() => setTimeout(() => setShowSuggestions(false), 200)}
                    />
                    {showSuggestions && locationSuggestions.length > 0 && (
                      <div style={{
                        position: 'absolute', top: '100%', left: 0, right: 0, 
                        background: 'white', border: '1px solid #E2E8F0', borderRadius: '8px', 
                        boxShadow: '0 4px 6px -1px rgba(0,0,0,0.1)', zIndex: 50, maxHeight: '200px', overflowY: 'auto', marginTop: '4px'
                      }}>
                        {locationSuggestions.map((loc, idx) => (
                          <div 
                            key={idx} 
                            onClick={() => handleSelectLocation(loc)}
                            style={{ padding: '0.8rem 1rem', cursor: 'pointer', borderBottom: '1px solid #F1F5F9', fontSize: '0.9rem', color: '#0F172A' }}
                            onMouseOver={e => e.currentTarget.style.background = '#F8FAFC'}
                            onMouseOut={e => e.currentTarget.style.background = 'white'}
                          >
                            📍 {loc.display_name}
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                  <div style={{ flex: 1 }}>
                    <label style={labelStyle}>Categoría Principal</label>
                    <select value={storeConfig.category || ''} onChange={(e) => updateStoreConfig({ category: e.target.value })} style={inputStyle}>
                      <option value="">Selecciona una categoría...</option>
                      <option value="Frutas & Superfoods">Frutas & Superfoods</option>
                      <option value="Ropa & Accesorios">Ropa & Accesorios</option>
                      <option value="Comida Rápida">Comida Rápida</option>
                      <option value="Tecnología">Tecnología</option>
                      <option value="Mascotas">Mascotas</option>
                      <option value="Hogar & Jardín">Hogar & Jardín</option>
                      <option value="Salud & Belleza">Salud & Belleza</option>
                      <option value="Servicios">Servicios</option>
                      <option value="General">General / Otros</option>
                    </select>
                  </div>
                  <div style={{ flex: 1 }}>
                    <label style={labelStyle}>Seguidores (Visual)</label>
                    <input type="text" value={storeConfig.followers || ''} onChange={(e) => updateStoreConfig({ followers: e.target.value })} style={inputStyle} placeholder="Ej. 1.5K" />
                  </div>
                </div>
                <div className="form-row-responsive">
                  <div style={{ flex: 1 }}>
                    <label style={labelStyle}>Color Header</label>
                    <input type="color" value={storeConfig.headerColor || '#ffffff'} onChange={(e) => updateStoreConfig({ headerColor: e.target.value })} style={{ width: '100%', height: '40px', border: 'none', borderRadius: '8px', cursor: 'pointer' }} />
                  </div>
                  <div style={{ flex: 1 }}>
                    <label style={labelStyle}>Color Títulos</label>
                    <input type="color" value={storeConfig.titleColor || '#0f172a'} onChange={(e) => updateStoreConfig({ titleColor: e.target.value })} style={{ width: '100%', height: '40px', border: 'none', borderRadius: '8px', cursor: 'pointer' }} />
                  </div>
                  <div style={{ flex: 1 }}>
                    <label style={labelStyle}>Color Botones</label>
                    <input type="color" value={storeConfig.buttonColor || storeConfig.primaryColor || '#11683e'} onChange={(e) => updateStoreConfig({ buttonColor: e.target.value })} style={{ width: '100%', height: '40px', border: 'none', borderRadius: '8px', cursor: 'pointer' }} />
                  </div>
                </div>
              </div>
            </div>

            <div style={{ fontSize: '0.8rem', fontWeight: 'bold', color: 'var(--text-muted)', marginBottom: '1rem', letterSpacing: '1px' }}>
              SECCIONES
            </div>

            <DragDropContext onDragEnd={onDragEnd}>
              <Droppable droppableId="sections-list">
                {(provided) => (
                  <div {...provided.droppableProps} ref={provided.innerRef} style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                    {layoutSections.map((section, index) => {
                      const isActive = activeSectionId === section.id;
                      return (
                        <Draggable key={section.id} draggableId={section.id} index={index}>
                          {(provided, snapshot) => (
                            <div
                              ref={provided.innerRef} {...provided.draggableProps}
                              onClick={() => setActiveSectionId(section.id)}
                              style={{
                                display: 'flex', alignItems: 'center', gap: '1rem',
                                padding: '0.75rem 1rem', borderRadius: '8px', 
                                background: isActive || snapshot.isDragging ? '#F4FBF7' : 'white',
                                border: isActive ? '1px solid var(--primary)' : '1px solid #E2E8E0',
                                cursor: 'pointer', transition: 'all 0.2s',
                                boxShadow: snapshot.isDragging ? '0 5px 15px rgba(0,0,0,0.1)' : 'none',
                                ...provided.draggableProps.style
                              }}
                            >
                              <div {...provided.dragHandleProps} style={{ cursor: 'grab', color: '#CBD5E1', display: 'flex', flexDirection: 'column', gap: '2px' }}>
                                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round"><path d="M18 15l-6-6-6 6"/></svg>
                                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round"><path d="M6 9l6 6 6-6"/></svg>
                              </div>
                              
                              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', flex: 1 }}>
                                {getIcon(section.templateType)}
                                <span style={{ fontWeight: '600', color: 'var(--text-main)', fontSize: '0.9rem' }}>{section.title}</span>
                              </div>

                              <button 
                                onClick={(e) => { e.stopPropagation(); deleteSection(section.id); }} 
                                style={{ background: 'none', border: 'none', color: '#94A3B8', cursor: 'pointer', opacity: isActive ? 1 : 0.5 }}
                              >
                                <Trash2 size={16} />
                              </button>
                            </div>
                          )}
                        </Draggable>
                      )
                    })}
                    {provided.placeholder}
                  </div>
                )}
              </Droppable>
            </DragDropContext>

            <button 
              onClick={() => setIsModalOpen(true)}
              style={{
                width: '100%', marginTop: '1.5rem', padding: '0.75rem', borderRadius: '20px',
                border: '2px dashed #A7F3D0', color: 'var(--primary)', background: '#ECFDF5',
                fontWeight: 'bold', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem',
                cursor: 'pointer', transition: 'all 0.2s'
              }}
            >
              <Plus size={18} /> Agregar Sección
            </button>

            <hr style={{ border: 'none', borderTop: '1px solid #E2E8E0', margin: '2rem 0' }} />

            {/* Configuraciones Contextuales de la Sección Activa */}
            {activeSection && (
              <div style={{ animation: 'fadeIn 0.2s ease', background: '#F8FAFC', padding: '1.5rem', borderRadius: '12px' }}>
                <div style={{ fontSize: '0.8rem', fontWeight: 'bold', color: 'var(--primary)', marginBottom: '1.5rem', letterSpacing: '1px' }}>
                  EDITAR CONTENIDO
                </div>
                
                {/* Selector de filtro de productos SI es de tipo products_grid */}
                {activeSection.templateType === 'products_grid' && (
                  <div style={{ marginBottom: '1.5rem' }}>
                    <label style={labelStyle}>Mostrar Productos</label>
                    <select 
                      value={activeSection.tag || 'all'} 
                      onChange={(e) => handleUpdateSectionTag(activeSection.id, e.target.value)}
                      style={inputStyle}
                    >
                      <option value="all">Catálogo Completo</option>
                      <option value="featured">Solo Destacados</option>
                      <option value="bestseller">Solo Más Vendidos</option>
                    </select>
                  </div>
                )}

                {/* Selector de columnas */}
                {['categories', 'products_grid', 'features', 'testimonials'].includes(activeSection.templateType) && (
                  <div style={{ marginBottom: '1.5rem' }}>
                    <label style={{ fontSize: '0.8rem', fontWeight: 'bold', color: '#64748b', display: 'block', marginBottom: '0.5rem' }}>Columnas</label>
                    <div style={{ display: 'flex', gap: '0.5rem', justifyContent: 'center' }}>
                      {[2, 3, 4].map(num => (
                        <button 
                          key={num}
                          className={`pill-btn ${activeSection.config.columns === num ? 'active' : ''}`}
                          onClick={() => updateSectionConfig(activeSection.id, 'columns', num)}
                          style={{ flex: 1, padding: '0.4rem' }}
                        >
                          {num} col
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {/* Campos comunes: Título y Subtítulo */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                  
                  {activeSection.config.title !== undefined && (
                    <div>
                      <label style={{ fontSize: '0.8rem', fontWeight: 'bold', color: '#64748b' }}>Título</label>
                      <input type="text" value={activeSection.config.title} onChange={(e) => updateSectionConfig(activeSection.id, 'title', e.target.value)} style={inputStyle} />
                    </div>
                  )}

                  {activeSection.config.subtitle !== undefined && (
                    <div>
                      <label style={{ fontSize: '0.8rem', fontWeight: 'bold', color: '#64748b' }}>Subtítulo</label>
                      <textarea value={activeSection.config.subtitle} onChange={(e) => updateSectionConfig(activeSection.id, 'subtitle', e.target.value)} style={{...inputStyle, resize: 'vertical', minHeight: '60px'}} />
                    </div>
                  )}

                  {activeSection.config.sectionTitle !== undefined && (
                    <div>
                      <label style={{ fontSize: '0.8rem', fontWeight: 'bold', color: '#64748b' }}>Título de Sección</label>
                      <input type="text" value={activeSection.config.sectionTitle} onChange={(e) => updateSectionConfig(activeSection.id, 'sectionTitle', e.target.value)} style={inputStyle} />
                    </div>
                  )}

                  {activeSection.config.sectionSubtitle !== undefined && (
                    <div>
                      <label style={{ fontSize: '0.8rem', fontWeight: 'bold', color: '#64748b' }}>Subtítulo de Sección</label>
                      <input type="text" value={activeSection.config.sectionSubtitle} onChange={(e) => updateSectionConfig(activeSection.id, 'sectionSubtitle', e.target.value)} style={inputStyle} />
                    </div>
                  )}

                  {/* Campos específicos por plantilla */}
                  {activeSection.templateType === 'hero' && (
                    <>
                      <div>
                        <label style={{ fontSize: '0.8rem', fontWeight: 'bold', color: '#64748b' }}>Texto del Botón</label>
                        <input type="text" value={activeSection.config.buttonText} onChange={(e) => updateSectionConfig(activeSection.id, 'buttonText', e.target.value)} style={inputStyle} />
                      </div>
                      <div>
                        <label style={{ fontSize: '0.8rem', fontWeight: 'bold', color: '#64748b' }}>Imagen de Fondo (URL o Subir Archivo)</label>
                        <div style={{ display: 'flex', gap: '0.5rem' }}>
                          <input type="text" value={activeSection.config.bgImage || ''} onChange={(e) => updateSectionConfig(activeSection.id, 'bgImage', e.target.value)} style={{...inputStyle, flex: 1}} placeholder="URL o subir imagen de fondo" />
                          <label style={{ background: '#E2E8E0', padding: '0.8rem', borderRadius: '8px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', marginTop: '0.2rem' }}>
                            <Upload size={16} />
                            <input type="file" accept="image/*" style={{ display: 'none' }} onChange={(e) => handleImageUpload(e, (base64) => updateSectionConfig(activeSection.id, 'bgImage', base64))} />
                          </label>
                        </div>
                      </div>
                      <div>
                        <label style={{ fontSize: '0.8rem', fontWeight: 'bold', color: '#64748b' }}>Color de Degradado / Superposición</label>
                        <input 
                          type="color" 
                          value={activeSection.config.overlayColor || storeConfig.primaryColor || '#11683E'} 
                          onChange={(e) => updateSectionConfig(activeSection.id, 'overlayColor', e.target.value)} 
                          style={{ width: '100%', height: '40px', border: 'none', borderRadius: '8px', cursor: 'pointer' }} 
                        />
                      </div>
                    </>
                  )}

                  {activeSection.templateType === 'promo' && (
                    <div>
                      <label style={{ fontSize: '0.8rem', fontWeight: 'bold', color: '#64748b' }}>Código de Descuento</label>
                      <input type="text" value={activeSection.config.code} onChange={(e) => updateSectionConfig(activeSection.id, 'code', e.target.value)} style={inputStyle} />
                    </div>
                  )}

                </div>
              </div>
            )}
          </div>
        )}

        {/* --- PESTAÑA DE CATÁLOGO (Agregar Productos) --- */}
        {activeTab === 'catalog' && (
          <div style={{ flex: 1, overflowY: 'auto', padding: '1.5rem' }}>
            <h3 style={{ color: 'var(--primary)', marginBottom: '1.5rem' }}>Gestión de Productos</h3>
            
            <div style={{ background: '#F8FAFC', padding: '1.5rem', borderRadius: '12px', marginBottom: '2rem' }}>
              <h4 style={{ margin: '0 0 1rem 0', color: 'var(--text-main)', fontSize: '1rem' }}>+ Agregar Nuevo Producto</h4>
              <form onSubmit={handleAddProduct} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                <div className="form-row-responsive">
                  <div style={{ flex: 1 }}>
                    <label style={labelStyle}>Nombre del Producto</label>
                    <input type="text" value={newProdName} onChange={e => setNewProdName(e.target.value)} style={inputStyle} required />
                  </div>
                  <div style={{ flex: 1 }}>
                    <label style={labelStyle}>Precio ($)</label>
                    <input type="number" step="0.01" value={newProdPrice} onChange={e => setNewProdPrice(e.target.value)} style={inputStyle} required />
                  </div>
                </div>
                <div className="form-row-responsive">
                  <div style={{ flex: 1 }}>
                    <label style={labelStyle}>Categoría</label>
                    <select value={newProdCategory} onChange={e => setNewProdCategory(e.target.value)} style={inputStyle}>
                      {getAvailableCategories().map(cat => (
                        <option key={cat.id} value={cat.id}>{cat.icon} {cat.name}</option>
                      ))}
                    </select>
                  </div>
                  <div style={{ flex: 1 }}>
                    <label style={labelStyle}>Etiqueta (Badge)</label>
                    <input type="text" value={newProdBadge} onChange={e => setNewProdBadge(e.target.value)} style={inputStyle} placeholder="Ej. Oferta, Nuevo" />
                  </div>
                </div>
                <div>
                  <label style={labelStyle}>Descripción Detallada</label>
                  <textarea value={newProdDesc} onChange={e => setNewProdDesc(e.target.value)} style={{...inputStyle, resize: 'vertical', minHeight: '60px'}} placeholder="Describe tu producto..." />
                </div>
                <div>
                  <label style={labelStyle}>Galería de Imágenes</label>
                  <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                    <label style={{ background: '#E2E8E0', padding: '1rem', borderRadius: '8px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', minWidth: '100px', height: '100px', border: '2px dashed #94A3B8' }}>
                      <div style={{ textAlign: 'center' }}>
                        <Upload size={20} style={{ margin: '0 auto 0.5rem auto' }} />
                        <span style={{ fontSize: '0.75rem', display: 'block' }}>Subir Fotos</span>
                      </div>
                      <input type="file" accept="image/*" multiple style={{ display: 'none' }} onChange={handleGalleryUpload} />
                    </label>
                    {newProdGallery.map((img, idx) => (
                      <div key={idx} style={{ position: 'relative', width: '100px', height: '100px' }}>
                        <img src={img} alt={`Preview ${idx}`} style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: '8px' }} />
                        <button type="button" onClick={() => setNewProdGallery(prev => prev.filter((_, i) => i !== idx))} style={{ position: 'absolute', top: '-5px', right: '-5px', background: '#EF4444', color: 'white', border: 'none', borderRadius: '50%', width: '20px', height: '20px', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', fontSize: '10px' }}>✕</button>
                      </div>
                    ))}
                  </div>
                </div>
                <div style={{ display: 'flex', gap: '1.5rem', marginTop: '0.5rem' }}>
                  <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.85rem', cursor: 'pointer' }}>
                    <input type="checkbox" checked={isFeatured} onChange={e => setIsFeatured(e.target.checked)} />
                    ⭐ Destacado
                  </label>
                  <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.85rem', cursor: 'pointer' }}>
                    <input type="checkbox" checked={isBestseller} onChange={e => setIsBestseller(e.target.checked)} />
                    🔥 Más Vendido
                  </label>
                </div>
                <button type="submit" style={{
                  background: 'var(--primary)', color: 'white', border: 'none', padding: '0.75rem', borderRadius: '8px',
                  fontWeight: 'bold', cursor: 'pointer', marginTop: '0.5rem'
                }}>
                  Guardar Producto
                </button>
              </form>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem' }}>
              <h4 style={{ margin: 0, color: 'var(--text-main)', fontSize: '1rem' }}>Inventario ({products.length})</h4>
              <button onClick={() => setIsInventoryModalOpen(true)} style={{ background: '#E3F2FD', color: '#0288D1', border: 'none', padding: '0.4rem 0.8rem', borderRadius: '6px', fontSize: '0.8rem', fontWeight: 'bold', cursor: 'pointer' }}>
                Ver Todo
              </button>
            </div>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              {products.slice(0, 3).map(p => (
                <div key={p.id} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', background: 'white', border: '1px solid #E2E8E0', padding: '0.75rem', borderRadius: '8px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                    <img src={p.image} alt={p.name} style={{ width: '40px', height: '40px', objectFit: 'cover', borderRadius: '4px' }} />
                    <div>
                      <p style={{ margin: 0, fontWeight: 'bold', fontSize: '0.9rem', color: 'var(--text-main)' }}>{p.name}</p>
                      <div style={{ display: 'flex', gap: '0.5rem', marginTop: '0.2rem', alignItems: 'center' }}>
                        <span style={{ color: 'var(--primary)', fontSize: '0.8rem', fontWeight: 'bold' }}>${p.price.toFixed(2)}</span>
                        <span style={{ color: 'var(--text-muted)', fontSize: '0.75rem' }}>({(p.price * useStore.getState().bcvRate).toFixed(2)} Bs)</span>
                      </div>
                      {p.gallery && p.gallery.length > 0 && (
                        <span style={{ fontSize: '0.7rem', color: '#64748b', display: 'inline-block', marginTop: '0.2rem', background: '#f1f5f9', padding: '0.1rem 0.4rem', borderRadius: '4px' }}>
                          📸 {p.gallery.length} foto(s)
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              ))}
              {products.length > 3 && (
                <p style={{ textAlign: 'center', fontSize: '0.85rem', color: 'var(--text-muted)', margin: '0.5rem 0' }}>+ {products.length - 3} productos más</p>
              )}
            </div>
          </div>
        )}

        {/* --- PESTAÑA DE ÓRDENES --- */}
        {activeTab === 'orders' && (
          <div style={{ flex: 1, overflowY: 'auto', padding: '1.5rem', display: 'flex', flexDirection: 'column' }}>
            <h3 style={{ margin: '0 0 1.5rem 0', color: 'var(--text-main)', fontSize: '1.2rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Inbox size={20} /> Órdenes Recibidas ({orders.length})
            </h3>
            
            {orders.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '3rem 1rem', color: 'var(--text-muted)' }}>
                <PackageOpen size={48} style={{ opacity: 0.3, marginBottom: '1rem' }} />
                <p>Aún no tienes órdenes nuevas.</p>
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                {orders.map(order => (
                  <div key={order.id} style={{ background: 'white', borderRadius: '12px', padding: '1.5rem', border: '1px solid #E2E8E0', boxShadow: '0 2px 4px rgba(0,0,0,0.02)' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem', borderBottom: '1px solid #F1F5F9', paddingBottom: '0.75rem' }}>
                      <span style={{ fontWeight: 'bold', fontSize: '1.1rem', color: 'var(--primary)' }}>{order.id}</span>
                      <span style={{ 
                        background: order.status === 'Aprobado' ? '#D1FAE5' : '#FEF3C7', 
                        color: order.status === 'Aprobado' ? '#065F46' : '#92400E', 
                        padding: '0.3rem 0.8rem', borderRadius: '20px', fontSize: '0.8rem', fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: '0.3rem' 
                      }}>
                        {order.status === 'Aprobado' ? <CheckCircle size={14} /> : <Clock size={14} />} {order.status}
                      </span>
                    </div>
                    
                    <div style={{ fontSize: '0.9rem', color: 'var(--text-main)', marginBottom: '1rem' }}>
                      <p style={{ margin: '0 0 0.3rem 0' }}><strong>Fecha:</strong> {new Date(order.date).toLocaleString()}</p>
                      
                      {order.customer && (
                        <div style={{ background: '#F0FDF4', padding: '0.8rem', borderRadius: '8px', marginTop: '0.8rem', border: '1px solid #BBF7D0' }}>
                          <p style={{ margin: '0 0 0.3rem 0', fontWeight: 'bold', color: '#166534' }}>Datos del Cliente:</p>
                          <p style={{ margin: '0 0 0.2rem 0', color: '#166534' }}><strong>Nombre:</strong> {order.customer.name}</p>
                          <p style={{ margin: '0 0 0.2rem 0', color: '#166534' }}><strong>Teléfono:</strong> {order.customer.phone}</p>
                          <p style={{ margin: '0', color: '#166534' }}><strong>Dirección:</strong> {order.customer.address}</p>
                        </div>
                      )}

                      <div style={{ background: '#F8FAFC', borderRadius: '8px', padding: '1rem', marginTop: '1rem', border: '1px solid #E2E8E0' }}>
                        <h4 style={{ margin: '0 0 0.8rem 0', fontSize: '0.95rem' }}>Productos ({order.items?.length || 0})</h4>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.8rem' }}>
                          {order.items?.map((item, idx) => (
                            <div key={idx} style={{ display: 'flex', gap: '0.8rem', alignItems: 'center' }}>
                              <img src={item.image} alt={item.name} style={{ width: '40px', height: '40px', objectFit: 'cover', borderRadius: '6px', background: 'white', border: '1px solid #eee' }} />
                              <div style={{ flex: 1 }}>
                                <p style={{ margin: 0, fontWeight: 'bold', fontSize: '0.85rem' }}>{item.name}</p>
                                <p style={{ margin: 0, color: 'var(--text-muted)', fontSize: '0.8rem' }}>{item.quantity} x ${item.price.toFixed(2)}</p>
                              </div>
                              <span style={{ fontWeight: 'bold', color: 'var(--primary)', fontSize: '0.9rem' }}>${(item.quantity * item.price).toFixed(2)}</span>
                            </div>
                          ))}
                        </div>
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '1rem', paddingTop: '0.8rem', borderTop: '1px dashed #CBD5E1', fontWeight: 'bold', fontSize: '1rem' }}>
                          <span>Total Pagado:</span>
                          <span style={{ color: 'var(--primary)' }}>${order.total.toFixed(2)}</span>
                        </div>
                      </div>

                      {order.pagoMovil && (
                        <div style={{ background: '#FFF7ED', padding: '0.8rem', borderRadius: '8px', marginTop: '0.8rem', border: '1px dashed #FFEDD5' }}>
                          <p style={{ margin: '0 0 0.3rem 0', fontWeight: 'bold', color: '#9A3412' }}>Datos Pago Móvil Reportado:</p>
                          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', color: '#9A3412' }}>
                            <span><strong>Ref:</strong> {order.pagoMovil.reference}</span>
                            <span><strong>Fecha:</strong> {order.pagoMovil.date}</span>
                            <span><strong>Banco:</strong> {order.pagoMovil.bank}</span>
                          </div>
                        </div>
                      )}
                    </div>

                    {order.status !== 'Aprobado' && (
                      <button 
                        onClick={() => updateOrderStatus(order.id, 'Aprobado')}
                        style={{ width: '100%', background: 'var(--primary)', color: 'white', border: 'none', padding: '0.8rem', borderRadius: '8px', fontWeight: 'bold', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem', transition: 'opacity 0.2s' }}
                      >
                        <CheckCircle size={18} /> Aprobar Orden
                      </button>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

      </div>

      {/* Map Picker Modal */}
      {showMapPicker && (
        <div style={{
          position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
          background: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center',
          zIndex: 1050, backdropFilter: 'blur(4px)', animation: 'fadeIn 0.2s'
        }}>
          <div style={{
            background: 'white', borderRadius: '16px', width: '90%', maxWidth: '600px',
            overflow: 'hidden', boxShadow: '0 25px 50px -12px rgba(0,0,0,0.5)',
            display: 'flex', flexDirection: 'column'
          }}>
            <div style={{ padding: '1.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid #E2E8F0' }}>
              <div>
                <h3 style={{ margin: 0, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  Ubicación de tu Tienda
                </h3>
                <p style={{ margin: '0.2rem 0 0 0', fontSize: '0.8rem', color: '#64748B' }}>Haz clic en el mapa para posicionar el pin y luego confirma.</p>
              </div>
              <button onClick={() => setShowMapPicker(false)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#64748B' }}>
                <X size={24} />
              </button>
            </div>
            <div style={{ height: '400px', width: '100%' }}>
              <MapContainer center={mapPickerCoords} zoom={17} style={{ height: '100%', width: '100%' }}>
                <TileLayer
                  attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
                  url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />
                <LocationMapEvents />
                <Marker position={mapPickerCoords} />
              </MapContainer>
            </div>
            <div style={{ padding: '1rem', borderTop: '1px solid #E2E8F0', display: 'flex', justifyContent: 'flex-end', gap: '1rem' }}>
              <button onClick={() => setShowMapPicker(false)} style={{ padding: '0.6rem 1.2rem', borderRadius: '8px', border: '1px solid #CBD5E1', background: 'white', color: '#475569', fontWeight: 'bold', cursor: 'pointer' }}>
                Cancelar
              </button>
              <button onClick={confirmMapSelection} style={{ padding: '0.6rem 1.2rem', borderRadius: '8px', border: 'none', background: 'var(--primary)', color: 'white', fontWeight: 'bold', cursor: 'pointer' }}>
                Confirmar Ubicación
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL AGREGAR SECCIÓN */}
      {isModalOpen && (
        <div style={{
          position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
          background: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center',
          zIndex: 1000, backdropFilter: 'blur(4px)'
        }}>
          <div style={{
            background: 'white', borderRadius: '16px', width: '90%', maxWidth: '700px',
            overflow: 'hidden', boxShadow: '0 25px 50px -12px rgba(0,0,0,0.5)',
            animation: 'fadeIn 0.2s ease-out'
          }}>
            <div style={{ background: 'var(--primary)', padding: '1.5rem 2rem', color: 'white', position: 'relative' }}>
              <h2 style={{ margin: 0, fontFamily: 'Inter', fontSize: '1.5rem' }}>Agregar Sección</h2>
              <p style={{ margin: '0.2rem 0 0 0', opacity: 0.8, fontSize: '0.9rem' }}>Elige el tipo de sección</p>
              <button 
                onClick={() => setIsModalOpen(false)}
                style={{ position: 'absolute', top: '1.5rem', right: '1.5rem', background: 'none', border: 'none', color: 'white', cursor: 'pointer', opacity: 0.8 }}
              >
                <X size={24} />
              </button>
            </div>
            <div style={{ padding: '2rem', display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '1.5rem' }}>
              {templateOptions.map(opt => (
                <div 
                  key={opt.id}
                  onClick={() => handleAddSection(opt.id)}
                  style={{
                    border: '1px solid #E2E8E0', borderRadius: '16px', padding: '1.5rem',
                    display: 'flex', flexDirection: 'column', cursor: 'pointer',
                    transition: 'all 0.2s ease', background: 'white'
                  }}
                  onMouseOver={(e) => {
                    e.currentTarget.style.borderColor = 'var(--primary)';
                    e.currentTarget.style.background = '#F4FBF7';
                  }}
                  onMouseOut={(e) => {
                    e.currentTarget.style.borderColor = '#E2E8E0';
                    e.currentTarget.style.background = 'white';
                  }}
                >
                  <span style={{ fontSize: '2.5rem', marginBottom: '0.5rem' }}>{opt.icon}</span>
                  <h4 style={{ margin: '0 0 0.3rem 0', color: 'var(--text-main)', fontSize: '1.1rem' }}>{opt.title}</h4>
                  <p style={{ margin: 0, color: 'var(--primary)', fontSize: '0.85rem' }}>{opt.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* MODAL INVENTARIO COMPLETO */}
      {isInventoryModalOpen && (
        <div style={{
          position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
          background: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center',
          zIndex: 1050, backdropFilter: 'blur(4px)'
        }}>
          <div style={{
            background: 'white', borderRadius: '16px', width: '90%', maxWidth: '900px', height: '80vh',
            display: 'flex', flexDirection: 'column', overflow: 'hidden', boxShadow: '0 25px 50px -12px rgba(0,0,0,0.5)',
            animation: 'fadeIn 0.2s ease-out'
          }}>
            <div style={{ background: 'var(--primary)', padding: '1.5rem 2rem', color: 'white', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <h2 style={{ margin: 0, fontFamily: 'Inter', fontSize: '1.5rem' }}>Inventario Completo</h2>
                <p style={{ margin: '0.2rem 0 0 0', opacity: 0.8, fontSize: '0.9rem' }}>Gestiona todos los productos de tu tienda</p>
              </div>
              <button onClick={() => setIsInventoryModalOpen(false)} style={{ background: 'none', border: 'none', color: 'white', cursor: 'pointer', opacity: 0.8 }}>
                <X size={28} />
              </button>
            </div>

            <div className="modal-filter-row" style={{ padding: '1.5rem', borderBottom: '1px solid #E2E8E0', display: 'flex', gap: '1rem', background: '#F8FAFC' }}>
              <div style={{ flex: 1, position: 'relative' }}>
                <Search size={18} style={{ position: 'absolute', left: '12px', top: '12px', color: '#94A3B8' }} />
                <input 
                  type="text" 
                  placeholder="Buscar por nombre..." 
                  value={inventorySearch}
                  onChange={(e) => setInventorySearch(e.target.value)}
                  style={{ width: '100%', padding: '0.7rem 1rem 0.7rem 2.5rem', border: '1px solid #CBD5E1', borderRadius: '8px', fontSize: '0.95rem' }} 
                />
              </div>
              <div className="modal-select-box" style={{ width: '250px', position: 'relative' }}>
                <Filter size={18} style={{ position: 'absolute', left: '12px', top: '12px', color: '#94A3B8' }} />
                <select 
                  value={inventoryCategory}
                  onChange={(e) => setInventoryCategory(e.target.value)}
                  style={{ width: '100%', padding: '0.7rem 1rem 0.7rem 2.5rem', border: '1px solid #CBD5E1', borderRadius: '8px', fontSize: '0.95rem', background: 'white', cursor: 'pointer' }}
                >
                  <option value="all">Todas las categorías</option>
                  {getAvailableCategories().map(c => (
                    <option key={c.id} value={c.id}>{c.icon} {c.name}</option>
                  ))}
                </select>
              </div>
            </div>

            <div style={{ flex: 1, overflowY: 'auto', padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              {products
                .filter(p => p.name.toLowerCase().includes(inventorySearch.toLowerCase()))
                .filter(p => inventoryCategory === 'all' || p.categoryId === parseInt(inventoryCategory))
                .map(p => (
                <div key={p.id} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', background: 'white', border: '1px solid #E2E8E0', padding: '1rem', borderRadius: '12px', transition: 'all 0.2s', ':hover': { boxShadow: '0 4px 6px rgba(0,0,0,0.05)' } }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
                    <img src={p.image} alt={p.name} style={{ width: '60px', height: '60px', objectFit: 'cover', borderRadius: '8px' }} />
                    <div>
                      <p style={{ margin: '0 0 0.3rem 0', fontWeight: 'bold', fontSize: '1.1rem', color: 'var(--text-main)' }}>{p.name}</p>
                      <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                        <span style={{ color: 'var(--primary)', fontSize: '1rem', fontWeight: 'bold' }}>${p.price.toFixed(2)}</span>
                        <span style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>({(p.price * useStore.getState().bcvRate).toFixed(2)} Bs)</span>
                        {p.tags.includes('featured') && <span style={{ fontSize: '0.75rem', background: '#FEF3C7', color: '#D97706', padding: '0.1rem 0.5rem', borderRadius: '4px' }}>⭐ Destacado</span>}
                        {p.tags.includes('bestseller') && <span style={{ fontSize: '0.75rem', background: '#FEE2E2', color: '#DC2626', padding: '0.1rem 0.5rem', borderRadius: '4px' }}>🔥 Bestseller</span>}
                      </div>
                    </div>
                  </div>
                  <button onClick={() => deleteProduct(p.id)} style={{ background: '#FEE2E2', color: '#EF4444', border: 'none', width: '40px', height: '40px', borderRadius: '8px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <Trash2 size={20} />
                  </button>
                </div>
              ))}
              {products.filter(p => p.name.toLowerCase().includes(inventorySearch.toLowerCase()) && (inventoryCategory === 'all' || p.categoryId === parseInt(inventoryCategory))).length === 0 && (
                <div style={{ textAlign: 'center', color: '#94A3B8', marginTop: '3rem' }}>
                  <p style={{ fontSize: '1.1rem' }}>No se encontraron productos con esos filtros.</p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* MODAL ACTIVACIÓN DE TIENDA */}
      {isActivationModalOpen && (
        <div style={{
          position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
          background: 'rgba(0,0,0,0.6)', display: 'flex', alignItems: 'center', justifyContent: 'center',
          zIndex: 1050, backdropFilter: 'blur(6px)'
        }}>
          <div style={{
            background: 'white', borderRadius: '24px', width: '90%', maxWidth: '500px',
            overflow: 'hidden', boxShadow: '0 25px 50px -12px rgba(0,0,0,0.5)',
            animation: 'fadeIn 0.2s ease-out'
          }}>
            <div style={{ background: 'linear-gradient(135deg, #F97316 0%, #FF9800 100%)', padding: '2rem', color: 'white', position: 'relative', textAlign: 'center' }}>
              <button 
                onClick={() => setIsActivationModalOpen(false)}
                style={{ position: 'absolute', top: '1.5rem', right: '1.5rem', background: 'rgba(255,255,255,0.2)', border: 'none', color: 'white', cursor: 'pointer', borderRadius: '50%', width: '36px', height: '36px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
              >
                <X size={20} />
              </button>
              <div style={{ background: 'white', color: '#F97316', width: '60px', height: '60px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1rem auto', boxShadow: '0 10px 15px rgba(0,0,0,0.1)' }}>
                <Rocket size={32} />
              </div>
              <h2 style={{ margin: 0, fontFamily: 'Fraunces', fontSize: '1.8rem', fontWeight: '900' }}>Activa tu Tienda</h2>
              <p style={{ margin: '0.5rem 0 0 0', opacity: 0.9, fontSize: '0.95rem' }}>Estás a un paso de empezar a vender.</p>
            </div>

            <div style={{ padding: '2rem' }}>
              <div style={{ background: '#F8FAFC', padding: '1.5rem', borderRadius: '12px', marginBottom: '1.5rem', border: '1px dashed #CBD5E1' }}>
                <h4 style={{ margin: '0 0 1rem 0', color: '#0F172A', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <CreditCard size={18} style={{ color: 'var(--primary)' }}/> Datos para Pago Móvil
                </h4>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem', fontSize: '0.9rem' }}>
                  <span style={{ color: '#64748B' }}>Monto:</span>
                  <span style={{ fontWeight: 'bold', color: '#0F172A' }}>$3.00 (A la tasa del día)</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem', fontSize: '0.9rem' }}>
                  <span style={{ color: '#64748B' }}>Teléfono:</span>
                  <span style={{ fontWeight: 'bold', color: '#0F172A' }}>0414-1234567</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem', fontSize: '0.9rem' }}>
                  <span style={{ color: '#64748B' }}>Cédula/RIF:</span>
                  <span style={{ fontWeight: 'bold', color: '#0F172A' }}>J-40123456-7</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.9rem' }}>
                  <span style={{ color: '#64748B' }}>Banco:</span>
                  <span style={{ fontWeight: 'bold', color: '#0F172A' }}>Banesco (0134)</span>
                </div>
              </div>

              <form onSubmit={(e) => {
                e.preventDefault()
                if(paymentRef && paymentBank) {
                  reportSubscriptionPayment(paymentRef, paymentBank)
                  setIsActivationModalOpen(false)
                }
              }}>
                <div style={{ marginBottom: '1rem' }}>
                  <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 'bold', color: 'var(--text-main)', marginBottom: '0.4rem' }}>Banco Emisor</label>
                  <input type="text" value={paymentBank} onChange={e => setPaymentBank(e.target.value)} required placeholder="Ej. Provincial, Mercantil..." style={{ width: '100%', padding: '0.8rem', border: '1px solid #CBD5E1', borderRadius: '8px', fontSize: '0.95rem' }} />
                </div>
                <div style={{ marginBottom: '1.5rem' }}>
                  <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 'bold', color: 'var(--text-main)', marginBottom: '0.4rem' }}>Número de Referencia</label>
                  <input type="text" value={paymentRef} onChange={e => setPaymentRef(e.target.value)} required placeholder="Últimos 4-6 dígitos" style={{ width: '100%', padding: '0.8rem', border: '1px solid #CBD5E1', borderRadius: '8px', fontSize: '0.95rem' }} />
                </div>
                
                <button type="submit" style={{
                  width: '100%', padding: '1rem', borderRadius: '12px', border: 'none',
                  background: 'var(--primary)', color: 'white', fontSize: '1.05rem', fontWeight: 'bold', cursor: 'pointer',
                  boxShadow: '0 4px 6px rgba(17, 104, 62, 0.2)', transition: 'background 0.2s'
                }}>
                  Enviar Reporte de Pago
                </button>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* Botón Flotante para Colapsar/Expandir */}
      <button 
        onClick={() => setIsCollapsed(!isCollapsed)}
        style={{
          position: 'fixed',
          bottom: '20px',
          left: isCollapsed ? '20px' : '470px',
          zIndex: 100,
          background: 'var(--primary)',
          color: 'white',
          border: 'none',
          borderRadius: '50%',
          width: '48px',
          height: '48px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          cursor: 'pointer',
          boxShadow: '0 4px 15px rgba(0,0,0,0.2)',
          transition: 'left 0.3s cubic-bezier(0.4, 0, 0.2, 1)'
        }}
        title={isCollapsed ? "Expandir panel" : "Ocultar panel"}
      >
        {isCollapsed ? <ChevronRight size={24} /> : <ChevronLeft size={24} />}
      </button>
    </>
  )
}

const inputStyle = { width: '100%', padding: '0.6rem', borderRadius: '6px', border: '1px solid #cbd5e1', marginTop: '0.2rem', fontFamily: 'inherit' }
const labelStyle = { fontSize: '0.8rem', fontWeight: 'bold', color: '#64748b' }
