const AppError = require('./../utils/appError');

const handleCastErrorDB = err => {
    const message = `Invalid ${err.path}: ${err.value}.`;
    return new AppError(message, 400);
};

const handleDuplicateFieldsDB = err => {
    const value = err.errmsg.match(/(["'])(\\?.)*?\1/)[0]; // Match the duplicate value.
    // const value = err.errmsg.match(/(["'])(?:(?=(\\?))\2.)*?\1/)[0];
    const message = `Duplicate field value: ${value}. Please use another value!`;
    return new AppError(message, 400);
};

const handleValidationErrorDB = err => {
    const errors = Object.values(err.errors).map(el => el.message);
    const message = `Invalid input data. ${errors.join('. ')}`;
    return new AppError(message, 400);
};

const handleJWTError = () => new AppError('Invalid token. Please login again', 401);

const handleJWTExpiredError = () =>
    new AppError('Token has expired. Please log in again to get access.', 401);

const sendErrorDev = (err, req, res) => {
    if (req.originalUrl.startsWith('/api')) {
        return res.status(err.statusCode).json({
            status: err.status,
            message: err.message,
            error: err,
            stack: err.stack
        });
    }
    return res.status(err.statusCode).render('error', {
        title: 'Something went wrong!',
        msg: err.message,
        status: err.statusCode
    });
};

const sendErrorProd = (err, req, res) => {
    if (!req.originalUrl.startsWith('/api')) {
        if (err.isOperational) {
            // Operational error, trusted error: send msg to client
            return res.status(err.statusCode).render('error', {
                title: 'Something went wrong!',
                msg: err.message,
                status: err.statusCode
            });
        }
        // Progrmming and unknown errors: don't leak error details
        console.error('ERROR 💥', err);
        return res.status(err.statusCode).render('error', {
            title: 'Something went wrong!',
            msg: 'Please try again later!',
            status: err.statusCode
        });
    }
    if (err.isOperational) {
        // Operational error, trusted error: send msg to client
        return res.status(err.statusCode).json({
            status: err.status,
            message: err.message
        });
    }
    // Progrmming and unknown errors: don't leak error details
    console.error('ERROR 💥', err);
    return res.status(500).json({
        status: 'error',
        message: 'Something went very wrong'
    });
};

module.exports = (err, req, res, next) => {
    err.statusCode = err.statusCode || 500;
    err.status = err.status || 'error';

    if (process.env.NODE_ENV === 'development') sendErrorDev(err, req, res);
    else if (process.env.NODE_ENV === 'production') {
        let error = { ...err };
        error.message = err.message;

        if (error.name === 'CastError') error = handleCastErrorDB(error);
        if (error.code === 11000) error = handleDuplicateFieldsDB(error); // Duclicate Key - Mongo Error
        if (error.name === 'ValidationError') error = handleValidationErrorDB(error);
        if (error.name === 'JsonWebTokenError') error = handleJWTError();
        if (error.name === 'TokenExpiredError') error = handleJWTExpiredError();
        sendErrorProd(error, req, res);
    }
};
