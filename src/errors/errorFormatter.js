export const formatError = (err) => {
    return {
        status: 'error',
        name: err.name,
        message: err.message,
        cause: err.cause || 'Unknown'
    };
};