const pool = require('../config/database');

// 📌 Obtener comentarios para una danza específica
const getComentariosByDanza = async (req, res) => {
  try {
    const { danza_id } = req.params;

    const comentarios = await pool.query(`
      SELECT c.comentario_id, c.usuario_id, u.nombre AS usuario_nombre, u.correo AS usuario_correo, 
             c.comentario_texto, c.creado_en
      FROM danzapp.Comentario c
      JOIN danzapp.Usuario u ON c.usuario_id = u.usuario_id
      WHERE c.danza_id = $1
      ORDER BY c.creado_en DESC
    `, [danza_id]);

    if (comentarios.rows.length === 0) {
      return res.status(404).json({ error: 'No hay comentarios para esta danza' });
    }

    res.json(comentarios.rows);
  } catch (error) {
    console.error('❌ Error al obtener los comentarios:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
};

// 📌 Crear un comentario para una danza
const createComentario = async (req, res) => {
  const { danza_id } = req.params;
  const { comentario } = req.body;
  const usuario_id = req.userId; // se obtiene desde el middleware de autenticación JWT

  try {
    if (!comentario) {
      return res.status(400).json({ error: 'El comentario es obligatorio' });
    }

    // ✅ Verificar que el usuario exista y esté autenticado
    const userResult = await pool.query(
      'SELECT usuario_id FROM danzapp.Usuario WHERE usuario_id = $1',
      [usuario_id]
    );
    if (userResult.rows.length === 0) {
      return res.status(403).json({ error: 'Usuario no válido' });
    }

    // ✅ Verificar que la danza exista
    const danzaResult = await pool.query(
      'SELECT danza_id FROM danzapp.Danza WHERE danza_id = $1',
      [danza_id]
    );
    if (danzaResult.rows.length === 0) {
      return res.status(404).json({ error: 'La danza no está registrada' });
    }

    // ✅ Insertar comentario
    const result = await pool.query(
      'INSERT INTO danzapp.Comentario (usuario_id, danza_id, comentario_texto) VALUES ($1, $2, $3) RETURNING *',
      [usuario_id, danza_id, comentario]
    );

    res.status(201).json({
      comentario_id: result.rows[0].comentario_id,
      mensaje: 'Comentario agregado correctamente'
    });
  } catch (error) {
    console.error('❌ Error al crear el comentario:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
};

module.exports = {
  getComentariosByDanza,
  createComentario
};
