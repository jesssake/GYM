require('dotenv').config();
const express = require('express');
const cors = require('cors');
const path = require('path');

const app = express();

// -----------------------------------------------------
// 1. MIDDLEWARES BÁSICOS
// -----------------------------------------------------
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

app.use(
    cors({
        origin: ['http://localhost:4200'],
        credentials: true
    })
);

// -----------------------------------------------------
// 3. ARCHIVOS ESTÁTICOS
// -----------------------------------------------------
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// -----------------------------------------------------
// 4. RUTAS DEL SISTEMA (Asegúrate de que esta línea esté corregida)
// -----------------------------------------------------
app.use('/api/auth', require('./src/routes/auth.routes')); // ✅ USA /api/auth
app.use('/api/users', require('./src/routes/user.routes'));
app.use('/api/admin', require('./src/routes/admin.routes'));
app.use('/api/membresia', require('./src/routes/membresia.routes'));
// 🚨 CORRECCIÓN CLAVE: Agregamos el router de Notificaciones
app.use('/api/notifications', require('./src/routes/notifications.routes')); // 👈 ¡NUEVA LÍNEA!

// -----------------------------------------------------
// 5. RUTA BASE
// -----------------------------------------------------
app.get('/', (req, res) => {
    res.send('Backend GymApp funcionando correctamente 🚀');
});

// -----------------------------------------------------
// 6. INICIAR SERVIDOR
// -----------------------------------------------------
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(` Servidor corriendo en http://localhost:${PORT}`);
});
