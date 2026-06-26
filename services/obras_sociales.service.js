import * as ObraSocialRepository from '../repositories/obras_sociales.repository.js';

export const getAll = async () => {
    return ObraSocialRepository.findAll();
};

export const getById = async (id) => {
    const obraSocial = await ObraSocialRepository.findById(id);
    if (!obraSocial) {
        const error = new Error('Obra social no encontrada');
        error.status = 404;
        throw error;
    }
    return obraSocial;
};

export const create = async (datos) => {
    const existente = await ObraSocialRepository.findByNombre(datos.nombre);
    if (existente) {
        const error = new Error('Ya existe una obra social con ese nombre');
        error.status = 409;
        throw error;
    }
    const id = await ObraSocialRepository.create(datos);
    return { id_obra_social: id, nombre: datos.nombre };
};

export const update = async (id, datos) => {
    const affected = await ObraSocialRepository.update(id, datos);
    if (!affected) {
        const error = new Error('Obra social no encontrada');
        error.status = 404;
        throw error;
    }
    return { mensaje: 'Actualizada' };
};

export const remove = async (id) => {
    const affected = await ObraSocialRepository.remove(id);
    if (!affected) {
        const error = new Error('Obra social no encontrada');
        error.status = 404;
        throw error;
    }
    return { mensaje: 'Eliminada' };
};
