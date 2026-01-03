const express = require('express');
const router = express.Router();
const notificationController = require('../controllers/NotificationController');
const authenticateToken = require('../middleware/authMiddleware');

// Middleware de autenticación para todas las rutas de notificaciones
// Así aseguramos que solo usuarios logueados puedan registrar tokens o enviar (si lo permitimos)
router.use(authenticateToken);

/**
 * @swagger
 * tags:
 *   name: Notifications
 *   description: Gestión de Notificaciones Push
 */

/**
 * @swagger
 * /api/notifications/token:
 *   post:
 *     summary: Registrar token FCM
 *     tags: [Notifications]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - token
 *             properties:
 *               token:
 *                 type: string
 *                 description: Token FCM del dispositivo
 *               platform:
 *                 type: string
 *                 description: android, ios, web
 *     responses:
 *       200:
 *         description: Token registrado
 *       401:
 *         description: No autorizado
 */
router.post('/token', notificationController.registerToken);

/**
 * @swagger
 * /api/notifications/send:
 *   post:
 *     summary: Enviar notificación push (Solo Admin/Demo)
 *     tags: [Notifications]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - userId
 *               - title
 *               - body
 *             properties:
 *               userId:
 *                 type: integer
 *               title:
 *                 type: string
 *               body:
 *                 type: string
 *               image:
 *                 type: string
 *                 description: URL de imagen para mostrar en la notificación
 *               data:
 *                 type: object
 *     responses:
 *       200:
 *         description: Notificación enviada
 *       400:
 *         description: Datos faltantes
 */
router.post('/send', notificationController.sendNotification);

module.exports = router;
