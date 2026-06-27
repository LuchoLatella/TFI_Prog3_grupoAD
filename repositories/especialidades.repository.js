import { pool } from '../config/db.js';

export const findAll = async () => {
    const [rows] = await pool.query('SELECT * FROM especialidades WHERE activo = 1');
    return rows;
};

export const findById = async (id) => {
    const [rows] = await pool.query(
        'SELECT * FROM especialidades WHERE id_especialidad = ? AND activo = 1',
        [id]
    );
    return rows[0] || null;
};

export const create = async (nombre) => {
    const [result] = await pool.query(
        'INSERT INTO especialidades (nombre) VALUES (?)',
        [nombre]
    );
    return result.insertId;
};

export const update = async (id, nombre) => {
    const [result] = await pool.query(
        'UPDATE especialidades SET nombre = ? WHERE id_especialidad = ? AND activo = 1',
        [nombre, id]
    );
    return result.affectedRows;
};

export const remove = async (id) => {
    const [result] = await pool.query(
        'UPDATE especialidades SET activo = 0 WHERE id_especialidad = ?',
        [id]
    );
    return result.affectedRows;
};
