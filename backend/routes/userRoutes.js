const express = require('express');
const router = express.Router();

// 🧭 Importa las funciones del controlador de usuarios
const {
  getUsers,
  getUserById,
  updateUser,
  deleteUser
} = require('../controllers/usersController.js');

// 🔐 Middleware que valida el rol del usuario (por token JWT)
const requireRole = require('../middlewares/authMiddleware.js');

// ✅ Rutas protegidas:

// 📌 GET /api/usuarios
// Solo un "admin" puede listar a todos los usuarios
router.get('/', requireRole(['admin']), getUsers);

// 📌 GET /api/usuarios/:id
// Admin y critic pueden ver info de un usuario específico
router.get('/:id', requireRole(['admin', 'critic']), getUserById);

// 📌 PUT /api/usuarios/:id
// Admin y critic pueden actualizar su info o la de otros
router.put('/:id', requireRole(['admin', 'critic']), updateUser);

// 📌 DELETE /api/usuarios/:id
// Solo "admin" puede eliminar usuarios
router.delete('/:id', requireRole(['admin']), deleteUser);

module.exports = router;
