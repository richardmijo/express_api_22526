const pool = require('../config/database');

class UserRepository {
    // Buscar un usuario por su nombre de usuario
    async findByUsername(username) {
        // Consultamos la base de datos buscando el usuario
        // $1 es el placeholder para evitar inyecciones SQL
        const query = 'SELECT * FROM users WHERE username = $1';
        const result = await pool.query(query, [username]);
        return result.rows[0]; // Retorna el primer usuario encontrado o undefined
    }

    // Crear un nuevo usuario
    async create(username, passwordHash) {
        // Insertamos el usuario con el nombre y la contraseña encriptada
        const query = 'INSERT INTO users (username, password) VALUES ($1, $2) RETURNING id, username, created_at';
        const result = await pool.query(query, [username, passwordHash]);
        return result.rows[0]; // Retorna el usuario creado sin la contraseña
    }

    // Buscar usuario por ID (útil para verificar tokens)
    async findById(id) {
        const query = 'SELECT id, username, created_at FROM users WHERE id = $1';
        const result = await pool.query(query, [id]);
        return result.rows[0];
    }
}

module.exports = new UserRepository();
