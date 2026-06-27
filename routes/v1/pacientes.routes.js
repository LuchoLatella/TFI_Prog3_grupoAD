import { Router } from 'express';
import { body, param } from 'express-validator';
import { validarCampos } from '../../middlewares/validate.js';
import { verifyToken, checkRole } from '../../middlewares/auth.js';
import {
    getPacientes,
    getPacienteById,
    actualizarObraSocial
} from '../../controllers/pacientes.controller.js';

const router = Router();

/**
 * @swagger
 * /pacientes:
 *   get:
 *     summary: Listar todos los pacientes (solo admin)
 *     tags: [Pacientes]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Lista de pacientes
 */
router.get('/', verifyToken, checkRole([3]), getPacientes);

/**
 * @swagger
 * /pacientes/{id}:
 *   get:
 *     summary: Obtener un paciente por ID (solo admin)
 *     tags: [Pacientes]
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
 *         description: Datos del paciente
 *       404:
 *         description: Paciente no encontrado
 */
router.get(
    '/:id',
    verifyToken,
    checkRole([3]),
    param('id').isInt({ min: 1 }).withMessage('El ID debe ser un entero positivo'),
    validarCampos,
    getPacienteById
);

/**
 * @swagger
 * /pacientes/{id}/obra-social:
 *   put:
 *     summary: Actualizar obra social de un paciente (solo admin)
 *     tags: [Pacientes]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID del paciente
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
 *                 example: 2
 *     responses:
 *       200:
 *         description: Obra social actualizada
 *       404:
 *         description: Paciente no encontrado
 */
router.put(
    '/:id/obra-social',
    verifyToken,
    checkRole([3]),
    param('id').isInt({ min: 1 }).withMessage('El ID debe ser un entero positivo'),
    body('id_obra_social').isInt({ min: 1 }).withMessage('id_obra_social debe ser un entero positivo'),
    validarCampos,
    actualizarObraSocial
);

export default router;
