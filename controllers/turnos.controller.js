import * as TurnoService from '../services/turnos.service.js';

export const getTurnos = async (req, res) => {
    try {
        const { id, rol } = req.usuario;
        const data = await TurnoService.getTurnos(id, rol);
        res.json(data);
    } catch (error) {
        res.status(error.status || 500).json({ mensaje: error.message });
    }
};

export const crearTurno = async (req, res) => {
    try {
        const { id, rol } = req.usuario;
        const data = await TurnoService.crearTurno(req.body, id, rol);
        res.status(201).json(data);
    } catch (error) {
        res.status(error.status || 500).json({ mensaje: error.message });
    }
};

export const marcarAtendido = async (req, res) => {
    try {
        const data = await TurnoService.marcarAtendido(req.params.id, req.usuario.id);
        res.json(data);
    } catch (error) {
        res.status(error.status || 500).json({ mensaje: error.message });
    }
};

export const cancelarTurno = async (req, res) => {
    try {
        const { id, rol } = req.usuario;
        const data = await TurnoService.cancelarTurno(req.params.id, id, rol);
        res.json(data);
    } catch (error) {
        res.status(error.status || 500).json({ mensaje: error.message });
    }
};

export const getEstadisticas = async (req, res) => {
    try {
        const data = await TurnoService.getEstadisticas();
        res.json(data);
    } catch (error) {
        res.status(error.status || 500).json({ mensaje: error.message });
    }
};

export const getReportePDF = async (req, res) => {
    try {
        const buffer = await TurnoService.generarReportePDF();
        res.setHeader('Content-Type', 'application/pdf');
        res.setHeader('Content-Disposition', 'attachment; filename=turnos.pdf');
        res.send(buffer);
    } catch (error) {
        res.status(500).json({ mensaje: error.message });
    }
};
