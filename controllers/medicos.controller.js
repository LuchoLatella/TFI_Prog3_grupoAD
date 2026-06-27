import * as MedicoService from '../services/medicos.service.js';

export const getMedicos = async (req, res) => {
    try {
        const data = await MedicoService.getAll(req.query.especialidad || null);
        res.json(data);
    } catch (error) {
        res.status(error.status || 500).json({ mensaje: error.message });
    }
};

export const getMedicoById = async (req, res) => {
    try {
        const data = await MedicoService.getById(req.params.id);
        res.json(data);
    } catch (error) {
        res.status(error.status || 500).json({ mensaje: error.message });
    }
};

export const asociarObraSocial = async (req, res) => {
    try {
        const data = await MedicoService.asociarObraSocial(req.params.id, req.body.id_obra_social);
        res.status(201).json(data);
    } catch (error) {
        res.status(error.status || 500).json({ mensaje: error.message });
    }
};

export const desasociarObraSocial = async (req, res) => {
    try {
        const data = await MedicoService.desasociarObraSocial(req.params.id, req.params.idOS);
        res.json(data);
    } catch (error) {
        res.status(error.status || 500).json({ mensaje: error.message });
    }
};
