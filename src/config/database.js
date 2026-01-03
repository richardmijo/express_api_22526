const { Pool } = require('pg');
const dotenv = require('dotenv');

// Cargar variables de entorno desde el archivo .env
dotenv.config();

// Configuración de la conexión a la base de datos PostgreSQL
const pool = new Pool({
  user: process.env.DB_USER || 'postgres',
  host: process.env.DB_HOST || 'localhost',
  database: process.env.DB_NAME || 'my_database',
  password: process.env.DB_PASSWORD || 'password',
  port: process.env.DB_PORT || 5432,
});

// Evento para verificar la conexión exitosa
pool.on('connect', () => {
    console.log('Base de datos conectada exitosamente');
});

// Manejo de errores en la conexión
pool.on('error', (err) => {
    console.error('Error inesperado e el cliente inactivo', err);
    process.exit(-1);
});

module.exports = pool;
