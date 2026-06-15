import { Router } from 'express';
import { body, param, query } from 'express-validator';
import { validarCampos } from '../middlewares/validate.js';
import { verifyToken, checkRole } from '../middlewares/auth.js';
import {
    getMedicos,
    getMedicoById,
    asociarObraSocial,
    desasociarObraSocial
} from '../controllers/medicos.controller.js';

const router = Router();

/**
 * @swagger
 * tags:
 *   name: Médicos
 *   description: Gestión de médicos y sus obras sociales
 */

/**
 * @swagger
 * /medicos:
 *   get:
 *     summary: Listar todos los médicos (con filtro opcional por especialidad)
 *     tags: [Médicos]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: especialidad
 *         schema:
 *           type: integer
 *         description: Filtrar por id_especialidad
 *     responses:
 *       200:
 *         description: Lista de médicos
 */
router.get(
    '/',
    verifyToken,
    checkRole([2, 3]), // pacientes y admins pueden listar médicos
    query('especialidad').optional().isInt({ min: 1 }).withMessage('ID especialidad inválido'),
    validarCampos,
    getMedicos
);

/**
 * @swagger
 * /medicos/{id}:
 *   get:
 *     summary: Obtener un médico por ID
 *     tags: [Médicos]
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
 *         description: Datos del médico
 *       404:
 *         description: Médico no encontrado
 */
router.get(
    '/:id',
    verifyToken,
    checkRole([2, 3]),
    param('id').isInt({ min: 1 }).withMessage('El ID debe ser un entero positivo'),
    validarCampos,
    getMedicoById
);

/**
 * @swagger
 * /medicos/{id}/obras-sociales:
 *   post:
 *     summary: Asociar un médico con una obra social (solo admin)
 *     tags: [Médicos]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [id_obra_social]
 *             properties:
 *               id_obra_social:
 *                 type: integer
 *     responses:
 *       201:
 *         description: Asociación creada
 *       409:
 *         description: Ya existe esa asociación
 */
router.post(
    '/:id/obras-sociales',
    verifyToken,
    checkRole([3]), // solo admin
    param('id').isInt({ min: 1 }).withMessage('El ID debe ser un entero positivo'),
    body('id_obra_social').isInt({ min: 1 }).withMessage('id_obra_social debe ser un entero positivo'),
    validarCampos,
    asociarObraSocial
);

/**
 * @swagger
 * /medicos/{id}/obras-sociales/{idOS}:
 *   delete:
 *     summary: Desasociar un médico de una obra social (solo admin)
 *     tags: [Médicos]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *       - in: path
 *         name: idOS
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Desasociado correctamente
 *       404:
 *         description: Asociación no encontrada
 */
router.delete(
    '/:id/obras-sociales/:idOS',
    verifyToken,
    checkRole([3]),
    param('id').isInt({ min: 1 }).withMessage('El ID debe ser un entero positivo'),
    param('idOS').isInt({ min: 1 }).withMessage('El ID de obra social debe ser un entero positivo'),
    validarCampos,
    desasociarObraSocial
);

export default router;