import { pool } from '../config/db.js';

export const getObrasSociales = async (req, res) => {
    try {
        const [rows] = await pool.query('SELECT * FROM obras_sociales WHERE activo = 1');
        res.json(rows);
    } catch (error) {
        res.status(500).json({ mensaje: error.message });
    }
};

export const getObraSocialById = async (req, res) => {
    try {
        const [rows] = await pool.query(
            'SELECT * FROM obras_sociales WHERE id_obra_social = ? AND activo = 1',
            [req.params.id]
        );
        if (!rows[0]) return res.status(404).json({ mensaje: 'No encontrada' });
        res.json(rows[0]);
    } catch (error) {
        res.status(500).json({ mensaje: error.message });
    }
};

export const createObraSocial = async (req, res) => {
    try {
        const { nombre, descripcion, porcentaje_descuento, es_particular } = req.body;
        const [result] = await pool.query(
            'INSERT INTO obras_sociales (nombre, descripcion, porcentaje_descuento, es_particular) VALUES (?, ?, ?, ?)',
            [nombre, descripcion ?? '', porcentaje_descuento, es_particular ?? 0]
        );
        res.status(201).json({ id_obra_social: result.insertId, nombre });
    } catch (error) {
        res.status(500).json({ mensaje: error.message });
    }
};

export const updateObraSocial = async (req, res) => {
    try {
        const { nombre, descripcion, porcentaje_descuento, es_particular } = req.body;
        const [result] = await pool.query(
            'UPDATE obras_sociales SET nombre = ?, descripcion = ?, porcentaje_descuento = ?, es_particular = ? WHERE id_obra_social = ? AND activo = 1',
            [nombre, descripcion ?? '', porcentaje_descuento, es_particular ?? 0, req.params.id]
        );
        if (!result.affectedRows) return res.status(404).json({ mensaje: 'No encontrada' });
        res.json({ mensaje: 'Actualizada' });
    } catch (error) {
        res.status(500).json({ mensaje: error.message });
    }
};

export const deleteObraSocial = async (req, res) => {
    try {
        const [result] = await pool.query(
            'UPDATE obras_sociales SET activo = 0 WHERE id_obra_social = ?',
            [req.params.id]
        );
        if (!result.affectedRows) return res.status(404).json({ mensaje: 'No encontrada' });
        res.json({ mensaje: 'Eliminada' });
    } catch (error) {
        res.status(500).json({ mensaje: error.message });
    }
};
