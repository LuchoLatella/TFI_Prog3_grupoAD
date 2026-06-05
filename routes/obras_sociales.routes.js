import { Router } from 'express';
import { body, validationResult } from 'express-validator';
import { verificarToken } from '../middlewares/auth.js';
import { autorizar } from '../middlewares/roles.js';
import {
    getObrasSociales,
    getObraSocialById,
    createObraSocial,
    updateObraSocial,
    deleteObraSocial
} from '../controllers/obras_sociales.controller.js';

const validate = (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(400).json({ errores: errors.array() });
    next();
};

const router = Router();

/**
 * @swagger
 * /obras-sociales:
 *   get:
 *     summary: Listar obras sociales
 *     tags: [Obras Sociales]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Lista de obras sociales
 */
router.get('/', verificarToken, autorizar(3), getObrasSociales);

/**
 * @swagger
 * /obras-sociales/{id}:
 *   get:
 *     summary: Obtener obra social por ID
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
 *         description: Obra social
 */
router.get('/:id', verificarToken, autorizar(3), getObraSocialById);

/**
 * @swagger
 * /obras-sociales:
 *   post:
 *     summary: Crear obra social
 *     tags: [Obras Sociales]
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
 *               descripcion:
 *                 type: string
 *               porcentaje_descuento:
 *                 type: number
 *               es_particular:
 *                 type: integer
 *     responses:
 *       201:
 *         description: Creada
 */
router.post('/', verificarToken, autorizar(3),
    body('nombre').notEmpty(),
    body('porcentaje_descuento').isNumeric(),
    validate,
    createObraSocial
);

/**
 * @swagger
 * /obras-sociales/{id}:
 *   put:
 *     summary: Editar obra social
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
 *         description: Actualizada
 */
router.put('/:id', verificarToken, autorizar(3),
    body('nombre').notEmpty(),
    body('porcentaje_descuento').isNumeric(),
    validate,
    updateObraSocial
);

/**
 * @swagger
 * /obras-sociales/{id}:
 *   delete:
 *     summary: Eliminar obra social (soft delete)
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
 *         description: Eliminada
 */
router.delete('/:id', verificarToken, autorizar(3), deleteObraSocial);

export default router;
