// src/config/multer.config.js
const multer = require('multer');
const path = require('path');
const fs = require('fs');

// ------------------------------------------------------------
// 1. Carpeta donde se guardarán las imágenes
// ------------------------------------------------------------
const UPLOADS_DIR = path.join(__dirname, '../public/uploads/rutinas');

// Crear directorio si no existe
if (!fs.existsSync(UPLOADS_DIR)) {
    fs.mkdirSync(UPLOADS_DIR, { recursive: true });
}

// ------------------------------------------------------------
// 2. Configuración del almacenamiento
// ------------------------------------------------------------
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, UPLOADS_DIR);
    },
    filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
        const fileExtension = path.extname(file.originalname).toLowerCase();

        cb(null, `rutina-${uniqueSuffix}${fileExtension}`);
    }
});

// ------------------------------------------------------------
// 3. Filtrar solo imágenes
// ------------------------------------------------------------
const fileFilter = (req, file, cb) => {
    if (file.mimetype.startsWith('image/')) {
        cb(null, true);
    } else {
        cb(new Error('Solo se permiten imágenes.'), false);
    }
};

// ------------------------------------------------------------
// 4. Exportamos la configuración de Multer
// ------------------------------------------------------------
const uploadRoutineImage = multer({
    storage,
    fileFilter,
    limits: { fileSize: 5 * 1024 * 1024 } // 5MB máximo
});

module.exports = uploadRoutineImage;
