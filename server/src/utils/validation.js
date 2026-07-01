const { ValidationError } = require('./errors');

/**
 * Validates request components against Zod schemas.
 * @param {Object} schemas - Target schemas to validate
 * @param {Object} [schemas.body] - Zod schema for req.body
 * @param {Object} [schemas.query] - Zod schema for req.query
 * @param {Object} [schemas.params] - Zod schema for req.params
 */
const validate = (schemas) => {
  return async (req, res, next) => {
    try {
      if (schemas.body) {
        req.body = await schemas.body.parseAsync(req.body);
      }
      if (schemas.query) {
        req.query = await schemas.query.parseAsync(req.query);
      }
      if (schemas.params) {
        req.params = await schemas.params.parseAsync(req.params);
      }
      next();
    } catch (error) {
      if (error.name === 'ZodError') {
        const formattedErrors = error.errors.map(err => ({
          field: err.path.join('.'),
          message: err.message
        }));
        return next(new ValidationError('Invalid input parameters', formattedErrors));
      }
      next(error);
    }
  };
};

module.exports = validate;
