import { pool } from '../config/db.js';

export const findAll = async (idEspecialidad = null) => {
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
    if (idEspecialidad) {
        query += ' AND m.id_especialidad = ?';
        params.push(idEspecialidad);
    }
    const [rows] = await pool.query(query, params);
    return rows;
};

export const findById = async (id) => {
    const [rows] = await pool.query(`
        SELECT m.id_medico, m.matricula, m.descripcion, m.valor_consulta,
               u.apellido, u.nombres, u.email, u.foto_path,
               e.nombre AS especialidad
        FROM medicos m
        JOIN usuarios u ON m.id_usuario = u.id_usuario
        JOIN especialidades e ON m.id_especialidad = e.id_especialidad
        WHERE m.id_medico = ? AND u.activo = 1
    `, [id]);
    return rows[0] || null;
};

export const asociarObraSocial = async (idMedico, idObraSocial) => {
    await pool.query(
        'INSERT INTO medicos_obras_sociales (id_medico, id_obra_social) VALUES (?, ?)',
        [idMedico, idObraSocial]
    );
};

export const desasociarObraSocial = async (idMedico, idObraSocial) => {
    const [result] = await pool.query(
        'UPDATE medicos_obras_sociales SET activo = 0 WHERE id_medico = ? AND id_obra_social = ?',
        [idMedico, idObraSocial]
    );
    return result.affectedRows;
};
