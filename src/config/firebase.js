const admin = require('firebase-admin');
const dotenv = require('dotenv');

dotenv.config();

// Configuración de Firebase Admin SDK
// Nota: Necesitas el archivo serviceAccountKey.json descargado desde la consola de Firebase
// PROJECT SETTINGS -> SERVICE ACCOUNTS -> GENERATE NEW PRIVATE KEY
try {
    const serviceAccount = require('../../serviceAccountKey.json'); // Ajusta la ruta si es necesario

    admin.initializeApp({
        credential: admin.credential.cert(serviceAccount)
    });
    console.log('Firebase Admin inicializado correctamente');
} catch (error) {
    console.warn('Advertencia: No se pudo inicializar Firebase. Asegúrate de tener serviceAccountKey.json');
    console.warn(error.message);
}

module.exports = admin;
