// src/db.config.js
require('dotenv').config();
const mysql = require('mysql2/promise');
// ------------------------------------------------------------
// POOL DE CONEXIÓN
// ------------------------------------------------------------
const pool = mysql.createPool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
});
// ------------------------------------------------------------
// TABLA: USERS
// ------------------------------------------------------------
const createUsersTable = async () => {
    try {
        const query = `
            CREATE TABLE IF NOT EXISTS users (
                id INT AUTO_INCREMENT PRIMARY KEY,
                nombre VARCHAR(255) NOT NULL,
                email VARCHAR(255) UNIQUE NOT NULL,
                password VARCHAR(255) NOT NULL,
                rol ENUM('Cliente', 'Administrador', 'Coach') DEFAULT 'Cliente',
                fechaNacimiento DATE NULL,
                peso DECIMAL(7,2) NULL,
                altura INT NULL,
                meta VARCHAR(255) NULL,
                fotoUrl VARCHAR(255) NULL,
                createdAt DATETIME DEFAULT CURRENT_TIMESTAMP
            );
        `;
        await pool.query(query);
        console.log("✔ Tabla 'users' verificada/creada.");
    } catch (error) {
        console.error("❌ Error al crear tabla 'users':", error.message);
    }
};
// ------------------------------------------------------------
// TABLA: MEMBRESIAS
// ------------------------------------------------------------
const createMembresiasTable = async () => {
    try {
        const query = `
            CREATE TABLE IF NOT EXISTS membresias (
                id INT AUTO_INCREMENT PRIMARY KEY,
                user_id INT NOT NULL,
                plan_name VARCHAR(50),
                status VARCHAR(20),
                price VARCHAR(20),
                start_date DATE,
                fecha_fin DATE,  -- ✔ Incluida para evitar el error de columna
                FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
            );
        `;
        await pool.query(query);
        console.log("✔ Tabla 'membresias' verificada/creada.");
    } catch (error) {
        console.error("❌ Error al crear tabla 'membresias':", error.message);
    }
};
// ------------------------------------------------------------
// TABLA: PAGOS
// ------------------------------------------------------------
const createPagosTable = async () => {
    try {
        const query = `
            CREATE TABLE IF NOT EXISTS pagos (
                id INT AUTO_INCREMENT PRIMARY KEY,
                user_id INT NOT NULL,
                monto DECIMAL(10,2),
                descripcion VARCHAR(100),
                fecha DATE,
                FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
            );
        `;
        await pool.query(query);
        console.log("✔ Tabla 'pagos' verificada/creada.");
    } catch (error) {
        console.error("❌ Error al crear tabla 'pagos':", error.message);
    }
};
// ------------------------------------------------------------
// TABLA: RUTINAS
// ------------------------------------------------------------
const createRutinasTable = async () => {
    try {
        const query = `
            CREATE TABLE IF NOT EXISTS rutinas (
                id INT AUTO_INCREMENT PRIMARY KEY,
                titulo VARCHAR(255) NOT NULL,
                descripcion TEXT NOT NULL,
                imagen_url VARCHAR(255) NOT NULL,
                fecha_creacion DATETIME NOT NULL
            );
        `;
        await pool.query(query);
        console.log("✔ Tabla 'rutinas' verificada/creada.");
    } catch (error) {
        console.error("❌ Error al crear tabla 'rutinas':", error.message);
    }
};
// ------------------------------------------------------------
// TABLA: AVISOS
// ------------------------------------------------------------
const createAvisosTable = async () => {
    try {
        const query = `
            CREATE TABLE IF NOT EXISTS avisos (
                id INT AUTO_INCREMENT PRIMARY KEY,
                titulo VARCHAR(255) NOT NULL,
                mensaje TEXT NOT NULL,
                fecha_inicio DATE NOT NULL,
                fecha_fin DATE NULL,
                fecha_creacion DATETIME DEFAULT CURRENT_TIMESTAMP
            );
        `;
        await pool.query(query);
        console.log("✔ Tabla 'avisos' verificada/creada.");
    } catch (error) {
        console.error("❌ Error al crear tabla 'avisos':", error.message);
    }
};
// ------------------------------------------------------------
// TABLA: CONFIGURACIÓN DE ALERTAS
// ------------------------------------------------------------
const createConfigAlertasTable = async () => {
    try {
        const query = `
            CREATE TABLE IF NOT EXISTS config_alertas (
                id INT PRIMARY KEY DEFAULT 1,
                dias_antes INT NOT NULL DEFAULT 7
            );
        `;
        await pool.query(query);
        console.log("✔ Tabla 'config_alertas' verificada/creada.");

        // Asegurar que siempre haya un registro de configuración
        const [rows] = await pool.query('SELECT COUNT(*) AS count FROM config_alertas');
        if (rows[0].count === 0) {
             await pool.query('INSERT INTO config_alertas (id, dias_antes) VALUES (1, 7)');
        }

    } catch (error) {
        console.error("❌ Error al crear tabla 'config_alertas':", error.message);
    }
};

// ------------------------------------------------------------
// INICIALIZAR TODAS LAS TABLAS
// ------------------------------------------------------------
const initDB = async () => {
    await createUsersTable();
    await createMembresiasTable();
    await createPagosTable();
    await createRutinasTable();
    await createAvisosTable();
    await createConfigAlertasTable();
};

initDB();

module.exports = pool;
