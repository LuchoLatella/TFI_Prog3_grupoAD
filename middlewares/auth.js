import jwt from 'jsonwebtoken';

export const verificarToken = (req, res, next) => {
    const auth = req.headers.authorization;
    if (!auth) return res.status(401).json({ mensaje: 'Token requerido' });
    const token = auth.split(' ')[1];
    try {
        req.usuario = jwt.verify(token, process.env.JWT_SECRET);
        next();
    } catch {
        res.status(401).json({ mensaje: 'Token inválido' });
    }
};
