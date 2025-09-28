const express = require('express');
const pool = require('../config/database');
const { authenticateToken } = require('../middleware/auth');

const router = express.Router();

// Obtener todos los planes
router.get('/', authenticateToken, async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT p.*, COUNT(c.id) as subscribers
      FROM plans p
      LEFT JOIN customers c ON p.id = c.plan_id AND c.status = 'active'
      GROUP BY p.id
      ORDER BY p.created_at DESC
    `);
    res.json(result.rows);
  } catch (error) {
    console.error('Error obteniendo planes:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
});

// Obtener plan por ID
router.get('/:id', authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;
    const result = await pool.query(`
      SELECT p.*, COUNT(c.id) as subscribers
      FROM plans p
      LEFT JOIN customers c ON p.id = c.plan_id AND c.status = 'active'
      WHERE p.id = $1
      GROUP BY p.id
    `, [id]);

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Plan no encontrado' });
    }

    res.json(result.rows[0]);
  } catch (error) {
    console.error('Error obteniendo plan:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
});

// Crear nuevo plan
router.post('/', authenticateToken, async (req, res) => {
  try {
    const { name, price, description, features, active = true } = req.body;

    if (!name || !price) {
      return res.status(400).json({ error: 'Nombre y precio requeridos' });
    }

    const result = await pool.query(`
      INSERT INTO plans (name, price, description, features, active)
      VALUES ($1, $2, $3, $4, $5)
      RETURNING *
    `, [name, price, description, JSON.stringify(features), active]);

    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error('Error creando plan:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
});

// Actualizar plan
router.put('/:id', authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;
    const { name, price, description, features, active } = req.body;

    const result = await pool.query(`
      UPDATE plans 
      SET name = $1, price = $2, description = $3, features = $4, active = $5
      WHERE id = $6
      RETURNING *
    `, [name, price, description, JSON.stringify(features), active, id]);

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Plan no encontrado' });
    }

    res.json(result.rows[0]);
  } catch (error) {
    console.error('Error actualizando plan:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
});

// Eliminar plan
router.delete('/:id', authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;
    
    // Verificar si hay clientes usando este plan
    const customersCount = await pool.query('SELECT COUNT(*) FROM customers WHERE plan_id = $1', [id]);
    
    if (parseInt(customersCount.rows[0].count) > 0) {
      return res.status(409).json({ error: 'No se puede eliminar un plan que tiene clientes asignados' });
    }

    const result = await pool.query('DELETE FROM plans WHERE id = $1 RETURNING *', [id]);

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Plan no encontrado' });
    }

    res.json({ message: 'Plan eliminado correctamente' });
  } catch (error) {
    console.error('Error eliminando plan:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
});

module.exports = router;