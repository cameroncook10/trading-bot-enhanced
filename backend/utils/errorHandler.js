/**
 * Error Handler Utility
 * Centralized error handling with logging and structured responses
 */

import { logger } from './logger.js';

/**
 * Standard error codes for API responses
 */
export const ERROR_CODES = {
  // Validation errors (400)
  INVALID_INPUT: 'INVALID_INPUT',
  MISSING_REQUIRED_FIELD: 'MISSING_REQUIRED_FIELD',
  INVALID_TRADE_TYPE: 'INVALID_TRADE_TYPE',
  INVALID_PAGINATION: 'INVALID_PAGINATION',
  INVALID_STATUS_FILTER: 'INVALID_STATUS_FILTER',

  // Authentication errors (401)
  UNAUTHORIZED: 'UNAUTHORIZED',
  INVALID_TOKEN: 'INVALID_TOKEN',

  // Resource not found (404)
  NOT_FOUND: 'NOT_FOUND',
  TRADE_NOT_FOUND: 'TRADE_NOT_FOUND',
  SIGNAL_NOT_FOUND: 'SIGNAL_NOT_FOUND',

  // Server errors (500)
  INTERNAL_ERROR: 'INTERNAL_ERROR',
  DATABASE_ERROR: 'DATABASE_ERROR',
  EXTERNAL_API_ERROR: 'EXTERNAL_API_ERROR',
};

/**
 * Creates a standard error response
 * @param {string} code - Error code from ERROR_CODES
 * @param {string} message - User-friendly error message
 * @param {string} details - Technical details (for development mode)
 * @param {number} statusCode - HTTP status code
 * @returns {Object} Error response object
 */
export function createErrorResponse(code, message, details = null, statusCode = 500) {
  const response = {
    error: {
      code,
      message,
      timestamp: new Date().toISOString(),
    }
  };

  if (process.env.NODE_ENV === 'development' && details) {
    response.error.details = details;
  }

  return { response, statusCode };
}

/**
 * Async wrapper for Express route handlers
 * Catches errors automatically and sends standard responses
 * @param {Function} handler - Express route handler
 * @returns {Function} Wrapped handler
 */
export function asyncHandler(handler) {
  return (req, res, next) => {
    Promise.resolve(handler(req, res, next)).catch(error => {
      const { response, statusCode } = handleError(error);
      logger.error('Route error', { error: error.message, path: req.path, method: req.method });
      res.status(statusCode).json(response);
    });
  };
}

/**
 * Handles various error types and returns appropriate responses
 * @param {Error} error - The error object
 * @returns {Object} { response, statusCode }
 */
export function handleError(error) {
  // Validation errors
  if (error.message.includes('Invalid') || error.message.includes('missing')) {
    return createErrorResponse(
      ERROR_CODES.INVALID_INPUT,
      error.message,
      error.stack,
      400
    );
  }

  // Not found errors
  if (error.message.includes('not found') || error.statusCode === 404) {
    return createErrorResponse(
      ERROR_CODES.NOT_FOUND,
      'Resource not found',
      error.message,
      404
    );
  }

  // Unauthorized errors
  if (error.statusCode === 401) {
    return createErrorResponse(
      ERROR_CODES.UNAUTHORIZED,
      'Unauthorized access',
      error.message,
      401
    );
  }

  // Database errors
  if (error.message.includes('database') || error.message.includes('query')) {
    return createErrorResponse(
      ERROR_CODES.DATABASE_ERROR,
      'Database operation failed',
      error.message,
      500
    );
  }

  // External API errors
  if (error.message.includes('API') || error.message.includes('external')) {
    return createErrorResponse(
      ERROR_CODES.EXTERNAL_API_ERROR,
      'External service error',
      error.message,
      503
    );
  }

  // Generic server error
  return createErrorResponse(
    ERROR_CODES.INTERNAL_ERROR,
    'An unexpected error occurred',
    error.message,
    500
  );
}

/**
 * Validation error helper
 * @param {string} field - Field name that failed validation
 * @param {string} reason - Reason for failure
 * @returns {Error} Error object with proper message
 */
export function createValidationError(field, reason) {
  const error = new Error(`Invalid ${field}: ${reason}`);
  error.statusCode = 400;
  error.code = ERROR_CODES.INVALID_INPUT;
  return error;
}

/**
 * Not found error helper
 * @param {string} resource - Resource type
 * @param {string} id - Resource identifier
 * @returns {Error} Error object
 */
export function createNotFoundError(resource, id) {
  const error = new Error(`${resource} not found: ${id}`);
  error.statusCode = 404;
  error.code = ERROR_CODES.NOT_FOUND;
  return error;
}
