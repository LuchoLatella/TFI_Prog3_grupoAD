import { Router } from 'express';
import { body, param } from 'express-validator';
import { validarCampos } from '../middlewares/validate.js';
import { verifyToken, checkRole } from '../middlewares/auth.js';
import {
    getTurnos,
    crearTurno,
    marcarAtendido,
    getEstadisticas,
    getReportePDF
} from '../controllers/turnos.controller.js';

const router = Router();

/**
 * @swagger
 * tags:
 *   name: Turnos
 *   description: Gestión de turnos y reservas
 */

/**
 * @swagger
 * /turnos:
 *   get:
 *     summary: Listar turnos según rol del usuario autenticado
 *     tags: [Turnos]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Lista de turnos (médico ve los suyos, paciente los suyos, admin todos)
 */
router.get(
    '/',
    verifyToken,
    checkRole([1, 2, 3]), // todos los roles
    getTurnos
);

/**
 * @swagger
 * /turnos:
 *   post:
 *     summary: Crear un turno (paciente o admin)
 *     tags: [Turnos]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [id_medico, fecha_hora]
 *             properties:
 *               id_medico:
 *                 type: integer
 *               id_paciente:
 *                 type: integer
 *                 description: Solo requerido si el que crea es admin (rol 3)
 *               id_obra_social:
 *                 type: integer
 *                 description: Opcional para paciente (usa la propia), requerido para admin
 *               fecha_hora:
 *                 type: string
 *                 format: date-time
 *                 example: "2026-06-20T10:00:00"
 *     responses:
 *       201:
 *         description: Turno creado con valor_total calculado
 *       404:
 *         description: Médico, paciente u obra social no encontrados
 */
router.post(
    '/',
    verifyToken,
    checkRole([2, 3]), // pacientes y admin pueden crear turnos
    body('id_medico').isInt({ min: 1 }).withMessage('id_medico debe ser un entero positivo'),
    body('fecha_hora').isISO8601().withMessage('fecha_hora debe ser una fecha válida (ISO 8601)'),
    body('id_paciente').optional().isInt({ min: 1 }).withMessage('id_paciente debe ser un entero positivo'),
    body('id_obra_social').optional().isInt({ min: 1 }).withMessage('id_obra_social debe ser un entero positivo'),
    validarCampos,
    crearTurno
);

/**
 * @swagger
 * /turnos/{id}/atendido:
 *   patch:
 *     summary: Marcar un turno como atendido (solo médico)
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
 *         description: Turno marcado como atendido
 *       404:
 *         description: Turno no encontrado o no pertenece al médico
 */
router.patch(
    '/:id/atendido',
    verifyToken,
    checkRole([1]), // solo médicos
    param('id').isInt({ min: 1 }).withMessage('El ID debe ser un entero positivo'),
    validarCampos,
    marcarAtendido
);

/**
 * @swagger
 * /turnos/estadisticas:
 *   get:
 *     summary: Obtener estadísticas de atenciones via stored procedure (solo admin)
 *     tags: [Turnos]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Estadísticas del mes anterior (resumen, por obra social, por especialidad)
 */
router.get(
    '/estadisticas',
    verifyToken,
    checkRole([3]), // solo admin
    getEstadisticas
);

/**
 * @swagger
 * /turnos/reporte-pdf:
 *   get:
 *     summary: Descargar reporte PDF de turnos (solo admin)
 *     tags: [Turnos]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Archivo PDF con el informe de turnos
 *         content:
 *           application/pdf:
 *             schema:
 *               type: string
 *               format: binary
 */
router.get(
    '/reporte-pdf',
    verifyToken,
    checkRole([3]),
    getReportePDF
);

export default router;