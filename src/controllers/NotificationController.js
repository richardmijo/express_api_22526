const notificationService = require('../services/NotificationService');

class NotificationController {
    // Endpoint para registrar el token FCM
    async registerToken(req, res) {
        try {
            // Asumimos que el usuario ya está autenticado y tenemos su ID (req.user.id)
            const userId = req.user.id;
            const { token, platform } = req.body;

            await notificationService.registerToken(userId, token, platform);
            res.status(200).json({ message: 'Token registrado exitosamente' });
        } catch (error) {
            res.status(400).json({ error: error.message });
        }
    }

    // Endpoint para enviar notificación (Solo para pruebas/demo o administración)
    async sendNotification(req, res) {
        try {
            const { userId, title, body, data } = req.body;

            if (!userId || !title || !body) {
                return res.status(400).json({ error: 'Faltan datos requeridos (userId, title, body)' });
            }

            const result = await notificationService.sendNotificationToUser(userId, title, body, data);
            res.status(200).json({ message: 'Proceso de envío completado', details: result });
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }
}

module.exports = new NotificationController();
