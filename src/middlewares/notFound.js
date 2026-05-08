function notFound(req, res, next) {
    res.status(404).json({
        ok: false,
        message: 'Ruta no encontrada'
    });
}

module.exports = notFound;
