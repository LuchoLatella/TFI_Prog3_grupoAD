import * as EspecialidadRepository from '../repositories/especialidades.repository.js';

export const getAll = async () => {
    return EspecialidadRepository.findAll();
};

export const getById = async (id) => {
    const especialidad = await EspecialidadRepository.findById(id);
    if (!especialidad) {
        const error = new Error('Especialidad no encontrada');
        error.status = 404;
        throw error;
    }
    return especialidad;
};

export const create = async (nombre) => {
    const id = await EspecialidadRepository.create(nombre);
    return { id_especialidad: id, nombre };
};

export const update = async (id, nombre) => {
    const affected = await EspecialidadRepository.update(id, nombre);
    if (!affected) {
        const error = new Error('Especialidad no encontrada');
        error.status = 404;
        throw error;
    }
    return { mensaje: 'Actualizada' };
};

export const remove = async (id) => {
    const affected = await EspecialidadRepository.remove(id);
    if (!affected) {
        const error = new Error('Especialidad no encontrada');
        error.status = 404;
        throw error;
    }
    return { mensaje: 'Eliminada' };
};
