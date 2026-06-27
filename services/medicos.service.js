import * as MedicoRepository from '../repositories/medicos.repository.js';

export const getAll = async (idEspecialidad = null) => {
    return MedicoRepository.findAll(idEspecialidad);
};

export const getById = async (id) => {
    const medico = await MedicoRepository.findById(id);
    if (!medico) {
        const error = new Error('Médico no encontrado');
        error.status = 404;
        throw error;
    }
    return medico;
};

export const asociarObraSocial = async (idMedico, idObraSocial) => {
    try {
        await MedicoRepository.asociarObraSocial(idMedico, idObraSocial);
        return { mensaje: 'Obra social asociada al médico' };
    } catch (error) {
        if (error.code === 'ER_DUP_ENTRY') {
            const err = new Error('Ya existe esa asociación');
            err.status = 409;
            throw err;
        }
        throw error;
    }
};

export const desasociarObraSocial = async (idMedico, idObraSocial) => {
    const affected = await MedicoRepository.desasociarObraSocial(idMedico, idObraSocial);
    if (!affected) {
        const error = new Error('Asociación no encontrada');
        error.status = 404;
        throw error;
    }
    return { mensaje: 'Desasociado' };
};
