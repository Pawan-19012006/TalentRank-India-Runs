const express = require('express');
const cors = require('cors');
const requestLogger = require('./middleware/requestLogger');
const errorHandler = require('./middleware/errorHandler');
const routes = require('./routes');
const { NotFoundError } = require('./utils/errors');

const app = express();

// Global Middlewares
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(requestLogger);

// Base API Routes
app.use('/api/v1', routes);

// Undefined Route Fallback
app.use((req, res, next) => {
  next(new NotFoundError(`Route ${req.method} ${req.originalUrl} is not registered on this server`));
});

// Centralized Error Handler Middleware
app.use(errorHandler);

module.exports = app;
