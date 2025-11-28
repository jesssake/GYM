const db = require('../db.config');

// -------------------------------------------------------------
// CREAR RUTINA (con imagen)
// -------------------------------------------------------------
exports.crearRutina = async (req, res) => {
    const { name, description } = req.body;

    try {
        await db.query(
            "INSERT INTO rutinas (nombre, descripcion) VALUES (?, ?)",
            [name, description]
        );

        res.json({ message: "Rutina creada correctamente" });
    } catch (error) {
        res.status(500).json({ error });
    }
};

// -------------------------------------------------------------
// CREAR AVISO / EVENTO
// -------------------------------------------------------------
exports.crearAviso = async (req, res) => {
    const { titulo, contenido, inicio, fin } = req.body;

    try {
        await db.query(
            "INSERT INTO avisos (titulo, contenido, fecha_inicio, fecha_fin) VALUES (?, ?, ?, ?)",
            [titulo, contenido, inicio, fin]
        );

        res.json({ message: "Aviso creado correctamente" });
    } catch (error) {
        res.status(500).json({ error });
    }
};
