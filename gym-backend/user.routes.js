const express = require('express');
const router = express.Router();
const fs = require('fs');
const path = require('path');
const db = require('./db.config'); // Importamos la configuración de la base de datos

// 🚨 La URL final será http://localhost:3000/api/usuario/foto-perfil
router.put('/foto-perfil', async (req, res) => {
    // 🚨 Aquí deberías usar la autenticación (JWT) para obtener el ID real
    // Por ahora, usaremos un ID simulado:
    const userId = 'cliente@gym.com';

    const base64Data = req.body.fotoBase64;

    if (!base64Data) {
        return res.status(400).send({ message: "No se proporcionó la imagen Base64." });
    }

    try {
        // --- Procesamiento y Guardado de Archivo ---
        const base64Image = base64Data.split(';base64,').pop();
        const imageBuffer = Buffer.from(base64Image, 'base64');

        // Generar un nombre de archivo único para evitar colisiones
        const filename = `profile-${userId}-${Date.now()}.png`;
        const uploadDir = path.join(__dirname, 'uploads');
        const uploadPath = path.join(uploadDir, filename);

        // Asegurarse de que la carpeta 'uploads' exista
        if (!fs.existsSync(uploadDir)) {
            fs.mkdirSync(uploadDir, { recursive: true });
        }

        // Guardar el archivo en el disco
        fs.writeFileSync(uploadPath, imageBuffer);

        // Generar la URL pública que Angular usará para mostrar la imagen
        const publicUrl = `http://localhost:3000/uploads/${filename}`;

        // --- Actualización de la Base de Datos MySQL ---

        const sql = `UPDATE usuarios SET fotoUrl = ? WHERE email = ?`;
        await db.query(sql, [publicUrl, userId]);

        console.log(`[DB] Foto de perfil de ${userId} actualizada a: ${publicUrl}`);

        // Respuesta exitosa a Angular con la nueva URL
        res.status(200).send({
            message: "Foto de perfil subida y guardada exitosamente.",
            url: publicUrl
        });

    } catch (error) {
        console.error('❌ Error fatal en la subida de foto:', error);
        res.status(500).send({ message: "Error interno del servidor al procesar la imagen." });
    }
});

module.exports = router;
