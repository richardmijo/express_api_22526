const pool = require('../config/database');

class DeviceTokenRepository {
    // Guardar o actualizar un token de dispositivo
    async saveToken(userId, token, platform) {
        // Usamos UPSERT (Insertar o Actualizar) para evitar duplicados del mismo token
        const query = `
            INSERT INTO device_tokens (user_id, token, platform, last_updated)
            VALUES ($1, $2, $3, NOW())
            ON CONFLICT (token) 
            DO UPDATE SET user_id = EXCLUDED.user_id, last_updated = NOW()
            RETURNING *;
        `;
        const result = await pool.query(query, [userId, token, platform]);
        return result.rows[0];
    }

    // Obtener tokens de un usuario específico
    async getTokensByUserId(userId) {
        const query = 'SELECT token FROM device_tokens WHERE user_id = $1';
        const result = await pool.query(query, [userId]);
        // Retornamos solo un array de strings con los tokens
        return result.rows.map(row => row.token);
    }

    // Obtener todos los tokens (para enviar a todos, opcional)
    async getAllTokens() {
        const query = 'SELECT token FROM device_tokens';
        const result = await pool.query(query);
        return result.rows.map(row => row.token);
    }
}

module.exports = new DeviceTokenRepository();
