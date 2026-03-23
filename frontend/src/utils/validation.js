/**
 * Validation utilities for trading bot
 */

// Validate trade data
export const validateTrade = (trade) => {
  const errors = [];

  if (!trade) {
    errors.push('Trade data is required');
    return errors;
  }

  if (!trade.symbol || typeof trade.symbol !== 'string') {
    errors.push('Valid symbol is required');
  }

  if (!trade.type || !['long', 'short'].includes(trade.type)) {
    errors.push('Valid trade type (long/short) is required');
  }

  if (!trade.entryPrice || trade.entryPrice <= 0) {
    errors.push('Valid entry price (positive number) is required');
  }

  if (!trade.quantity || trade.quantity <= 0) {
    errors.push('Valid quantity (positive number) is required');
  }

  if (trade.stopLoss && trade.stopLoss <= 0) {
    errors.push('Stop loss must be positive');
  }

  if (trade.profitTarget && trade.profitTarget <= 0) {
    errors.push('Profit target must be positive');
  }

  return errors;
};

// Validate signal data
export const validateSignal = (signal) => {
  const errors = [];

  if (!signal) {
    errors.push('Signal data is required');
    return errors;
  }

  if (!signal.symbol) {
    errors.push('Symbol is required');
  }

  if (!signal.direction || !['buy', 'sell', 'wait'].includes(signal.direction)) {
    errors.push('Valid direction (buy/sell/wait) is required');
  }

  if (!signal.confidence || signal.confidence < 0 || signal.confidence > 100) {
    errors.push('Confidence must be between 0 and 100');
  }

  if (!signal.reasoning || typeof signal.reasoning !== 'string') {
    errors.push('Valid reasoning text is required');
  }

  return errors;
};

// Validate portfolio position
export const validatePosition = (position) => {
  const errors = [];

  if (!position) {
    errors.push('Position data is required');
    return errors;
  }

  if (!position.symbol) {
    errors.push('Symbol is required');
  }

  if (!position.currentPrice || position.currentPrice <= 0) {
    errors.push('Current price must be positive');
  }

  if (!position.quantity || position.quantity <= 0) {
    errors.push('Quantity must be positive');
  }

  return errors;
};

// Calculate position PNL
export const calculatePNL = (entryPrice, currentPrice, quantity, type = 'long') => {
  if (!entryPrice || !currentPrice || !quantity) {
    return { pnl: 0, pnlPercent: 0 };
  }

  const priceDifference = currentPrice - entryPrice;
  const pnl = type === 'long' ? priceDifference * quantity : -priceDifference * quantity;
  const pnlPercent = ((currentPrice - entryPrice) / entryPrice) * 100;

  return {
    pnl: parseFloat(pnl.toFixed(2)),
    pnlPercent: parseFloat(pnlPercent.toFixed(2))
  };
};

// Validate email format
export const isValidEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

// Sanitize string input
export const sanitizeInput = (input) => {
  if (typeof input !== 'string') return '';
  return input.trim().replace(/[<>]/g, '');
};

// Validate API response
export const validateApiResponse = (response, requiredFields = []) => {
  if (!response) {
    return { valid: false, error: 'No response data' };
  }

  for (const field of requiredFields) {
    if (!(field in response)) {
      return { valid: false, error: `Missing required field: ${field}` };
    }
  }

  return { valid: true };
};

// Check if risk is acceptable
export const isRiskAcceptable = (riskMode, positionSize, maxRisk) => {
  const limits = {
    conservative: 0.05,
    moderate: 0.10,
    aggressive: 0.15
  };

  const limit = limits[riskMode] || limits.moderate;
  return positionSize <= limit && positionSize <= maxRisk;
};

// Validate date
export const isValidDate = (date) => {
  return date instanceof Date && !isNaN(date);
};
