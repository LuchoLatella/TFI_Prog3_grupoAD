import { createRequire } from 'module';
import { pool } from '../config/db.js';
import * as TurnoRepository from '../repositories/turnos.repository.js';

const require = createRequire(import.meta.url);
const PDFDocument = require('pdfkit');

export const getTurnos = async (idUsuario, rol) => {
    if (rol === 1) return TurnoRepository.findByMedico(idUsuario);
    if (rol === 2) return TurnoRepository.findByPaciente(idUsuario);
    return TurnoRepository.findAll();
};

export const crearTurno = async ({ id_medico, id_paciente, id_obra_social, fecha_hora }, idUsuario, rol) => {
    const conn = await pool.getConnection();
    try {
        await conn.beginTransaction();

        // Todas las consultas dentro de la transacción reciben conn
        if (rol === 2) {
            const paciente = await TurnoRepository.findPacienteByUsuario(conn, idUsuario);
            if (!paciente) {
                const error = new Error('Paciente no encontrado');
                error.status = 404;
                throw error;
            }
            id_paciente = paciente.id_paciente;
            id_obra_social = id_obra_social ?? paciente.id_obra_social;
        }

        const medico = await TurnoRepository.findMedicoById(conn, id_medico);
        if (!medico) {
            const error = new Error('Médico no encontrado');
            error.status = 404;
            throw error;
        }

        const obraSocial = await TurnoRepository.findObraSocialById(conn, id_obra_social);
        if (!obraSocial) {
            const error = new Error('Obra social no encontrada');
            error.status = 404;
            throw error;
        }

        const { valor_consulta } = medico;
        const { porcentaje_descuento, es_particular } = obraSocial;

        // Regla de negocio del enunciado
        const valor_total = es_particular
            ? valor_consulta
            : valor_consulta - (porcentaje_descuento / 100) * valor_consulta;

        const id_turno_reserva = await TurnoRepository.create(conn, {
            id_medico, id_paciente, id_obra_social, fecha_hora, valor_total
        });

        await conn.commit();
        return { id_turno_reserva, valor_total };
    } catch (error) {
        await conn.rollback();
        throw error;
    } finally {
        conn.release();
    }
};

export const marcarAtendido = async (idTurno, idUsuario) => {
    const turno = await TurnoRepository.findByIdForMedico(idTurno, idUsuario);
    if (!turno) {
        const error = new Error('Turno no encontrado');
        error.status = 404;
        throw error;
    }
    await TurnoRepository.marcarAtendido(idTurno);
    return { mensaje: 'Turno marcado como atendido' };
};

export const cancelarTurno = async (idTurno, idUsuario, rol) => {
    let turno;
    if (rol === 3) {
        turno = await TurnoRepository.findById(idTurno);
    } else {
        turno = await TurnoRepository.findByIdForPaciente(idTurno, idUsuario);
    }
    if (!turno) {
        const error = new Error('Turno no encontrado');
        error.status = 404;
        throw error;
    }
    await TurnoRepository.cancelar(idTurno);
    return { mensaje: 'Turno cancelado' };
};

export const getEstadisticas = async () => {
    const rows = await TurnoRepository.getEstadisticas();
    return {
        resumen: rows[0],
        por_obra_social: rows[1],
        por_especialidad: rows[2]
    };
};

export const generarReportePDF = async () => {
    const turnos = await TurnoRepository.findAll();

    return new Promise((resolve, reject) => {
        const doc = new PDFDocument({ margin: 40 });
        const chunks = [];

        doc.on('data', chunk => chunks.push(chunk));
        doc.on('end', () => resolve(Buffer.concat(chunks)));
        doc.on('error', reject);

        doc.fontSize(18).text('Informe de Turnos - Clínica Médica', { align: 'center' });
        doc.moveDown();

        const atendidos = turnos.filter(t => t.atentido).length;
        const recaudacion = turnos.reduce((acc, t) => acc + Number(t.valor_total), 0);

        doc.fontSize(12)
            .text(`Total de turnos: ${turnos.length}`)
            .text(`Atendidos: ${atendidos}`)
            .text(`Pendientes: ${turnos.length - atendidos}`)
            .text(`Recaudación total: $${recaudacion.toFixed(2)}`);

        doc.moveDown();
        doc.fontSize(10).text('Detalle:', { underline: true });
        doc.moveDown(0.5);

        turnos.forEach(t => {
            const fecha = new Date(t.fecha_hora).toLocaleString('es-AR');
            const estado = t.atentido ? 'Atendido' : 'Pendiente';
            doc.text(`[${t.id_turno_reserva}] ${fecha} | Dr. ${t.medico} (${t.especialidad}) | Pac. ${t.paciente} | ${t.obra_social} | $${t.valor_total} | ${estado}`);
        });

        doc.end();
    });
};
