// backend/controllers/danzaController.js
const pool = require('../config/database');

// GET todas las danzas
const getAllDanzas = async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM danzapp.danza ORDER BY danza_id');
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// GET danza por id
const getDanzaById = async (req, res) => {
  const id = req.params.id;
  try {
    const result = await pool.query('SELECT * FROM danzapp.danza WHERE danza_id = $1', [id]);
    if (result.rows.length === 0) {
      return res.status(404).json({ mensaje: 'No se encontró la danza con el id indicado' });
    }
    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// POST crear danza
const createDanza = async (req, res) => {
  const { nombre, descripcion, origen, imagen_url, video_url, region_id } = req.body;
  try {
    const result = await pool.query(
      `INSERT INTO danzapp.danza (nombre, descripcion, origen, imagen_url, video_url, region_id)
       VALUES ($1,$2,$3,$4,$5,$6) RETURNING *`,
      [nombre, descripcion, origen, imagen_url, video_url, region_id]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// PUT actualizar danza
const updateDanza = async (req, res) => {
  const id = req.params.id;
  const { nombre, descripcion, origen, imagen_url, video_url, region_id } = req.body;
  try {
    const result = await pool.query(
      `UPDATE danzapp.danza 
       SET nombre=$1, descripcion=$2, origen=$3, imagen_url=$4, video_url=$5, region_id=$6
       WHERE danza_id=$7 RETURNING *`,
      [nombre, descripcion, origen, imagen_url, video_url, region_id, id]
    );
    if (result.rowCount === 0) {
      return res.status(404).json({ mensaje: 'No se encontró la danza con el id indicado' });
    }
    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// DELETE eliminar danza
const deleteDanza = async (req, res) => {
  const id = req.params.id;
  try {
    const result = await pool.query('DELETE FROM danzapp.danza WHERE danza_id=$1', [id]);
    if (result.rowCount === 0) {
      return res.status(404).json({ mensaje: 'No se encontró la danza con el id indicado' });
    }
    res.json({ mensaje: 'Danza eliminada exitosamente' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

module.exports = {
  getAllDanzas,
  getDanzaById,
  createDanza,
  updateDanza,
  deleteDanza
};
