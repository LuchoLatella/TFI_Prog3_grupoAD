const express = require('express');
const router = express.Router();

const {
    getPacientes,
    getPacienteById,
    createPaciente,
    updatePaciente,
    deletePaciente
} = require('../controllers/pacientes.controller');

router.get('/', getPacientes);
router.get('/:id', getPacienteById);
router.post('/', createPaciente);
router.put('/:id', updatePaciente);
router.delete('/:id', deletePaciente);

module.exports = router;
