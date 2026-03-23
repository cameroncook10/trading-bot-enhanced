/**
 * API Client with Enhanced Error Handling
 * Provides type-safe API interactions with automatic retries and error recovery
 */

import {
  HealthResponse,
  BotStatusResponse,
  TradesResponse,
  SignalsResponse,
  ExecuteTradeRequest,
  ExecuteTradeResponse,
  MetricsResponse,
  HealthMetrics
} from '../types/api';

interface RequestOptions {
  method?: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';
  headers?: Record<string, string>;
  body?: any;
  retries?: number;
  timeout?: number;
}

interface ApiError extends Error {
  statusCode?: number;
  details?: any;
}

class APIClient {
  private baseUrl: string;
  private timeout: number = 30000; // 30 second default timeout
  private retryAttempts: number = 3;
  private retryDelay: number = 1000; // 1 second

  constructor(baseUrl: string = 'http://localhost:5000') {
    this.baseUrl = baseUrl;
  }

  /**
   * Make an API request with retry logic and error handling
   * @private
   */
  private async request<T>(
    path: string,
    options: RequestOptions = {}
  ): Promise<T> {
    const url = `${this.baseUrl}${path}`;
    const method = options.method || 'GET';
    const retries = options.retries ?? this.retryAttempts;

    let lastError: Error | null = null;

    for (let attempt = 0; attempt <= retries; attempt++) {
      try {
        const controller = new AbortController();
        const timeoutId = setTimeout(
          () => controller.abort(),
          options.timeout || this.timeout
        );

        const response = await fetch(url, {
          method,
          headers: {
            'Content-Type': 'application/json',
            ...options.headers
          },
          body: options.body ? JSON.stringify(options.body) : undefined,
          signal: controller.signal
        });

        clearTimeout(timeoutId);

        if (!response.ok) {
          let errorData;
          try {
            errorData = await response.json();
          } catch {
            errorData = { error: response.statusText };
          }

          const error: ApiError = new Error(
            errorData.error || `HTTP ${response.status}`
          );
          error.statusCode = response.statusCode;
          error.details = errorData;

          // Don't retry on 4xx client errors (except 429 and 408)
          if (response.status >= 400 && response.status < 500) {
            if (![429, 408].includes(response.status)) {
              throw error;
            }
          }

          if (attempt < retries) {
            lastError = error;
            // Exponential backoff
            const delay = this.retryDelay * Math.pow(2, attempt);
            await new Promise(resolve => setTimeout(resolve, delay));
            continue;
          }

          throw error;
        }

        const data = await response.json();
        return data as T;

      } catch (error) {
        if (error instanceof Error) {
          if (error.name === 'AbortError') {
            const timeoutError: ApiError = new Error('Request timeout');
            timeoutError.statusCode = 408;
            lastError = timeoutError;
          } else {
            lastError = error;
          }
        }

        if (attempt < retries) {
          const delay = this.retryDelay * Math.pow(2, attempt);
          await new Promise(resolve => setTimeout(resolve, delay));
          continue;
        }

        throw lastError || new Error('Unknown request error');
      }
    }

    throw lastError || new Error('Request failed after retries');
  }

  /**
   * Health check endpoint
   */
  async getHealth(): Promise<HealthResponse> {
    return this.request('/api/health');
  }

  /**
   * Get bot status with portfolio metrics
   */
  async getBotStatus(): Promise<BotStatusResponse> {
    return this.request('/api/bot/status');
  }

  /**
   * Get trades with pagination
   */
  async getTrades(limit: number = 50, offset: number = 0): Promise<TradesResponse> {
    return this.request(`/api/trades?limit=${limit}&offset=${offset}`);
  }

  /**
   * Get signals with optional status filter
   */
  async getSignals(status: string = 'all'): Promise<SignalsResponse> {
    return this.request(`/api/signals?status=${status}`);
  }

  /**
   * Execute a trade
   */
  async executeTrade(trade: ExecuteTradeRequest): Promise<ExecuteTradeResponse> {
    return this.request('/api/trades/execute', {
      method: 'POST',
      body: trade
    });
  }

  /**
   * Get API metrics
   */
  async getMetrics(view: 'summary' | 'health' | 'endpoints' | 'errors' | 'requests' = 'summary'): Promise<MetricsResponse | HealthMetrics> {
    return this.request(`/api/metrics?view=${view}`);
  }

  /**
   * Set base URL (useful for environment-specific endpoints)
   */
  setBaseUrl(url: string): void {
    this.baseUrl = url;
  }

  /**
   * Set retry configuration
   */
  setRetryConfig(attempts: number, delayMs: number): void {
    this.retryAttempts = attempts;
    this.retryDelay = delayMs;
  }

  /**
   * Set request timeout
   */
  setTimeout(ms: number): void {
    this.timeout = ms;
  }
}

// Create singleton instance
export const apiClient = new APIClient(
  import.meta.env.VITE_API_URL || 'http://localhost:5000'
);

export type { ApiError };
export default apiClient;
