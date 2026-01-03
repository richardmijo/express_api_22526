const fs = require('fs');
const path = require('path');
const pool = require('../config/database');

async function initDb() {
    try {
        // Leer el archivo SQL
        const sqlPath = path.join(__dirname, '../../init.sql');
        const sql = fs.readFileSync(sqlPath, 'utf8');

        console.log('Ejecutando script de inicialización de base de datos...');
        await pool.query(sql);
        console.log('Tablas creadas exitosamente.');
    } catch (error) {
        console.error('Error inicializando la base de datos:', error);
    } finally {
        await pool.end();
    }
}

initDb();
