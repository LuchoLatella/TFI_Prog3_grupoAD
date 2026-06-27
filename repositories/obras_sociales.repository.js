import { pool } from '../config/db.js';

export const findAll = async () => {
    const [rows] = await pool.query('SELECT * FROM obras_sociales WHERE activo = 1');
    return rows;
};

export const findById = async (id) => {
    const [rows] = await pool.query(
        'SELECT * FROM obras_sociales WHERE id_obra_social = ? AND activo = 1',
        [id]
    );
    return rows[0] || null;
};

export const findByNombre = async (nombre) => {
    const [rows] = await pool.query(
        'SELECT id_obra_social FROM obras_sociales WHERE nombre = ?',
        [nombre]
    );
    return rows[0] || null;
};

export const create = async ({ nombre, descripcion, porcentaje_descuento, es_particular }) => {
    const [result] = await pool.query(
        'INSERT INTO obras_sociales (nombre, descripcion, porcentaje_descuento, es_particular) VALUES (?, ?, ?, ?)',
        [nombre, descripcion ?? '', porcentaje_descuento, es_particular ?? 0]
    );
    return result.insertId;
};

export const update = async (id, { nombre, descripcion, porcentaje_descuento, es_particular }) => {
    const [result] = await pool.query(
        'UPDATE obras_sociales SET nombre = ?, descripcion = ?, porcentaje_descuento = ?, es_particular = ? WHERE id_obra_social = ? AND activo = 1',
        [nombre, descripcion ?? '', porcentaje_descuento, es_particular ?? 0, id]
    );
    return result.affectedRows;
};

export const remove = async (id) => {
    const [result] = await pool.query(
        'UPDATE obras_sociales SET activo = 0 WHERE id_obra_social = ?',
        [id]
    );
    return result.affectedRows;
};
