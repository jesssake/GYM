// src/middleware/auth.middleware.js
const jwt = require('jsonwebtoken');

// -------------------------------------------------------------------
// 1. Verifica el token enviado en "Authorization: Bearer TOKEN"
// -------------------------------------------------------------------
exports.verifyToken = (req, res, next) => {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).json({
            ok: false,
            msg: 'Acceso denegado. Falta el Token.'
        });
    }

    const token = authHeader.split(' ')[1];

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        // Guardamos el usuario decodificado en req.user
        req.user = {
            id: decoded.id,
            rol: decoded.rol
        };

        next();
    } catch (err) {
        console.error('❌ Error verificando Token:', err.message);
        return res.status(401).json({
            ok: false,
            msg: 'Token inválido o expirado.'
        });
    }
};

// -------------------------------------------------------------------
// 2. Verifica que el usuario sea Administrador
// -------------------------------------------------------------------
exports.isAdmin = (req, res, next) => {
    if (!req.user || !req.user.rol) {
        return res.status(401).json({
            ok: false,
            msg: 'No se encontró información del usuario en el token.'
        });
    }

    if (req.user.rol !== 'Administrador') {
        return res.status(403).json({
            ok: false,
            msg: 'Acceso denegado. Se requiere rol Administrador.'
        });
    }

    next();
};
