import { Router } from 'express';
import { body } from 'express-validator';
import multer from 'multer';
import path from 'path';
import { validarCampos } from '../../middlewares/validate.js';
import { login, register } from '../../controllers/auth.controller.js';

const router = Router();

const storage = multer.diskStorage({
    destination: (req, file, cb) => cb(null, 'uploads/'),
    filename: (req, file, cb) => {
        const unique = Date.now() + '-' + Math.round(Math.random() * 1e9);
        cb(null, unique + path.extname(file.originalname));
    }
});
const upload = multer({
    storage,
    limits: { fileSize: 2 * 1024 * 1024 },
    fileFilter: (req, file, cb) => {
        const allowed = /jpeg|jpg|png|webp/;
        cb(null, allowed.test(path.extname(file.originalname).toLowerCase()));
    }
});

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
router.post(
    '/login',
    body('email').isEmail().withMessage('Email inválido').normalizeEmail(),
    body('contrasenia').notEmpty().withMessage('La contraseña es obligatoria'),
    validarCampos,
    login
);

/**
 * @swagger
 * /auth/register:
 *   post:
 *     summary: Registrar nuevo usuario (paciente, médico o admin)
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             required: [documento, apellido, nombres, email, contrasenia, rol]
 *             properties:
 *               documento:
 *                 type: string
 *               apellido:
 *                 type: string
 *               nombres:
 *                 type: string
 *               email:
 *                 type: string
 *               contrasenia:
 *                 type: string
 *               rol:
 *                 type: integer
 *                 enum: [1, 2, 3]
 *               foto:
 *                 type: string
 *                 format: binary
 *               id_obra_social:
 *                 type: integer
 *                 description: Requerido si rol = 2 (paciente)
 *               matricula:
 *                 type: integer
 *                 description: Requerido si rol = 1 (médico)
 *               id_especialidad:
 *                 type: integer
 *                 description: Requerido si rol = 1 (médico)
 *               valor_consulta:
 *                 type: number
 *                 description: Requerido si rol = 1 (médico)
 *     responses:
 *       201:
 *         description: Usuario registrado exitosamente
 *       409:
 *         description: Email ya registrado
 */
router.post(
    '/register',
    upload.single('foto'),
    body('documento').notEmpty().withMessage('El documento es obligatorio'),
    body('apellido').notEmpty().withMessage('El apellido es obligatorio'),
    body('nombres').notEmpty().withMessage('El nombre es obligatorio'),
    body('email').isEmail().withMessage('Email inválido').normalizeEmail(),
    body('contrasenia')
        .isLength({ min: 6 }).withMessage('La contraseña debe tener al menos 6 caracteres'),
    body('rol')
        .isInt({ min: 1, max: 3 }).withMessage('El rol debe ser 1 (médico), 2 (paciente) o 3 (admin)'),
    validarCampos,
    register
);

export default router;
