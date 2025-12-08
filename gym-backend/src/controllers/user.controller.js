const db = require('../db.config');
const fs = require('fs');
const path = require('path');
const usuarioModel = require('../models/usuarioModel');

// =========================================================
// PERFIL
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
// ACTUALIZAR PERFIL
// =========================================================
exports.updateProfile = async (req, res) => {
    const userId = req.userId;
    const { nombre, fechaNacimiento, peso, altura, meta } = req.body;

    try {
        const query = `
            UPDATE users SET
                nombre = ?, fechaNacimiento = ?, peso = ?, altura = ?, meta = ?
            WHERE id = ?
        `;
        await db.query(query, [
            nombre || null,
            fechaNacimiento || null,
            peso || null,
            altura || null,
            meta || null,
            userId
        ]);

        res.json({ ok: true, msg: 'Perfil actualizado correctamente.' });

    } catch (err) {
        console.error("Error al actualizar perfil:", err);
        res.status(500).json({ ok: false, msg: 'Error al actualizar perfil.' });
    }
};

// =========================================================
// SUBIR FOTO DE PERFIL
// =========================================================
exports.uploadProfilePhoto = async (req, res) => {
    const userId = req.userId;
    const { fotoBase64 } = req.body;

    if (!fotoBase64) {
        return res.status(400).json({ ok: false, msg: 'No se recibió la imagen Base64.' });
    }

    try {
        const matches = fotoBase64.match(/^data:([A-Za-z-+/]+);base64,(.+)$/);

        if (!matches) {
            return res.status(400).json({ ok: false, msg: 'Formato de imagen inválido.' });
        }

        const imageType = matches[1];
        const base64Data = matches[2];
        const fileExtension = imageType.split('/')[1];

        const folderPath = path.join(__dirname, '..', '..', 'uploads', 'profile_photos');

        if (!fs.existsSync(folderPath)) {
            fs.mkdirSync(folderPath, { recursive: true });
        }

        const fileName = `${userId}-${Date.now()}.${fileExtension}`;
        const filePath = path.join(folderPath, fileName);

        fs.writeFileSync(filePath, Buffer.from(base64Data, 'base64'));

        const publicUrl = `/uploads/profile_photos/${fileName}`;

        await db.query("UPDATE users SET fotoUrl = ? WHERE id = ?", [publicUrl, userId]);

        res.json({ ok: true, msg: 'Foto actualizada.', newUrl: publicUrl });

    } catch (err) {
        console.error("Error al subir imagen:", err);
        res.status(500).json({ ok: false, msg: 'Error al subir imagen.' });
    }
};

// =========================================================
// RUTINA ACTUAL
// =========================================================
exports.getCurrentRoutine = async (req, res) => {
    const userId = req.userId;

    try {
        const query = `
            SELECT
                r.id,
                r.titulo,
                r.descripcion,
                r.objetivo,
                r.dificultad,
                r.imagen_url,
                r.fecha_creacion
            FROM user_rutinas ur
            JOIN rutinas r ON ur.rutina_id = r.id
            WHERE ur.user_id = ?
            ORDER BY ur.fecha_asignacion DESC
            LIMIT 1;
        `;
        const [rows] = await db.query(query, [userId]);

        res.json({ ok: true, routine: rows[0] || null });

    } catch (err) {
        console.error("Error rutina:", err);
        res.status(500).json({ ok: false, msg: 'Error al obtener rutina.' });
    }
};

// =========================================================
// DETALLES DE RUTINA (EJERCICIOS AGRUPADOS POR DÍA)
// =========================================================
exports.getRoutineDetails = async (req, res) => {
    const userId = req.userId;

    try {
        // 1. Obtener rutina asignada
        const [currentRoutine] = await db.query(`
            SELECT r.id, r.titulo, r.descripcion, r.objetivo, r.dificultad
            FROM user_rutinas ur
            JOIN rutinas r ON ur.rutina_id = r.id
            WHERE ur.user_id = ?
            ORDER BY ur.fecha_asignacion DESC
            LIMIT 1;
        `, [userId]);

        if (currentRoutine.length === 0) {
            return res.json({ ok: true, rutina: null, msg: "No tienes una rutina asignada." });
        }

        const rutinaBase = currentRoutine[0];
        const rutinaId = rutinaBase.id;

        // 2. Obtener ejercicios (TABLA rutina_detalles DEBE EXISTIR)
        const [detallesRows] = await db.query(`
            SELECT
                dia_semana, orden, nombre, descripcion, video_url,
                series, repeticiones, descanso, completado
            FROM rutina_detalles
            WHERE rutina_id = ?
            ORDER BY FIELD(dia_semana, 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado', 'Domingo'), orden ASC;
        `, [rutinaId]);

        // Si no hay ejercicios
        if (detallesRows.length === 0) {
            return res.json({
                ok: true,
                rutina: {
                    titulo: rutinaBase.titulo,
                    objetivo: rutinaBase.objetivo,
                    dificultad: rutinaBase.dificultad,
                    dias: {}
                }
            });
        }

        // 3. Agrupar por día
        const diasAgrupados = {};

        detallesRows.forEach(det => {
            const dia = det.dia_semana;

            if (!diasAgrupados[dia]) {
                diasAgrupados[dia] = [];
            }

            diasAgrupados[dia].push({
                orden: det.orden,
                nombre: det.nombre,
                descripcion: det.descripcion,
                video_url: det.video_url,
                series: det.series,
                repeticiones: det.repeticiones,
                descanso: det.descanso,
                completado: det.completado || false,
            });
        });

        // 4. Respuesta final
        const rutinaFinal = {
            titulo: rutinaBase.titulo,
            objetivo: rutinaBase.objetivo || 'General',
            dificultad: rutinaBase.dificultad || 'Principiante',
            dias: diasAgrupados
        };

        res.json({ ok: true, rutina: rutinaFinal });

    } catch (err) {
        console.error("Error rutina-detalles:", err);
        res.status(500).json({ ok: false, msg: "Error al cargar los detalles de rutina." });
    }
};
// =========================================================
// ACTIVIDADES EXTRAS
// =========================================================
exports.getExtraActivities = async (req, res) => {
    const userId = req.userId;

    try {
        const [rows] = await db.query(
            // 🚨 CORRECCIÓN: Busca contenido específico O contenido donde user_id es NULL (Global)
            `SELECT * FROM actividades_extras WHERE user_id IS NULL OR user_id = ?`,
            [userId]
        );

        res.json({ ok: true, actividades: rows });

    } catch (err) {
        console.error("Error actividades:", err);
        res.status(500).json({ ok: false, msg: "Error al obtener actividades." });
    }
};

// =========================================================
// RECOMENDACIONES
// =========================================================
exports.getRecommendations = async (req, res) => {
    const userId = req.userId;

    try {
        const [rows] = await db.query(
            // 🚨 CORRECCIÓN: Busca contenido específico O contenido donde user_id es NULL (Global)
            `SELECT * FROM recomendaciones WHERE user_id IS NULL OR user_id = ?`,
            [userId]
        );

        res.json({ ok: true, recomendaciones: rows });

    } catch (err) {
        console.error("Error recomendaciones:", err);
        res.status(500).json({ ok: false, msg: "Error al obtener recomendaciones." });
    }
};

// =========================================================
// AVISOS (CORREGIDO)
// =========================================================
exports.getActiveNotices = async (req, res) => {
    const today = new Date().toISOString().split("T")[0];

    try {
        const query = `
            SELECT
                titulo,
                mensaje AS descripcion,
                fecha_inicio
            FROM avisos
            WHERE fecha_inicio <= ?
              AND (fecha_fin IS NULL OR fecha_fin >= ?)
        `;

        const [rows] = await db.query(query, [today, today]);

        res.json({ ok: true, avisos: rows });

    } catch (err) {
        console.error("Error avisos:", err);
        res.status(500).json({ ok: false, msg: "Error al obtener avisos." });
    }
};

// =========================================================
// MEMBRESÍA
// =========================================================
exports.getMembershipStatus = async (req, res) => {
    const userId = req.userId;

    try {
        const query = `
            SELECT plan_name, fecha_fin
            FROM membresias
            WHERE user_id = ?
            ORDER BY fecha_fin DESC
            LIMIT 1
        `;
        const [rows] = await db.query(query, [userId]);

        res.json({ ok: true, status: rows[0] || null });

    } catch (err) {
        console.error("Error membresía:", err);
        res.status(500).json({ ok: false, msg: "Error al obtener membresía." });
    }
};

// =========================================================
// BÚSQUEDA
// =========================================================
exports.searchUsers = async (req, res) => {
    try {
        const { query, limit, page } = req.query;

        const queryTerm = query?.trim();
        const limitNum = parseInt(limit) || 10;
        const offset = ((parseInt(page) || 1) - 1) * limitNum;

        const usuarios = await usuarioModel.buscarUsuarios(queryTerm, limitNum, offset);

        res.json({ ok: true, usuarios });

    } catch (err) {
        console.error("Error búsqueda:", err);
        res.status(500).json({ ok: false, msg: "Error en búsqueda." });
    }
};
