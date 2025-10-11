const jwt = require('jsonwebtoken');
require('dotenv').config();

// Clave secreta para firmar el JWT
const key_jwt = process.env.JWT_SECRET || '93!SFSCDDSodsfk923*ada';

/**
 * Middleware para proteger rutas según roles.
 * @param {Array} allowedRoles - Array de roles permitidos, ej: ['admin','investigador']
 */
const requireRole = (allowedRoles) => {
  return (req, res, next) => {
    // Leer header Authorization: Bearer <token>
    const authHeader = req.header('Authorization');
    const token = authHeader && authHeader.split(' ')[1];
    if (!token) {
      return res.status(403).json({ error: 'Acceso denegado. Token no proporcionado' });
    }

    try {
      // Decodificar token
      const decoded = jwt.verify(token, key_jwt);

      // Nuestro token se construyó con { userId, correo, nombre, rol }
      const { userId, correo, nombre, rol } = decoded;

      // Verificar si el rol del token está en la lista de permitidos
      if (!allowedRoles.includes(rol)) {
        return res.status(403).json({ error: 'Acceso no autorizado para este rol' });
      }

      // Guardar datos del usuario en req para usarlos en controladores
      req.userId = userId;
      req.correo = correo;
      req.nombre = nombre;
      req.rol = rol;

      next();
    } catch (error) {
      return res.status(403).json({ error: 'Token inválido o expirado' });
    }
  };
};


module.exports = requireRole;
