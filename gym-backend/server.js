// Archivo principal del Servidor Express
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const path = require('path');

// Importar los archivos que crearemos más tarde
const userRoutes = require('./user.routes');
const dbConfig = require('./db.config'); // Esto inicializa la conexión con MySQL

const app = express();
const PORT = 3000;

// --- Configuración de Middlewares ---

// 1. CORS: Permite que Angular (Frontend) se conecte
app.use(cors({
    origin: 'http://localhost:4200'
}));

// 2. Body-Parser: Permite recibir datos grandes como el Base64 de la foto
// El límite '50mb' es crucial para imágenes grandes
app.use(bodyParser.json({ limit: '50mb' }));
app.use(bodyParser.urlencoded({ limit: '50mb', extended: true }));

// 3. RUTAS ESTÁTICAS: Hace pública la carpeta 'uploads' para que el navegador vea las fotos
// http://localhost:3000/uploads/nombre_de_la_foto.png
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// --- Definición de Rutas ---

// Ruta de prueba para verificar que el servidor está encendido
app.get('/', (req, res) => {
    res.send('Servidor Backend del Gym Funcionando!');
});

// Conectar las rutas específicas de los usuarios (foto de perfil, etc.)
app.use('/api/usuario', userRoutes);

// --- Inicio del Servidor ---

app.listen(PORT, () => {
    console.log(`🚀 Servidor Express corriendo en el puerto ${PORT}`);
    console.log(`URL de la API: http://localhost:${PORT}/api/usuario`);
});
