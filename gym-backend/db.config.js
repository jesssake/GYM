// Configuración de Conexión a MySQL
const mysql = require('mysql2/promise');

// 🚨 REEMPLAZA estos valores con tus credenciales REALES de MySQL
const dbConfig = {
    host: 'localhost',
    user: 'root',
    password: '3031', // Ej: 'micontraseña123'
    database: 'gym_db' // Ej: 'gym_db'
};

let pool;

async function connectToDatabase() {
    try {
        // Crea un "pool" de conexiones. Esto es más eficiente que una conexión simple.
        pool = mysql.createPool(dbConfig);
        console.log('✅ Conexión exitosa a MySQL.');
    } catch (error) {
        console.error('❌ Error al conectar a la base de datos:', error);
        // Si no se puede conectar, salimos
        process.exit(1);
    }
}

// Inicializa la conexión cuando el archivo es cargado
connectToDatabase();

// Exporta una función para ejecutar queries de forma segura
module.exports = {
    // La función 'query' ejecuta consultas SQL usando el pool
    query: (sql, params) => pool.execute(sql, params)
};
