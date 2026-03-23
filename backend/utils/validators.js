/**
 * Validators
 * Data validation helpers for request bodies, query parameters, and data integrity
 */

import { 
  TRADE_TYPES, 
  TRADE_VALIDATION, 
  SIGNAL_STATUSES,
  ERROR_MESSAGES 
} from './constants.js';

/**
 * Validate trade data
 * @param {Object} tradeData - Trade object to validate
 * @returns {Object} { valid: boolean, error: string | null }
 */
export const validateTrade = (tradeData) => {
  if (!tradeData || typeof tradeData !== 'object') {
    return { valid: false, error: 'Trade data must be an object' };
  }

  const { symbol, type, amount, price } = tradeData;

  if (!symbol || typeof symbol !== 'string') {
    return { valid: false, error: ERROR_MESSAGES.INVALID_SYMBOL };
  }

  if (!type || !Object.values(TRADE_TYPES).includes(type)) {
    return { valid: false, error: ERROR_MESSAGES.INVALID_TRADE_TYPE };
  }

  if (typeof amount !== 'number' || amount <= TRADE_VALIDATION.MIN_AMOUNT || amount > TRADE_VALIDATION.MAX_AMOUNT) {
    return { 
      valid: false, 
      error: `Amount must be between ${TRADE_VALIDATION.MIN_AMOUNT} and ${TRADE_VALIDATION.MAX_AMOUNT}` 
    };
  }

  if (typeof price !== 'number' || price <= TRADE_VALIDATION.MIN_PRICE || price > TRADE_VALIDATION.MAX_PRICE) {
    return { 
      valid: false, 
      error: `Price must be between ${TRADE_VALIDATION.MIN_PRICE} and ${TRADE_VALIDATION.MAX_PRICE}` 
    };
  }

  return { valid: true, error: null };
};

/**
 * Validate signal status filter
 * @param {string} status - Status value to validate
 * @returns {Object} { valid: boolean, error: string | null }
 */
export const validateSignalStatus = (status) => {
  const validStatuses = ['all', ...Object.values(SIGNAL_STATUSES)];
  
  if (!status || !validStatuses.includes(status.toLowerCase())) {
    return { 
      valid: false, 
      error: ERROR_MESSAGES.INVALID_STATUS_FILTER,
      validStatuses 
    };
  }

  return { valid: true, error: null };
};

/**
 * Validate pagination parameters
 * @param {number} limit - Records per page
 * @param {number} offset - Starting index
 * @returns {Object} { valid: boolean, error: string | null, sanitized: {limit, offset} }
 */
export const validatePagination = (limit, offset, maxLimit = 500) => {
  let sanitizedLimit = parseInt(limit) || 50;
  let sanitizedOffset = parseInt(offset) || 0;

  // Enforce bounds
  if (isNaN(sanitizedLimit) || sanitizedLimit < 1) {
    sanitizedLimit = 50;
  }
  if (sanitizedLimit > maxLimit) {
    sanitizedLimit = maxLimit;
  }
  if (isNaN(sanitizedOffset) || sanitizedOffset < 0) {
    sanitizedOffset = 0;
  }

  return { 
    valid: true, 
    error: null,
    sanitized: { limit: sanitizedLimit, offset: sanitizedOffset }
  };
};

/**
 * Check if request body is valid JSON object
 * @param {Object} body - Request body
 * @returns {boolean}
 */
export const isValidRequestBody = (body) => {
  // Check if it's a plain object (not null, array, etc.)
  if (body === null || body === undefined) return false;
  if (!typeof body === 'object') return false;
  if (Array.isArray(body)) return false;
  return Object.keys(body).length > 0;
};

/**
 * Validate required fields in object
 * @param {Object} obj - Object to check
 * @param {string[]} requiredFields - Required field names
 * @returns {Object} { valid: boolean, error: string | null, missing: string[] }
 */
export const validateRequiredFields = (obj, requiredFields) => {
  const missing = requiredFields.filter(field => !obj[field]);

  if (missing.length > 0) {
    return {
      valid: false,
      error: `Missing required fields: ${missing.join(', ')}`,
      missing
    };
  }

  return { valid: true, error: null, missing: [] };
};

/**
 * Sanitize numeric values
 * @param {any} value - Value to sanitize
 * @param {number} defaultValue - Default if invalid
 * @returns {number}
 */
export const sanitizeNumber = (value, defaultValue = 0) => {
  const num = Number(value);
  return isNaN(num) ? defaultValue : num;
};

/**
 * Sanitize string values
 * @param {any} value - Value to sanitize
 * @param {string} defaultValue - Default if invalid
 * @returns {string}
 */
export const sanitizeString = (value, defaultValue = '') => {
  return typeof value === 'string' ? value.trim() : defaultValue;
};

/**
 * Validate date string/object
 * @param {string|Date} dateValue - Date to validate
 * @returns {Object} { valid: boolean, error: string | null, date: Date | null }
 */
export const validateDate = (dateValue) => {
  const date = new Date(dateValue);
  
  if (isNaN(date.getTime())) {
    return { valid: false, error: 'Invalid date format', date: null };
  }

  return { valid: true, error: null, date };
};

export default {
  validateTrade,
  validateSignalStatus,
  validatePagination,
  isValidRequestBody,
  validateRequiredFields,
  sanitizeNumber,
  sanitizeString,
  validateDate
};
