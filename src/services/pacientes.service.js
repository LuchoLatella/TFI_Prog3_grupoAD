const pacientes = require('../data/pacientes.data');

function getAll() {
    return pacientes;
}

function getById(id) {
    return pacientes.find(paciente => paciente.id === id);
}

function create(data) {
    const nuevoPaciente = {
        id: pacientes.length + 1,
        nombre: data.nombre,
        dni: data.dni,
        obraSocial: data.obraSocial
    };

    pacientes.push(nuevoPaciente);

    return nuevoPaciente;
}

function update(id, data) {
    const paciente = pacientes.find(p => p.id === id);

    if (!paciente) {
        return null;
    }

    paciente.nombre = data.nombre || paciente.nombre;
    paciente.dni = data.dni || paciente.dni;
    paciente.obraSocial = data.obraSocial || paciente.obraSocial;

    return paciente;
}

function remove(id) {
    const index = pacientes.findIndex(p => p.id === id);

    if (index === -1) {
        return false;
    }

    pacientes.splice(index, 1);

    return true;
}

module.exports = {
    getAll,
    getById,
    create,
    update,
    remove
};
