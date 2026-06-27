import { Router } from 'express';
import { body, param } from 'express-validator';
import { validarCampos } from '../../middlewares/validate.js';
import { verifyToken, checkRole } from '../../middlewares/auth.js';
import {
    getEspecialidades,
    getEspecialidadById,
    createEspecialidad,
    updateEspecialidad,
    deleteEspecialidad
} from '../../controllers/especialidades.controller.js';

const router = Router();

/**
 * @swagger
 * /especialidades:
 *   get:
 *     summary: Listar especialidades
 *     tags: [Especialidades]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Lista de especialidades
 */
router.get('/', verifyToken, checkRole([2, 3]), getEspecialidades);

/**
 * @swagger
 * /especialidades/{id}:
 *   get:
 *     summary: Obtener especialidad por ID
 *     tags: [Especialidades]
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
 *         description: Especialidad
 *       404:
 *         description: No encontrada
 */
router.get(
    '/:id',
    verifyToken,
    checkRole([2, 3]),
    param('id').isInt({ min: 1 }).withMessage('El ID debe ser un entero positivo'),
    validarCampos,
    getEspecialidadById
);

/**
 * @swagger
 * /especialidades:
 *   post:
 *     summary: Crear especialidad (solo admin)
 *     tags: [Especialidades]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [nombre]
 *             properties:
 *               nombre:
 *                 type: string
 *     responses:
 *       201:
 *         description: Creada
 */
router.post(
    '/',
    verifyToken,
    checkRole([3]),
    body('nombre').notEmpty().withMessage('El nombre es obligatorio'),
    validarCampos,
    createEspecialidad
);

/**
 * @swagger
 * /especialidades/{id}:
 *   put:
 *     summary: Editar especialidad (solo admin)
 *     tags: [Especialidades]
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
 *             required: [nombre]
 *             properties:
 *               nombre:
 *                 type: string
 *     responses:
 *       200:
 *         description: Actualizada
 *       404:
 *         description: No encontrada
 */
router.put(
    '/:id',
    verifyToken,
    checkRole([3]),
    param('id').isInt({ min: 1 }).withMessage('El ID debe ser un entero positivo'),
    body('nombre').notEmpty().withMessage('El nombre es obligatorio'),
    validarCampos,
    updateEspecialidad
);

/**
 * @swagger
 * /especialidades/{id}:
 *   delete:
 *     summary: Eliminar especialidad (soft delete, solo admin)
 *     tags: [Especialidades]
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
 *         description: Eliminada
 *       404:
 *         description: No encontrada
 */
router.delete(
    '/:id',
    verifyToken,
    checkRole([3]),
    param('id').isInt({ min: 1 }).withMessage('El ID debe ser un entero positivo'),
    validarCampos,
    deleteEspecialidad
);

export default router;
