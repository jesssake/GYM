// src/routes/user.routes.js
const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth.middleware');
const userController = require('../controllers/user.controller');

// =========================================================
// PERFIL
// =========================================================
router.get('/profile', auth.verifyToken, userController.getProfile);
router.put('/profile', auth.verifyToken, userController.updateProfile);
router.put('/foto-perfil', auth.verifyToken, userController.uploadProfilePhoto);

// =========================================================
// RUTINAS DEL CLIENTE
// =========================================================
router.get('/rutina-asignada', auth.verifyToken, userController.getCurrentRoutine);
router.get('/rutina-detalles', auth.verifyToken, userController.getRoutineDetails);

// =========================================================
// ACTIVIDADES EXTRAS
// =========================================================
router.get('/actividades', auth.verifyToken, userController.getExtraActivities);

// =========================================================
// RECOMENDACIONES
// =========================================================
router.get('/recomendaciones', auth.verifyToken, userController.getRecommendations);

// =========================================================
// AVISOS DEL CLIENTE
// =========================================================
router.get('/avisos-activos', auth.verifyToken, userController.getActiveNotices);

// =========================================================
// MEMBRESÍA
// =========================================================
router.get('/membresia-status', auth.verifyToken, userController.getMembershipStatus);

// =========================================================
// BUSQUEDA USUARIOS (ADMIN)
// =========================================================
router.get('/buscar', auth.verifyToken, userController.searchUsers);

module.exports = router;
