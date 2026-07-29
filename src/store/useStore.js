import { create } from 'zustand'
import { db, auth } from '../firebase'
import { doc, updateDoc, getDoc, collection, setDoc, getDocs, query, where, deleteDoc } from 'firebase/firestore'
import { signOut } from 'firebase/auth'

export const useStore = create((set, get) => ({
  // --- Autenticación ---
  user: null,
  userRole: 'cliente',
  storeStatus: 'pending_activation', // 'pending_activation' | 'validation_pending' | 'active'
  
  // Auth actions
  setUser: (user, role = 'cliente', status = 'pending_activation') => set({ user, userRole: role, storeStatus: status }),
  logout: async () => {
    try {
      await signOut(auth)
      set({ user: null, userRole: 'cliente', cart: [], isCartOpen: false })
    } catch (err) {
      console.error("Error signing out: ", err)
    }
  },

  // --- Configuración de la Tienda (Header/Globales) ---
  storeConfig: {
    name: 'Mi Nueva Tienda',
    primaryColor: '#11683E',
    secondaryColor: '#FFC107',
    logoText: '🚀',
    avatarUrl: '',
    headerAlignment: 'left',
    location: 'Miami, FL',
    followers: '1.2K',
    buttonColor: '#11683E',
    headerColor: '#FFFFFF',
    titleColor: '#0F172A'
  },
  hasUnsavedChanges: false,
  
  updateStoreConfig: (newConfig) => {
    set((state) => ({ 
      storeConfig: { ...state.storeConfig, ...newConfig },
      hasUnsavedChanges: true
    }))
  },

  // --- Visual Block Builder ---
  activeSectionId: null,
  setActiveSectionId: (id) => set({ activeSectionId: id }),

  layoutSections: [
    { 
      id: 'sec-hero-demo', 
      title: 'Banner Principal (Editar)', 
      templateType: 'hero',
      config: { 
        title: '¡Bienvenido a tu Tienda!', 
        subtitle: 'Haz clic en el engranaje de esta sección para editar el texto y la imagen de fondo, o elimínala.',
        buttonText: 'Explorar',
        bgImage: 'https://images.unsplash.com/photo-1610832958506-aa56368176cf?q=80&w=2070&auto=format&fit=crop'
      }
    },
    { 
      id: 'sec-products-demo', 
      title: 'Productos (Editar)', 
      tag: 'all', 
      templateType: 'products_grid',
      config: { columns: 4, sectionTitle: 'Tu Catálogo', sectionSubtitle: 'Sube tus primeros productos reales desde la pestaña de Catálogo y borra estos de prueba' }
    }
  ],
  
  reorderSections: (startIndex, endIndex) => {
    set((state) => {
      const newSections = Array.from(state.layoutSections)
      const [removed] = newSections.splice(startIndex, 1)
      newSections.splice(endIndex, 0, removed)
      return { layoutSections: newSections, hasUnsavedChanges: true }
    })
  },

  updateSectionConfig: (id, key, value) => {
    set((state) => ({
      layoutSections: state.layoutSections.map(s => 
        s.id === id ? { ...s, config: { ...s.config, [key]: value } } : s
      ),
      hasUnsavedChanges: true
    }))
  },

  addSection: (templateType) => {
    const newSection = {
      id: `sec-${Date.now()}`,
      templateType,
      title: 'Nueva Sección',
      config: {}
    }
    
    // Set default config based on type
    if (templateType === 'banner') {
      newSection.title = 'Banner Principal'
      newSection.config = { title: 'Gran Promoción', subtitle: 'Aprovecha nuestros descuentos', buttonText: 'Comprar', bgImage: 'https://images.unsplash.com/photo-1555529771-835f59fc5efe?q=80&w=1000' }
    } else if (templateType === 'categories') {
      newSection.title = 'Categorías'
      newSection.config = { columns: 3 }
    } else if (templateType === 'products_grid') {
      newSection.title = 'Nuestros Productos'
      newSection.config = { columns: 4 }
      newSection.tag = 'all'
    } else if (templateType === 'promo') {
      newSection.title = 'Promoción Especial'
      newSection.config = { code: 'SALE20' }
    } else if (templateType === 'features') {
      newSection.title = 'Por qué elegirnos'
      newSection.config = { columns: 3 }
    } else if (templateType === 'testimonials') {
      newSection.title = 'Reseñas'
      newSection.config = { columns: 2 }
    }

    set((state) => ({ 
      layoutSections: [...state.layoutSections, newSection],
      hasUnsavedChanges: true
    }))
  },
    
  deleteSection: (id) => {
    set((state) => ({ 
      layoutSections: state.layoutSections.filter(s => s.id !== id),
      hasUnsavedChanges: true
    }))
  },

  // Save all design changes to Firestore
  saveDesignToFirestore: async () => {
    const user = get().user
    if (!user) return
    
    try {
      await updateDoc(doc(db, 'users', user.uid), {
        storeConfig: get().storeConfig,
        layoutSections: get().layoutSections
      })
      set({ hasUnsavedChanges: false })
    } catch (err) {
      console.error("Error saving design to Firestore", err)
    }
  },

  // --- Datos Mock ---
  categories: [
    { id: 1, name: 'Frutas Tropicales', count: 84, color: '#FF1493', icon: '🥭' },
    { id: 2, name: 'Especias & Hierbas', count: 56, color: '#00C853', icon: '🌿' },
    { id: 3, name: 'Bebidas Naturales', count: 42, color: '#2962FF', icon: '🥥' },
    { id: 4, name: 'Superfoods', count: 67, color: '#D500F9', icon: '✨' },
    { id: 5, name: 'Snacks Tostados', count: 32, color: '#FF6D00', icon: '🥜' },
    { id: 6, name: 'Productos Orgánicos', count: 112, color: '#64DD17', icon: '🌱' },
    { id: 7, name: 'Raíces & Tubérculos', count: 18, color: '#E65100', icon: '🍠' },
    { id: 8, name: 'Flores Comestibles', count: 24, color: '#C51162', icon: '🌺' },
  ],

  products: [
    { id: 1, categoryId: 1, name: 'Producto de Prueba 1 (Editar)', price: 10.00, image: 'https://images.unsplash.com/photo-1553279768-865429fa0078?q=80&w=500', tags: ['all'], rating: 5.0, badge: 'Demo' },
    { id: 2, categoryId: 1, name: 'Producto de Prueba 2 (Editar)', price: 15.00, image: 'https://images.unsplash.com/photo-1613146445582-7ea4c4e7ab56?q=80&w=500', tags: ['all'], rating: 5.0, badge: 'Demo' },
    { id: 3, categoryId: 1, name: 'Producto de Prueba 3 (Editar)', price: 20.00, image: 'https://images.unsplash.com/photo-1550258987-190a2d41a8ba?q=80&w=500', tags: ['all'], rating: 5.0, badge: 'Demo' },
  ],
  
  addNewProduct: async (product) => {
    const newProduct = { ...product, id: Date.now().toString(), storeId: get().user?.uid || 'demo' }
    set((state) => ({ products: [...state.products, newProduct] }))
    
    if (get().user) {
      try {
        await setDoc(doc(db, 'products', newProduct.id), newProduct)
      } catch (err) {
        console.error("Error saving product to Firestore", err)
      }
    }
  },
  
  deleteProduct: async (id) => {
    set((state) => ({ products: state.products.filter(p => p.id !== id) }))
    if (get().user) {
      try {
        await deleteDoc(doc(db, 'products', id.toString()))
      } catch (err) {
        console.error("Error deleting product from Firestore", err)
      }
    }
  },

  features: [
    { id: 1, title: 'Envío Express', desc: 'Entrega en 24-48 hrs a todo el país', icon: '🚚' },
    { id: 2, title: 'Calidad Garantizada', desc: 'Frescura revisada a mano diario', icon: '🛡️' },
    { id: 3, title: 'Precios Justos', desc: 'Sin intermediarios, directo del campo', icon: '🏷️' },
    { id: 4, title: 'Atención 24/7', desc: 'Soporte disponible todos los días', icon: '📞' }
  ],

  testimonials: [
    { id: 1, name: 'María García', role: 'Miami, FL', text: 'Los mangos llegaron perfectos. Fresquísimos. El mejor servicio que he encontrado para frutas tropicales premium.', stars: 5, avatar: 'https://i.pravatar.cc/150?img=1' },
    { id: 2, name: 'Carlos Rodríguez', role: 'New York, NY', text: 'Increíble variedad y calidad. El cacao venezolano es simplemente extraordinario. 100% recomendado.', stars: 5, avatar: 'https://i.pravatar.cc/150?img=11' },
    { id: 3, name: 'Ana Martínez', role: 'Los Angeles, CA', text: 'Servicio excelente, envíos rápidos y los productos son auténticamente tropicales. Mi tienda favorita.', stars: 5, avatar: 'https://i.pravatar.cc/150?img=5' }
  ],

  // --- Carrito y Órdenes ---
  cart: [],
  orders: [],
  isCartOpen: false,
  toggleCart: () => set((state) => ({ isCartOpen: !state.isCartOpen })),
  addToCart: (product) => 
    set((state) => {
      const exists = state.cart.find(item => item.id === product.id);
      if (exists) {
        return { cart: state.cart.map(item => item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item), isCartOpen: true };
      }
      return { cart: [...state.cart, { ...product, quantity: 1 }], isCartOpen: true };
    }),
  removeFromCart: (productId) => 
    set((state) => ({ cart: state.cart.filter(item => item.id !== productId) })),
  updateQuantity: (productId, delta) =>
    set((state) => ({
      cart: state.cart.map(item => {
        if (item.id === productId) {
          const newQty = item.quantity + delta;
          return { ...item, quantity: newQty > 0 ? newQty : 1 };
        }
        return item;
      })
    })),
  // Tienda (Suscripción)
  reportSubscriptionPayment: async (reference, bank) => {
    const user = get().user;
    if (user) {
      try {
        await updateDoc(doc(db, 'users', user.uid), {
          status: 'validation_pending',
          paymentRef: reference,
          paymentBank: bank
        });
        set({ storeStatus: 'validation_pending' });
      } catch (err) {
        console.error("Error updating payment in Firestore", err);
      }
    } else {
      set({ storeStatus: 'validation_pending' });
    }
  },

  // Órdenes
  addOrder: async (order) => {
    let storeId = get().cart[0]?.storeId
    if (!storeId || storeId === 'demo') {
      storeId = get().user?.uid || 'demo'
    }
    const newOrder = { 
      ...order, 
      id: `ORD-${Date.now()}`, 
      date: new Date().toISOString(), 
      status: 'Validando Pago',
      storeId: storeId,
      customerId: get().user?.uid || 'guest'
    }
    
    set((state) => ({ orders: [newOrder, ...state.orders] }))

    try {
      await setDoc(doc(db, 'orders', newOrder.id), newOrder)
    } catch (err) {
      console.error("Error saving order to Firestore", err)
    }
  },
  
  updateOrderStatus: async (orderId, newStatus) => {
    set((state) => ({
      orders: state.orders.map(order => 
        order.id === orderId ? { ...order, status: newStatus } : order
      )
    }))

    try {
      await updateDoc(doc(db, 'orders', orderId), { status: newStatus })
    } catch (err) {
      console.error("Error updating order status in Firestore", err)
    }
  },

  // --- Marketplace Dummy Stores ---
  marketplaceStores: [
    { id: 1, name: 'Sabores del Paraíso', category: 'Frutas & Superfoods', rating: 4.9, reviews: 2847, cover: 'https://images.unsplash.com/photo-1610832958506-aa56368176cf?q=80&w=500', logo: '🌸' },
    { id: 2, name: 'Moda Urbana', category: 'Ropa & Accesorios', rating: 4.7, reviews: 1420, cover: 'https://images.unsplash.com/photo-1489987707023-af8147c6e240?q=80&w=500', logo: '👗' },
    { id: 3, name: 'Huellas Felices', category: 'Mascotas', rating: 5.0, reviews: 950, cover: 'https://images.unsplash.com/photo-1517849845537-4d257902454a?q=80&w=500', logo: '🐶' }
  ],
  
  fetchMarketplaceStores: async () => {
    try {
      const q = query(collection(db, 'users'), where('role', '==', 'tienda'))
      const snapshot = await getDocs(q)
      const realStores = []
      snapshot.forEach(doc => {
        const data = doc.data()
        if (data.status === 'active') {
          // Intentar obtener una imagen de fondo de la sección "hero" o "banner"
          const heroSection = data.layoutSections?.find(s => s.templateType === 'hero' || s.templateType === 'banner')
          const coverImg = heroSection?.config?.bgImage || 'https://images.unsplash.com/photo-1610832958506-aa56368176cf?q=80&w=500'

          realStores.push({
            id: doc.id,
            name: data.storeConfig?.name || data.storeName || 'Tienda',
            category: data.storeConfig?.category || 'Tienda Local',
            rating: 5.0,
            reviews: data.storeConfig?.followers || 0,
            cover: coverImg,
            logo: data.storeConfig?.logoText || '🏪',
            location: data.storeConfig?.location || 'Online'
          })
        }
      })
      // You can mix real and dummy stores, or just show real ones if they exist
      set((state) => ({ 
        marketplaceStores: realStores.length > 0 ? realStores : state.marketplaceStores 
      }))
    } catch(err) {
      console.error("Error fetching marketplace stores", err)
    }
  },

  // --- Funciones de Sincronización con Firestore ---
  saveStoreData: async () => {
    const state = get()
    if (!state.user || state.userRole !== 'tienda') return

    try {
      await updateDoc(doc(db, 'users', state.user.uid), {
        storeConfig: state.storeConfig,
        layoutSections: state.layoutSections
      })
    } catch (err) {
      console.error("Error saving store data", err)
    }
  },

  fetchStoreData: async (uid) => {
    try {
      // 1. Fetch user document (config & layout)
      const userDoc = await getDoc(doc(db, 'users', uid))
      if (userDoc.exists()) {
        const data = userDoc.data()
        
        let finalConfig = get().storeConfig;
        if (data.storeConfig) {
          finalConfig = { ...finalConfig, ...data.storeConfig }
        }
        
        // Si el nombre sigue siendo el de prueba, intentamos usar el de registro
        if ((!data.storeConfig || data.storeConfig.name === 'Mi Nueva Tienda') && data.storeName) {
          finalConfig.name = data.storeName;
        }

        set({ storeConfig: finalConfig })

        if (data.layoutSections && data.layoutSections.length > 0) {
          set({ layoutSections: data.layoutSections })
        } else {
          // If no sections exist, save the default ones
          get().saveStoreData()
        }
      }

      // 2. Fetch products
      const productsQ = query(collection(db, 'products'), where('storeId', '==', uid))
      const querySnapshot = await getDocs(productsQ)
      const products = []
      querySnapshot.forEach((doc) => {
        products.push(doc.data())
      })

      if (products.length > 0) {
        set({ products: products })
      } else {
        // If no products, save the default demo products
        const demoProducts = get().products
        const newProducts = demoProducts.map(p => ({ ...p, storeId: uid }))
        newProducts.forEach(async newP => {
          await setDoc(doc(db, 'products', newP.id.toString()), newP)
        })
        set({ products: newProducts })
      }

      // 3. Fetch orders
      const ordersQ = query(collection(db, 'orders'), where('storeId', '==', uid))
      const ordersSnapshot = await getDocs(ordersQ)
      const orders = []
      ordersSnapshot.forEach((doc) => {
        orders.push(doc.data())
      })
      
      // Sort orders by date descending
      orders.sort((a, b) => new Date(b.date) - new Date(a.date))
      set({ orders: orders })

    } catch (err) {
      console.error("Error fetching store data", err)
    }
  },

  fetchClientOrders: async (uid) => {
    try {
      const ordersQ = query(collection(db, 'orders'), where('customerId', '==', uid))
      const ordersSnapshot = await getDocs(ordersQ)
      const orders = []
      ordersSnapshot.forEach((doc) => {
        orders.push(doc.data())
      })
      orders.sort((a, b) => new Date(b.date) - new Date(a.date))
      set({ orders: orders })
    } catch (err) {
      console.error("Error fetching client orders", err)
    }
  },

  publicStoreData: null,
  fetchPublicStoreData: async (uid) => {
    try {
      const userDoc = await getDoc(doc(db, 'users', uid))
      let storeConfig = get().storeConfig;
      let layoutSections = get().layoutSections;
      
      if (userDoc.exists()) {
         const data = userDoc.data()
         
         if(data.storeConfig) {
           storeConfig = { ...storeConfig, ...data.storeConfig }
         }
         
         // Si el nombre sigue siendo el de prueba, intentamos usar el de registro
         if ((!data.storeConfig || data.storeConfig.name === 'Mi Nueva Tienda') && data.storeName) {
           storeConfig.name = data.storeName;
         }

         if(data.layoutSections) layoutSections = data.layoutSections
      }

      const productsQ = query(collection(db, 'products'), where('storeId', '==', uid))
      const productsSnapshot = await getDocs(productsQ)
      const products = []
      productsSnapshot.forEach(doc => products.push(doc.data()))

      set({ publicStoreData: { 
        storeConfig, 
        layoutSections, 
        products: products.length > 0 ? products : get().products 
      }})
    } catch(err) {
      console.error("Error fetching public store data", err)
    }
  },
  clearPublicStoreData: () => set({ publicStoreData: null })
}))
