import { pool } from '../config/db.js';
import { createRequire } from 'module';

const require = createRequire(import.meta.url);
const PDFDocument = require('pdfkit');

export const getTurnos = async (req, res) => {
    try {
        const { id, rol } = req.usuario;
        let query, params;

        if (rol === 1) {
            query = `
                SELECT tr.id_turno_reserva, tr.fecha_hora, tr.valor_total, tr.atentido,
                       CONCAT(up.apellido, ' ', up.nombres) AS paciente,
                       up.documento,
                       os.nombre AS obra_social
                FROM turnos_reservas tr
                JOIN pacientes p ON tr.id_paciente = p.id_paciente
                JOIN usuarios up ON p.id_usuario = up.id_usuario
                JOIN obras_sociales os ON tr.id_obra_social = os.id_obra_social
                JOIN medicos m ON tr.id_medico = m.id_medico
                WHERE m.id_usuario = ? AND tr.activo = 1
                ORDER BY tr.fecha_hora DESC
            `;
            params = [id];
        } else if (rol === 2) {
            query = `
                SELECT tr.id_turno_reserva, tr.fecha_hora, tr.valor_total, tr.atentido,
                       CONCAT(um.apellido, ' ', um.nombres) AS medico,
                       e.nombre AS especialidad,
                       os.nombre AS obra_social
                FROM turnos_reservas tr
                JOIN medicos m ON tr.id_medico = m.id_medico
                JOIN usuarios um ON m.id_usuario = um.id_usuario
                JOIN especialidades e ON m.id_especialidad = e.id_especialidad
                JOIN obras_sociales os ON tr.id_obra_social = os.id_obra_social
                JOIN pacientes p ON tr.id_paciente = p.id_paciente
                WHERE p.id_usuario = ? AND tr.activo = 1
                ORDER BY tr.fecha_hora DESC
            `;
            params = [id];
        } else {
            query = `
                SELECT tr.id_turno_reserva, tr.fecha_hora, tr.valor_total, tr.atentido,
                       CONCAT(um.apellido, ' ', um.nombres) AS medico,
                       CONCAT(up.apellido, ' ', up.nombres) AS paciente,
                       os.nombre AS obra_social,
                       e.nombre AS especialidad
                FROM turnos_reservas tr
                JOIN medicos m ON tr.id_medico = m.id_medico
                JOIN usuarios um ON m.id_usuario = um.id_usuario
                JOIN especialidades e ON m.id_especialidad = e.id_especialidad
                JOIN pacientes p ON tr.id_paciente = p.id_paciente
                JOIN usuarios up ON p.id_usuario = up.id_usuario
                JOIN obras_sociales os ON tr.id_obra_social = os.id_obra_social
                WHERE tr.activo = 1
                ORDER BY tr.fecha_hora DESC
            `;
            params = [];
        }

        const [rows] = await pool.query(query, params);
        res.json(rows);
    } catch (error) {
        res.status(500).json({ mensaje: error.message });
    }
};

export const crearTurno = async (req, res) => {
    const conn = await pool.getConnection();
    try {
        let { id_medico, id_paciente, id_obra_social, fecha_hora } = req.body;
        const { id: id_usuario, rol } = req.usuario;

        await conn.beginTransaction();

        if (rol === 2) {
            const [pac] = await conn.query(
                'SELECT id_paciente, id_obra_social FROM pacientes WHERE id_usuario = ?',
                [id_usuario]
            );
            if (!pac[0]) {
                await conn.rollback();
                return res.status(404).json({ mensaje: 'Paciente no encontrado' });
            }
            id_paciente = pac[0].id_paciente;
            id_obra_social = id_obra_social ?? pac[0].id_obra_social;
        }

        const [medicos] = await conn.query(
            'SELECT valor_consulta FROM medicos WHERE id_medico = ?',
            [id_medico]
        );
        if (!medicos[0]) {
            await conn.rollback();
            return res.status(404).json({ mensaje: 'Médico no encontrado' });
        }

        const [obras] = await conn.query(
            'SELECT porcentaje_descuento, es_particular FROM obras_sociales WHERE id_obra_social = ? AND activo = 1',
            [id_obra_social]
        );
        if (!obras[0]) {
            await conn.rollback();
            return res.status(404).json({ mensaje: 'Obra social no encontrada' });
        }

        const { valor_consulta } = medicos[0];
        const { porcentaje_descuento, es_particular } = obras[0];

        const valor_total = es_particular
            ? valor_consulta
            : valor_consulta - (porcentaje_descuento / 100) * valor_consulta;

        const [result] = await conn.query(
            'INSERT INTO turnos_reservas (id_medico, id_paciente, id_obra_social, fecha_hora, valor_total, atentido) VALUES (?, ?, ?, ?, ?, 0)',
            [id_medico, id_paciente, id_obra_social, fecha_hora, valor_total]
        );

        await conn.commit();
        res.status(201).json({ id_turno_reserva: result.insertId, valor_total });
    } catch (error) {
        await conn.rollback();
        res.status(500).json({ mensaje: error.message });
    } finally {
        conn.release();
    }
};

export const marcarAtendido = async (req, res) => {
    try {
        const { id } = req.params;
        const { id: id_usuario } = req.usuario;

        const [check] = await pool.query(`
            SELECT tr.id_turno_reserva FROM turnos_reservas tr
            JOIN medicos m ON tr.id_medico = m.id_medico
            WHERE tr.id_turno_reserva = ? AND m.id_usuario = ? AND tr.activo = 1
        `, [id, id_usuario]);

        if (!check[0]) return res.status(404).json({ mensaje: 'Turno no encontrado' });

        await pool.query(
            'UPDATE turnos_reservas SET atentido = 1 WHERE id_turno_reserva = ?',
            [id]
        );
        res.json({ mensaje: 'Turno marcado como atendido' });
    } catch (error) {
        res.status(500).json({ mensaje: error.message });
    }
};

export const getEstadisticas = async (req, res) => {
    try {
        const [rows] = await pool.query('CALL sp_estadisticas()');
        res.json({
            resumen: rows[0],
            por_obra_social: rows[1],
            por_especialidad: rows[2]
        });
    } catch (error) {
        res.status(500).json({ mensaje: error.message });
    }
};

export const getReportePDF = async (req, res) => {
    try {
        const [turnos] = await pool.query(`
            SELECT tr.id_turno_reserva, tr.fecha_hora, tr.valor_total, tr.atentido,
                   CONCAT(um.apellido, ' ', um.nombres) AS medico,
                   CONCAT(up.apellido, ' ', up.nombres) AS paciente,
                   os.nombre AS obra_social,
                   e.nombre AS especialidad
            FROM turnos_reservas tr
            JOIN medicos m ON tr.id_medico = m.id_medico
            JOIN usuarios um ON m.id_usuario = um.id_usuario
            JOIN especialidades e ON m.id_especialidad = e.id_especialidad
            JOIN pacientes p ON tr.id_paciente = p.id_paciente
            JOIN usuarios up ON p.id_usuario = up.id_usuario
            JOIN obras_sociales os ON tr.id_obra_social = os.id_obra_social
            WHERE tr.activo = 1
            ORDER BY tr.fecha_hora DESC
        `);

        const doc = new PDFDocument({ margin: 40 });
        res.setHeader('Content-Type', 'application/pdf');
        res.setHeader('Content-Disposition', 'attachment; filename=turnos.pdf');
        doc.pipe(res);

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
    } catch (error) {
        res.status(500).json({ mensaje: error.message });
    }
};
