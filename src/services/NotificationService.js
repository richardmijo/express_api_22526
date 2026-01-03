const admin = require('../config/firebase');
const deviceTokenRepository = require('../repositories/DeviceTokenRepository');

class NotificationService {
    // Registrar el token de un dispositivo para un usuario
    async registerToken(userId, token, platform) {
        if (!token) {
            throw new Error('El token es requerido');
        }
        return await deviceTokenRepository.saveToken(userId, token, platform);
    }

    // Enviar una notificación a un usuario específico
    async sendNotificationToUser(userId, title, body, data = {}) {
        // 1. Obtener los tokens del usuario
        const tokens = await deviceTokenRepository.getTokensByUserId(userId);

        if (tokens.length === 0) {
            console.log(`El usuario ${userId} no tiene dispositivos registrados.`);
            return { success: 0, failure: 0, message: 'Usuario sin dispositivos' };
        }

        // 2. Construir el mensaje
        const message = {
            notification: {
                title: title,
                body: body
            },
            data: data, // Datos adicionales opcionales
            tokens: tokens // Enviamos a todos los tokens del usuario (Multicast)
        };

        try {
            // 3. Enviar a través de Firebase Admin
            // sendMulticast envía a múltiples tokens a la vez
            const response = await admin.messaging().sendMulticast(message);
            console.log(`Notificación enviada: ${response.successCount} éxitos, ${response.failureCount} fallos.`);

            // Aquí podríamos manejar los tokens inválidos (response.responses[i].error) y borrarlos de la BD

            return response;
        } catch (error) {
            console.error('Error enviando notificación:', error);
            throw new Error('Falló el envío de la notificación');
        }
    }

    // Enviar notificación a todos los dispositivos (Broadcast) - Opcional/Demo
    async sendGlobalNotification(title, body) {
        const tokens = await deviceTokenRepository.getAllTokens();
        if (tokens.length === 0) return;

        const message = {
            notification: { title, body },
            tokens: tokens
        };

        return await admin.messaging().sendMulticast(message);
    }
}

module.exports = new NotificationService();
