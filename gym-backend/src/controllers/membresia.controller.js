const pool = require('../db.config');

// -----------------------------------------------------
// Obtener membresía actual del usuario
// -----------------------------------------------------
exports.getMembresiaActual = async (req, res) => {
    try {
        const userId = req.user?.id || 1;

        const [rows] = await pool.query(
            `SELECT plan_name AS planName, status, price,
                    DATE_FORMAT(start_date, '%d/%m/%Y') AS startDate,
                    DATE_FORMAT(expiration, '%d/%m/%Y') AS expirationDate
             FROM membresias
             WHERE user_id = ?
             ORDER BY id DESC
             LIMIT 1`,
            [userId]
        );

        if (rows.length === 0) {
            return res.json({
                planName: 'Sin membresía',
                status: 'VENCIDO',
                price: '$0',
                startDate: 'N/A',
                expirationDate: 'N/A'
            });
        }

        res.json(rows[0]);
    } catch (error) {
        console.error('Error al obtener membresía:', error);
        res.status(500).json({ error: 'Error al obtener membresía' });
    }
};

// -----------------------------------------------------
// Obtener historial de pagos
// -----------------------------------------------------
exports.getHistorialPagos = async (req, res) => {
    try {
        const userId = req.user?.id || 1;

        const [rows] = await pool.query(
            `SELECT
                DATE_FORMAT(fecha, '%d/%m/%Y') AS date,
                monto AS amount,
                descripcion AS description
             FROM pagos
             WHERE user_id = ?
             ORDER BY fecha DESC`,
            [userId]
        );

        res.json(rows);
    } catch (error) {
        console.error('Error historial pagos:', error);
        res.status(500).json({ error: 'Error al obtener historial de pagos' });
    }
};

// -----------------------------------------------------
// Renovar plan
// -----------------------------------------------------
exports.renovarPlan = async (req, res) => {
    try {
        const userId = req.user?.id || 1;

        await pool.query(
            `INSERT INTO pagos (user_id, monto, descripcion, fecha)
             VALUES (?, 80.00, 'Renovación de membresía', NOW())`,
            [userId]
        );

        await pool.query(
            `UPDATE membresias
             SET expiration = DATE_ADD(expiration, INTERVAL 1 MONTH)
             WHERE user_id = ?
             ORDER BY id DESC
             LIMIT 1`,
            [userId]
        );

        res.json({ message: 'Membresía renovada correctamente' });
    } catch (error) {
        console.error('Error renovación:', error);
        res.status(500).json({ error: 'Error al renovar plan' });
    }
};

// -----------------------------------------------------
// Cambiar plan
// -----------------------------------------------------
exports.cambiarPlan = async (req, res) => {
    try {
        const { nuevoPlan, precio } = req.body;
        const userId = req.user?.id || 1;

        await pool.query(
            `INSERT INTO membresias (user_id, plan_name, status, price, start_date, expiration)
             VALUES (?, ?, 'ACTIVO', ?, NOW(), DATE_ADD(NOW(), INTERVAL 1 MONTH))`,
            [userId, nuevoPlan, precio]
        );

        res.json({ message: 'Plan cambiado exitosamente' });

    } catch (error) {
        console.error('Error cambio plan:', error);
        res.status(500).json({ error: 'Error al cambiar plan' });
    }
};
