const express = require('express');
const router = express.Router();

const adminController = require('../controllers/admin.controller');

// Multer para imágenes
const uploadRoutineImage = require('../config/multer.config');

// Middlewares de seguridad
const { verifyToken, isAdmin } = require('../middleware/auth.middleware');

// ✔ Todas las rutas protegidas
router.use(verifyToken, isAdmin);

// =========================================================
// GESTIÓN DE USUARIOS
// =========================================================
router.get('/usuarios', adminController.getAllUsers);
router.put('/usuarios/:id/rol', adminController.updateUserRole);
router.delete('/usuarios/:id', adminController.deleteUser);

// =========================================================
// GESTIÓN DE CONTENIDO (Rutinas y Avisos)
// =========================================================

// ✔ Multer va antes del controlador
router.post(
    '/rutinas',
    uploadRoutineImage.single('image'),
    adminController.createRoutine
);

router.post('/avisos', adminController.createNotice);

// =========================================================
// CONFIG Y NOTIFICACIONES
// =========================================================
// RUTA NUEVA: Obtener la configuración actual de alertas
router.get('/config/alertas', adminController.getAlertConfig);
// Actualizar la configuración de alertas
router.put('/config/alertas', adminController.updateAlertConfig);
// Obtener clientes por expirar
router.get('/notificaciones/expiraciones', adminController.getExpiringClients);
// PUT /api/admin/config/alertas
router.put('/config/alertas', adminController.updateAlertConfig);


module.exports = router;
