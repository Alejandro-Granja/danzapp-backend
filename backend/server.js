const express = require('express');
require('dotenv').config();
const cors = require('cors');

const PORT = process.env.PORT || 4000;
const app = express();

// ========================
// 🧰 Middlewares globales
// ========================
app.use(cors());
app.use(express.json());

// ========================
// 📌 Importar rutas
// ========================


const usersRoutes = require('./routes/userRoutes');
app.use('/api/users', usersRoutes);

const authRoutes = require('./routes/auth');                 // registro / login
const regionsRoutes = require('./routes/regions');           // CRUD regiones culturales
const danzasRoutes = require('./routes/danzas');             // CRUD danzas tradicionales
const comentariosRoutes = require('./routes/comentarios');   // CRUD comentarios sobre danzas
const calificacionesRoutes = require('./routes/calificaciones'); // Calificaciones de danzas
const userRoutes = require('./routes/userRoutes');           // Gestión de usuarios (solo admin)

// ========================
// 🚦 Registrar rutas
// ========================
app.use('/api/auth', authRoutes);
app.use('/api/regions', regionsRoutes);
app.use('/api/danzas', danzasRoutes);
app.use('/api/comentarios', comentariosRoutes);
app.use('/api/calificaciones', calificacionesRoutes);
app.use('/api/usuarios', userRoutes);

// ========================
// 🚀 Iniciar servidor
// ========================
app.listen(PORT, () => {
  console.log(`✅ Servidor DanzApp iniciado en el puerto ${PORT}`);
});
