import * as AuthService from '../services/auth.service.js';

// POST /api/v1/auth/login
export const login = async (req, res) => {
    try {
        const { email, contrasenia } = req.body;
        const resultado = await AuthService.login(email, contrasenia);
        res.json(resultado);
    } catch (error) {
        res.status(error.status || 500).json({ mensaje: error.message });
    }
};

// POST /api/v1/auth/register
export const register = async (req, res) => {
    try {
        // req.file viene de Multer (foto de perfil opcional)
        const fotoPath = req.file ? req.file.filename : '';
        const resultado = await AuthService.register(req.body, fotoPath);
        res.status(201).json(resultado);
    } catch (error) {
        res.status(error.status || 500).json({ mensaje: error.message });
    }
};
