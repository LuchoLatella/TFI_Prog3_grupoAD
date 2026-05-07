import { Router } from 'express';
import { body, validationResult } from 'express-validator';
import { verificarToken } from '../middlewares/auth.js';
import { autorizar } from '../middlewares/roles.js';
import { getPacientes, asociarObraSocial } from '../controllers/pacientes.controller.js';

const validate = (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(400).json({ errores: errors.array() });
    next();
};

const router = Router();

/**
 * @swagger
 * /pacientes:
 *   get:
 *     summary: Listar pacientes
 *     tags: [Pacientes]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Lista de pacientes
 */
router.get('/', verificarToken, autorizar(3), getPacientes);

/**
 * @swagger
 * /pacientes/{id}/obras-sociales:
 *   put:
 *     summary: Asociar obra social a paciente
 *     tags: [Pacientes]
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
 *       200:
 *         description: Actualizado
 */
router.put('/:id/obras-sociales', verificarToken, autorizar(3),
    body('id_obra_social').isInt(),
    validate,
    asociarObraSocial
);

export default router;
