const jwt = require('jsonwebtoken');
require('dotenv').config();

const key_jwt = process.env.JWT_SECRET || '93!SFSCDDSodsfk923*ada';

const requireRole = (allowedRoles = []) => {
  return (req, res, next) => {
    const authHeader = req.header('Authorization');
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) {
      return res.status(403).json({ error: 'Acceso denegado. Token no proporcionado' });
    }

    try {
      const decoded = jwt.verify(token, key_jwt);
      const { userId, correo, nombre, rol } = decoded;

      if (allowedRoles.length > 0 && !allowedRoles.includes(rol)) {
        return res.status(403).json({ error: 'Acceso no autorizado para este rol' });
      }
      req.userId = userId;
      req.correo = correo;
      req.nombre = nombre;
      req.rol = rol;

      next();
    } catch (error) {
      console.error(' Error en authMiddleware:', error);
      return res.status(403).json({ error: 'Token inválido o expirado' });
    }
  };
};

module.exports = requireRole;
