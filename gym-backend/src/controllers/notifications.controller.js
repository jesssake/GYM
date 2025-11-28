const db = require('../db.config');

// -------------------------------------------------------------
// CLIENTES CON MEMBRESÍA POR EXPIRAR
// -------------------------------------------------------------
exports.obtenerClientesExpirando = async (req, res) => {
    try {
        const [rows] = await db.query(`
            SELECT u.nombre, u.email, m.fecha_fin
            FROM membresias m
            INNER JOIN users u ON u.id = m.usuario_id
        `);

        res.json(rows);
    } catch (error) {
        res.status(500).json({ error });
    }
};

// -------------------------------------------------------------
// OBTENER CONFIG DE ALERTAS
// -------------------------------------------------------------
exports.obtenerConfigAlertas = async (req, res) => {
    try {
        const [rows] = await db.query("SELECT dias_anticipacion FROM config_alertas LIMIT 1");
        res.json(rows[0] || { dias_anticipacion: 7 });
    } catch (error) {
        res.status(500).json({ error });
    }
};

// -------------------------------------------------------------
// ACTUALIZAR CONFIG DE ALERTAS
// -------------------------------------------------------------
exports.actualizarConfigAlertas = async (req, res) => {
    const { dias } = req.body;

    try {
        await db.query("UPDATE config_alertas SET dias_anticipacion = ?", [dias]);

        res.json({ message: "Configuración actualizada" });
    } catch (error) {
        res.status(500).json({ error });
    }
};
