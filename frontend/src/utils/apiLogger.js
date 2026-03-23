/**
 * API Request/Response Logger
 * Helps debug API interactions without cluttering component code
 * Tracks request timing, success/failure, and response size
 */

class APILogger {
  constructor() {
    this.requests = [];
    this.maxHistorySize = 100; // Keep last 100 requests
  }

  /**
   * Log outgoing API request
   * @param {Object} request - Request details { method, url, data, timestamp }
   */
  logRequest(method, url, data = null) {
    const timestamp = new Date().toISOString();
    const requestId = `${method}-${Date.now()}`;

    const request = {
      requestId,
      method,
      url,
      dataSize: data ? JSON.stringify(data).length : 0,
      timestamp,
      status: 'pending'
    };

    this.requests.push(request);
    if (this.requests.length > this.maxHistorySize) {
      this.requests.shift();
    }

    if (process.env.NODE_ENV === 'development') {
      console.log(`📤 [${method}] ${url}`, data ? `(${request.dataSize} bytes)` : '');
    }

    return requestId;
  }

  /**
   * Log successful API response
   * @param {string} requestId - ID from logRequest
   * @param {number} statusCode - HTTP status code
   * @param {any} responseData - Response data
   * @param {number} duration - Request duration in ms
   */
  logSuccess(requestId, statusCode, responseData, duration) {
    const request = this.requests.find(r => r.requestId === requestId);
    if (request) {
      request.status = 'success';
      request.statusCode = statusCode;
      request.responseSize = responseData ? JSON.stringify(responseData).length : 0;
      request.duration = duration;
    }

    if (process.env.NODE_ENV === 'development') {
      const color = statusCode >= 400 ? '🔴' : '🟢';
      console.log(
        `${color} [${statusCode}] Response (${duration.toFixed(2)}ms, ${request?.responseSize || 0} bytes)`
      );
    }
  }

  /**
   * Log failed API request
   * @param {string} requestId - ID from logRequest
   * @param {Error} error - Error object
   * @param {number} duration - Request duration in ms
   */
  logError(requestId, error, duration) {
    const request = this.requests.find(r => r.requestId === requestId);
    if (request) {
      request.status = 'error';
      request.error = error.message;
      request.duration = duration;
    }

    if (process.env.NODE_ENV === 'development') {
      console.error(`🔴 [ERROR] ${error.message} (${duration.toFixed(2)}ms)`);
    }
  }

  /**
   * Get request history for debugging
   * @param {number} limit - Number of recent requests to return
   * @returns {Array} Recent API requests
   */
  getHistory(limit = 20) {
    return this.requests.slice(-limit);
  }

  /**
   * Get statistics about API performance
   * @returns {Object} Stats including avg response time, success rate, etc.
   */
  getStats() {
    if (this.requests.length === 0) {
      return { totalRequests: 0, averageResponseTime: 0, successRate: 0 };
    }

    const completed = this.requests.filter(r => r.status !== 'pending');
    const successful = completed.filter(r => r.status === 'success');
    const avgDuration = completed.length > 0
      ? completed.reduce((sum, r) => sum + (r.duration || 0), 0) / completed.length
      : 0;

    return {
      totalRequests: this.requests.length,
      pendingRequests: this.requests.filter(r => r.status === 'pending').length,
      successfulRequests: successful.length,
      failedRequests: this.requests.filter(r => r.status === 'error').length,
      averageResponseTime: parseFloat(avgDuration.toFixed(2)),
      successRate: parseFloat(((successful.length / completed.length) * 100).toFixed(2))
    };
  }

  /**
   * Clear request history
   */
  clear() {
    this.requests = [];
  }

  /**
   * Print formatted history to console
   */
  printHistory() {
    console.group('📊 API Request History');
    console.table(this.getHistory());
    console.log('📈 Stats:', this.getStats());
    console.groupEnd();
  }
}

// Create singleton instance
export const apiLogger = new APILogger();

export default apiLogger;
