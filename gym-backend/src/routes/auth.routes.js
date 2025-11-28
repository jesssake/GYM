// src/routes/auth.routes.js CORREGIDO

const express = require('express');
const router = express.Router();

// 🚨 IMPORTAR EL CONTROLADOR DE AUTENTICACIÓN
const authController = require('../controllers/auth.controller');

// =======================================================
// RUTAS DE AUTENTICACIÓN LOCAL
// =======================================================

// POST /api/auth/register  <-- ¡CORRECCIÓN APLICADA AQUÍ!
router.post('/register', authController.register);

// POST /api/auth/login
router.post('/login', authController.login);

// POST /api/auth/restablecer-solicitud (Solicitud de cambio de contraseña)
router.post('/restablecer-solicitud', authController.requestPasswordReset);

// POST /api/auth/restablecer-confirmar (Confirmación y cambio de contraseña)
router.post('/restablecer-confirmar', authController.resetPasswordConfirm);


module.exports = router;
