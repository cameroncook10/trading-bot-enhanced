import axios from 'axios';
import { apiLogger } from './apiLogger.js';

/**
 * API Service Configuration & Setup
 * 
 * Provides centralized API client with:
 * - Error handling and response validation
 * - Request/response logging for debugging
 * - Timeout configuration
 * - Consistent error format
 */

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';

// Create axios instance with timeout and error handling
const apiClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json'
  }
});

/**
 * Request interceptor: Log outgoing requests
 */
apiClient.interceptors.request.use(
  (config) => {
    // Log request with optional data
    apiLogger.logRequest(config.method.toUpperCase(), config.url, config.data);
    return config;
  },
  (error) => {
    console.error('Request setup error:', error);
    return Promise.reject(error);
  }
);

/**
 * Response interceptor: Log responses and handle errors
 */
apiClient.interceptors.response.use(
  (response) => {
    // Log successful response
    const startTime = performance.now();
    apiLogger.logSuccess(
      `${response.config.method.toUpperCase()}-${Date.now()}`,
      response.status,
      response.data,
      performance.now() - startTime
    );
    return response;
  },
  (error) => {
    // Log error response
    const errorMessage = error.response?.data?.error || error.message || 'Unknown error';
    apiLogger.logError(
      `${error.config?.method.toUpperCase()}-${Date.now()}`,
      new Error(errorMessage),
      0
    );

    if (process.env.NODE_ENV === 'development') {
      console.error('API Error:', {
        status: error.response?.status,
        message: errorMessage,
        path: error.config?.url
      });
    }

    return Promise.reject({
      status: error.response?.status || 500,
      message: errorMessage,
      timestamp: new Date().toISOString()
    });
  }
);

// API functions with error handling
export const apiService = {
  // Health check
  checkHealth: async () => {
    try {
      const response = await apiClient.get('/api/health');
      return { success: true, data: response.data };
    } catch (error) {
      return { success: false, error: error.message };
    }
  },

  // Bot status
  getBotStatus: async () => {
    try {
      const response = await apiClient.get('/api/bot/status');
      return { success: true, data: response.data };
    } catch (error) {
      return { success: false, error: error.message };
    }
  },

  // Trades
  getTrades: async (limit = 50, offset = 0) => {
    try {
      const response = await apiClient.get('/api/trades', {
        params: { limit, offset }
      });
      return { success: true, data: response.data };
    } catch (error) {
      return { success: false, error: error.message };
    }
  },

  // Signals
  getSignals: async (status = 'all') => {
    try {
      const response = await apiClient.get('/api/signals', {
        params: { status }
      });
      return { success: true, data: response.data };
    } catch (error) {
      return { success: false, error: error.message };
    }
  },

  // Execute trade
  executeTrade: async (tradeData) => {
    try {
      if (!tradeData.symbol || !tradeData.type || !tradeData.amount || !tradeData.price) {
        throw new Error('Missing required trade fields');
      }
      const response = await apiClient.post('/api/trades/execute', tradeData);
      return { success: true, data: response.data };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }
};

export default apiClient;
