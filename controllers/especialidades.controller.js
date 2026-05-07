import { pool } from '../config/db.js';

export const getEspecialidades = async (req, res) => {
    try {
        const [rows] = await pool.query('SELECT * FROM especialidades WHERE activo = 1');
        res.json(rows);
    } catch (error) {
        res.status(500).json({ mensaje: error.message });
    }
};

export const getEspecialidadById = async (req, res) => {
    try {
        const [rows] = await pool.query(
            'SELECT * FROM especialidades WHERE id_especialidad = ? AND activo = 1',
            [req.params.id]
        );
        if (!rows[0]) return res.status(404).json({ mensaje: 'No encontrada' });
        res.json(rows[0]);
    } catch (error) {
        res.status(500).json({ mensaje: error.message });
    }
};

export const createEspecialidad = async (req, res) => {
    try {
        const { nombre } = req.body;
        const [result] = await pool.query(
            'INSERT INTO especialidades (nombre) VALUES (?)',
            [nombre]
        );
        res.status(201).json({ id_especialidad: result.insertId, nombre });
    } catch (error) {
        res.status(500).json({ mensaje: error.message });
    }
};

export const updateEspecialidad = async (req, res) => {
    try {
        const { nombre } = req.body;
        const [result] = await pool.query(
            'UPDATE especialidades SET nombre = ? WHERE id_especialidad = ? AND activo = 1',
            [nombre, req.params.id]
        );
        if (!result.affectedRows) return res.status(404).json({ mensaje: 'No encontrada' });
        res.json({ mensaje: 'Actualizada' });
    } catch (error) {
        res.status(500).json({ mensaje: error.message });
    }
};

export const deleteEspecialidad = async (req, res) => {
    try {
        const [result] = await pool.query(
            'UPDATE especialidades SET activo = 0 WHERE id_especialidad = ?',
            [req.params.id]
        );
        if (!result.affectedRows) return res.status(404).json({ mensaje: 'No encontrada' });
        res.json({ mensaje: 'Eliminada' });
    } catch (error) {
        res.status(500).json({ mensaje: error.message });
    }
};
