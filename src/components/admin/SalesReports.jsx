import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  Calendar, 
  TrendingUp, 
  DollarSign, 
  BarChart3,
  Download,
  Filter
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

const SalesReports = () => {
  const { api } = useAuth();
  const [sales, setSales] = useState([]);
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [period, setPeriod] = useState('daily');
  const [startDate, setStartDate] = useState(
    new Date(new Date().setDate(new Date().getDate() - 30)).toISOString().split('T')[0]
  );
  const [endDate, setEndDate] = useState(new Date().toISOString().split('T')[0]);

  useEffect(() => {
    fetchSales();
    fetchReports();
  }, [period, startDate, endDate]);

  const fetchSales = async () => {
    try {
      const response = await api.get('/sales');
      setSales(response.data);
    } catch (error) {
      console.error('Error cargando ventas:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchReports = async () => {
    try {
      const params = new URLSearchParams({
        period,
        startDate,
        endDate
      });
      const response = await api.get(`/sales/reports?${params}`);
      setReports(response.data);
    } catch (error) {
      console.error('Error cargando reportes:', error);
    }
  };

  const getTotalRevenue = () => {
    return reports.reduce((total, report) => total + parseFloat(report.total_revenue || 0), 0);
  };

  const getTotalSales = () => {
    return reports.reduce((total, report) => total + parseInt(report.total_sales || 0), 0);
  };

  const getAverageSale = () => {
    const total = getTotalRevenue();
    const count = getTotalSales();
    return count > 0 ? total / count : 0;
  };

  const formatPeriod = (periodStr) => {
    const date = new Date(periodStr);
    switch (period) {
      case 'monthly':
        return date.toLocaleDateString('es-ES', { year: 'numeric', month: 'long' });
      case 'weekly':
        return `Semana del ${date.toLocaleDateString('es-ES')}`;
      default:
        return date.toLocaleDateString('es-ES');
    }
  };

  if (loading) {
    return (
      <div className="p-6">
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-gray-800 rounded w-1/4"></div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="h-32 bg-gray-800 rounded"></div>
            ))}
          </div>
          <div className="h-64 bg-gray-800 rounded"></div>
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
          <h1 className="text-3xl font-bold text-white">Reportes de Ventas</h1>
          <motion.button
            className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Download className="h-5 w-5" />
            Exportar
          </motion.button>
        </div>

        {/* Filters */}
        <div className="bg-gray-900 rounded-lg p-4 mb-6">
          <div className="flex items-center gap-4 flex-wrap">
            <div className="flex items-center gap-2">
              <Filter className="h-5 w-5 text-gray-400" />
              <span className="text-gray-300">Filtros:</span>
            </div>
            
            <select
              value={period}
              onChange={(e) => setPeriod(e.target.value)}
              className="px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:border-red-600"
            >
              <option value="daily">Diario</option>
              <option value="weekly">Semanal</option>
              <option value="monthly">Mensual</option>
            </select>

            <input
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              className="px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:border-red-600"
            />

            <input
              type="date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              className="px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:border-red-600"
            />
          </div>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
          <motion.div
            className="bg-gray-900 rounded-lg p-6 border-l-4 border-l-green-500"
            whileHover={{ scale: 1.02 }}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-sm font-medium">Ingresos Total</p>
                <p className="text-2xl font-bold text-white">${getTotalRevenue().toFixed(2)}</p>
              </div>
              <div className="p-3 bg-green-900 bg-opacity-50 rounded-full">
                <DollarSign className="h-6 w-6 text-green-400" />
              </div>
            </div>
          </motion.div>

          <motion.div
            className="bg-gray-900 rounded-lg p-6 border-l-4 border-l-blue-500"
            whileHover={{ scale: 1.02 }}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-sm font-medium">Total Ventas</p>
                <p className="text-2xl font-bold text-white">{getTotalSales()}</p>
              </div>
              <div className="p-3 bg-blue-900 bg-opacity-50 rounded-full">
                <BarChart3 className="h-6 w-6 text-blue-400" />
              </div>
            </div>
          </motion.div>

          <motion.div
            className="bg-gray-900 rounded-lg p-6 border-l-4 border-l-purple-500"
            whileHover={{ scale: 1.02 }}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-sm font-medium">Venta Promedio</p>
                <p className="text-2xl font-bold text-white">${getAverageSale().toFixed(2)}</p>
              </div>
              <div className="p-3 bg-purple-900 bg-opacity-50 rounded-full">
                <TrendingUp className="h-6 w-6 text-purple-400" />
              </div>
            </div>
          </motion.div>
        </div>

        {/* Reports Table */}
        <div className="bg-gray-900 rounded-lg overflow-hidden mb-6">
          <div className="p-4 bg-gray-800 border-b border-gray-700">
            <h2 className="text-lg font-semibold text-white">Reporte por Período</h2>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-800">
                <tr>
                  <th className="px-6 py-4 text-left text-gray-300 font-semibold">Período</th>
                  <th className="px-6 py-4 text-left text-gray-300 font-semibold">Ventas</th>
                  <th className="px-6 py-4 text-left text-gray-300 font-semibold">Ingresos</th>
                  <th className="px-6 py-4 text-left text-gray-300 font-semibold">Promedio</th>
                </tr>
              </thead>
              <tbody>
                {reports.map((report, index) => (
                  <motion.tr
                    key={report.period}
                    className="border-t border-gray-800 hover:bg-gray-800 transition-colors"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                  >
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <Calendar className="h-4 w-4 text-gray-400" />
                        <span className="text-white">{formatPeriod(report.period)}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-white">{report.total_sales}</td>
                    <td className="px-6 py-4 text-green-400 font-semibold">
                      ${parseFloat(report.total_revenue).toFixed(2)}
                    </td>
                    <td className="px-6 py-4 text-white">
                      ${parseFloat(report.average_sale).toFixed(2)}
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>
          
          {reports.length === 0 && (
            <div className="text-center py-8 text-gray-400">
              No hay datos para el período seleccionado
            </div>
          )}
        </div>

        {/* Recent Sales */}
        <div className="bg-gray-900 rounded-lg overflow-hidden">
          <div className="p-4 bg-gray-800 border-b border-gray-700">
            <h2 className="text-lg font-semibold text-white">Ventas Recientes</h2>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-800">
                <tr>
                  <th className="px-6 py-4 text-left text-gray-300 font-semibold">Cliente</th>
                  <th className="px-6 py-4 text-left text-gray-300 font-semibold">Plan</th>
                  <th className="px-6 py-4 text-left text-gray-300 font-semibold">Monto</th>
                  <th className="px-6 py-4 text-left text-gray-300 font-semibold">Fecha</th>
                  <th className="px-6 py-4 text-left text-gray-300 font-semibold">Estado</th>
                </tr>
              </thead>
              <tbody>
                {sales.slice(0, 10).map((sale, index) => (
                  <motion.tr
                    key={sale.id}
                    className="border-t border-gray-800 hover:bg-gray-800 transition-colors"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.05 }}
                  >
                    <td className="px-6 py-4">
                      <div className="text-white">{sale.customer_name}</div>
                      <div className="text-gray-400 text-sm">{sale.customer_email}</div>
                    </td>
                    <td className="px-6 py-4 text-white">{sale.plan_name}</td>
                    <td className="px-6 py-4">
                      <span className="text-green-400 font-semibold">
                        ${parseFloat(sale.amount).toFixed(2)}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-gray-400">
                      {new Date(sale.sale_date).toLocaleDateString('es-ES')}
                    </td>
                    <td className="px-6 py-4">
                      <span className={`px-2 py-1 rounded-full text-xs ${
                        sale.status === 'completed' 
                          ? 'bg-green-900 text-green-400 border border-green-700'
                          : sale.status === 'pending'
                          ? 'bg-yellow-900 text-yellow-400 border border-yellow-700'
                          : 'bg-red-900 text-red-400 border border-red-700'
                      }`}>
                        {sale.status}
                      </span>
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>
          
          {sales.length === 0 && (
            <div className="text-center py-8 text-gray-400">
              No hay ventas registradas
            </div>
          )}
        </div>
      </motion.div>
    </div>
  );
};

export default SalesReports;