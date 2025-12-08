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

// ✔ Crear rutina con imagen
router.post(
    '/rutinas',
    uploadRoutineImage.single('image'),
    adminController.createRoutine
);

// ✔ Crear aviso
router.post('/avisos', adminController.createNotice);

// 🚨 NUEVA RUTA PARA ASIGNAR RUTINA A UN USUARIO
router.post('/rutinas/asignar', adminController.assignRoutine);

// =========================================================
// CONFIGURACIÓN Y NOTIFICACIONES
// =========================================================

// Obtener configuración de alertas
router.get('/config/alertas', adminController.getAlertConfig);

// Actualizar configuración de alertas
router.put('/config/alertas', adminController.updateAlertConfig);

// Obtener clientes que están por expirar
router.get('/notificaciones/expiraciones', adminController.getExpiringClients);

module.exports = router;
