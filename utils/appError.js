class AppError extends Error {
    /**
     * Custom error handler
     * @param {String} message Error Message
     * @param {Number} statusCode Status code
     */
    constructor(message, statusCode) {
        super(message);

        this.statusCode = statusCode;
        this.status = `${statusCode}`.startsWith('4') ? 'fail' : 'error';
        this.isOperational = true;

        Error.captureStackTrace(this, this.constructor);
    }
}

module.exports = AppError;
