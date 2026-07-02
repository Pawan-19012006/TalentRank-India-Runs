const app = require('./src/app');
const logger = require('./src/utils/logger');
const dotenv = require('dotenv');

// Load environment variables
dotenv.config();

const PORT = process.env.PORT || 5001;

const server = app.listen(PORT, () => {
  logger.info(`Server successfully started in ${process.env.NODE_ENV || 'development'} mode on port ${PORT}`);
});

// Graceful Shutdown & Process Crash Handling
process.on('unhandledRejection', (err) => {
  logger.error('UNHANDLED REJECTION! Shutting down server...', err);
  server.close(() => {
    process.exit(1);
  });
});

process.on('uncaughtException', (err) => {
  logger.error('UNCAUGHT EXCEPTION! Shutting down process immediately...', err);
  process.exit(1);
});