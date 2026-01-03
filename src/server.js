const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const authRoutes = require('./routes/authRoutes');
const notificationRoutes = require('./routes/notificationRoutes');

// Cargar variables de entorno
dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors()); // Habilitar CORS para permitir peticiones desde Flutter (u otros orígenes)
app.use(express.json()); // Parsear el cuerpo de las peticiones a JSON

// Rutas
app.use('/api/auth', authRoutes);
app.use('/api/notifications', notificationRoutes);

// Ruta base de prueba
app.get('/', (req, res) => {
    res.send('Backend Express para Flutter funcionando 🚀');
});

// Manejo de errores global
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ error: 'Algo salió mal en el servidor!' });
});

// Iniciar el servidor
app.listen(PORT, () => {
    console.log(`Servidor corriendo en el puerto ${PORT}`);
    console.log(`Endpoint Auth: http://localhost:${PORT}/api/auth`);
    console.log(`Endpoint Notificaciones: http://localhost:${PORT}/api/notifications`);
});
