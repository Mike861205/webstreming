# Configuración para Vercel Serverless Functions

Para hacer que el backend funcione en Vercel, necesitas:

1. **Variables de Entorno en Vercel:**
   - Ve a tu proyecto en vercel.com
   - Settings > Environment Variables
   - Agrega estas variables:

```
DATABASE_URL=postgresql://neondb_owner:npg_9rEe8doIJDcF@ep-twilight-recipe-adydq0r4-pooler.c-2.us-east-1.aws.neon.tech/neondb?sslmode=require&channel_binding=require
JWT_SECRET=streamflix_production_secret_key_2024_very_secure_token
NODE_ENV=production
ADMIN_USERNAME=admin
ADMIN_PASSWORD=admin
```

2. **Estructura de archivos para Vercel:**
   - Las serverless functions van en `/api/`
   - El frontend estático va en `/dist/`

3. **Comandos de despliegue:**
   ```bash
   git add .
   git commit -m "🚀 Add admin panel with PostgreSQL integration"
   git push origin main
   ```

4. **Configuración automática:**
   - Vercel detectará automáticamente el proyecto Vite
   - Las rutas API serán manejadas por las serverless functions
   - El frontend será servido como SPA

5. **Credenciales por defecto:**
   - Usuario: admin
   - Contraseña: admin
   - IMPORTANTE: Cambia estas credenciales después del primer despliegue

6. **Panel de administración:**
   - Acceso desde el pequeño botón cuadrado junto al logo StreamFlix
   - Dashboard completo con estadísticas en tiempo real
   - Gestión de usuarios, ventas y planes
   - Reportes diarios y mensuales