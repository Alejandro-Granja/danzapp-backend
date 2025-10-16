const pool = require('../config/database');

// 📌 Obtener las calificaciones por danza
const getRatingByIdDanza = async (req, res) => {
  try {
    const { danza_id } = req.params;
    const ratings = await pool.query(`
      SELECT danza_id, puntaje, COUNT(*) as cantidad
      FROM danzapp.Calificacion
      WHERE danza_id = $1
      GROUP BY danza_id, puntaje
      ORDER BY puntaje DESC
    `, [danza_id]);

    if (ratings.rows.length === 0) {
      return res.status(404).json({ error: 'No hay calificaciones para esta danza' });
    }

    res.json(ratings.rows);
  } catch (error) {
    console.error(' Error al obtener las calificaciones:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
};

//  Obtener una calificación por ID
const getRatingById = async (req, res) => {
  try {
    const { calificacion_id } = req.params;
    const result = await pool.query(
      'SELECT * FROM danzapp.Calificacion WHERE calificacion_id = $1',
      [calificacion_id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Calificación no encontrada' });
    }

    res.json(result.rows[0]);
  } catch (error) {
    console.error(' Error al obtener la calificación:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
};

//  Crear una calificación para una danza
const createRating = async (req, res) => {
  const { danza_id } = req.params;
  const { puntaje } = req.body;
  const usuario_id = req.userId; // desde el middleware de autenticación JWT

  try {
    if (puntaje === undefined || puntaje < 0 || puntaje > 5) {
      return res.status(400).json({ error: 'La calificación debe estar entre 0 y 5' });
    }

    //  Verificar que el usuario exista
    const userResult = await pool.query(
      'SELECT usuario_id FROM danzapp.Usuario WHERE usuario_id = $1',
      [usuario_id]
    );
    if (userResult.rows.length === 0) {
      return res.status(403).json({ error: 'Usuario no válido' });
    }

    //  Verificar que la danza exista
    const danzaResult = await pool.query(
      'SELECT danza_id FROM danzapp.Danza WHERE danza_id = $1',
      [danza_id]
    );
    if (danzaResult.rows.length === 0) {
      return res.status(404).json({ error: 'La danza no está registrada' });
    }

    //  Verificar que no exista una calificación previa de este usuario
    const ratingPrev = await pool.query(
      'SELECT * FROM danzapp.Calificacion WHERE danza_id = $1 AND usuario_id = $2',
      [danza_id, usuario_id]
    );
    if (ratingPrev.rows.length !== 0) {
      return res.status(400).json({ error: 'Ya has calificado esta danza previamente' });
    }

    //  Crear nueva calificación
    const result = await pool.query(
      'INSERT INTO danzapp.Calificacion (usuario_id, danza_id, puntaje) VALUES ($1, $2, $3) RETURNING *',
      [usuario_id, danza_id, puntaje]
    );

    res.status(201).json({
      calificacion_id: result.rows[0].calificacion_id,
      mensaje: ' Calificación registrada exitosamente'
    });
  } catch (error) {
    console.error('❌ Error al crear la calificación:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
};

//  Actualizar calificación
const updateRating = async (req, res) => {
  try {
    const { calificacion_id } = req.params;
    const { puntaje } = req.body;
    const usuario_id = req.userId;

    if (puntaje === undefined || puntaje < 0 || puntaje > 5) {
      return res.status(400).json({ error: 'La calificación debe estar entre 0 y 5' });
    }

    // Verificar que la calificación exista
    const ratingResult = await pool.query(
      'SELECT * FROM danzapp.Calificacion WHERE calificacion_id = $1',
      [calificacion_id]
    );
    if (ratingResult.rows.length === 0) {
      return res.status(404).json({ error: 'Calificación no encontrada' });
    }

    // Verificar que el usuario sea el autor o admin
    if (ratingResult.rows[0].usuario_id !== usuario_id && req.rol !== 'admin') {
      return res.status(403).json({ error: 'No autorizado para actualizar esta calificación' });
    }

    await pool.query(
      'UPDATE danzapp.Calificacion SET puntaje = $1 WHERE calificacion_id = $2',
      [puntaje, calificacion_id]
    );

    res.json({ mensaje: ' Calificación actualizada correctamente' });
  } catch (error) {
    console.error('❌ Error al actualizar la calificación:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
};

//  Eliminar calificación
const deleteRating = async (req, res) => {
  try {
    const { calificacion_id } = req.params;
    const usuario_id = req.userId;

    const ratingResult = await pool.query(
      'SELECT * FROM danzapp.Calificacion WHERE calificacion_id = $1',
      [calificacion_id]
    );
    if (ratingResult.rows.length === 0) {
      return res.status(404).json({ error: 'Calificación no encontrada' });
    }

    // Solo el autor o admin pueden eliminar
    if (ratingResult.rows[0].usuario_id !== usuario_id && req.rol !== 'admin') {
      return res.status(403).json({ error: 'No autorizado para eliminar esta calificación' });
    }

    await pool.query(
      'DELETE FROM danzapp.Calificacion WHERE calificacion_id = $1',
      [calificacion_id]
    );

    res.json({ mensaje: '🗑 Calificación eliminada correctamente' });
  } catch (error) {
    console.error('❌ Error al eliminar la calificación:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
};

module.exports = {
  getRatingByIdDanza,
  getRatingById,
  createRating,
  updateRating,
  deleteRating
};
