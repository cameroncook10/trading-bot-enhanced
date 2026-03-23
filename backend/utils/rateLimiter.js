/**
 * Rate Limiter Utility
 * Prevents API abuse by limiting requests per client
 */

/**
 * In-memory store for rate limiting
 * In production, use Redis for distributed rate limiting
 */
class RateLimiter {
  constructor() {
    this.clients = new Map(); // Map of IP -> { requests: [], lastCleanup: timestamp }
  }

  /**
   * Check if a client has exceeded rate limit
   * @param {string} clientId - Client identifier (IP address)
   * @param {number} maxRequests - Maximum requests allowed
   * @param {number} windowMs - Time window in milliseconds
   * @returns {Object} { allowed: boolean, remaining: number, resetAt: timestamp }
   */
  check(clientId, maxRequests = 100, windowMs = 60000) {
    const now = Date.now();
    const windowStart = now - windowMs;

    if (!this.clients.has(clientId)) {
      this.clients.set(clientId, { requests: [], lastCleanup: now });
    }

    const client = this.clients.get(clientId);

    // Clean up old requests (older than window)
    if (now - client.lastCleanup > windowMs) {
      client.requests = client.requests.filter(timestamp => timestamp > windowStart);
      client.lastCleanup = now;
    }

    // Remove old requests from current window
    client.requests = client.requests.filter(timestamp => timestamp > windowStart);

    const isAllowed = client.requests.length < maxRequests;
    
    if (isAllowed) {
      client.requests.push(now);
    }

    const remaining = Math.max(0, maxRequests - client.requests.length);
    const resetAt = client.requests.length > 0 
      ? client.requests[0] + windowMs 
      : now;

    return {
      allowed: isAllowed,
      remaining,
      resetAt,
      limit: maxRequests,
      window: windowMs
    };
  }

  /**
   * Get current status for a client
   * @param {string} clientId - Client identifier
   * @returns {Object} Current status or null if no data
   */
  getStatus(clientId) {
    return this.clients.get(clientId) || null;
  }

  /**
   * Reset rate limit for a client
   * @param {string} clientId - Client identifier
   */
  reset(clientId) {
    this.clients.delete(clientId);
  }

  /**
   * Get all tracked clients
   * @returns {Array} Array of client IDs
   */
  getClients() {
    return Array.from(this.clients.keys());
  }

  /**
   * Clear all old entries (useful for cleanup)
   * @param {number} olderThanMs - Clear entries older than this (default: 1 hour)
   */
  cleanup(olderThanMs = 3600000) {
    const now = Date.now();
    const cutoff = now - olderThanMs;

    for (const [clientId, client] of this.clients.entries()) {
      if (client.lastCleanup < cutoff && client.requests.length === 0) {
        this.clients.delete(clientId);
      }
    }
  }
}

/**
 * Express middleware factory for rate limiting
 * @param {Object} options - Configuration options
 * @returns {Function} Express middleware
 */
export function createRateLimitMiddleware(options = {}) {
  const {
    maxRequests = 100,
    windowMs = 60000,
    skipSuccessfulRequests = false,
    skipFailedRequests = false,
    keyGenerator = (req) => req.ip,
    handler = null
  } = options;

  const limiter = new RateLimiter();

  // Cleanup old entries every 10 minutes
  setInterval(() => limiter.cleanup(), 600000);

  return (req, res, next) => {
    const clientId = keyGenerator(req);
    const status = limiter.check(clientId, maxRequests, windowMs);

    // Set rate limit headers
    res.set({
      'X-RateLimit-Limit': maxRequests.toString(),
      'X-RateLimit-Remaining': status.remaining.toString(),
      'X-RateLimit-Reset': new Date(status.resetAt).toISOString(),
      'Retry-After': status.allowed ? undefined : Math.ceil((status.resetAt - Date.now()) / 1000)
    });

    if (!status.allowed) {
      const secondsUntilReset = Math.ceil((status.resetAt - Date.now()) / 1000);
      
      if (handler) {
        return handler(req, res, {
          limit: maxRequests,
          current: maxRequests,
          remaining: 0,
          resetAt: status.resetAt
        });
      }

      return res.status(429).json({
        error: 'Too many requests',
        message: `Rate limit exceeded. Please try again in ${secondsUntilReset} seconds.`,
        retryAfter: secondsUntilReset,
        resetAt: new Date(status.resetAt).toISOString()
      });
    }

    next();
  };
}

export { RateLimiter };
