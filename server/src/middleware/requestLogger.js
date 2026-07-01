const logger = require('../utils/logger');

const requestLogger = (req, res, next) => {
  const start = Date.now();
  
  logger.info(`Incoming: ${req.method} ${req.originalUrl} from IP ${req.ip}`);

  res.on('finish', () => {
    const duration = Date.now() - start;
    const message = `Response: ${req.method} ${req.originalUrl} | Status: ${res.statusCode} | Duration: ${duration}ms | Agent: ${req.get('user-agent') || 'unknown'}`;

    if (res.statusCode >= 500) {
      logger.error(message);
    } else if (res.statusCode >= 400) {
      logger.warn(message);
    } else {
      logger.info(message);
    }
  });

  next();
};

module.exports = requestLogger;
