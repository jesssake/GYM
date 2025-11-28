// src/routes/user.routes.js
const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth.middleware');
const userController = require('../controllers/user.controller');

// =========================================================
// RUTAS DE PERFIL
// =========================================================
// Obtener perfil del usuario autenticado
router.get('/profile', auth.verifyToken, userController.getProfile);

// Actualizar datos del perfil
router.put('/profile', auth.verifyToken, userController.updateProfile);

// Subir / actualizar foto de perfil (Base64)
router.put('/foto-perfil', auth.verifyToken, userController.uploadProfilePhoto);

// =========================================================
// RUTAS DE DASHBOARD DEL CLIENTE 🚨 AÑADIDAS
// =========================================================

// Obtener la rutina asignada más reciente
router.get('/rutina-asignada', auth.verifyToken, userController.getCurrentRoutine);

// Obtener los avisos generales activos
router.get('/avisos-activos', auth.verifyToken, userController.getActiveNotices);

// Obtener el estado de la membresía (plan actual y fecha de fin)
router.get('/membresia-status', auth.verifyToken, userController.getMembershipStatus);

module.exports = router;
