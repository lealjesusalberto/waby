import React, { useState, useEffect } from 'react'
import { useStore } from '../store/useStore'
import { db } from '../firebase'
import { collection, query, getDocs, doc, updateDoc, where } from 'firebase/firestore'
import { LogOut, Users, Store, CheckCircle, Clock, Search, XCircle, Activity } from 'lucide-react'

export default function SuperAdminPanel() {
  const logout = useStore(state => state.logout)
  const [activeTab, setActiveTab] = useState('pending') // pending, active, users

  const [users, setUsers] = useState([])
  const [loading, setLoading] = useState(true)

  const bcvRate = useStore(state => state.bcvRate)
  const updateBcvRate = useStore(state => state.updateBcvRate)
  const [localBcvRate, setLocalBcvRate] = useState(36.5)

  useEffect(() => {
    setLocalBcvRate(bcvRate)
  }, [bcvRate])

  useEffect(() => {
    fetchUsers()
  }, [])

  const fetchUsers = async () => {
    setLoading(true)
    try {
      const q = query(collection(db, "users"))
      const querySnapshot = await getDocs(q)
      const usersData = []
      querySnapshot.forEach((doc) => {
        usersData.push({ id: doc.id, ...doc.data() })
      })
      setUsers(usersData)
    } catch (error) {
      console.error("Error fetching users: ", error)
    } finally {
      setLoading(false)
    }
  }

  const approvePayment = async (userId) => {
    try {
      const userRef = doc(db, "users", userId)
      await updateDoc(userRef, {
        status: 'active'
      })
      // Update local state to reflect change instantly
      setUsers(users.map(u => u.id === userId ? { ...u, status: 'active' } : u))
    } catch (error) {
      console.error("Error approving payment: ", error)
      alert("Error al aprobar el pago")
    }
  }

  const revokeStore = async (userId) => {
    try {
      const userRef = doc(db, "users", userId)
      await updateDoc(userRef, {
        status: 'pending_activation'
      })
      // Update local state to reflect change instantly
      setUsers(users.map(u => u.id === userId ? { ...u, status: 'pending_activation' } : u))
    } catch (error) {
      console.error("Error revoking store: ", error)
      alert("Error al revocar tienda")
    }
  }

  const pendingStores = users.filter(u => u.role === 'tienda' && u.status === 'validation_pending')
  const activeStores = users.filter(u => u.role === 'tienda' && u.status === 'active')
  const clients = users.filter(u => u.role === 'cliente')

  return (
    <div className="admin-layout" style={{ fontFamily: "'Inter', sans-serif" }}>
      {/* Sidebar */}
      <aside className="admin-sidebar">
        <div style={{ padding: '2rem 1.5rem', borderBottom: '1px solid #334155' }}>
          <h2 style={{ margin: 0, fontSize: '1.5rem', fontFamily: 'Fraunces', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Activity color="#38BDF8" /> Waby Admin
          </h2>
          <p style={{ margin: '0.2rem 0 0 0', color: '#94A3B8', fontSize: '0.85rem' }}>Panel de Control Global</p>
        </div>

        <nav className="admin-nav">
          <button
            onClick={() => setActiveTab('pending')}
            style={{ display: 'flex', alignItems: 'center', gap: '0.8rem', padding: '0.8rem 1rem', background: activeTab === 'pending' ? '#334155' : 'transparent', color: activeTab === 'pending' ? '#38BDF8' : '#CBD5E1', border: 'none', borderRadius: '8px', cursor: 'pointer', textAlign: 'left', fontWeight: activeTab === 'pending' ? 'bold' : 'normal', transition: 'all 0.2s' }}
          >
            <Clock size={18} /> Validar Pagos
            {pendingStores.length > 0 && <span style={{ background: '#EF4444', color: 'white', padding: '0.1rem 0.5rem', borderRadius: '10px', fontSize: '0.7rem', marginLeft: 'auto' }}>{pendingStores.length}</span>}
          </button>
          <button
            onClick={() => setActiveTab('active')}
            style={{ display: 'flex', alignItems: 'center', gap: '0.8rem', padding: '0.8rem 1rem', background: activeTab === 'active' ? '#334155' : 'transparent', color: activeTab === 'active' ? '#38BDF8' : '#CBD5E1', border: 'none', borderRadius: '8px', cursor: 'pointer', textAlign: 'left', fontWeight: activeTab === 'active' ? 'bold' : 'normal', transition: 'all 0.2s' }}
          >
            <Store size={18} /> Tiendas Activas
          </button>
          <button
            onClick={() => setActiveTab('users')}
            style={{ display: 'flex', alignItems: 'center', gap: '0.8rem', padding: '0.8rem 1rem', background: activeTab === 'users' ? '#334155' : 'transparent', color: activeTab === 'users' ? '#38BDF8' : '#CBD5E1', border: 'none', borderRadius: '8px', cursor: 'pointer', textAlign: 'left', fontWeight: activeTab === 'users' ? 'bold' : 'normal', transition: 'all 0.2s' }}
          >
            <Users size={18} /> Clientes
          </button>
        </nav>

        <div style={{ padding: '1rem' }}>
          <button
            onClick={logout}
            style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem', width: '100%', padding: '0.8rem', background: '#334155', color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer', transition: 'background 0.2s' }}
            onMouseOver={e => e.currentTarget.style.background = '#475569'}
            onMouseOut={e => e.currentTarget.style.background = '#334155'}
          >
            <LogOut size={16} /> Cerrar Sesión
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="admin-main">

        {/* Header Stats */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1.5rem', marginBottom: '2.5rem' }}>
          <div style={{ background: 'white', padding: '1.5rem', borderRadius: '12px', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.05)' }}>
            <p style={{ color: '#64748B', margin: '0 0 0.5rem 0', fontSize: '0.9rem', fontWeight: 'bold' }}>Tiendas por Validar</p>
            <h3 style={{ margin: 0, fontSize: '2rem', color: '#F59E0B' }}>{pendingStores.length}</h3>
          </div>
          <div style={{ background: 'white', padding: '1.5rem', borderRadius: '12px', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.05)' }}>
            <p style={{ color: '#64748B', margin: '0 0 0.5rem 0', fontSize: '0.9rem', fontWeight: 'bold' }}>Tiendas Activas</p>
            <h3 style={{ margin: 0, fontSize: '2rem', color: '#10B981' }}>{activeStores.length}</h3>
          </div>
          <div style={{ background: 'white', padding: '1.5rem', borderRadius: '12px', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.05)' }}>
            <p style={{ color: '#64748B', margin: '0 0 0.5rem 0', fontSize: '0.9rem', fontWeight: 'bold' }}>Clientes Registrados</p>
            <h3 style={{ margin: 0, fontSize: '2rem', color: '#3B82F6' }}>{clients.length}</h3>
          </div>
          <div style={{ background: 'white', padding: '1.5rem', borderRadius: '12px', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.05)' }}>
            <p style={{ color: '#64748B', margin: '0 0 0.5rem 0', fontSize: '0.9rem', fontWeight: 'bold' }}>Tasa BCV (Bs/$)</p>
            <div style={{ display: 'flex', gap: '0.5rem' }}>
              <input
                type="number"
                step="0.01"
                value={localBcvRate}
                onChange={(e) => setLocalBcvRate(parseFloat(e.target.value))}
                style={{ width: '100px', fontSize: '1.5rem', fontWeight: 'bold', color: '#0F172A', border: '1px solid #E2E8F0', borderRadius: '8px', padding: '0.5rem' }}
              />
              <button
                onClick={() => updateBcvRate(localBcvRate)}
                style={{ background: '#38BDF8', color: 'white', border: 'none', padding: '0.5rem 1rem', borderRadius: '8px', fontWeight: 'bold', cursor: 'pointer' }}
              >
                Actualizar
              </button>
            </div>
          </div>
        </div>

        {/* Content Area */}
        <div style={{ background: 'white', borderRadius: '16px', padding: '2rem', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.05)' }}>
          <h2 style={{ marginTop: 0, marginBottom: '1.5rem', color: '#0F172A', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            {activeTab === 'pending' && <><Clock color="#F59E0B" /> Pagos Pendientes por Validar</>}
            {activeTab === 'active' && <><Store color="#10B981" /> Tiendas Activas</>}
            {activeTab === 'users' && <><Users color="#3B82F6" /> Base de Clientes</>}
          </h2>

          {loading ? (
            <div style={{ textAlign: 'center', padding: '3rem', color: '#64748B' }}>Cargando datos...</div>
          ) : (
            <div>
              {/* Pending Stores Cards */}
              {activeTab === 'pending' && (
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '1.5rem' }}>
                  {pendingStores.length === 0 && <p style={{ padding: '2rem', textAlign: 'center', color: '#94A3B8', gridColumn: '1 / -1' }}>No hay tiendas pendientes.</p>}
                  {pendingStores.map(store => (
                    <div key={store.id} style={{ border: '1px solid #E2E8F0', borderRadius: '12px', padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1rem', background: '#F8FAFC' }}>
                      <div>
                        <h4 style={{ margin: '0 0 0.3rem 0', color: '#0F172A', fontSize: '1.1rem' }}>{store.name}</h4>
                        <p style={{ margin: 0, color: '#64748B', fontSize: '0.9rem' }}>{store.email}</p>
                      </div>
                      <div>
                        <p style={{ margin: '0 0 0.3rem 0', fontSize: '0.85rem', color: '#64748B', fontWeight: 'bold' }}>Tienda</p>
                        <p style={{ margin: 0, color: '#0F172A', fontWeight: '500' }}>{store.storeName}</p>
                      </div>
                      <div style={{ background: '#FEF3C7', border: '1px solid #FDE68A', color: '#B45309', padding: '0.8rem', borderRadius: '8px', fontSize: '0.85rem' }}>
                        <p style={{ margin: '0 0 0.2rem 0' }}>Banco: <strong>{store.paymentBank || 'N/A'}</strong></p>
                        <p style={{ margin: 0 }}>Ref: <strong>{store.paymentRef || 'N/A'}</strong></p>
                      </div>
                      <button onClick={() => approvePayment(store.id)} style={{ background: '#10B981', color: 'white', border: 'none', padding: '0.8rem', borderRadius: '8px', fontWeight: 'bold', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem', marginTop: 'auto', boxShadow: '0 2px 4px rgba(16, 185, 129, 0.2)' }}>
                        <CheckCircle size={18} /> Aprobar
                      </button>
                    </div>
                  ))}
                </div>
              )}

              {/* Active Stores Cards */}
              {activeTab === 'active' && (
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '1.5rem' }}>
                  {activeStores.length === 0 && <p style={{ padding: '2rem', textAlign: 'center', color: '#94A3B8', gridColumn: '1 / -1' }}>No hay tiendas activas.</p>}
                  {activeStores.map(store => (
                    <div key={store.id} style={{ border: '1px solid #E2E8F0', borderRadius: '12px', padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1rem', background: '#F8FAFC' }}>
                      <div>
                        <h4 style={{ margin: '0 0 0.3rem 0', color: '#0F172A', fontSize: '1.1rem' }}>{store.name}</h4>
                        <p style={{ margin: 0, color: '#64748B', fontSize: '0.9rem' }}>{store.email}</p>
                      </div>
                      <div>
                        <p style={{ margin: '0 0 0.3rem 0', fontSize: '0.85rem', color: '#64748B', fontWeight: 'bold' }}>Tienda</p>
                        <p style={{ margin: 0, color: '#0F172A', fontWeight: '500' }}>{store.storeName}</p>
                      </div>
                      <button onClick={() => revokeStore(store.id)} style={{ background: '#FFF1F2', color: '#E11D48', border: '1px solid #FECDD3', padding: '0.8rem', borderRadius: '8px', fontWeight: 'bold', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem', marginTop: 'auto' }}>
                        <XCircle size={18} /> Revocar Tienda
                      </button>
                    </div>
                  ))}
                </div>
              )}

              {/* Clients Cards */}
              {activeTab === 'users' && (
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))', gap: '1.5rem' }}>
                  {clients.length === 0 && <p style={{ padding: '2rem', textAlign: 'center', color: '#94A3B8', gridColumn: '1 / -1' }}>No hay clientes registrados.</p>}
                  {clients.map(client => (
                    <div key={client.id} style={{ border: '1px solid #E2E8F0', borderRadius: '12px', padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '0.5rem', background: '#F8FAFC' }}>
                      <h4 style={{ margin: 0, color: '#0F172A', fontSize: '1.1rem' }}>{client.name}</h4>
                      <p style={{ margin: 0, color: '#64748B', fontSize: '0.9rem' }}>{client.email}</p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </main>
    </div>
  )
}
