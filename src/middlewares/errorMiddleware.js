import logger from '../logs/logger.js';

const errorMiddleware = (err, req, res, next) => {
    logger.error({
        name: err.name || 'UnknownError',
        message: err.message || 'Unknown error occurred',
        stack: err.stack,
        cause: err.cause || 'No additional information'
    });

    const previousUrl = req.headers.referer || '/';
    const userMessage = `${err.message}.`;
    const userCause = err.cause || 'No additional information';
    
    res.redirect(`/error?message=${encodeURIComponent(userMessage)}&cause=${encodeURIComponent(userCause)}&previousUrl=${encodeURIComponent(previousUrl)}`);
};

export default errorMiddleware;