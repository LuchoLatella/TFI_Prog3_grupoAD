import * as PacienteService from '../services/pacientes.service.js';

export const getPacientes = async (req, res) => {
    try {
        const data = await PacienteService.getAll();
        res.json(data);
    } catch (error) {
        res.status(error.status || 500).json({ mensaje: error.message });
    }
};

export const getPacienteById = async (req, res) => {
    try {
        const data = await PacienteService.getById(req.params.id);
        res.json(data);
    } catch (error) {
        res.status(error.status || 500).json({ mensaje: error.message });
    }
};

export const actualizarObraSocial = async (req, res) => {
    try {
        const data = await PacienteService.actualizarObraSocial(req.params.id, req.body.id_obra_social);
        res.json(data);
    } catch (error) {
        res.status(error.status || 500).json({ mensaje: error.message });
    }
};
