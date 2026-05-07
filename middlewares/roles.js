export const autorizar = (...roles) => (req, res, next) => {
    if (!roles.includes(req.usuario.rol)) {
        return res.status(403).json({ mensaje: 'No autorizado' });
    }
    next();
};
