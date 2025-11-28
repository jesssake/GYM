const db = require('../db.config');
const fs = require('fs');
const path = require('path');

// =========================================================
// 1. OBTENER PERFIL (getProfile)
// =========================================================
exports.getProfile = async (req, res) => {
    const userId = req.userId;

    try {
        const query = `
            SELECT id, nombre, email, rol, fechaNacimiento, peso, altura, meta, fotoUrl
            FROM users
            WHERE id = ?
        `;
        const [rows] = await db.query(query, [userId]);

        if (rows.length === 0) {
            return res.status(404).json({ ok: false, msg: 'Usuario no encontrado.' });
        }

        res.json({ ok: true, user: rows[0] });

    } catch (err) {
        console.error("Error al obtener perfil:", err);
        res.status(500).json({ ok: false, msg: 'Error del servidor al obtener el perfil.' });
    }
};


// =========================================================
// 2. ACTUALIZAR PERFIL (updateProfile) 🚨 FUNCIÓN FALTANTE
// =========================================================
exports.updateProfile = async (req, res) => {
    const userId = req.userId;
    const { nombre, fechaNacimiento, peso, altura, meta } = req.body;

    try {
        const query = `
            UPDATE users SET
                nombre = ?,
                fechaNacimiento = ?,
                peso = ?,
                altura = ?,
                meta = ?
            WHERE id = ?
        `;
        const [result] = await db.query(query, [
            nombre,
            fechaNacimiento,
            peso,
            altura,
            meta,
            userId
        ]);

        if (result.affectedRows === 0) {
            return res.status(404).json({ ok: false, msg: 'Usuario no encontrado o no hay cambios que aplicar.' });
        }

        res.json({ ok: true, msg: 'Datos de perfil actualizados correctamente.' });

    } catch (err) {
        console.error("Error al actualizar perfil:", err);
        res.status(500).json({ ok: false, msg: 'Error del servidor al actualizar el perfil.' });
    }
};


// =========================================================
// 3. SUBIR FOTO DE PERFIL (uploadProfilePhoto) 🚨 FUNCIÓN FALTANTE
// =========================================================
exports.uploadProfilePhoto = async (req, res) => {
    const userId = req.userId;
    const { fotoBase64 } = req.body;

    if (!fotoBase64) {
        return res.status(400).json({ ok: false, msg: 'No se recibió la imagen Base64.' });
    }

    try {
        const matches = fotoBase64.match(/^data:([A-Za-z-+/]+);base64,(.+)$/);

        if (!matches || matches.length !== 3) {
            return res.status(400).json({ ok: false, msg: 'Formato Base64 inválido.' });
        }

        const imageType = matches[1];
        const base64Data = matches[2];
        const fileExtension = imageType.split('/')[1];

        const fileName = `${userId}-${Date.now()}.${fileExtension}`;
        const filePath = path.join(__dirname, '..', '..', 'uploads', 'profile_photos', fileName);

        fs.writeFileSync(filePath, Buffer.from(base64Data, 'base64'));

        const publicUrl = `/uploads/profile_photos/${fileName}`;

        const updateQuery = `UPDATE users SET fotoUrl = ? WHERE id = ?`;
        await db.query(updateQuery, [publicUrl, userId]);

        res.json({
            ok: true,
            msg: 'Foto de perfil subida y actualizada correctamente.',
            newUrl: publicUrl
        });

    } catch (err) {
        console.error("Error al subir foto de perfil:", err.message);
        res.status(500).json({ ok: false, msg: 'Error del servidor al procesar la imagen.' });
    }
};


// =========================================================
// 4. OBTENER RUTINA ASIGNADA (getCurrentRoutine)
// =========================================================
exports.getCurrentRoutine = async (req, res) => {
    const userId = req.userId;
    // ... (cuerpo de la función 4) ...
    try {
        // Asumiendo una tabla 'user_rutinas' que vincula user_id con rutina_id
        const query = `
            SELECT r.titulo, r.objetivo, r.dificultad
            FROM user_rutinas ur
            JOIN rutinas r ON ur.rutina_id = r.id
            WHERE ur.user_id = ?
            ORDER BY ur.fecha_asignacion DESC
            LIMIT 1;
        `;
        const [rows] = await db.query(query, [userId]);

        if (rows.length === 0) {
            return res.status(200).json({ ok: true, routine: null, msg: 'No hay rutina asignada.' });
        }

        res.json({ ok: true, routine: rows[0] });

    } catch (err) {
        console.error("Error al obtener rutina:", err);
        res.status(500).json({ ok: false, msg: 'Error al obtener la rutina asignada.' });
    }
};


// =========================================================
// 5. OBTENER AVISOS ACTIVOS (getActiveNotices)
// =========================================================
exports.getActiveNotices = async (req, res) => {
    const today = new Date().toISOString().split('T')[0]; // Formato YYYY-MM-DD
    // ... (cuerpo de la función 5) ...
    try {
        // Filtra los avisos cuya fecha de inicio sea hoy o en el pasado, y cuya fecha de fin no haya llegado.
        const query = `
            SELECT titulo, mensaje, fecha_inicio
            FROM avisos
            WHERE fecha_inicio <= ? AND fecha_fin >= ?
            ORDER BY fecha_inicio DESC;
        `;
        const [rows] = await db.query(query, [today, today]);

        res.json({ ok: true, avisos: rows });

    } catch (err) {
        console.error("Error al obtener avisos:", err);
        res.status(500).json({ ok: false, msg: 'Error al obtener los avisos activos.' });
    }
};


// =========================================================
// 6. OBTENER ESTADO DE MEMBRESÍA (getMembershipStatus)
// =========================================================
exports.getMembershipStatus = async (req, res) => {
    const userId = req.userId;
    const today = new Date();
    // ... (cuerpo de la función 6) ...
    try {
        // Asumiendo una tabla 'membresias' que guarda el plan activo y la fecha de fin
        const query = `
            SELECT p.nombre AS plan_name, m.fecha_fin, m.id
            FROM membresias m
            JOIN planes p ON m.plan_id = p.id
            WHERE m.user_id = ? AND m.fecha_fin >= ?
            ORDER BY m.fecha_fin DESC
            LIMIT 1;
        `;
        const [rows] = await db.query(query, [userId, today.toISOString().split('T')[0]]);

        if (rows.length === 0) {
            return res.json({ ok: true, status: null, msg: 'Membresía inactiva.' });
        }

        const status = rows[0];
        const endDate = new Date(status.fecha_fin);
        const diffTime = endDate.getTime() - today.getTime();
        const daysRemaining = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

        res.json({
            ok: true,
            status: {
                plan_name: status.plan_name,
                fecha_fin: status.fecha_fin,
                days_remaining: daysRemaining,
                is_active: true
            }
        });

    } catch (err) {
        console.error("Error al obtener membresía:", err);
        res.status(500).json({ ok: false, msg: 'Error al obtener estado de membresía.' });
    }
};
