/**
 * Rate Limiter Tests
 * Comprehensive test suite for rate limiting functionality
 */

import { RateLimiter, createRateLimitMiddleware } from '../utils/rateLimiter.js';

function test(description, fn) {
  try {
    fn();
    console.log(`✅ ${description}`);
  } catch (error) {
    console.log(`❌ ${description}`);
    console.log(`   Error: ${error.message}\n`);
  }
}

function assertEqual(actual, expected, message = '') {
  if (actual !== expected) {
    throw new Error(`Expected ${expected}, got ${actual}. ${message}`);
  }
}

function assertTrue(value, message = '') {
  if (!value) {
    throw new Error(`Expected true, got ${value}. ${message}`);
  }
}

function assertFalse(value, message = '') {
  if (value) {
    throw new Error(`Expected false, got ${value}. ${message}`);
  }
}

console.log('🧪 Running Rate Limiter Tests...\n');

// Basic functionality tests
console.log('--- Basic Functionality ---');

test('Should allow requests within limit', () => {
  const limiter = new RateLimiter();
  const result = limiter.check('client1', 5, 60000);
  assertTrue(result.allowed);
  assertEqual(result.remaining, 4);
});

test('Should block requests exceeding limit', () => {
  const limiter = new RateLimiter();
  for (let i = 0; i < 5; i++) {
    limiter.check('client2', 5, 60000);
  }
  const result = limiter.check('client2', 5, 60000);
  assertFalse(result.allowed);
  assertEqual(result.remaining, 0);
});

test('Should track requests correctly', () => {
  const limiter = new RateLimiter();
  assertEqual(limiter.getClients().length, 0);
  
  limiter.check('client3', 10, 60000);
  assertEqual(limiter.getClients().length, 1);
  
  limiter.check('client4', 10, 60000);
  assertEqual(limiter.getClients().length, 2);
});

test('Should reset rate limit for client', () => {
  const limiter = new RateLimiter();
  limiter.check('client5', 5, 60000);
  limiter.reset('client5');
  
  const status = limiter.getStatus('client5');
  assertEqual(status, null);
});

// Time window tests
console.log('\n--- Time Window Handling ---');

test('Should reset after time window expires', (done) => {
  const limiter = new RateLimiter();
  const windowMs = 100; // 100ms window for fast testing
  
  // Fill up the limit
  for (let i = 0; i < 2; i++) {
    limiter.check('client6', 2, windowMs);
  }
  
  let result = limiter.check('client6', 2, windowMs);
  assertFalse(result.allowed);
  
  // Wait for window to expire
  setTimeout(() => {
    result = limiter.check('client6', 2, windowMs);
    assertTrue(result.allowed, 'Should allow requests after window expires');
  }, 150);
});

test('Should return resetAt timestamp', () => {
  const limiter = new RateLimiter();
  const result = limiter.check('client7', 5, 60000);
  
  assertTrue(result.resetAt > Date.now());
});

// Multiple clients tests
console.log('\n--- Multiple Clients ---');

test('Should isolate limits between clients', () => {
  const limiter = new RateLimiter();
  
  // Max out client1
  for (let i = 0; i < 3; i++) {
    limiter.check('client8', 3, 60000);
  }
  
  // client2 should still be allowed
  const result = limiter.check('client9', 3, 60000);
  assertTrue(result.allowed);
});

test('Should track correct remaining count per client', () => {
  const limiter = new RateLimiter();
  
  limiter.check('client10', 5, 60000);
  limiter.check('client10', 5, 60000);
  const result = limiter.check('client10', 5, 60000);
  
  assertEqual(result.remaining, 2);
});

// Cleanup tests
console.log('\n--- Cleanup ---');

test('Should clean up old entries', () => {
  const limiter = new RateLimiter();
  
  limiter.check('old-client', 5, 60000);
  assertEqual(limiter.getClients().length, 1);
  
  // Cleanup entries older than 10ms (old-client will be old)
  setTimeout(() => {
    limiter.cleanup(10);
    assertEqual(limiter.getClients().length, 0);
  }, 15);
});

// Middleware tests
console.log('\n--- Middleware ---');

test('Should create middleware with default options', () => {
  const middleware = createRateLimitMiddleware();
  assertTrue(typeof middleware === 'function');
});

test('Middleware should set rate limit headers', () => {
  const middleware = createRateLimitMiddleware({
    maxRequests: 10,
    windowMs: 60000
  });
  
  const req = {
    ip: '127.0.0.1'
  };
  
  const res = {
    set: (headers) => {
      assertTrue('X-RateLimit-Limit' in headers);
      assertTrue('X-RateLimit-Remaining' in headers);
      assertTrue('X-RateLimit-Reset' in headers);
    }
  };
  
  const next = () => {};
  middleware(req, res, next);
});

// Summary
console.log('\n' + '='.repeat(50));
console.log('\n✅ Rate Limiter Tests Complete!\n');
