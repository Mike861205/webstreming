-- StreamFlix Database Schema
-- Ejecutar en Neon PostgreSQL Console

-- Tabla de administradores
CREATE TABLE IF NOT EXISTS admins (
    id SERIAL PRIMARY KEY,
    username VARCHAR(50) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Tabla de planes de streaming
CREATE TABLE IF NOT EXISTS plans (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    price DECIMAL(10,2) NOT NULL,
    description TEXT,
    features JSONB,
    active BOOLEAN DEFAULT true,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Tabla de clientes/usuarios de streaming
CREATE TABLE IF NOT EXISTS customers (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    phone VARCHAR(20),
    email VARCHAR(255) UNIQUE NOT NULL,
    plan_id INTEGER REFERENCES plans(id),
    status VARCHAR(20) DEFAULT 'active', -- active, inactive, suspended
    subscription_start DATE,
    subscription_end DATE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Tabla de ventas
CREATE TABLE IF NOT EXISTS sales (
    id SERIAL PRIMARY KEY,
    customer_id INTEGER REFERENCES customers(id),
    plan_id INTEGER REFERENCES plans(id),
    amount DECIMAL(10,2) NOT NULL,
    sale_date DATE NOT NULL DEFAULT CURRENT_DATE,
    payment_method VARCHAR(50),
    status VARCHAR(20) DEFAULT 'completed', -- completed, pending, failed
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Insertar admin por defecto
INSERT INTO admins (username, password_hash) 
VALUES ('admin', '$2b$10$8K1p/a0dF2gZ6H3rEz5bIeTUHGfR9lXzb8d2J4f1h5L9Pq3rSt7u8v') -- admin
ON CONFLICT (username) DO NOTHING;

-- Insertar planes por defecto
INSERT INTO plans (name, price, description, features) VALUES
('Básico', 9.99, 'Plan básico con contenido limitado', '["HD Quality", "1 Device", "Limited Content"]'),
('Estándar', 14.99, 'Plan estándar con más contenido', '["Full HD Quality", "2 Devices", "Full Content", "Downloads"]'),
('Premium', 19.99, 'Plan premium con todas las características', '["4K Quality", "4 Devices", "Full Content", "Downloads", "Multiple Profiles"]')
ON CONFLICT DO NOTHING;

-- Crear índices para optimización
CREATE INDEX IF NOT EXISTS idx_customers_email ON customers(email);
CREATE INDEX IF NOT EXISTS idx_sales_date ON sales(sale_date);
CREATE INDEX IF NOT EXISTS idx_sales_customer ON sales(customer_id);
CREATE INDEX IF NOT EXISTS idx_customers_plan ON customers(plan_id);