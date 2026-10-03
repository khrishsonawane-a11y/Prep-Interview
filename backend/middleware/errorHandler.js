/**
 * Centralized Production-Ready Error Handling Middleware
 * Prevents credential or internal stack leakages to clients while logging safely on the server.
 */
export const errorHandler = (err, req, res, next) => {
    const isDevelopment = process.env.NODE_ENV !== 'production';

    // Log internal error trace to server console safely
    console.error(`[Error] ${req.method} ${req.originalUrl}:`, err);

    const statusCode = err.statusCode || (err.status && typeof err.status === 'number' ? err.status : 500);

    // Format safe response for client
    const clientResponse = {
        success: false,
        error: err.message || 'An error occurred during request processing.'
    };

    if (isDevelopment && err.stack) {
        clientResponse.debug = {
            message: err.message,
            stack: err.stack.split('\n').slice(0, 4)
        };
    }

    res.status(statusCode).json(clientResponse);
};

export default errorHandler;
