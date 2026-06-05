import { Router } from 'express';
import { body, validationResult } from 'express-validator';
import { verificarToken } from '../middlewares/auth.js';
import { autorizar } from '../middlewares/roles.js';
import {
    getMedicos,
    getMedicoById,
    asociarObraSocial,
    desasociarObraSocial
} from '../controllers/medicos.controller.js';

const validate = (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(400).json({ errores: errors.array() });
    next();
};

const router = Router();

/**
 * @swagger
 * /medicos:
 *   get:
 *     summary: Listar médicos (opcionalmente filtrar por especialidad)
 *     tags: [Médicos]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: especialidad
 *         schema:
 *           type: integer
 *         description: ID de especialidad para filtrar
 *     responses:
 *       200:
 *         description: Lista de médicos
 */
router.get('/', verificarToken, autorizar(2, 3), getMedicos);

/**
 * @swagger
 * /medicos/{id}:
 *   get:
 *     summary: Obtener médico por ID
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
 *         description: Médico
 */
router.get('/:id', verificarToken, autorizar(2, 3), getMedicoById);

/**
 * @swagger
 * /medicos/{id}/obras-sociales:
 *   post:
 *     summary: Asociar obra social a médico
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
 *             properties:
 *               id_obra_social:
 *                 type: integer
 *     responses:
 *       201:
 *         description: Asociado
 */
router.post('/:id/obras-sociales', verificarToken, autorizar(3),
    body('id_obra_social').isInt(),
    validate,
    asociarObraSocial
);

/**
 * @swagger
 * /medicos/{id}/obras-sociales/{idOS}:
 *   delete:
 *     summary: Desasociar obra social de médico
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
 *         description: Desasociado
 */
router.delete('/:id/obras-sociales/:idOS', verificarToken, autorizar(3), desasociarObraSocial);

export default router;
