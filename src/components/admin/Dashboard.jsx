import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  Users, 
  DollarSign, 
  TrendingUp, 
  Star,
  LogOut,
  Menu,
  X,
  Play,
  Calendar,
  BarChart3
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import UserManagement from './UserManagement';
import SalesReports from './SalesReports';
import PlanManagement from './PlanManagement';

const Dashboard = () => {
  const { user, logout, api } = useAuth();
  const [activeTab, setActiveTab] = useState('dashboard');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await api.get('/sales/stats');
        setStats(response.data);
      } catch (error) {
        console.error('Error cargando estadísticas:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, [api]);

  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: BarChart3 },
    { id: 'users', label: 'Usuarios', icon: Users },
    { id: 'sales', label: 'Ventas', icon: DollarSign },
    { id: 'plans', label: 'Planes', icon: Star }
  ];

  const StatCard = ({ title, value, icon: Icon, color, subtitle }) => (
    <motion.div
      className={`bg-gray-900 rounded-lg p-6 border-l-4 ${color}`}
      whileHover={{ scale: 1.02, y: -2 }}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <div className="flex items-center justify-between">
        <div>
          <p className="text-gray-400 text-sm font-medium">{title}</p>
          <p className="text-2xl font-bold text-white mt-1">{value}</p>
          {subtitle && <p className="text-gray-500 text-xs mt-1">{subtitle}</p>}
        </div>
        <div className={`p-3 rounded-full ${color.replace('border-l-4', 'bg-opacity-20')}`}>
          <Icon className="h-6 w-6 text-red-400" />
        </div>
      </div>
    </motion.div>
  );

  const renderContent = () => {
    switch (activeTab) {
      case 'users':
        return <UserManagement />;
      case 'sales':
        return <SalesReports />;
      case 'plans':
        return <PlanManagement />;
      default:
        return (
          <div className="p-6">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5 }}
            >
              <h1 className="text-3xl font-bold text-white mb-8">Dashboard</h1>
              
              {loading ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                  {[...Array(4)].map((_, i) => (
                    <div key={i} className="bg-gray-900 rounded-lg p-6 animate-pulse">
                      <div className="h-4 bg-gray-800 rounded mb-2"></div>
                      <div className="h-8 bg-gray-800 rounded mb-1"></div>
                      <div className="h-3 bg-gray-800 rounded w-1/2"></div>
                    </div>
                  ))}
                </div>
              ) : stats ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                  <StatCard
                    title="Ventas Hoy"
                    value={stats.today.sales}
                    subtitle={`$${stats.today.revenue.toFixed(2)}`}
                    icon={Calendar}
                    color="border-l-blue-500"
                  />
                  <StatCard
                    title="Ventas Este Mes"
                    value={stats.thisMonth.sales}
                    subtitle={`$${stats.thisMonth.revenue.toFixed(2)}`}
                    icon={TrendingUp}
                    color="border-l-green-500"
                  />
                  <StatCard
                    title="Clientes Activos"
                    value={stats.activeCustomers}
                    subtitle="Suscripciones vigentes"
                    icon={Users}
                    color="border-l-purple-500"
                  />
                  <StatCard
                    title="Plan Popular"
                    value={stats.topPlan.name}
                    subtitle={`${stats.topPlan.subscribers} suscriptores`}
                    icon={Star}
                    color="border-l-red-500"
                  />
                </div>
              ) : (
                <div className="text-center py-12">
                  <p className="text-gray-400">Error cargando estadísticas</p>
                </div>
              )}

              <div className="bg-gray-900 rounded-lg p-6">
                <h2 className="text-xl font-semibold text-white mb-4">Resumen del Sistema</h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="text-center">
                    <div className="bg-blue-900 bg-opacity-50 rounded-full p-4 w-16 h-16 mx-auto mb-3">
                      <Users className="h-8 w-8 text-blue-400" />
                    </div>
                    <h3 className="text-lg font-semibold text-white">Gestión de Usuarios</h3>
                    <p className="text-gray-400 text-sm">Administra clientes y suscripciones</p>
                  </div>
                  <div className="text-center">
                    <div className="bg-green-900 bg-opacity-50 rounded-full p-4 w-16 h-16 mx-auto mb-3">
                      <DollarSign className="h-8 w-8 text-green-400" />
                    </div>
                    <h3 className="text-lg font-semibold text-white">Reportes de Ventas</h3>
                    <p className="text-gray-400 text-sm">Análisis diarios y mensuales</p>
                  </div>
                  <div className="text-center">
                    <div className="bg-red-900 bg-opacity-50 rounded-full p-4 w-16 h-16 mx-auto mb-3">
                      <Star className="h-8 w-8 text-red-400" />
                    </div>
                    <h3 className="text-lg font-semibold text-white">Planes de Servicio</h3>
                    <p className="text-gray-400 text-sm">Configuración de planes y precios</p>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        );
    }
  };

  return (
    <div className="min-h-screen bg-black flex">
      {/* Sidebar */}
      <motion.div
        className={`fixed inset-y-0 left-0 z-50 w-64 bg-gray-900 transform ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        } lg:translate-x-0 lg:static lg:inset-0 transition-transform duration-300 ease-in-out`}
        initial={{ x: -256 }}
        animate={{ x: sidebarOpen ? 0 : -256 }}
        transition={{ duration: 0.3 }}
      >
        <div className="flex items-center justify-between h-16 px-6 bg-gray-800">
          <div className="flex items-center gap-2">
            <Play className="h-8 w-8 text-red-600" />
            <span className="text-xl font-bold text-white">StreamFlix</span>
          </div>
          <button
            onClick={() => setSidebarOpen(false)}
            className="lg:hidden text-gray-400 hover:text-white"
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        <nav className="mt-8">
          {menuItems.map((item) => {
            const Icon = item.icon;
            return (
              <motion.button
                key={item.id}
                onClick={() => {
                  setActiveTab(item.id);
                  setSidebarOpen(false);
                }}
                className={`w-full flex items-center gap-3 px-6 py-3 text-left transition-colors ${
                  activeTab === item.id
                    ? 'bg-red-600 text-white'
                    : 'text-gray-300 hover:bg-gray-800 hover:text-white'
                }`}
                whileHover={{ x: 4 }}
                whileTap={{ scale: 0.98 }}
              >
                <Icon className="h-5 w-5" />
                {item.label}
              </motion.button>
            );
          })}
        </nav>

        <div className="absolute bottom-0 w-full p-6">
          <div className="bg-gray-800 rounded-lg p-4 mb-4">
            <p className="text-gray-300 text-sm">Conectado como:</p>
            <p className="text-white font-semibold">{user?.username}</p>
          </div>
          <motion.button
            onClick={logout}
            className="w-full flex items-center gap-3 px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <LogOut className="h-5 w-5" />
            Cerrar Sesión
          </motion.button>
        </div>
      </motion.div>

      {/* Main Content */}
      <div className="flex-1 lg:ml-0">
        {/* Top Bar */}
        <div className="bg-gray-900 h-16 flex items-center justify-between px-6 lg:hidden">
          <button
            onClick={() => setSidebarOpen(true)}
            className="text-gray-400 hover:text-white"
          >
            <Menu className="h-6 w-6" />
          </button>
          <div className="flex items-center gap-2">
            <Play className="h-6 w-6 text-red-600" />
            <span className="text-lg font-bold text-white">StreamFlix</span>
          </div>
        </div>

        {/* Content */}
        <div className="min-h-screen bg-black">
          {renderContent()}
        </div>
      </div>

      {/* Overlay for mobile */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}
    </div>
  );
};

export default Dashboard;