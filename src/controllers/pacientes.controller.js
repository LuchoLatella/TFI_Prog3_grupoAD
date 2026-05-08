const pacientesService = require('../services/pacientes.service');

function getPacientes(req, res) {
    const pacientes = pacientesService.getAll();

    res.status(200).json({
        ok: true,
        data: pacientes
    });
}

function getPacienteById(req, res) {
    const id = parseInt(req.params.id);

    const paciente = pacientesService.getById(id);

    if (!paciente) {
        return res.status(404).json({
            ok: false,
            message: 'Paciente no encontrado'
        });
    }

    res.status(200).json({
        ok: true,
        data: paciente
    });
}

function createPaciente(req, res) {
    const nuevoPaciente = req.body;

    const pacienteCreado = pacientesService.create(nuevoPaciente);

    res.status(201).json({
        ok: true,
        message: 'Paciente creado',
        data: pacienteCreado
    });
}

function updatePaciente(req, res) {
    const id = parseInt(req.params.id);
    const datos = req.body;

    const pacienteActualizado = pacientesService.update(id, datos);

    if (!pacienteActualizado) {
        return res.status(404).json({
            ok: false,
            message: 'Paciente no encontrado'
        });
    }

    res.status(200).json({
        ok: true,
        message: 'Paciente actualizado',
        data: pacienteActualizado
    });
}

function deletePaciente(req, res) {
    const id = parseInt(req.params.id);

    const eliminado = pacientesService.remove(id);

    if (!eliminado) {
        return res.status(404).json({
            ok: false,
            message: 'Paciente no encontrado'
        });
    }

    res.status(200).json({
        ok: true,
        message: 'Paciente eliminado'
    });
}

module.exports = {
    getPacientes,
    getPacienteById,
    createPaciente,
    updatePaciente,
    deletePaciente
};
