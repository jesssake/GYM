const pool = require('../db.config');
const fs = require('fs');
// =========================================================
// OBTENER TODOS LOS USUARIOS
// =========================================================
exports.getAllUsers = async (req, res) => {
    try {
        const query = `
            SELECT
                id,
                nombre,
                email,
                rol,
                createdAt AS fecha_registro
            FROM users
        `;

        const [users] = await pool.query(query);

        res.json({
            ok: true,
            users
        });

    } catch (error) {
        console.error('❌ Error al obtener usuarios:', error);
        res.status(500).json({
            ok: false,
            msg: 'Error interno al obtener usuarios.'
        });
    }
};
// =========================================================
// ACTUALIZAR ROL DE USUARIO
// =========================================================
exports.updateUserRole = async (req, res) => {
    const { id } = req.params;
    const { nuevoRol } = req.body;

    if (!nuevoRol) {
        return res.status(400).json({
            ok: false,
            msg: 'Debe enviar el nuevoRol.'
        });
    }

    try {
        const query = `
            UPDATE users SET rol = ? WHERE id = ?
        `;

        const [result] = await pool.query(query, [nuevoRol, id]);

        if (result.affectedRows === 0) {
            return res.status(404).json({
                ok: false,
                msg: 'Usuario no encontrado.'
            });
        }

        res.json({
            ok: true,
            msg: 'Rol actualizado correctamente.'
        });

    } catch (err) {
        console.error('❌ Error al actualizar rol:', err);
        res.status(500).json({
            ok: false,
            msg: 'Error interno al actualizar el rol.'
        });
    }
};
// =========================================================
// ELIMINAR USUARIO
// =========================================================
exports.deleteUser = async (req, res) => {
    const { id } = req.params;

    try {
        const query = `DELETE FROM users WHERE id = ?`;

        const [result] = await pool.query(query, [id]);

        if (result.affectedRows === 0) {
            return res.status(404).json({
                ok: false,
                msg: 'Usuario no encontrado.'
            });
        }

        res.json({
            ok: true,
            msg: 'Usuario eliminado correctamente.'
        });

    } catch (error) {
        console.error('❌ Error al eliminar usuario:', error);
        res.status(500).json({
            ok: false,
            msg: 'Error interno al eliminar usuario.'
        });
    }
};
// =========================================================
// CREAR RUTINA
// =========================================================
exports.createRoutine = async (req, res) => {
    const { name, description } = req.body;

    // 1. Validar imagen
    if (!req.file) {
        return res.status(400).json({
            ok: false,
            msg: 'Debe subir una imagen para la rutina.'
        });
    }

    const imageUrl = `/uploads/rutinas/${req.file.filename}`;

    // 2. Validar campos obligatorios
    if (!name || !description) {
        fs.unlinkSync(req.file.path);
        return res.status(400).json({
            ok: false,
            msg: 'Faltan campos obligatorios: name y description.'
        });
    }

    try {
        const query = `
            INSERT INTO rutinas (titulo, descripcion, imagen_url, fecha_creacion)
            VALUES (?, ?, ?, NOW())
        `;

        const [result] = await pool.query(query, [
            name,
            description,
            imageUrl
        ]);

        res.status(201).json({
            ok: true,
            msg: 'Rutina creada con éxito.',
            routineId: result.insertId,
            imageUrl
        });

    } catch (err) {
        console.error('❌ Error al crear rutina:', err);

        fs.unlinkSync(req.file.path);

        res.status(500).json({
            ok: false,
            msg: 'Error interno al guardar la rutina en la base de datos.'
        });
    }
};
// =========================================================
// CREAR AVISO
// =========================================================
exports.createNotice = async (req, res) => {
    const { titulo, contenido, inicio, fin } = req.body;

    if (!titulo || !contenido || !inicio) {
        return res.status(400).json({
            ok: false,
            msg: 'Faltan campos obligatorios (Título, Contenido o Fecha de Inicio).'
        });
    }

    try {
        const query = `
            INSERT INTO avisos (titulo, mensaje, fecha_inicio, fecha_fin, fecha_creacion)
            VALUES (?, ?, ?, ?, NOW())
        `;

        const fechaFin = fin || null;

        const [result] = await pool.query(query, [
            titulo,
            contenido,
            inicio,
            fechaFin
        ]);

        res.status(201).json({
            ok: true,
            msg: 'Aviso creado con éxito.',
            noticeId: result.insertId
        });

    } catch (err) {
        console.error('❌ Error al crear aviso:', err);

        res.status(500).json({
            ok: false,
            msg: 'Error interno al guardar el aviso en la base de datos.'
        });
    }
};
// =========================================================
// OBTENER CONFIGURACIÓN DE ALERTAS
// =========================================================
exports.getAlertConfig = async (req, res) => {
    try {
        const [rows] = await pool.query('SELECT dias_antes FROM config_alertas WHERE id = 1');

        const config = rows.length > 0 ? rows[0] : { dias_antes: 7 };

        res.json({
            ok: true,
            config: config
        });

    } catch (err) {
        console.error('❌ Error al obtener configuración de alertas:', err);
        res.status(500).json({
            ok: false,
            msg: 'Error interno al obtener configuración de alertas.'
        });
    }
};

// =========================================================
// ACTUALIZAR CONFIGURACIÓN DE ALERTAS
// =========================================================
exports.updateAlertConfig = async (req, res) => {
    const { diasAntes } = req.body;

    if (diasAntes === undefined || diasAntes < 1) {
        return res.status(400).json({
            ok: false,
            msg: 'El campo diasAntes es obligatorio y debe ser un número positivo.'
        });
    }

    try {
        // La actualización usa WHERE id = 1, asumiendo un solo registro
        const query = `
            UPDATE config_alertas SET dias_antes = ? WHERE id = 1
        `;

        await pool.query(query, [diasAntes]);

        res.json({
            ok: true,
            msg: 'Configuración de alertas actualizada.'
        });

    } catch (err) {
        console.error('❌ Error al actualizar alertas:', err);
        res.status(500).json({
            ok: false,
            msg: 'Error interno al actualizar configuración.'
        });
    }
};
// =========================================================
// OBTENER CLIENTES CUYA MEMBRESÍA ESTÁ POR EXPIRAR
// =========================================================
exports.getExpiringClients = async (req, res) => {
    try {
        // 1. Obtener los días de alerta configurados
        const [configRows] = await pool.query('SELECT dias_antes FROM config_alertas WHERE id = 1');
        const dias = configRows.length > 0 ? configRows[0].dias_antes : 7; // Usa el valor de la BD o 7 por defecto

        // 2. Ejecutar la consulta usando los días dinámicos
        const query = `
            SELECT
                u.id,
                u.nombre,
                u.email,
                m.fecha_fin
            FROM membresias m
            INNER JOIN users u ON u.id = m.user_id
            -- Filtra membresías que expiran HOY o en los próximos [dias]
            WHERE m.fecha_fin BETWEEN CURDATE() AND DATE_ADD(CURDATE(), INTERVAL ? DAY)
        `;

        const [rows] = await pool.query(query, [dias]);

        res.json({
            ok: true,
            clientes: rows,
            dias_alerta: dias
        });

    } catch (err) {
        console.error('❌ Error al obtener expiraciones:', err);
        res.status(500).json({
            ok: false,
            msg: 'Error interno al obtener expiraciones.'
        });
    }
};
