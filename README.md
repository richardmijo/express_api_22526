# Backend Node.js Express para Flutter

Este proyecto es un backend educativo construido con Node.js y Express, diseñado para servir a una aplicación Flutter. Incluye autenticación de usuarios (JWT) y notificaciones push con Firebase Cloud Messaging (FCM).

## 🚀 Características

- **Arquitectura Limpia**: Separación de responsabilidades en Controladores, Servicios y Repositorios.
- **Autenticación**: Registro y Login de usuarios con encriptación de contraseñas (Bcrypt) y generación de Tokens (JWT).
- **Base de Datos**: PostgreSQL con script de inicialización automática.
- **Notificaciones Push**: Integración con Firebase Admin SDK para enviar mensajes a dispositivos Android/iOS/Web.

## 🛠️ Requisitos Previos

- [Node.js](https://nodejs.org/) (v14 o superior)
- [PostgreSQL](https://www.postgresql.org/)
- Una cuenta de [Firebase](https://console.firebase.google.com/)

## ⚙️ Configuración del Proyecto

### 1. Clonar e Instalar Dependencias
```bash
npm install
```

### 2. Configurar Variables de Entorno
Copia el archivo `.env.example` a `.env` y ajusta los valores:
```bash
cp .env.example .env
```
Asegúrate de configurar correctamente las credenciales de tu base de datos PostgreSQL.

### 3. Configurar Firebase (Notificaciones)
1. Ve a la Consola de Firebase > Configuración del proyecto > Cuentas de servicio.
2. Haz clic en "Generar nueva clave privada".
3. Descarga el archivo JSON y renómbralo a `serviceAccountKey.json`.
4. Coloca el archivo `serviceAccountKey.json` en la raíz del proyecto.

### 4. Inicializar Base de Datos
Ejecuta el siguiente comando para crear las tablas necesarias (`users` y `device_tokens`):
```bash
npm run db:init
```

### 5. Correr el Servidor
Modo desarrollo (con recarga automática):
```bash
npm run dev
```
Modo producción:
```bash
npm start
```

## 📡 Endpoints Principales

### Autenticación
- **POST** `/api/auth/register`: Registrar un nuevo usuario.
  - Body: `{ "username": "...", "password": "..." }`
- **POST** `/api/auth/login`: Iniciar sesión.
  - Body: `{ "username": "...", "password": "..." }`
  - Response: `{ "token": "eyJ...", "user": { ... } }`

### Notificaciones
- **POST** `/api/notifications/token`: Registrar el token FCM de un dispositivo.
  - Headers: `Authorization: Bearer <JWT_TOKEN>`
  - Body: `{ "token": "fcm_token_xyz...", "platform": "android" }`
- **POST** `/api/notifications/send`: Enviar notificación de prueba (opcional).
  - Headers: `Authorization: Bearer <JWT_TOKEN>`
  - Body: `{ "userId": 1, "title": "Hola", "body": "Mundo" }`

## 📚 Estructura del Proyecto

```
src/
├── config/         # Configuración de DB y Firebase
├── controllers/    # Manejadores de las peticiones HTTP
├── middleware/     # Middlewares (ej. Autenticación)
├── repositories/   # Acceso a datos (SQL queries)
├── routes/         # Definición de rutas de la API
├── scripts/        # Scripts de utilidad (ej. initDb)
├── services/       # Lógica de negocio
└── server.js       # Punto de entrada de la aplicación
```
