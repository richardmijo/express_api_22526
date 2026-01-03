const express = require('express');
const router = express.Router();
const notificationController = require('../controllers/NotificationController');
const authenticateToken = require('../middleware/authMiddleware');

// Middleware de autenticación para todas las rutas de notificaciones
// Así aseguramos que solo usuarios logueados puedan registrar tokens o enviar (si lo permitimos)
router.use(authenticateToken);

// POST /api/notifications/token - Registrar token
router.post('/token', notificationController.registerToken);

// POST /api/notifications/send - Enviar notificación (Endpoint de prueba o para admin)
router.post('/send', notificationController.sendNotification);

module.exports = router;
