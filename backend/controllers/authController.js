const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const pool = require('../config/database');
require('dotenv').config();


const key_jwt = process.env.JWT_SECRET || '93!SFSCDDSodsfk923*ada';


const register = async (req, res) => {
  try {
    const { correo, nombre, pais, ciudad, fecha_nacimiento, contraseña } = req.body;

    if (!correo || !nombre || !pais || !ciudad || !fecha_nacimiento || !contraseña) {
      return res.status(400).json({ error: 'Todos los campos son requeridos' });
    }

    // Verificar si el correo ya existe
    const existing = await pool.query('SELECT * FROM danzapp.Usuario WHERE correo = $1', [correo]);
    if (existing.rows.length > 0) {
      return res.status(400).json({ error: 'El correo electrónico ya está registrado' });
    }

    const hashedPassword = await bcrypt.hash(contraseña, 10);

    const result = await pool.query(
      `INSERT INTO danzapp.Usuario (nombre, correo, contraseña, rol, pais, ciudad, fecha_nacimiento)
       VALUES ($1, $2, $3, $4, $5, $6, $7)
       RETURNING usuario_id, nombre, correo, rol`,
      [nombre, correo, hashedPassword, 'admin', pais, ciudad, fecha_nacimiento]
    );

    const user = result.rows[0];

    const token = jwt.sign(
      {
        userId: user.usuario_id,
        correo: user.correo,
        nombre: user.nombre,
        rol: user.rol
      },
      key_jwt,
      { expiresIn: '1d' }
    );

    res.status(201).json({ token, mensaje: 'Usuario registrado exitosamente' });
  } catch (error) {
    console.error('❌ Error en registro:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
};

const login = async (req, res) => {
  try {
    const { correo, contraseña } = req.body;

    if (!correo || !contraseña) {
      return res.status(400).json({ error: 'Credenciales requeridas' });
    }

  
    const result = await pool.query('SELECT * FROM danzapp.Usuario WHERE correo = $1', [correo]);
    if (result.rows.length === 0) {
      return res.status(401).json({ error: 'Credenciales inválidas' });
    }

    const user = result.rows[0];

    const isValidPassword = await bcrypt.compare(contraseña, user.contraseña);
    if (!isValidPassword) {
      return res.status(401).json({ error: 'Credenciales inválidas' });
    }

    const token = jwt.sign(
      {
        userId: user.usuario_id,
        correo: user.correo,
        nombre: user.nombre,
        rol: user.rol
      },
      key_jwt,
      { expiresIn: '1d' }
    );

    res.json({ token, mensaje: 'Inicio de sesión exitoso' });
  } catch (error) {
    console.error('❌ Error en login:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
};

const changePassword = async (req, res) => {
  const { id } = req.params;
  const { oldPassword, newPassword } = req.body;

  if (!oldPassword || !newPassword) {
    return res.status(400).json({ error: 'Todos los campos son requeridos' });
  }

  const authHeader = req.header('Authorization');
  const token = authHeader && authHeader.split(' ')[1];
  if (!token) {
    return res.status(403).json({ error: 'Acceso denegado. Token no proporcionado' });
  }

  try {
    const decoded = jwt.verify(token, key_jwt);
    if (decoded.userId != id) {
      return res.status(403).json({ error: 'Acceso no autorizado' });
    }

    
    const result = await pool.query('SELECT * FROM danzapp.Usuario WHERE usuario_id = $1', [id]);
    if (result.rows.length === 0) return res.status(404).json({ error: 'Usuario no encontrado' });

    const user = result.rows[0];
    const isValidPassword = await bcrypt.compare(oldPassword, user.contraseña);
    if (!isValidPassword) {
      return res.status(401).json({ error: 'Contraseña actual incorrecta' });
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);
    await pool.query('UPDATE danzapp.Usuario SET contraseña = $1 WHERE usuario_id = $2', [hashedPassword, id]);

    res.json({ mensaje: 'Contraseña actualizada exitosamente' });
  } catch (error) {
    console.error('❌ Error en cambio de contraseña:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
};

const forceChangePassword = async (req, res) => {
  try {
    const { id } = req.params;
    const { newPassword } = req.body;

    if (!newPassword) {
      return res.status(400).json({ error: 'La nueva contraseña es requerida' });
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);
    await pool.query('UPDATE danzapp.Usuario SET contraseña = $1 WHERE usuario_id = $2', [hashedPassword, id]);

    res.json({ mensaje: 'Contraseña actualizada exitosamente por admin' });
  } catch (error) {
    console.error(' Error en cambio de password forzado:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
};

module.exports = {
  register,
  login,
  changePassword,
  forceChangePassword
};
