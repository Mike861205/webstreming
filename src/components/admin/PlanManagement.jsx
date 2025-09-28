import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  Plus, 
  Search, 
  Edit, 
  Trash2, 
  Star,
  Check,
  X,
  Users
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

const PlanManagement = () => {
  const { api } = useAuth();
  const [plans, setPlans] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [editingPlan, setEditingPlan] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    price: '',
    description: '',
    features: [''],
    active: true
  });

  useEffect(() => {
    fetchPlans();
  }, []);

  const fetchPlans = async () => {
    try {
      const response = await api.get('/plans');
      setPlans(response.data);
    } catch (error) {
      console.error('Error cargando planes:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const planData = {
        ...formData,
        price: parseFloat(formData.price),
        features: formData.features.filter(feature => feature.trim() !== '')
      };

      if (editingPlan) {
        await api.put(`/plans/${editingPlan.id}`, planData);
      } else {
        await api.post('/plans', planData);
      }
      
      fetchPlans();
      closeModal();
    } catch (error) {
      console.error('Error guardando plan:', error);
      alert(error.response?.data?.error || 'Error guardando plan');
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('¿Estás seguro de eliminar este plan? Esta acción no se puede deshacer.')) {
      try {
        await api.delete(`/plans/${id}`);
        fetchPlans();
      } catch (error) {
        console.error('Error eliminando plan:', error);
        alert(error.response?.data?.error || 'Error eliminando plan');
      }
    }
  };

  const openModal = (plan = null) => {
    setEditingPlan(plan);
    setFormData(plan ? {
      name: plan.name,
      price: plan.price.toString(),
      description: plan.description || '',
      features: Array.isArray(plan.features) ? plan.features : 
                typeof plan.features === 'string' ? JSON.parse(plan.features) : [''],
      active: plan.active
    } : {
      name: '',
      price: '',
      description: '',
      features: [''],
      active: true
    });
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setEditingPlan(null);
    setFormData({
      name: '',
      price: '',
      description: '',
      features: [''],
      active: true
    });
  };

  const addFeature = () => {
    setFormData({
      ...formData,
      features: [...formData.features, '']
    });
  };

  const removeFeature = (index) => {
    const newFeatures = formData.features.filter((_, i) => i !== index);
    setFormData({
      ...formData,
      features: newFeatures.length === 0 ? [''] : newFeatures
    });
  };

  const updateFeature = (index, value) => {
    const newFeatures = [...formData.features];
    newFeatures[index] = value;
    setFormData({
      ...formData,
      features: newFeatures
    });
  };

  const filteredPlans = plans.filter(plan =>
    plan.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    plan.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return (
      <div className="p-6">
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-gray-800 rounded w-1/4"></div>
          <div className="h-10 bg-gray-800 rounded"></div>
          {[...Array(3)].map((_, i) => (
            <div key={i} className="h-48 bg-gray-800 rounded"></div>
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
          <h1 className="text-3xl font-bold text-white">Gestión de Planes</h1>
          <motion.button
            onClick={() => openModal()}
            className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Plus className="h-5 w-5" />
            Nuevo Plan
          </motion.button>
        </div>

        {/* Search */}
        <div className="relative mb-6">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
          <input
            type="text"
            placeholder="Buscar planes..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-gray-900 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-red-600"
          />
        </div>

        {/* Plans Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredPlans.map((plan, index) => (
            <motion.div
              key={plan.id}
              className="bg-gray-900 rounded-lg border border-gray-800 overflow-hidden hover:border-red-600 transition-colors"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              whileHover={{ y: -5 }}
            >
              {/* Plan Header */}
              <div className="p-6 border-b border-gray-800">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="text-xl font-bold text-white">{plan.name}</h3>
                    <div className="flex items-center gap-2 mt-1">
                      <span className="text-3xl font-bold text-red-400">
                        ${parseFloat(plan.price).toFixed(2)}
                      </span>
                      <span className="text-gray-400">/mes</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <span
                      className={`px-2 py-1 rounded-full text-xs ${
                        plan.active
                          ? 'bg-green-900 text-green-400 border border-green-700'
                          : 'bg-gray-900 text-gray-400 border border-gray-700'
                      }`}
                    >
                      {plan.active ? 'Activo' : 'Inactivo'}
                    </span>
                  </div>
                </div>
                
                {plan.description && (
                  <p className="text-gray-400 text-sm">{plan.description}</p>
                )}
              </div>

              {/* Features */}
              <div className="p-6">
                <h4 className="text-white font-semibold mb-3">Características:</h4>
                <ul className="space-y-2">
                  {(Array.isArray(plan.features) ? plan.features : 
                    typeof plan.features === 'string' ? JSON.parse(plan.features) : []
                  ).map((feature, featureIndex) => (
                    <li key={featureIndex} className="flex items-center gap-2 text-gray-300">
                      <Check className="h-4 w-4 text-green-400 flex-shrink-0" />
                      <span className="text-sm">{feature}</span>
                    </li>
                  ))}
                </ul>

                {/* Subscribers count */}
                <div className="mt-4 pt-4 border-t border-gray-800">
                  <div className="flex items-center gap-2 text-gray-400">
                    <Users className="h-4 w-4" />
                    <span className="text-sm">
                      {plan.subscribers} suscriptor{plan.subscribers !== 1 ? 'es' : ''}
                    </span>
                  </div>
                </div>
              </div>

              {/* Actions */}
              <div className="p-6 pt-0">
                <div className="flex items-center gap-2">
                  <motion.button
                    onClick={() => openModal(plan)}
                    className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-lg flex items-center justify-center gap-2 transition-colors"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <Edit className="h-4 w-4" />
                    Editar
                  </motion.button>
                  <motion.button
                    onClick={() => handleDelete(plan.id)}
                    className="p-2 text-red-400 hover:bg-red-900 hover:bg-opacity-50 rounded-lg transition-colors"
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                  >
                    <Trash2 className="h-4 w-4" />
                  </motion.button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {filteredPlans.length === 0 && (
          <div className="text-center py-12">
            <Star className="h-16 w-16 text-gray-600 mx-auto mb-4" />
            <p className="text-gray-400 text-lg">No se encontraron planes</p>
          </div>
        )}
      </motion.div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <motion.div
            className="bg-gray-900 rounded-lg p-6 w-full max-w-lg max-h-[90vh] overflow-y-auto"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.3 }}
          >
            <h2 className="text-xl font-bold text-white mb-4">
              {editingPlan ? 'Editar Plan' : 'Nuevo Plan'}
            </h2>
            
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-gray-300 text-sm font-medium mb-2">
                  Nombre del Plan
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
                  Precio Mensual ($)
                </label>
                <input
                  type="number"
                  step="0.01"
                  value={formData.price}
                  onChange={(e) => setFormData({...formData, price: e.target.value})}
                  className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:border-red-600"
                  required
                />
              </div>

              <div>
                <label className="block text-gray-300 text-sm font-medium mb-2">
                  Descripción
                </label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({...formData, description: e.target.value})}
                  rows={3}
                  className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:border-red-600"
                />
              </div>

              <div>
                <label className="block text-gray-300 text-sm font-medium mb-2">
                  Características
                </label>
                {formData.features.map((feature, index) => (
                  <div key={index} className="flex items-center gap-2 mb-2">
                    <input
                      type="text"
                      value={feature}
                      onChange={(e) => updateFeature(index, e.target.value)}
                      className="flex-1 px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:border-red-600"
                      placeholder="Escriba una característica..."
                    />
                    <button
                      type="button"
                      onClick={() => removeFeature(index)}
                      className="p-2 text-red-400 hover:bg-red-900 hover:bg-opacity-50 rounded-lg"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  </div>
                ))}
                <button
                  type="button"
                  onClick={addFeature}
                  className="text-blue-400 hover:text-blue-300 text-sm flex items-center gap-1"
                >
                  <Plus className="h-4 w-4" />
                  Agregar característica
                </button>
              </div>

              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="active"
                  checked={formData.active}
                  onChange={(e) => setFormData({...formData, active: e.target.checked})}
                  className="mr-2"
                />
                <label htmlFor="active" className="text-gray-300 text-sm">
                  Plan activo
                </label>
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
                  {editingPlan ? 'Actualizar' : 'Crear'}
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      )}
    </div>
  );
};

export default PlanManagement;