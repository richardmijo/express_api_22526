const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const userRepository = require('../repositories/UserRepository');

class AuthService {
    // Registro de usuarios
    async register(username, password) {
        // 1. Verificar si el usuario ya existe
        const existingUser = await userRepository.findByUsername(username);
        if (existingUser) {
            throw new Error('El nombre de usuario ya está en uso');
        }

        // 2. Encriptar la contraseña
        // El 'salt' (sal) añade aleatoriedad al hash para hacerlo más seguro
        const salt = await bcrypt.genSalt(10);
        const passwordHash = await bcrypt.hash(password, salt);

        // 3. Crear el usuario en la base de datos
        const newUser = await userRepository.create(username, passwordHash);
        return newUser;
    }

    // Login de usuarios
    async login(username, password) {
        // 1. Buscar el usuario
        const user = await userRepository.findByUsername(username);
        if (!user) {
            throw new Error('Credenciales inválidas');
        }

        // 2. Comparar la contraseña ingresada con el hash guardado
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            throw new Error('Credenciales inválidas');
        }

        // 3. Generar el token JWT
        // El token contendrá el ID del usuario y expirará en 24 horas
        const token = jwt.sign(
            { id: user.id, username: user.username },
            process.env.JWT_SECRET,
            { expiresIn: '24h' }
        );

        return { user: { id: user.id, username: user.username }, token };
    }
}

module.exports = new AuthService();
