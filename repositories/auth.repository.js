import { pool } from '../config/db.js';

// Buscar usuario por email (para login)
export const findByEmail = async (email) => {
    const [rows] = await pool.query(
        'SELECT * FROM usuarios WHERE email = ? AND activo = 1',
        [email]
    );
    return rows[0] || null;
};

// Verificar si ya existe un usuario con ese email (para register)
export const findByEmailAny = async (email) => {
    const [rows] = await pool.query(
        'SELECT id_usuario FROM usuarios WHERE email = ?',
        [email]
    );
    return rows[0] || null;
};

// Insertar usuario base (dentro de una transacción)
export const insertUsuario = async (conn, { documento, apellido, nombres, email, contrasenia, foto_path, rol }) => {
    const [result] = await conn.query(
        'INSERT INTO usuarios (documento, apellido, nombres, email, contrasenia, foto_path, rol, activo) VALUES (?, ?, ?, ?, ?, ?, ?, 1)',
        [documento, apellido, nombres, email, contrasenia, foto_path, rol]
    );
    return result.insertId;
};

// Insertar médico asociado al usuario (dentro de una transacción)
export const insertMedico = async (conn, { id_usuario, matricula, id_especialidad, descripcion, valor_consulta }) => {
    await conn.query(
        'INSERT INTO medicos (id_usuario, id_especialidad, matricula, descripcion, valor_consulta) VALUES (?, ?, ?, ?, ?)',
        [id_usuario, id_especialidad, matricula, descripcion, valor_consulta]
    );
};

// Insertar paciente asociado al usuario (dentro de una transacción)
export const insertPaciente = async (conn, { id_usuario, id_obra_social }) => {
    await conn.query(
        'INSERT INTO pacientes (id_usuario, id_obra_social) VALUES (?, ?)',
        [id_usuario, id_obra_social]
    );
};
