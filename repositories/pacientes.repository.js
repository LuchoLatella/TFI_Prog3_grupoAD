import { pool } from '../config/db.js';

const pacienteSelect = `
    SELECT p.id_paciente, u.id_usuario, u.documento, u.apellido, u.nombres, u.email, u.foto_path,
           os.id_obra_social, os.nombre AS obra_social
    FROM pacientes p
    JOIN usuarios u ON p.id_usuario = u.id_usuario
    JOIN obras_sociales os ON p.id_obra_social = os.id_obra_social
    WHERE u.activo = 1
`;

export const findAll = async () => {
    const [rows] = await pool.query(pacienteSelect);
    return rows;
};

export const findById = async (id) => {
    const [rows] = await pool.query(pacienteSelect + ' AND p.id_paciente = ?', [id]);
    return rows[0] || null;
};

export const updateObraSocial = async (conn, idPaciente, idObraSocial) => {
    const [result] = await conn.query(
        'UPDATE pacientes SET id_obra_social = ? WHERE id_paciente = ?',
        [idObraSocial, idPaciente]
    );
    return result.affectedRows;
};
