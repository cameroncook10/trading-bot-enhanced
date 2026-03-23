/**
 * Constants & Configuration
 * Centralized configuration for API endpoints, validation rules, and limits
 */

export const TRADE_TYPES = {
  LONG: 'long',
  SHORT: 'short'
};

export const SIGNAL_STATUSES = {
  PENDING: 'pending',
  EXECUTED: 'executed',
  REJECTED: 'rejected',
  EXPIRED: 'expired'
};

export const RISK_MODES = {
  CONSERVATIVE: 'conservative',
  MODERATE: 'moderate',
  AGGRESSIVE: 'aggressive'
};

export const BOT_STATUSES = {
  ONLINE: 'online',
  OFFLINE: 'offline',
  PAUSED: 'paused'
};

/**
 * API Limits & Validation Rules
 */
export const API_LIMITS = {
  MAX_TRADES_PER_REQUEST: 500,
  DEFAULT_TRADES_LIMIT: 50,
  MAX_REQUEST_SIZE: '10mb',
  REQUEST_TIMEOUT: 10000, // milliseconds
  SOCKET_PING_INTERVAL: 25000,
  SOCKET_PING_TIMEOUT: 60000
};

/**
 * Trade Validation Rules
 */
export const TRADE_VALIDATION = {
  MIN_AMOUNT: 0.001,
  MAX_AMOUNT: 1000000,
  MIN_PRICE: 0.01,
  MAX_PRICE: 1000000
};

/**
 * Market Condition Types
 */
export const MARKET_CONDITIONS = {
  BULLISH: 'bullish',
  BEARISH: 'bearish',
  NEUTRAL: 'neutral'
};

/**
 * Position Status Types
 */
export const POSITION_STATUS = {
  HEALTHY: 'healthy',
  CAUTION: 'caution',
  DANGER: 'danger'
};

/**
 * Activity Types for Feed
 */
export const ACTIVITY_TYPES = {
  SIGNAL: 'signal',
  TRADE: 'trade',
  RISK_ALERT: 'risk-alert',
  PAUSE: 'pause',
  RESUME: 'resume',
  SETTING: 'setting',
  OVERRIDE: 'override'
};

/**
 * Error Messages
 */
export const ERROR_MESSAGES = {
  INVALID_SYMBOL: 'Invalid or missing symbol',
  INVALID_TRADE_TYPE: 'Trade type must be "long" or "short"',
  INVALID_AMOUNT: 'Amount must be a positive number',
  INVALID_PRICE: 'Price must be a positive number',
  MISSING_REQUIRED_FIELDS: 'Missing required fields',
  INVALID_STATUS_FILTER: 'Invalid status filter',
  EMPTY_REQUEST_BODY: 'Request body cannot be empty',
  DATABASE_ERROR: 'Database error',
  UNAUTHORIZED: 'Unauthorized access',
  NOT_FOUND: 'Resource not found',
  SERVER_ERROR: 'Internal server error'
};

export default {
  TRADE_TYPES,
  SIGNAL_STATUSES,
  RISK_MODES,
  BOT_STATUSES,
  API_LIMITS,
  TRADE_VALIDATION,
  MARKET_CONDITIONS,
  POSITION_STATUS,
  ACTIVITY_TYPES,
  ERROR_MESSAGES
};
