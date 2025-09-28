const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { Pool } = require('pg');

// Configurar pool de conexiones
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false
  }
});

const allowCors = (fn) => async (req, res) => {
  res.setHeader('Access-Control-Allow-Credentials', true);
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
  res.setHeader(
    'Access-Control-Allow-Headers',
    'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version, Authorization'
  );

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  return await fn(req, res);
};

const handler = async (req, res) => {
  const { method } = req;

  if (method === 'POST') {
    // Login
    try {
      const { username, password } = req.body;

      if (!username || !password) {
        return res.status(400).json({ error: 'Usuario y contraseña requeridos' });
      }

      // Buscar admin en la base de datos
      const result = await pool.query(
        'SELECT * FROM admins WHERE username = $1',
        [username]
      );

      if (result.rows.length === 0) {
        return res.status(401).json({ error: 'Credenciales inválidas' });
      }

      const admin = result.rows[0];

      // Verificar contraseña
      const validPassword = await bcrypt.compare(password, admin.password_hash);
      if (!validPassword) {
        return res.status(401).json({ error: 'Credenciales inválidas' });
      }

      // Generar JWT token
      const token = jwt.sign(
        { 
          id: admin.id, 
          username: admin.username 
        },
        process.env.JWT_SECRET,
        { expiresIn: '24h' }
      );

      res.json({
        message: 'Login exitoso',
        token,
        user: {
          id: admin.id,
          username: admin.username
        }
      });
    } catch (error) {
      console.error('Error en login:', error);
      res.status(500).json({ error: 'Error interno del servidor' });
    }
  } else if (method === 'GET') {
    // Verificar token
    try {
      const authHeader = req.headers['authorization'];
      const token = authHeader && authHeader.split(' ')[1];

      if (!token) {
        return res.status(401).json({ error: 'Token de acceso requerido' });
      }

      jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
        if (err) {
          return res.status(403).json({ error: 'Token inválido' });
        }
        res.json({
          valid: true,
          user: user
        });
      });
    } catch (error) {
      console.error('Error verificando token:', error);
      res.status(500).json({ error: 'Error interno del servidor' });
    }
  } else {
    res.setHeader('Allow', ['POST', 'GET']);
    res.status(405).json({ error: `Método ${method} no permitido` });
  }
};

module.exports = allowCors(handler);