import { pool } from '../config/db.js';
import * as PacienteRepository from '../repositories/pacientes.repository.js';

export const getAll = async () => {
    return PacienteRepository.findAll();
};

export const getById = async (id) => {
    const paciente = await PacienteRepository.findById(id);
    if (!paciente) {
        const error = new Error('Paciente no encontrado');
        error.status = 404;
        throw error;
    }
    return paciente;
};

export const actualizarObraSocial = async (idPaciente, idObraSocial) => {
    const conn = await pool.getConnection();
    try {
        await conn.beginTransaction();
        const affected = await PacienteRepository.updateObraSocial(conn, idPaciente, idObraSocial);
        if (!affected) {
            await conn.rollback();
            const error = new Error('Paciente no encontrado');
            error.status = 404;
            throw error;
        }
        await conn.commit();
        return { mensaje: 'Obra social actualizada' };
    } catch (error) {
        await conn.rollback();
        throw error;
    } finally {
        conn.release();
    }
};
