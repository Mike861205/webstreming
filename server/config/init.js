const pool = require('../config/database');
const bcrypt = require('bcryptjs');

// Función para inicializar la base de datos
const initializeDatabase = async () => {
  try {
    // Crear tabla de administradores
    await pool.query(`
      CREATE TABLE IF NOT EXISTS admins (
        id SERIAL PRIMARY KEY,
        username VARCHAR(50) UNIQUE NOT NULL,
        password_hash VARCHAR(255) NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // Crear tabla de planes
    await pool.query(`
      CREATE TABLE IF NOT EXISTS plans (
        id SERIAL PRIMARY KEY,
        name VARCHAR(100) NOT NULL,
        price DECIMAL(10,2) NOT NULL,
        description TEXT,
        features JSONB,
        active BOOLEAN DEFAULT true,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // Crear tabla de clientes
    await pool.query(`
      CREATE TABLE IF NOT EXISTS customers (
        id SERIAL PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        phone VARCHAR(20),
        email VARCHAR(255) UNIQUE NOT NULL,
        plan_id INTEGER REFERENCES plans(id),
        status VARCHAR(20) DEFAULT 'active',
        subscription_start DATE,
        subscription_end DATE,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // Crear tabla de ventas
    await pool.query(`
      CREATE TABLE IF NOT EXISTS sales (
        id SERIAL PRIMARY KEY,
        customer_id INTEGER REFERENCES customers(id),
        plan_id INTEGER REFERENCES plans(id),
        amount DECIMAL(10,2) NOT NULL,
        sale_date DATE NOT NULL DEFAULT CURRENT_DATE,
        payment_method VARCHAR(50),
        status VARCHAR(20) DEFAULT 'completed',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // Insertar admin por defecto
    const hashedPassword = await bcrypt.hash('admin', 10);
    await pool.query(`
      INSERT INTO admins (username, password_hash) 
      VALUES ($1, $2) 
      ON CONFLICT (username) DO NOTHING
    `, ['admin', hashedPassword]);

    // Insertar planes por defecto
    await pool.query(`
      INSERT INTO plans (name, price, description, features) VALUES
      ($1, $2, $3, $4),
      ($5, $6, $7, $8),
      ($9, $10, $11, $12)
      ON CONFLICT DO NOTHING
    `, [
      'Básico', 9.99, 'Plan básico con contenido limitado', JSON.stringify(["HD Quality", "1 Device", "Limited Content"]),
      'Estándar', 14.99, 'Plan estándar con más contenido', JSON.stringify(["Full HD Quality", "2 Devices", "Full Content", "Downloads"]),
      'Premium', 19.99, 'Plan premium con todas las características', JSON.stringify(["4K Quality", "4 Devices", "Full Content", "Downloads", "Multiple Profiles"])
    ]);

    // Crear índices
    await pool.query('CREATE INDEX IF NOT EXISTS idx_customers_email ON customers(email)');
    await pool.query('CREATE INDEX IF NOT EXISTS idx_sales_date ON sales(sale_date)');
    await pool.query('CREATE INDEX IF NOT EXISTS idx_sales_customer ON sales(customer_id)');
    await pool.query('CREATE INDEX IF NOT EXISTS idx_customers_plan ON customers(plan_id)');

    console.log('✅ Base de datos inicializada correctamente');
  } catch (error) {
    console.error('❌ Error inicializando base de datos:', error);
  }
};

module.exports = { initializeDatabase };