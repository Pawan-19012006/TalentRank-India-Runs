const { AppError } = require('../utils/errors');
const logger = require('../utils/logger');

const errorHandler = (err, req, res, next) => {
  err.statusCode = err.statusCode || 500;
  err.status = err.status || 'error';

  // Log error with stack trace if internal 500 server error, otherwise warn
  if (err.statusCode >= 500) {
    logger.error(`${req.method} ${req.originalUrl} - Internal Error: ${err.message}`, { stack: err.stack });
  } else {
    logger.warn(`${req.method} ${req.originalUrl} - Client Error (${err.statusCode}): ${err.message}`);
  }

  const response = {
    status: err.status,
    message: err.message,
    ...(err.errors && { errors: err.errors }),
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
  };

  res.status(err.statusCode).json(response);
};

module.exports = errorHandler;
