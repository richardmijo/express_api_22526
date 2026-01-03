const express = require('express');
const router = express.Router();
const authController = require('../controllers/AuthController');

// Definición de las rutas de autenticación
// POST /api/auth/register
router.post('/register', authController.register);

// POST /api/auth/login
router.post('/login', authController.login);

module.exports = router;
