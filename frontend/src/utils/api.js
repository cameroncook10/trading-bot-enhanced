import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';

// Create axios instance with timeout and error handling
const apiClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json'
  }
});

// Response interceptor for error handling
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    const errorMessage = error.response?.data?.error || error.message || 'Unknown error';
    console.error('API Error:', {
      status: error.response?.status,
      message: errorMessage,
      path: error.config?.url
    });
    return Promise.reject({
      status: error.response?.status || 500,
      message: errorMessage
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
