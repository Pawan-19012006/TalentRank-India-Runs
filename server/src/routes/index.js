const express = require('express');
const router = express.Router();
const validate = require('../utils/validation');
const { z } = require('zod');

// GET /api/v1/health - System Health Check
router.get('/health', (req, res) => {
  res.status(200).json({
    status: 'success',
    message: 'TalentRank AI backend API is operational',
    timestamp: new Date().toISOString()
  });
});

// POST /api/v1/test-validation - Utility endpoint to test Zod validation schema
const testValidationSchema = {
  body: z.object({
    name: z.string({ required_error: 'name is required' }).min(2, 'name must be at least 2 characters'),
    email: z.string({ required_error: 'email is required' }).email('invalid email format')
  })
};

router.post('/test-validation', validate(testValidationSchema), (req, res) => {
  res.status(200).json({
    status: 'success',
    message: 'Zod validation assertion check passed',
    data: req.body
  });
});

module.exports = router;
