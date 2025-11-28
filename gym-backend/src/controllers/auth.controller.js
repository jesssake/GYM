// src/controllers/auth.controller.js (Se mantiene como está, ya incluye la corrección del provider)

const pool = require('../db.config');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const JWT_SECRET = process.env.JWT_SECRET || 'secretkey';
const JWT_EXPIRES = '30d';

// -----------------------------------------------------
// REGISTRO
// -----------------------------------------------------
exports.register = async (req, res) => { // <-- Se llama 'register'
    try {
        const { nombre, email, password } = req.body;
        if (!nombre || !email || !password)
            return res.status(400).json({ msg: 'Nombre, email y contraseña requeridos.' });

        // 1. Verificar si el correo ya existe
        const [existing] = await pool.query('SELECT id FROM users WHERE email = ?', [email]);
        if (existing.length > 0)
            return res.status(400).json({ msg: 'El correo ya está registrado.' });

        // 2. Hashear la contraseña
        const salt = await bcrypt.genSalt(10);
        const hashed = await bcrypt.hash(password, salt);

        // Definir el rol por defecto
        const rol = "Cliente";

        // 3. Insertar el nuevo usuario en la DB
        // ✅ CORRECTO: Sólo incluye (nombre, email, password, rol)
        const [result] = await pool.query(
            'INSERT INTO users (nombre, email, password, rol) VALUES (?, ?, ?, ?)',
            [nombre, email, hashed, rol]
        );

        // 4. Generar el Token JWT
        const token = jwt.sign(
            { id: result.insertId, email, nombre, rol },
            JWT_SECRET,
            { expiresIn: JWT_EXPIRES }
        );

        // 5. Respuesta exitosa
        res.status(201).json({
            token,
            rol
        });

    } catch (err) {
        console.error('register error', err);
        res.status(500).json({ msg: 'Error en el registro.' });
    }
};

// -----------------------------------------------------
// LOGIN
// -----------------------------------------------------
exports.login = async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password)
            return res.status(400).json({ msg: 'Email y contraseña requeridos.' });

        const [rows] = await pool.query('SELECT * FROM users WHERE email = ?', [email]);
        if (rows.length === 0)
            return res.status(400).json({ msg: 'Usuario no encontrado.' });

        const user = rows[0];

        if (!user.password)
            // Este mensaje puede ser redundante si eliminaste completamente el inicio de sesión social,
            // pero se mantiene por si el campo 'password' puede ser NULL en usuarios viejos.
            return res.status(400).json({ msg: 'Cuenta registrada mediante proveedor social. Usa el inicio de sesión social.' });

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch)
            return res.status(400).json({ msg: 'Contraseña incorrecta.' });

        const token = jwt.sign(
            { id: user.id, email: user.email, nombre: user.nombre, rol: user.rol },
            JWT_SECRET,
            { expiresIn: JWT_EXPIRES }
        );

        res.json({
            token,
            rol: user.rol
        });

    } catch (err) {
        console.error('login error', err);
        res.status(500).json({ msg: 'Error en el login.' });
    }
};

// -----------------------------------------------------
// PENDIENTE
// -----------------------------------------------------
exports.requestPasswordReset = async (req, res) => {
    res.status(200).json({ msg: 'Funcionalidad pendiente: requestPasswordReset' });
};

exports.resetPasswordConfirm = async (req, res) => {
    res.status(200).json({ msg: 'Funcionalidad pendiente: resetPasswordConfirm' });
};
