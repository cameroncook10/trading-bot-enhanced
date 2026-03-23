/**
 * Validators Test Suite
 * Tests for data validation functions
 */

import { 
  validateTrade, 
  validateSignalStatus, 
  validatePagination,
  isValidRequestBody,
  validateRequiredFields,
  sanitizeNumber,
  sanitizeString
} from '../utils/validators.js';

console.log('🧪 Running Validator Tests...\n');

let testsPassed = 0;
let testsFailed = 0;

const test = (description, testFn) => {
  try {
    testFn();
    console.log(`✅ ${description}`);
    testsPassed++;
  } catch (error) {
    console.log(`❌ ${description}`);
    console.log(`   Error: ${error.message}\n`);
    testsFailed++;
  }
};

const assert = (condition, message) => {
  if (!condition) {
    throw new Error(message);
  }
};

// Trade Validation Tests
console.log('--- Trade Validation ---');

test('Should validate valid trade', () => {
  const result = validateTrade({
    symbol: 'BTC',
    type: 'long',
    amount: 0.5,
    price: 42500
  });
  assert(result.valid === true, 'Trade should be valid');
});

test('Should reject trade with missing symbol', () => {
  const result = validateTrade({
    type: 'long',
    amount: 0.5,
    price: 42500
  });
  assert(result.valid === false, 'Trade should be invalid without symbol');
});

test('Should reject trade with invalid type', () => {
  const result = validateTrade({
    symbol: 'BTC',
    type: 'invalid',
    amount: 0.5,
    price: 42500
  });
  assert(result.valid === false, 'Trade should be invalid with invalid type');
});

test('Should reject trade with negative amount', () => {
  const result = validateTrade({
    symbol: 'BTC',
    type: 'long',
    amount: -0.5,
    price: 42500
  });
  assert(result.valid === false, 'Trade should be invalid with negative amount');
});

// Signal Status Validation Tests
console.log('\n--- Signal Status Validation ---');

test('Should accept valid status "pending"', () => {
  const result = validateSignalStatus('pending');
  assert(result.valid === true, 'Status should be valid');
});

test('Should accept "all" status', () => {
  const result = validateSignalStatus('all');
  assert(result.valid === true, 'Status should be valid');
});

test('Should reject invalid status', () => {
  const result = validateSignalStatus('invalid');
  assert(result.valid === false, 'Status should be invalid');
});

// Pagination Validation Tests
console.log('\n--- Pagination Validation ---');

test('Should validate valid pagination', () => {
  const result = validatePagination(50, 0);
  assert(result.valid === true, 'Pagination should be valid');
  assert(result.sanitized.limit === 50, 'Limit should be 50');
  assert(result.sanitized.offset === 0, 'Offset should be 0');
});

test('Should enforce max limit', () => {
  const result = validatePagination(1000, 0, 500);
  assert(result.sanitized.limit === 500, 'Limit should be capped at 500');
});

test('Should handle negative offset', () => {
  const result = validatePagination(50, -10);
  assert(result.sanitized.offset === 0, 'Negative offset should be 0');
});

// Request Body Validation Tests
console.log('\n--- Request Body Validation ---');

test('Should validate non-empty object', () => {
  const result = isValidRequestBody({ symbol: 'BTC' });
  assert(result === true, 'Non-empty object should be valid');
});

test('Should reject empty object', () => {
  const result = isValidRequestBody({});
  assert(result === false, 'Empty object should be invalid');
});

test('Should reject null', () => {
  const result = isValidRequestBody(null);
  assert(result === false, 'Null should be invalid');
});

// Required Fields Validation Tests
console.log('\n--- Required Fields Validation ---');

test('Should accept when all required fields present', () => {
  const result = validateRequiredFields(
    { symbol: 'BTC', type: 'long' },
    ['symbol', 'type']
  );
  assert(result.valid === true, 'Should be valid');
  assert(result.missing.length === 0, 'No fields should be missing');
});

test('Should reject when required fields missing', () => {
  const result = validateRequiredFields(
    { symbol: 'BTC' },
    ['symbol', 'type', 'amount']
  );
  assert(result.valid === false, 'Should be invalid');
  assert(result.missing.includes('type'), 'Should report missing type');
  assert(result.missing.includes('amount'), 'Should report missing amount');
});

// Sanitization Tests
console.log('\n--- Sanitization ---');

test('Should sanitize valid number', () => {
  const result = sanitizeNumber('42.5', 0);
  assert(result === 42.5, 'Should convert string to number');
});

test('Should use default for invalid number', () => {
  const result = sanitizeNumber('invalid', 99);
  assert(result === 99, 'Should use default value');
});

test('Should sanitize string by trimming', () => {
  const result = sanitizeString('  BTC  ', '');
  assert(result === 'BTC', 'Should trim whitespace');
});

test('Should use default for non-string', () => {
  const result = sanitizeString(123, 'DEFAULT');
  assert(result === 'DEFAULT', 'Should use default for non-string');
});

// Summary
console.log('\n' + '='.repeat(50));
console.log(`\n📊 Test Results: ${testsPassed} passed, ${testsFailed} failed\n`);

if (testsFailed === 0) {
  console.log('✅ All tests passed!');
  process.exit(0);
} else {
  console.log(`❌ ${testsFailed} test(s) failed`);
  process.exit(1);
}
