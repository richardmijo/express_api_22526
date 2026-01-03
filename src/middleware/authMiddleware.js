const jwt = require('jsonwebtoken');

// Middleware para verificar el token JWT
const authenticateToken = (req, res, next) => {
    // Obtenemos el header de autorización (ej: "Bearer eyJhbGci...")
    const authHeader = req.headers['authorization'];
    // Extraemos el token (si existe) separando "Bearer" del token
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) {
        return res.status(401).json({ error: 'Acceso denegado: Token no proporcionado' });
    }

    try {
        // Verificamos el token con nuestra clave secreta
        const verified = jwt.verify(token, process.env.JWT_SECRET);
        // Guardamos los datos del usuario en la request para usarlos luego
        req.user = verified;
        next(); // Continuamos a la siguiente función o ruta
    } catch (error) {
        res.status(403).json({ error: 'Token inválido' });
    }
};

module.exports = authenticateToken;
