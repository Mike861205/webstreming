const express = require('express');
const pool = require('../config/database');
const { authenticateToken } = require('../middleware/auth');

const router = express.Router();

// Obtener todos los clientes
router.get('/', authenticateToken, async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT c.*, p.name as plan_name, p.price as plan_price
      FROM customers c
      LEFT JOIN plans p ON c.plan_id = p.id
      ORDER BY c.created_at DESC
    `);
    res.json(result.rows);
  } catch (error) {
    console.error('Error obteniendo clientes:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
});

// Obtener cliente por ID
router.get('/:id', authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;
    const result = await pool.query(`
      SELECT c.*, p.name as plan_name, p.price as plan_price
      FROM customers c
      LEFT JOIN plans p ON c.plan_id = p.id
      WHERE c.id = $1
    `, [id]);

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Cliente no encontrado' });
    }

    res.json(result.rows[0]);
  } catch (error) {
    console.error('Error obteniendo cliente:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
});

// Crear nuevo cliente
router.post('/', authenticateToken, async (req, res) => {
  try {
    const { name, phone, email, plan_id, subscription_start, subscription_end } = req.body;

    if (!name || !email) {
      return res.status(400).json({ error: 'Nombre y email requeridos' });
    }

    const result = await pool.query(`
      INSERT INTO customers (name, phone, email, plan_id, subscription_start, subscription_end)
      VALUES ($1, $2, $3, $4, $5, $6)
      RETURNING *
    `, [name, phone, email, plan_id, subscription_start, subscription_end]);

    res.status(201).json(result.rows[0]);
  } catch (error) {
    if (error.code === '23505') { // Unique violation
      return res.status(409).json({ error: 'El email ya está en uso' });
    }
    console.error('Error creando cliente:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
});

// Actualizar cliente
router.put('/:id', authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;
    const { name, phone, email, plan_id, status, subscription_start, subscription_end } = req.body;

    const result = await pool.query(`
      UPDATE customers 
      SET name = $1, phone = $2, email = $3, plan_id = $4, status = $5, 
          subscription_start = $6, subscription_end = $7, updated_at = CURRENT_TIMESTAMP
      WHERE id = $8
      RETURNING *
    `, [name, phone, email, plan_id, status, subscription_start, subscription_end, id]);

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Cliente no encontrado' });
    }

    res.json(result.rows[0]);
  } catch (error) {
    console.error('Error actualizando cliente:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
});

// Eliminar cliente
router.delete('/:id', authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;
    const result = await pool.query('DELETE FROM customers WHERE id = $1 RETURNING *', [id]);

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Cliente no encontrado' });
    }

    res.json({ message: 'Cliente eliminado correctamente' });
  } catch (error) {
    console.error('Error eliminando cliente:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
});

module.exports = router;