const authService = require('../services/AuthService');

class AuthController {
    // Controlador para registrarse
    async register(req, res) {
        try {
            const { username, password } = req.body;

            // Validación básica
            if (!username || !password) {
                return res.status(400).json({ error: 'Usuario y contraseña son requeridos' });
            }

            const user = await authService.register(username, password);
            res.status(201).json({ message: 'Usuario registrado exitosamente', user });
        } catch (error) {
            // Manejamos errores específicos del servicio
            res.status(400).json({ error: error.message });
        }
    }

    // Controlador para iniciar sesión
    async login(req, res) {
        try {
            const { username, password } = req.body;

            if (!username || !password) {
                return res.status(400).json({ error: 'Usuario y contraseña son requeridos' });
            }

            const data = await authService.login(username, password);
            res.status(200).json({ message: 'Login exitoso', ...data });
        } catch (error) {
            res.status(401).json({ error: error.message });
        }
    }
}

module.exports = new AuthController();
