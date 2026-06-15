import { Router } from 'express';
import { body, validationResult } from 'express-validator';
import { verifyToken, checkRole } from '../middlewares/auth.js';
import { autorizar } from '../middlewares/roles.js';
import {
    getEspecialidades,
    getEspecialidadById,
    createEspecialidad,
    updateEspecialidad,
    deleteEspecialidad
} from '../controllers/especialidades.controller.js';

const validate = (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(400).json({ errores: errors.array() });
    next();
};

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
router.get('/:id', verifyToken, checkRole([2, 3]), getEspecialidadById);

/**
 * @swagger
 * /especialidades:
 *   post:
 *     summary: Crear especialidad
 *     tags: [Especialidades]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               nombre:
 *                 type: string
 *     responses:
 *       201:
 *         description: Creada
 */
router.post('/', verifyToken, checkRole([3]), body('nombre').notEmpty(), validate, createEspecialidad);

/**
 * @swagger
 * /especialidades/{id}:
 *   put:
 *     summary: Editar especialidad
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
 *             properties:
 *               nombre:
 *                 type: string
 *     responses:
 *       200:
 *         description: Actualizada
 */
router.put('/:id', verifyToken, checkRole([3]), body('nombre').notEmpty(), validate, updateEspecialidad);

/**
 * @swagger
 * /especialidades/{id}:
 *   delete:
 *     summary: Eliminar especialidad (soft delete)
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
 */
router.delete('/:id', verifyToken, checkRole([3]), deleteEspecialidad);

export default router;
