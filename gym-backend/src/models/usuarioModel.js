// archivo: models/usuarioModel.js (o user.models.js, como lo llames)

const db = require('../db.config');

async function buscarUsuarios(termino, limit, offset) {
    // ... (preparación del término igual)
    const terminoLike = `%${termino}%`;

    const sql = `
        SELECT id, nombre, email, rol, fotoUrl
        FROM users  <-- 🚨 CAMBIO AQUÍ: Usar 'users' en lugar de 'usuarios'
        WHERE nombre LIKE ? OR email LIKE ?
        ORDER BY nombre
        LIMIT ?
        OFFSET ?
    `;

    // Opcional: solo selecciona campos relevantes para la búsqueda (excluyendo password, etc.)
    // SELECT id, nombre, email, rol, fotoUrl

    const values = [terminoLike, terminoLike, limit, offset];

    try {
        const [results] = await db.query(sql, values);
        return results;
    } catch (error) {
        console.error("Error al ejecutar búsqueda:", error);
        throw new Error("Error en la base de datos.");
    }
}

module.exports = { buscarUsuarios };
