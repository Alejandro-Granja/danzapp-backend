// controllers/regionController.js
const pool = require('../config/database');

const regionController = {
  getAllRegions: async (req, res) => {
    try {
      const result = await pool.query('SELECT * FROM danzapp.region ORDER BY region_id');
      res.json(result.rows);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  },

  getRegionById: async (req, res) => {
    const id = req.params.id;
    try {
      const result = await pool.query('SELECT * FROM danzapp.region WHERE region_id = $1', [id]);
      if (result.rows.length === 0) {
        return res.status(404).json({ mensaje: 'No se encontró la región con el id indicado' });
      }
      res.json(result.rows[0]);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  },

  createRegion: async (req, res) => {
    const { nombre, descripcion } = req.body;
    try {
      const result = await pool.query(
        'INSERT INTO danzapp.region (nombre, descripcion) VALUES ($1,$2) RETURNING *',
        [nombre, descripcion]
      );
      res.status(201).json(result.rows[0]);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  },

  updateRegion: async (req, res) => {
    const id = req.params.id;
    const { nombre, descripcion } = req.body;
    try {
      const result = await pool.query(
        'UPDATE danzapp.region SET nombre=$1, descripcion=$2 WHERE region_id=$3 RETURNING *',
        [nombre, descripcion, id]
      );
      if (result.rowCount === 0) {
        return res.status(404).json({ mensaje: 'No se encontró la región con el id indicado' });
      }
      res.json(result.rows[0]);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  },

  deleteRegion: async (req, res) => {
    const id = req.params.id;
    try {
      const result = await pool.query('DELETE FROM danzapp.region WHERE region_id = $1', [id]);
      if (result.rowCount === 0) {
        return res.status(404).json({ mensaje: 'No se encontró la región con el id indicado' });
      }
      res.json({ mensaje: 'Región eliminada exitosamente' });
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  },
};

module.exports = regionController;
