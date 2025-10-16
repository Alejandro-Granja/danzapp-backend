const pool = require('../config/database');

//  Obtener todos los usuarios
const getUsers = async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT usuario_id, nombre, correo, rol, pais, ciudad, fecha_nacimiento
      FROM danzapp.Usuario
      ORDER BY usuario_id
    `);

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'No se encontraron usuarios' });
    }

    res.json(result.rows);
  } catch (error) {
    console.error(' Error al obtener los usuarios:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
};

//  Obtener un usuario por ID
const getUserById = async (req, res) => {
  const { id } = req.params;
  try {
    const result = await pool.query(`
      SELECT usuario_id, nombre, correo, rol, pais, ciudad, fecha_nacimiento
      FROM danzapp.Usuario
      WHERE usuario_id = $1
    `, [id]);

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Usuario no encontrado' });
    }

    res.json(result.rows[0]);
  } catch (error) {
    console.error(' Error al obtener el usuario:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
};

//  Actualizar datos de un usuario
const updateUser = async (req, res) => {
  const { id } = req.params;
  const { nombre, correo, rol, pais, ciudad, fecha_nacimiento } = req.body;

  try {
    const result = await pool.query(`
      UPDATE danzapp.Usuario
      SET nombre = $1,
          correo = $2,
          rol = $3,
          pais = $4,
          ciudad = $5,
          fecha_nacimiento = $6
      WHERE usuario_id = $7
      RETURNING usuario_id, nombre, correo, rol, pais, ciudad, fecha_nacimiento
    `, [nombre, correo, rol, pais, ciudad, fecha_nacimiento, id]);

    if (result.rowCount === 0) {
      return res.status(404).json({ error: 'Usuario no encontrado' });
    }

    res.json({ mensaje: ' Usuario actualizado exitosamente', usuario: result.rows[0] });
  } catch (error) {
    console.error(' Error al actualizar el usuario:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
};

//  Eliminar un usuario
const deleteUser = async (req, res) => {
  const { id } = req.params;
  try {
    const result = await pool.query(`
      DELETE FROM danzapp.Usuario
      WHERE usuario_id = $1
    `, [id]);

    if (result.rowCount === 0) {
      return res.status(404).json({ error: 'Usuario no encontrado' });
    }

    res.json({ mensaje: ' Usuario eliminado exitosamente' });
  } catch (error) {
    console.error(' Error al eliminar el usuario:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
};

module.exports = {
  getUsers,
  getUserById,
  updateUser,
  deleteUser
};
