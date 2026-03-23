/**
 * API Metrics & Monitoring Utility
 * Tracks API performance, usage patterns, and health
 */

class APIMetrics {
  constructor() {
    this.requests = [];
    this.errors = [];
    this.statusCodes = {};
    this.endpoints = {};
    this.startTime = Date.now();
  }

  /**
   * Record API request
   * @param {string} method - HTTP method
   * @param {string} path - Request path
   * @param {number} statusCode - Response status code
   * @param {number} duration - Request duration in ms
   * @param {string} requestId - Request identifier
   */
  recordRequest(method, path, statusCode, duration, requestId) {
    const entry = {
      method,
      path,
      statusCode,
      duration,
      requestId,
      timestamp: new Date().toISOString()
    };

    // Keep only last 1000 requests to prevent memory bloat
    if (this.requests.length >= 1000) {
      this.requests.shift();
    }
    this.requests.push(entry);

    // Track status codes
    this.statusCodes[statusCode] = (this.statusCodes[statusCode] || 0) + 1;

    // Track endpoints
    const key = `${method} ${path}`;
    if (!this.endpoints[key]) {
      this.endpoints[key] = {
        count: 0,
        totalDuration: 0,
        avgDuration: 0,
        minDuration: duration,
        maxDuration: duration,
        errors: 0
      };
    }

    const endpoint = this.endpoints[key];
    endpoint.count += 1;
    endpoint.totalDuration += duration;
    endpoint.avgDuration = endpoint.totalDuration / endpoint.count;
    endpoint.minDuration = Math.min(endpoint.minDuration, duration);
    endpoint.maxDuration = Math.max(endpoint.maxDuration, duration);

    if (statusCode >= 400) {
      endpoint.errors += 1;
    }
  }

  /**
   * Record API error
   * @param {string} message - Error message
   * @param {string} requestId - Request identifier
   * @param {Object} context - Additional context
   */
  recordError(message, requestId, context = {}) {
    const entry = {
      message,
      requestId,
      timestamp: new Date().toISOString(),
      context
    };

    if (this.errors.length >= 500) {
      this.errors.shift();
    }
    this.errors.push(entry);
  }

  /**
   * Get metrics summary
   * @returns {Object} Metrics summary
   */
  getSummary() {
    const uptime = Date.now() - this.startTime;
    const totalRequests = this.requests.length;
    const totalErrors = this.errors.length;

    const avgDuration = totalRequests > 0
      ? this.requests.reduce((sum, r) => sum + r.duration, 0) / totalRequests
      : 0;

    const errorRate = totalRequests > 0
      ? (Object.entries(this.statusCodes)
          .filter(([code]) => code >= 400)
          .reduce((sum, [, count]) => sum + count, 0) / totalRequests) * 100
      : 0;

    return {
      uptime,
      totalRequests,
      totalErrors,
      avgDuration: Math.round(avgDuration * 10) / 10,
      errorRate: Math.round(errorRate * 10) / 10,
      statusCodes: this.statusCodes,
      topEndpoints: this.getTopEndpoints(5),
      slowestEndpoints: this.getSlowestEndpoints(5)
    };
  }

  /**
   * Get top endpoints by request count
   * @param {number} limit - Number of endpoints to return
   * @returns {Array} Top endpoints
   */
  getTopEndpoints(limit = 5) {
    return Object.entries(this.endpoints)
      .sort(([, a], [, b]) => b.count - a.count)
      .slice(0, limit)
      .map(([endpoint, data]) => ({
        endpoint,
        ...data
      }));
  }

  /**
   * Get slowest endpoints by average duration
   * @param {number} limit - Number of endpoints to return
   * @returns {Array} Slowest endpoints
   */
  getSlowestEndpoints(limit = 5) {
    return Object.entries(this.endpoints)
      .sort(([, a], [, b]) => b.avgDuration - a.avgDuration)
      .slice(0, limit)
      .map(([endpoint, data]) => ({
        endpoint,
        ...data
      }));
  }

  /**
   * Get recent requests
   * @param {number} limit - Number of requests to return
   * @returns {Array} Recent requests
   */
  getRecentRequests(limit = 10) {
    return this.requests.slice(-limit).reverse();
  }

  /**
   * Get recent errors
   * @param {number} limit - Number of errors to return
   * @returns {Array} Recent errors
   */
  getRecentErrors(limit = 10) {
    return this.errors.slice(-limit).reverse();
  }

  /**
   * Get health status
   * @returns {Object} Health status
   */
  getHealth() {
    const summary = this.getSummary();
    const recentRequests = this.getRecentRequests(20);
    
    // Calculate recent error rate (last 20 requests)
    const recentErrors = recentRequests.filter(r => r.statusCode >= 400).length;
    const recentErrorRate = recentErrors / recentRequests.length;

    // Status determination
    let status = 'healthy';
    if (recentErrorRate > 0.1) status = 'degraded';
    if (recentErrorRate > 0.25) status = 'unhealthy';

    return {
      status,
      uptime: summary.uptime,
      totalRequests: summary.totalRequests,
      recentErrorRate: Math.round(recentErrorRate * 100),
      avgResponseTime: summary.avgDuration,
      statusCodes: summary.statusCodes
    };
  }

  /**
   * Reset all metrics
   */
  reset() {
    this.requests = [];
    this.errors = [];
    this.statusCodes = {};
    this.endpoints = {};
    this.startTime = Date.now();
  }
}

// Create singleton instance
const metrics = new APIMetrics();

/**
 * Express middleware for recording metrics
 * @returns {Function} Middleware function
 */
export function metricsMiddleware() {
  return (req, res, next) => {
    const start = Date.now();

    res.on('finish', () => {
      const duration = Date.now() - start;
      metrics.recordRequest(req.method, req.path, res.statusCode, duration, req.id);
    });

    next();
  };
}

/**
 * Express route for metrics endpoint
 * @param {Object} req - Express request
 * @param {Object} res - Express response
 */
export function metricsEndpoint(req, res) {
  const { view = 'summary' } = req.query;

  let response;
  switch (view) {
    case 'health':
      response = metrics.getHealth();
      break;
    case 'endpoints':
      response = { endpoints: metrics.endpoints };
      break;
    case 'errors':
      response = {
        totalErrors: metrics.errors.length,
        recent: metrics.getRecentErrors(20)
      };
      break;
    case 'requests':
      response = {
        totalRequests: metrics.requests.length,
        recent: metrics.getRecentRequests(20)
      };
      break;
    default:
      response = metrics.getSummary();
  }

  res.json(response);
}

export { metrics };
