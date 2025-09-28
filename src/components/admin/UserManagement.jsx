import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  Plus, 
  Search, 
  Edit, 
  Trash2, 
  Mail, 
  Phone, 
  Calendar,
  CreditCard,
  CheckCircle,
  XCircle
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

const UserManagement = () => {
  const { api } = useAuth();
  const [users, setUsers] = useState([]);
  const [plans, setPlans] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [editingUser, setEditingUser] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    plan_id: '',
    subscription_start: '',
    subscription_end: '',
    status: 'active'
  });

  useEffect(() => {
    fetchUsers();
    fetchPlans();
  }, []);

  const fetchUsers = async () => {
    try {
      const response = await api.get('/users');
      setUsers(response.data);
    } catch (error) {
      console.error('Error cargando usuarios:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchPlans = async () => {
    try {
      const response = await api.get('/plans');
      setPlans(response.data);
    } catch (error) {
      console.error('Error cargando planes:', error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingUser) {
        await api.put(`/users/${editingUser.id}`, formData);
      } else {
        await api.post('/users', formData);
      }
      
      fetchUsers();
      closeModal();
    } catch (error) {
      console.error('Error guardando usuario:', error);
      alert(error.response?.data?.error || 'Error guardando usuario');
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('¿Estás seguro de eliminar este usuario?')) {
      try {
        await api.delete(`/users/${id}`);
        fetchUsers();
      } catch (error) {
        console.error('Error eliminando usuario:', error);
        alert('Error eliminando usuario');
      }
    }
  };

  const openModal = (user = null) => {
    setEditingUser(user);
    setFormData(user ? {
      name: user.name,
      email: user.email,
      phone: user.phone || '',
      plan_id: user.plan_id || '',
      subscription_start: user.subscription_start || '',
      subscription_end: user.subscription_end || '',
      status: user.status
    } : {
      name: '',
      email: '',
      phone: '',
      plan_id: '',
      subscription_start: '',
      subscription_end: '',
      status: 'active'
    });
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setEditingUser(null);
    setFormData({
      name: '',
      email: '',
      phone: '',
      plan_id: '',
      subscription_start: '',
      subscription_end: '',
      status: 'active'
    });
  };

  const filteredUsers = users.filter(user =>
    user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getStatusBadge = (status) => {
    const styles = {
      active: 'bg-green-900 text-green-400 border-green-700',
      inactive: 'bg-gray-900 text-gray-400 border-gray-700',
      suspended: 'bg-red-900 text-red-400 border-red-700'
    };
    
    return (
      <span className={`px-2 py-1 rounded-full text-xs border ${styles[status] || styles.inactive}`}>
        {status}
      </span>
    );
  };

  if (loading) {
    return (
      <div className="p-6">
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-gray-800 rounded w-1/4"></div>
          <div className="h-10 bg-gray-800 rounded"></div>
          {[...Array(5)].map((_, i) => (
            <div key={i} className="h-16 bg-gray-800 rounded"></div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="p-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold text-white">Gestión de Usuarios</h1>
          <motion.button
            onClick={() => openModal()}
            className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Plus className="h-5 w-5" />
            Nuevo Usuario
          </motion.button>
        </div>

        {/* Search */}
        <div className="relative mb-6">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
          <input
            type="text"
            placeholder="Buscar usuarios..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-gray-900 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-red-600"
          />
        </div>

        {/* Users Table */}
        <div className="bg-gray-900 rounded-lg overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-800">
                <tr>
                  <th className="px-6 py-4 text-left text-gray-300 font-semibold">Usuario</th>
                  <th className="px-6 py-4 text-left text-gray-300 font-semibold">Plan</th>
                  <th className="px-6 py-4 text-left text-gray-300 font-semibold">Estado</th>
                  <th className="px-6 py-4 text-left text-gray-300 font-semibold">Suscripción</th>
                  <th className="px-6 py-4 text-left text-gray-300 font-semibold">Acciones</th>
                </tr>
              </thead>
              <tbody>
                {filteredUsers.map((user, index) => (
                  <motion.tr
                    key={user.id}
                    className="border-t border-gray-800 hover:bg-gray-800 transition-colors"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                  >
                    <td className="px-6 py-4">
                      <div>
                        <div className="text-white font-semibold">{user.name}</div>
                        <div className="flex items-center gap-4 text-gray-400 text-sm mt-1">
                          <span className="flex items-center gap-1">
                            <Mail className="h-4 w-4" />
                            {user.email}
                          </span>
                          {user.phone && (
                            <span className="flex items-center gap-1">
                              <Phone className="h-4 w-4" />
                              {user.phone}
                            </span>
                          )}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-white">
                        {user.plan_name || 'Sin plan'}
                      </div>
                      {user.plan_price && (
                        <div className="text-gray-400 text-sm">
                          ${user.plan_price}/mes
                        </div>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      {getStatusBadge(user.status)}
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-gray-400 text-sm">
                        {user.subscription_start && (
                          <div className="flex items-center gap-1">
                            <Calendar className="h-4 w-4" />
                            {new Date(user.subscription_start).toLocaleDateString()} - 
                            {user.subscription_end ? new Date(user.subscription_end).toLocaleDateString() : 'Indefinido'}
                          </div>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <motion.button
                          onClick={() => openModal(user)}
                          className="p-2 text-blue-400 hover:bg-blue-900 hover:bg-opacity-50 rounded-lg transition-colors"
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                        >
                          <Edit className="h-4 w-4" />
                        </motion.button>
                        <motion.button
                          onClick={() => handleDelete(user.id)}
                          className="p-2 text-red-400 hover:bg-red-900 hover:bg-opacity-50 rounded-lg transition-colors"
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                        >
                          <Trash2 className="h-4 w-4" />
                        </motion.button>
                      </div>
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>
          
          {filteredUsers.length === 0 && (
            <div className="text-center py-8 text-gray-400">
              No se encontraron usuarios
            </div>
          )}
        </div>
      </motion.div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <motion.div
            className="bg-gray-900 rounded-lg p-6 w-full max-w-md mx-4"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.3 }}
          >
            <h2 className="text-xl font-bold text-white mb-4">
              {editingUser ? 'Editar Usuario' : 'Nuevo Usuario'}
            </h2>
            
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-gray-300 text-sm font-medium mb-2">
                  Nombre
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                  className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:border-red-600"
                  required
                />
              </div>

              <div>
                <label className="block text-gray-300 text-sm font-medium mb-2">
                  Email
                </label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({...formData, email: e.target.value})}
                  className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:border-red-600"
                  required
                />
              </div>

              <div>
                <label className="block text-gray-300 text-sm font-medium mb-2">
                  Teléfono
                </label>
                <input
                  type="text"
                  value={formData.phone}
                  onChange={(e) => setFormData({...formData, phone: e.target.value})}
                  className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:border-red-600"
                />
              </div>

              <div>
                <label className="block text-gray-300 text-sm font-medium mb-2">
                  Plan
                </label>
                <select
                  value={formData.plan_id}
                  onChange={(e) => setFormData({...formData, plan_id: e.target.value})}
                  className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:border-red-600"
                >
                  <option value="">Seleccionar plan</option>
                  {plans.map((plan) => (
                    <option key={plan.id} value={plan.id}>
                      {plan.name} - ${plan.price}/mes
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-gray-300 text-sm font-medium mb-2">
                    Inicio
                  </label>
                  <input
                    type="date"
                    value={formData.subscription_start}
                    onChange={(e) => setFormData({...formData, subscription_start: e.target.value})}
                    className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:border-red-600"
                  />
                </div>

                <div>
                  <label className="block text-gray-300 text-sm font-medium mb-2">
                    Fin
                  </label>
                  <input
                    type="date"
                    value={formData.subscription_end}
                    onChange={(e) => setFormData({...formData, subscription_end: e.target.value})}
                    className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:border-red-600"
                  />
                </div>
              </div>

              <div>
                <label className="block text-gray-300 text-sm font-medium mb-2">
                  Estado
                </label>
                <select
                  value={formData.status}
                  onChange={(e) => setFormData({...formData, status: e.target.value})}
                  className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:border-red-600"
                >
                  <option value="active">Activo</option>
                  <option value="inactive">Inactivo</option>
                  <option value="suspended">Suspendido</option>
                </select>
              </div>

              <div className="flex justify-end gap-4 mt-6">
                <button
                  type="button"
                  onClick={closeModal}
                  className="px-4 py-2 text-gray-400 hover:text-white transition-colors"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors"
                >
                  {editingUser ? 'Actualizar' : 'Crear'}
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      )}
    </div>
  );
};

export default UserManagement;