const express = require('express');
const pool = require('../config/database');
const { authenticateToken } = require('../middleware/auth');

const router = express.Router();

// Obtener todas las ventas
router.get('/', authenticateToken, async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT s.*, c.name as customer_name, c.email as customer_email, 
             p.name as plan_name, p.price as plan_price
      FROM sales s
      LEFT JOIN customers c ON s.customer_id = c.id
      LEFT JOIN plans p ON s.plan_id = p.id
      ORDER BY s.sale_date DESC, s.created_at DESC
    `);
    res.json(result.rows);
  } catch (error) {
    console.error('Error obteniendo ventas:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
});

// Obtener reportes de ventas por fecha
router.get('/reports', authenticateToken, async (req, res) => {
  try {
    const { startDate, endDate, period = 'daily' } = req.query;
    
    let dateFormat, groupBy;
    switch (period) {
      case 'monthly':
        dateFormat = 'YYYY-MM';
        groupBy = 'DATE_TRUNC(\'month\', sale_date)';
        break;
      case 'weekly':
        dateFormat = 'YYYY-WW';
        groupBy = 'DATE_TRUNC(\'week\', sale_date)';
        break;
      default:
        dateFormat = 'YYYY-MM-DD';
        groupBy = 'sale_date';
    }

    let query = `
      SELECT ${groupBy} as period,
             COUNT(*) as total_sales,
             SUM(amount) as total_revenue,
             AVG(amount) as average_sale
      FROM sales
      WHERE status = 'completed'
    `;

    const params = [];
    if (startDate) {
      query += ' AND sale_date >= $1';
      params.push(startDate);
    }
    if (endDate) {
      const endParam = startDate ? '$2' : '$1';
      query += ` AND sale_date <= ${endParam}`;
      params.push(endDate);
    }

    query += ` GROUP BY ${groupBy} ORDER BY period DESC`;

    const result = await pool.query(query, params);
    res.json(result.rows);
  } catch (error) {
    console.error('Error obteniendo reportes:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
});

// Obtener estadísticas generales
router.get('/stats', authenticateToken, async (req, res) => {
  try {
    const today = new Date().toISOString().split('T')[0];
    const thisMonth = new Date().toISOString().slice(0, 7);

    const stats = await Promise.all([
      // Ventas del día
      pool.query('SELECT COUNT(*) as count, COALESCE(SUM(amount), 0) as total FROM sales WHERE sale_date = $1 AND status = \'completed\'', [today]),
      // Ventas del mes
      pool.query('SELECT COUNT(*) as count, COALESCE(SUM(amount), 0) as total FROM sales WHERE DATE_TRUNC(\'month\', sale_date) = DATE_TRUNC(\'month\', $1::date) AND status = \'completed\'', [today]),
      // Total de clientes activos
      pool.query('SELECT COUNT(*) as count FROM customers WHERE status = \'active\''),
      // Plan más popular
      pool.query(`
        SELECT p.name, COUNT(*) as subscribers 
        FROM customers c 
        JOIN plans p ON c.plan_id = p.id 
        WHERE c.status = 'active' 
        GROUP BY p.id, p.name 
        ORDER BY subscribers DESC 
        LIMIT 1
      `)
    ]);

    res.json({
      today: {
        sales: parseInt(stats[0].rows[0].count),
        revenue: parseFloat(stats[0].rows[0].total)
      },
      thisMonth: {
        sales: parseInt(stats[1].rows[0].count),
        revenue: parseFloat(stats[1].rows[0].total)
      },
      activeCustomers: parseInt(stats[2].rows[0].count),
      topPlan: stats[3].rows[0] || { name: 'N/A', subscribers: 0 }
    });
  } catch (error) {
    console.error('Error obteniendo estadísticas:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
});

// Crear nueva venta
router.post('/', authenticateToken, async (req, res) => {
  try {
    const { customer_id, plan_id, amount, payment_method, sale_date } = req.body;

    if (!customer_id || !plan_id || !amount) {
      return res.status(400).json({ error: 'Cliente, plan y monto requeridos' });
    }

    const result = await pool.query(`
      INSERT INTO sales (customer_id, plan_id, amount, payment_method, sale_date)
      VALUES ($1, $2, $3, $4, $5)
      RETURNING *
    `, [customer_id, plan_id, amount, payment_method, sale_date || new Date().toISOString().split('T')[0]]);

    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error('Error creando venta:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
});

// Actualizar venta
router.put('/:id', authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;
    const { customer_id, plan_id, amount, payment_method, status, sale_date } = req.body;

    const result = await pool.query(`
      UPDATE sales 
      SET customer_id = $1, plan_id = $2, amount = $3, payment_method = $4, 
          status = $5, sale_date = $6
      WHERE id = $7
      RETURNING *
    `, [customer_id, plan_id, amount, payment_method, status, sale_date, id]);

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Venta no encontrada' });
    }

    res.json(result.rows[0]);
  } catch (error) {
    console.error('Error actualizando venta:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
});

// Eliminar venta
router.delete('/:id', authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;
    const result = await pool.query('DELETE FROM sales WHERE id = $1 RETURNING *', [id]);

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Venta no encontrada' });
    }

    res.json({ message: 'Venta eliminada correctamente' });
  } catch (error) {
    console.error('Error eliminando venta:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
});

module.exports = router;