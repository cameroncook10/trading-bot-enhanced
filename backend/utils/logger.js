/**
 * Logger Utility
 * Provides structured logging with timestamps and log levels
 * Used throughout the backend for consistent error/info/warning output
 */

const LOG_LEVELS = {
  ERROR: 'ERROR',
  WARN: 'WARN',
  INFO: 'INFO',
  DEBUG: 'DEBUG'
};

const getTimestamp = () => {
  const now = new Date();
  return now.toISOString();
};

const getLogLevel = (level) => {
  const colors = {
    ERROR: '\x1b[31m', // Red
    WARN: '\x1b[33m',  // Yellow
    INFO: '\x1b[36m',  // Cyan
    DEBUG: '\x1b[35m'  // Magenta
  };
  const reset = '\x1b[0m';
  return `${colors[level] || ''}[${level}]${reset}`;
};

export const logger = {
  /**
   * Log error message with optional context
   */
  error: (message, context = {}) => {
    const timestamp = getTimestamp();
    const levelTag = getLogLevel(LOG_LEVELS.ERROR);
    console.error(`${timestamp} ${levelTag}`, message, context);
  },

  /**
   * Log warning message with optional context
   */
  warn: (message, context = {}) => {
    const timestamp = getTimestamp();
    const levelTag = getLogLevel(LOG_LEVELS.WARN);
    console.warn(`${timestamp} ${levelTag}`, message, context);
  },

  /**
   * Log info message with optional context
   */
  info: (message, context = {}) => {
    const timestamp = getTimestamp();
    const levelTag = getLogLevel(LOG_LEVELS.INFO);
    console.log(`${timestamp} ${levelTag}`, message, context);
  },

  /**
   * Log debug message with optional context
   */
  debug: (message, context = {}) => {
    if (process.env.NODE_ENV === 'development') {
      const timestamp = getTimestamp();
      const levelTag = getLogLevel(LOG_LEVELS.DEBUG);
      console.log(`${timestamp} ${levelTag}`, message, context);
    }
  },

  /**
   * Log API request with timing
   */
  apiRequest: (method, path, statusCode, durationMs) => {
    const timestamp = getTimestamp();
    const color = statusCode >= 400 ? '\x1b[31m' : '\x1b[32m'; // Red for errors, green for success
    const reset = '\x1b[0m';
    console.log(`${timestamp} ${color}[API]${reset} ${method} ${path} ${statusCode} (${durationMs}ms)`);
  }
};

export default logger;
