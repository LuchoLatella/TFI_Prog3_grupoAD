import { Router } from 'express';
import { body, validationResult } from 'express-validator';
import { verificarToken } from '../middlewares/auth.js';
import { autorizar } from '../middlewares/roles.js';
import {
    getTurnos,
    crearTurno,
    marcarAtendido,
    getEstadisticas,
    getReportePDF
} from '../controllers/turnos.controller.js';

const validate = (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(400).json({ errores: errors.array() });
    next();
};

const router = Router();

/**
 * @swagger
 * /turnos:
 *   get:
 *     summary: Listar turnos (según rol)
 *     tags: [Turnos]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Lista de turnos
 */
router.get('/', verificarToken, autorizar(1, 2, 3), getTurnos);

/**
 * @swagger
 * /turnos/estadisticas:
 *   get:
 *     summary: Obtener estadísticas de atenciones (solo admin)
 *     tags: [Turnos]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Estadísticas
 */
router.get('/estadisticas', verificarToken, autorizar(3), getEstadisticas);

/**
 * @swagger
 * /turnos/reporte/pdf:
 *   get:
 *     summary: Descargar reporte PDF de turnos (solo admin)
 *     tags: [Turnos]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Archivo PDF
 */
router.get('/reporte/pdf', verificarToken, autorizar(3), getReportePDF);

/**
 * @swagger
 * /turnos:
 *   post:
 *     summary: Crear turno/reserva
 *     tags: [Turnos]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               id_medico:
 *                 type: integer
 *               id_paciente:
 *                 type: integer
 *               id_obra_social:
 *                 type: integer
 *               fecha_hora:
 *                 type: string
 *                 example: "2026-06-01 10:00:00"
 *     responses:
 *       201:
 *         description: Turno creado
 */
router.post('/', verificarToken, autorizar(2, 3),
    body('id_medico').isInt(),
    body('fecha_hora').notEmpty(),
    validate,
    crearTurno
);

/**
 * @swagger
 * /turnos/{id}/atendido:
 *   put:
 *     summary: Marcar turno como atendido (solo médico)
 *     tags: [Turnos]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Turno atendido
 */
router.put('/:id/atendido', verificarToken, autorizar(1), marcarAtendido);

export default router;
