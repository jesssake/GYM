// src/middleware/admin.middleware.js

const { verifyToken, isAdmin } = require('./auth.middleware');

// Middleware combinado para rutas solo de Administrador
module.exports = (req, res, next) => {
    // Primero verificamos el Token
    verifyToken(req, res, () => {
        // Luego verificamos si es administrador
        isAdmin(req, res, next);
    });
};
