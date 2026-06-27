import * as EspecialidadService from '../services/especialidades.service.js';

export const getEspecialidades = async (req, res) => {
    try {
        const data = await EspecialidadService.getAll();
        res.json(data);
    } catch (error) {
        res.status(error.status || 500).json({ mensaje: error.message });
    }
};

export const getEspecialidadById = async (req, res) => {
    try {
        const data = await EspecialidadService.getById(req.params.id);
        res.json(data);
    } catch (error) {
        res.status(error.status || 500).json({ mensaje: error.message });
    }
};

export const createEspecialidad = async (req, res) => {
    try {
        const data = await EspecialidadService.create(req.body.nombre);
        res.status(201).json(data);
    } catch (error) {
        res.status(error.status || 500).json({ mensaje: error.message });
    }
};

export const updateEspecialidad = async (req, res) => {
    try {
        const data = await EspecialidadService.update(req.params.id, req.body.nombre);
        res.json(data);
    } catch (error) {
        res.status(error.status || 500).json({ mensaje: error.message });
    }
};

export const deleteEspecialidad = async (req, res) => {
    try {
        const data = await EspecialidadService.remove(req.params.id);
        res.json(data);
    } catch (error) {
        res.status(error.status || 500).json({ mensaje: error.message });
    }
};
