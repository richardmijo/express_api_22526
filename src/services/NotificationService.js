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
    async sendNotificationToUser(userId, title, body, data = {}, image = null) {
        // 1. Obtener los tokens del usuario
        const tokens = await deviceTokenRepository.getTokensByUserId(userId);

        if (tokens.length === 0) {
            console.log(`El usuario ${userId} no tiene dispositivos registrados.`);
            return { success: 0, failure: 0, message: 'Usuario sin dispositivos' };
        }

        // 3. Enviar a través de Firebase Admin
        try {
            if (!admin.apps.length) {
                console.warn('Firebase no inicializado correctamente. Simulando envío.');
                return { success: 0, failure: 0, message: 'Firebase no inicializado (Simulado)' };
            }

            // Usamos sendEachForMulticast que es la recomendación actual.
            console.log(`Intentando enviar a ${tokens.length} dispositivos...`);

            const response = await admin.messaging().sendEachForMulticast({
                tokens: tokens,
                notification: {
                    title: title,
                    body: body
                },
                data: data
            });

            console.log(`Notificación enviada: ${response.successCount} éxitos, ${response.failureCount} fallos.`);
            return response;
        } catch (error) {
            console.error('Error enviando notificación:', error);
            return { success: 0, failure: 0, error: error.message };
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
