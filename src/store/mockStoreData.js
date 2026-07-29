export const mockStoreData = {
  // Tienda 2: Moda Urbana (Ropa)
  "2": {
    storeConfig: {
      name: 'Moda Urbana',
      primaryColor: '#0F172A',
      logoText: '👗',
    },
    categories: [
      { id: 1, name: 'Camisas', count: 45, color: '#3B82F6', icon: '👔' },
      { id: 2, name: 'Pantalones', count: 32, color: '#10B981', icon: '👖' },
      { id: 3, name: 'Vestidos', count: 28, color: '#EC4899', icon: '👗' },
      { id: 4, name: 'Zapatos', count: 50, color: '#F59E0B', icon: '👟' },
    ],
    products: [
      { id: 201, categoryId: 1, name: 'Camisa Oxford Blanca', price: 29.99, image: 'https://images.unsplash.com/photo-1596755094514-f87e34085b2c?q=80&w=500', tags: ['bestseller', 'all'], rating: 4.8, badge: 'Clásico' },
      { id: 202, categoryId: 4, name: 'Zapatos Urbanos', price: 59.99, image: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?q=80&w=500', tags: ['featured', 'all'], rating: 4.9, badge: 'Nuevo' },
      { id: 203, categoryId: 3, name: 'Vestido Floral', price: 45.00, image: 'https://images.unsplash.com/photo-1572804013309-59a88b7e92f1?q=80&w=500', tags: ['bestseller', 'all'], rating: 4.7, badge: 'Verano' },
      { id: 204, categoryId: 2, name: 'Jeans Slim Fit', price: 39.99, image: 'https://images.unsplash.com/photo-1541099649105-f69ad21f3246?q=80&w=500', tags: ['all'], rating: 4.6, badge: 'Descuento', oldPrice: 49.99 },
    ],
    features: [
      { id: 1, title: 'Envíos Nacionales', desc: 'A todo el país por Zoom/Tealca', icon: '📦' },
      { id: 2, title: 'Cambios Gratis', desc: '30 días para devoluciones', icon: '🔄' },
      { id: 3, title: 'Telas Premium', desc: 'Algodón 100% importado', icon: '🧵' }
    ],
    testimonials: [
      { id: 1, name: 'Luis Pérez', role: 'Cliente', text: 'Excelente calidad de camisas.', stars: 5, avatar: 'https://i.pravatar.cc/150?img=12' },
      { id: 2, name: 'Sofía', role: 'Cliente', text: 'Los vestidos son hermosos.', stars: 5, avatar: 'https://i.pravatar.cc/150?img=5' }
    ],
    layoutSections: [
      { 
        id: 'sec-hero-2', templateType: 'hero',
        config: { title: 'Tu estilo, tus reglas', subtitle: 'La mejor colección de ropa urbana para esta temporada.', buttonText: 'Ver Colección', bgImage: 'https://images.unsplash.com/photo-1489987707023-af8147c6e240?q=80&w=1500' }
      },
      { id: 'sec-cat-2', templateType: 'categories', config: { columns: 4, sectionTitle: 'Colecciones', sectionSubtitle: 'Encuentra tu estilo' } },
      { id: 'sec-prod-2', tag: 'all', templateType: 'products_grid', config: { columns: 4, sectionTitle: 'Nuevos Ingresos', sectionSubtitle: 'Lo último en tendencia' } }
    ]
  },

  // Tienda 3: Huellas Felices (Mascotas)
  "3": {
    storeConfig: {
      name: 'Huellas Felices',
      primaryColor: '#F97316',
      logoText: '🐶',
    },
    categories: [
      { id: 1, name: 'Alimento', count: 120, color: '#EF4444', icon: '🍖' },
      { id: 2, name: 'Juguetes', count: 85, color: '#8B5CF6', icon: '🎾' },
      { id: 3, name: 'Camas', count: 30, color: '#10B981', icon: '🛏️' },
      { id: 4, name: 'Accesorios', count: 65, color: '#3B82F6', icon: '🦮' },
    ],
    products: [
      { id: 301, categoryId: 1, name: 'Perrina Premium 10kg', price: 35.00, image: 'https://images.unsplash.com/photo-1589924691995-400dc9ecc119?q=80&w=500', tags: ['bestseller', 'all'], rating: 4.8, badge: 'Popular' },
      { id: 302, categoryId: 2, name: 'Hueso de Goma Masticable', price: 8.50, image: 'https://images.unsplash.com/photo-1576201836106-db1758fd1c97?q=80&w=500', tags: ['all'], rating: 4.5, badge: 'Divertido' },
      { id: 303, categoryId: 3, name: 'Cama Ortopédica Grande', price: 45.99, image: 'https://images.unsplash.com/photo-1541781774459-bb2af2f05b55?q=80&w=500', tags: ['featured', 'all'], rating: 5.0, badge: 'Confort' },
    ],
    features: [
      { id: 1, title: 'Aprobado por Vets', desc: 'Productos seguros para mascotas', icon: '🩺' },
      { id: 2, title: 'Delivery Express', desc: 'Alimento en la puerta de tu casa', icon: '🛵' }
    ],
    testimonials: [
      { id: 1, name: 'Firulais', role: 'Perro Feliz', text: 'Woof woof! La mejor comida.', stars: 5, avatar: 'https://images.unsplash.com/photo-1517849845537-4d257902454a?q=80&w=150' }
    ],
    layoutSections: [
      { 
        id: 'sec-hero-3', templateType: 'hero',
        config: { title: 'Todo para tu mejor amigo', subtitle: 'Alimentos, juguetes y accesorios de la más alta calidad.', buttonText: 'Comprar', bgImage: 'https://images.unsplash.com/photo-1450778869180-41d0601e046e?q=80&w=1500' }
      },
      { id: 'sec-cat-3', templateType: 'categories', config: { columns: 4, sectionTitle: 'Nuestros Productos', sectionSubtitle: 'Categorías' } },
      { id: 'sec-prod-3', tag: 'all', templateType: 'products_grid', config: { columns: 4, sectionTitle: 'Productos Estrella', sectionSubtitle: 'Lo más vendido' } }
    ]
  }
}
