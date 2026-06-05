import { pool } from '../config/db.js';

export const getMedicos = async (req, res) => {
    try {
        let query = `
            SELECT m.id_medico, m.matricula, m.descripcion, m.valor_consulta,
                   u.apellido, u.nombres, u.email, u.foto_path,
                   e.nombre AS especialidad, e.id_especialidad
            FROM medicos m
            JOIN usuarios u ON m.id_usuario = u.id_usuario
            JOIN especialidades e ON m.id_especialidad = e.id_especialidad
            WHERE u.activo = 1
        `;
        const params = [];
        if (req.query.especialidad) {
            query += ' AND m.id_especialidad = ?';
            params.push(req.query.especialidad);
        }
        const [rows] = await pool.query(query, params);
        res.json(rows);
    } catch (error) {
        res.status(500).json({ mensaje: error.message });
    }
};

export const getMedicoById = async (req, res) => {
    try {
        const [rows] = await pool.query(`
            SELECT m.id_medico, m.matricula, m.descripcion, m.valor_consulta,
                   u.apellido, u.nombres, u.email, u.foto_path,
                   e.nombre AS especialidad
            FROM medicos m
            JOIN usuarios u ON m.id_usuario = u.id_usuario
            JOIN especialidades e ON m.id_especialidad = e.id_especialidad
            WHERE m.id_medico = ? AND u.activo = 1
        `, [req.params.id]);
        if (!rows[0]) return res.status(404).json({ mensaje: 'No encontrado' });
        res.json(rows[0]);
    } catch (error) {
        res.status(500).json({ mensaje: error.message });
    }
};

export const asociarObraSocial = async (req, res) => {
    try {
        const { id_obra_social } = req.body;
        await pool.query(
            'INSERT INTO medicos_obras_sociales (id_medico, id_obra_social) VALUES (?, ?)',
            [req.params.id, id_obra_social]
        );
        res.status(201).json({ mensaje: 'Obra social asociada al médico' });
    } catch (error) {
        res.status(500).json({ mensaje: error.message });
    }
};

export const desasociarObraSocial = async (req, res) => {
    try {
        const [result] = await pool.query(
            'UPDATE medicos_obras_sociales SET activo = 0 WHERE id_medico = ? AND id_obra_social = ?',
            [req.params.id, req.params.idOS]
        );
        if (!result.affectedRows) return res.status(404).json({ mensaje: 'Asociación no encontrada' });
        res.json({ mensaje: 'Desasociado' });
    } catch (error) {
        res.status(500).json({ mensaje: error.message });
    }
};
