import { Router } from 'express';
import multer from 'multer';
import path from 'path';
import { body, validationResult } from 'express-validator';
import { login, register } from '../controllers/auth.controller.js';

const storage = multer.diskStorage({
    destination: 'uploads/',
    filename: (req, file, cb) => cb(null, Date.now() + path.extname(file.originalname))
});
const upload = multer({ storage });

const validate = (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(400).json({ errores: errors.array() });
    next();
};

const router = Router();

/**
 * @swagger
 * /auth/login:
 *   post:
 *     summary: Iniciar sesión
 *     tags: [Auth]
 *     security: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *                 default: admin@clinica.com
 *               contrasenia:
 *                 type: string
 *                 default: admin123
 *     responses:
 *       200:
 *         description: Token JWT
 *       401:
 *         description: Credenciales incorrectas
 */
router.post('/login',
    body('email').isEmail(),
    body('contrasenia').notEmpty(),
    validate,
    login
);

/**
 * @swagger
 * /auth/register:
 *   post:
 *     summary: Registrar usuario (extra)
 *     tags: [Auth]
 *     security: []
 *     responses:
 *       201:
 *         description: Usuario creado
 */
router.post('/register',
    upload.single('foto'),
    body('documento').notEmpty(),
    body('apellido').notEmpty(),
    body('nombres').notEmpty(),
    body('email').isEmail(),
    body('contrasenia').notEmpty(),
    body('rol').isInt({ min: 1, max: 3 }),
    validate,
    register
);

export default router;
