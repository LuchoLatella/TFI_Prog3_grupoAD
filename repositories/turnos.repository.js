import { pool } from '../config/db.js';

const turnoFullSelect = `
    SELECT tr.id_turno_reserva, tr.fecha_hora, tr.valor_total, tr.atentido,
           CONCAT(um.apellido, ' ', um.nombres) AS medico,
           CONCAT(up.apellido, ' ', up.nombres) AS paciente,
           os.nombre AS obra_social,
           e.nombre AS especialidad
    FROM turnos_reservas tr
    JOIN medicos m ON tr.id_medico = m.id_medico
    JOIN usuarios um ON m.id_usuario = um.id_usuario
    JOIN especialidades e ON m.id_especialidad = e.id_especialidad
    JOIN pacientes p ON tr.id_paciente = p.id_paciente
    JOIN usuarios up ON p.id_usuario = up.id_usuario
    JOIN obras_sociales os ON tr.id_obra_social = os.id_obra_social
`;

export const findByMedico = async (idUsuario) => {
    const [rows] = await pool.query(`
        SELECT tr.id_turno_reserva, tr.fecha_hora, tr.valor_total, tr.atentido,
               CONCAT(up.apellido, ' ', up.nombres) AS paciente,
               up.documento,
               os.nombre AS obra_social
        FROM turnos_reservas tr
        JOIN pacientes p ON tr.id_paciente = p.id_paciente
        JOIN usuarios up ON p.id_usuario = up.id_usuario
        JOIN obras_sociales os ON tr.id_obra_social = os.id_obra_social
        JOIN medicos m ON tr.id_medico = m.id_medico
        WHERE m.id_usuario = ? AND tr.activo = 1
        ORDER BY tr.fecha_hora DESC
    `, [idUsuario]);
    return rows;
};

export const findByPaciente = async (idUsuario) => {
    const [rows] = await pool.query(`
        SELECT tr.id_turno_reserva, tr.fecha_hora, tr.valor_total, tr.atentido,
               CONCAT(um.apellido, ' ', um.nombres) AS medico,
               e.nombre AS especialidad,
               os.nombre AS obra_social
        FROM turnos_reservas tr
        JOIN medicos m ON tr.id_medico = m.id_medico
        JOIN usuarios um ON m.id_usuario = um.id_usuario
        JOIN especialidades e ON m.id_especialidad = e.id_especialidad
        JOIN obras_sociales os ON tr.id_obra_social = os.id_obra_social
        JOIN pacientes p ON tr.id_paciente = p.id_paciente
        WHERE p.id_usuario = ? AND tr.activo = 1
        ORDER BY tr.fecha_hora DESC
    `, [idUsuario]);
    return rows;
};

export const findAll = async () => {
    const [rows] = await pool.query(
        turnoFullSelect + ' WHERE tr.activo = 1 ORDER BY tr.fecha_hora DESC'
    );
    return rows;
};

export const findById = async (id) => {
    const [rows] = await pool.query(
        'SELECT id_turno_reserva FROM turnos_reservas WHERE id_turno_reserva = ? AND activo = 1',
        [id]
    );
    return rows[0] || null;
};

export const findByIdForMedico = async (idTurno, idUsuario) => {
    const [rows] = await pool.query(`
        SELECT tr.id_turno_reserva FROM turnos_reservas tr
        JOIN medicos m ON tr.id_medico = m.id_medico
        WHERE tr.id_turno_reserva = ? AND m.id_usuario = ? AND tr.activo = 1
    `, [idTurno, idUsuario]);
    return rows[0] || null;
};

export const findByIdForPaciente = async (idTurno, idUsuario) => {
    const [rows] = await pool.query(`
        SELECT tr.id_turno_reserva FROM turnos_reservas tr
        JOIN pacientes p ON tr.id_paciente = p.id_paciente
        WHERE tr.id_turno_reserva = ? AND p.id_usuario = ? AND tr.activo = 1
    `, [idTurno, idUsuario]);
    return rows[0] || null;
};

export const findPacienteByUsuario = async (idUsuario) => {
    const [rows] = await pool.query(
        'SELECT id_paciente, id_obra_social FROM pacientes WHERE id_usuario = ?',
        [idUsuario]
    );
    return rows[0] || null;
};

export const findMedicoById = async (idMedico) => {
    const [rows] = await pool.query(
        'SELECT valor_consulta FROM medicos WHERE id_medico = ?',
        [idMedico]
    );
    return rows[0] || null;
};

export const findObraSocialById = async (idObraSocial) => {
    const [rows] = await pool.query(
        'SELECT porcentaje_descuento, es_particular FROM obras_sociales WHERE id_obra_social = ? AND activo = 1',
        [idObraSocial]
    );
    return rows[0] || null;
};

export const create = async (conn, { id_medico, id_paciente, id_obra_social, fecha_hora, valor_total }) => {
    const [result] = await conn.query(
        'INSERT INTO turnos_reservas (id_medico, id_paciente, id_obra_social, fecha_hora, valor_total, atentido) VALUES (?, ?, ?, ?, ?, 0)',
        [id_medico, id_paciente, id_obra_social, fecha_hora, valor_total]
    );
    return result.insertId;
};

export const marcarAtendido = async (idTurno) => {
    await pool.query(
        'UPDATE turnos_reservas SET atentido = 1 WHERE id_turno_reserva = ?',
        [idTurno]
    );
};

export const cancelar = async (idTurno) => {
    await pool.query(
        'UPDATE turnos_reservas SET activo = 0 WHERE id_turno_reserva = ?',
        [idTurno]
    );
};

export const getEstadisticas = async () => {
    const [rows] = await pool.query('CALL sp_estadisticas()');
    return rows;
};
