import { Router } from 'express';
import { body, param } from 'express-validator';
import { validarCampos } from '../../middlewares/validate.js';
import { verifyToken, checkRole } from '../../middlewares/auth.js';
import {
    getObrasSociales,
    getObraSocialById,
    createObraSocial,
    updateObraSocial,
    deleteObraSocial
} from '../../controllers/obras_sociales.controller.js';

const router = Router();

/**
 * @swagger
 * /obras-sociales:
 *   get:
 *     summary: Listar todas las obras sociales activas
 *     tags: [Obras Sociales]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Lista de obras sociales
 */
router.get('/', verifyToken, checkRole([2, 3]), getObrasSociales);

/**
 * @swagger
 * /obras-sociales/{id}:
 *   get:
 *     summary: Obtener una obra social por ID
 *     tags: [Obras Sociales]
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
 *         description: Obra social encontrada
 *       404:
 *         description: No encontrada
 */
router.get(
    '/:id',
    verifyToken,
    checkRole([2, 3]),
    param('id').isInt({ min: 1 }).withMessage('El ID debe ser un entero positivo'),
    validarCampos,
    getObraSocialById
);

/**
 * @swagger
 * /obras-sociales:
 *   post:
 *     summary: Crear una obra social (solo admin)
 *     tags: [Obras Sociales]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [nombre, porcentaje_descuento]
 *             properties:
 *               nombre:
 *                 type: string
 *                 example: OSDE
 *               descripcion:
 *                 type: string
 *               porcentaje_descuento:
 *                 type: number
 *                 example: 30
 *               es_particular:
 *                 type: integer
 *                 enum: [0, 1]
 *                 example: 0
 *     responses:
 *       201:
 *         description: Obra social creada
 *       409:
 *         description: Ya existe con ese nombre
 */
router.post(
    '/',
    verifyToken,
    checkRole([3]),
    body('nombre')
        .notEmpty().withMessage('El nombre es obligatorio')
        .isLength({ min: 2 }).withMessage('Mínimo 2 caracteres').trim(),
    body('porcentaje_descuento')
        .isFloat({ min: 0, max: 100 }).withMessage('El porcentaje debe estar entre 0 y 100'),
    body('es_particular')
        .optional()
        .isInt({ min: 0, max: 1 }).withMessage('es_particular debe ser 0 o 1'),
    validarCampos,
    createObraSocial
);

/**
 * @swagger
 * /obras-sociales/{id}:
 *   put:
 *     summary: Actualizar una obra social (solo admin)
 *     tags: [Obras Sociales]
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
 *         description: Actualizada correctamente
 *       404:
 *         description: No encontrada
 */
router.put(
    '/:id',
    verifyToken,
    checkRole([3]),
    param('id').isInt({ min: 1 }).withMessage('El ID debe ser un entero positivo'),
    body('nombre')
        .notEmpty().withMessage('El nombre es obligatorio').trim(),
    body('porcentaje_descuento')
        .isFloat({ min: 0, max: 100 }).withMessage('El porcentaje debe estar entre 0 y 100'),
    body('es_particular')
        .optional()
        .isInt({ min: 0, max: 1 }).withMessage('es_particular debe ser 0 o 1'),
    validarCampos,
    updateObraSocial
);

/**
 * @swagger
 * /obras-sociales/{id}:
 *   delete:
 *     summary: Eliminar (soft delete) una obra social (solo admin)
 *     tags: [Obras Sociales]
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
 *         description: Eliminada correctamente
 *       404:
 *         description: No encontrada
 */
router.delete(
    '/:id',
    verifyToken,
    checkRole([3]),
    param('id').isInt({ min: 1 }).withMessage('El ID debe ser un entero positivo'),
    validarCampos,
    deleteObraSocial
);

export default router;
