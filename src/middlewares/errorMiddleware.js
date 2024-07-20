import logger from '../logs/logger.js';

const errorMiddleware = (err, req, res, next) => {
    logger.info('Middleware de errores activado');
    
    // Registrar el error
    logger.error({
        name: err.name || 'UnknownError',
        message: err.message || 'Unknown error occurred',
        stack: err.stack, // Incluir la pila de errores para más detalles
        cause: err.cause || 'No additional information'
    });

    // Obtener la URL de la página anterior
    const previousUrl = req.headers.referer || '/';

    // Construir mensajes de error para el usuario
    const userMessage = `${err.message}.`;
    const userCause = err.cause || 'No additional information';

    // Redirigir a la página de error personalizada con detalles
    res.redirect(`/error?message=${encodeURIComponent(userMessage)}&cause=${encodeURIComponent(userCause)}&previousUrl=${encodeURIComponent(previousUrl)}`);
};

export default errorMiddleware;