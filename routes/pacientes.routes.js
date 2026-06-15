import { Router } from 'express';
import { body, param } from 'express-validator';
import { validarCampos } from '../middlewares/validate.js';
import { verifyToken, checkRole } from '../middlewares/auth.js';
import {
    getPacientes,
    asociarObraSocial
} from '../controllers/pacientes.controller.js';

const router = Router();

/**
 * @swagger
 * tags:
 *   name: Pacientes
 *   description: Gestión de pacientes
 */

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
router.get(
    '/',
    verifyToken,
    checkRole([3]), // solo admin
    getPacientes
);

/**
 * @swagger
 * /pacientes/{id}/obra-social:
 *   put:
 *     summary: Asociar/actualizar obra social de un paciente (solo admin)
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
 *         description: Paciente u obra social no encontrados
 */
router.put(
    '/:id/obra-social',
    verifyToken,
    checkRole([3]),
    param('id').isInt({ min: 1 }).withMessage('El ID debe ser un entero positivo'),
    body('id_obra_social').isInt({ min: 1 }).withMessage('id_obra_social debe ser un entero positivo'),
    validarCampos,
    asociarObraSocial
);

export default router;