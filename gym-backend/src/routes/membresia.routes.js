// src/routes/membresia.routes.js
const express = require('express');
const router = express.Router();
const membresiaCtrl = require('../controllers/membresia.controller');

// Obtener la membresía actual del usuario
router.get('/actual', membresiaCtrl.getMembresiaActual);

// Obtener historial de pagos
router.get('/historial', membresiaCtrl.getHistorialPagos);

// Renovar plan de membresía
router.post('/renovar', membresiaCtrl.renovarPlan);

// Cambiar plan de membresía
router.post('/cambiar', membresiaCtrl.cambiarPlan);

module.exports = router;
