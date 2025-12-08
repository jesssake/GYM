// 📄 src/routes/notifications.routes.js
const express = require('express');
const router = express.Router();
const adminController = require('../controllers/admin.controller');

// 🚨 CORRECCIÓN CLAVE: Usamos '..' para subir un nivel (de routes a src)
// y luego bajamos a la carpeta 'middlewares' (ya renombrada)
const { verifyToken, isAdmin } = require('../middleware/auth.middleware');

// Mapear rutas de notificaciones (que usan funciones de admin.controller)
router.use(verifyToken, isAdmin);
router.get('/config', adminController.getAlertConfig);
router.put('/config', adminController.updateAlertConfig);
router.get('/expiring', adminController.getExpiringClients);

module.exports = router;
