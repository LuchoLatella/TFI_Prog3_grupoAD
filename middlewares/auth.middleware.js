import jwt from 'jsonwebtoken';

// ── verifyToken ──────────────────────────────────────────────────────────────
// Verifica que el request tenga un JWT válido en el header Authorization.
// Si es válido, agrega req.usuario = { id, rol, email } para uso en controllers.
export const verifyToken = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1]; // formato: "Bearer <token>"

    if (!token) {
        return res.status(401).json({ mensaje: 'Token requerido' });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.usuario = decoded; // { id, rol, email }
        next();
    } catch (error) {
        return res.status(401).json({ mensaje: 'Token inválido o expirado' });
    }
};

// ── checkRole ────────────────────────────────────────────────────────────────
// Factory que devuelve un middleware que verifica que el usuario tenga
// alguno de los roles permitidos.
// Uso: checkRole([1, 3]) → solo médicos (1) y admins (3) pueden pasar
export const checkRole = (rolesPermitidos) => {
    return (req, res, next) => {
        if (!req.usuario) {
            return res.status(401).json({ mensaje: 'No autenticado' });
        }
        if (!rolesPermitidos.includes(req.usuario.rol)) {
            return res.status(403).json({ mensaje: 'No tenés permisos para esta acción' });
        }
        next();
    };
};

// ── Roles disponibles (para referencia al usar checkRole) ────────────────────
// ROL 1 = Médico
// ROL 2 = Paciente
// ROL 3 = Administrador