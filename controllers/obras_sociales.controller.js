import * as ObraSocialService from '../services/obras_sociales.service.js';

export const getObrasSociales = async (req, res) => {
    try {
        const data = await ObraSocialService.getAll();
        res.json(data);
    } catch (error) {
        res.status(error.status || 500).json({ mensaje: error.message });
    }
};

export const getObraSocialById = async (req, res) => {
    try {
        const data = await ObraSocialService.getById(req.params.id);
        res.json(data);
    } catch (error) {
        res.status(error.status || 500).json({ mensaje: error.message });
    }
};

export const createObraSocial = async (req, res) => {
    try {
        const data = await ObraSocialService.create(req.body);
        res.status(201).json(data);
    } catch (error) {
        res.status(error.status || 500).json({ mensaje: error.message });
    }
};

export const updateObraSocial = async (req, res) => {
    try {
        const data = await ObraSocialService.update(req.params.id, req.body);
        res.json(data);
    } catch (error) {
        res.status(error.status || 500).json({ mensaje: error.message });
    }
};

export const deleteObraSocial = async (req, res) => {
    try {
        const data = await ObraSocialService.remove(req.params.id);
        res.json(data);
    } catch (error) {
        res.status(error.status || 500).json({ mensaje: error.message });
    }
};
