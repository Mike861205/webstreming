const express = require('express');
const cors = require('cors');
const path = require('path');
require('dotenv').config();

const { initializeDatabase } = require('./config/init');
const authRoutes = require('./routes/auth');
const userRoutes = require('./routes/users');
const salesRoutes = require('./routes/sales');
const planRoutes = require('./routes/plans');

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(express.json());

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/sales', salesRoutes);
app.use('/api/plans', planRoutes);

// Servir archivos estáticos del frontend en producción
if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, '../dist')));
  
  app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '../dist/index.html'));
  });
}

// Ruta de prueba
app.get('/api/health', (req, res) => {
  res.json({ 
    message: 'StreamFlix API funcionando', 
    timestamp: new Date().toISOString() 
  });
});

// Inicializar base de datos al arrancar
initializeDatabase().then(() => {
  app.listen(PORT, () => {
    console.log(`🚀 Servidor corriendo en puerto ${PORT}`);
  });
}).catch(console.error);

module.exports = app;