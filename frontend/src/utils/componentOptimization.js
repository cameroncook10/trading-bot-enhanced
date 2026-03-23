/**
 * Component Optimization Utilities
 * Helpers for optimizing React component performance
 * Includes memoization, debouncing, throttling, and render optimization
 */

import React, { useCallback, useRef, useMemo } from 'react';

/**
 * Custom hook for debouncing values
 * Useful for search inputs, resize handlers, etc.
 * @param {any} value - Value to debounce
 * @param {number} delay - Delay in milliseconds
 * @returns {any} Debounced value
 */
export const useDebounce = (value, delay = 300) => {
  const [debouncedValue, setDebouncedValue] = React.useState(value);

  React.useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => clearTimeout(handler);
  }, [value, delay]);

  return debouncedValue;
};

/**
 * Custom hook for throttling callbacks
 * Useful for scroll handlers, window resize, etc.
 * @param {Function} callback - Function to throttle
 * @param {number} delay - Delay in milliseconds
 * @returns {Function} Throttled callback
 */
export const useThrottle = (callback, delay = 300) => {
  const lastRunRef = useRef(Date.now());

  return useCallback((...args) => {
    const now = Date.now();
    if (now - lastRunRef.current >= delay) {
      callback(...args);
      lastRunRef.current = now;
    }
  }, [callback, delay]);
};

/**
 * Custom hook for memoizing expensive calculations
 * @param {Function} computeFn - Function that performs expensive calculation
 * @param {Array} dependencies - Dependencies that trigger recalculation
 * @returns {any} Memoized value
 */
export const useMemoized = (computeFn, dependencies) => {
  return useMemo(computeFn, dependencies);
};

/**
 * Custom hook to track previous value
 * Useful for comparing old vs new values
 * @param {any} value - Value to track
 * @returns {any} Previous value
 */
export const usePrevious = (value) => {
  const ref = useRef();

  React.useEffect(() => {
    ref.current = value;
  }, [value]);

  return ref.current;
};

/**
 * Optimized list rendering helper
 * Calculates which items are visible in a scrollable container
 * @param {number} itemCount - Total number of items
 * @param {number} itemHeight - Height of each item
 * @param {number} containerHeight - Height of visible container
 * @param {number} scrollPosition - Current scroll position
 * @param {number} overscan - Extra items to render outside visible area
 * @returns {Object} { startIndex, endIndex }
 */
export const calculateVisibleRange = (
  itemCount,
  itemHeight,
  containerHeight,
  scrollPosition,
  overscan = 3
) => {
  const startIndex = Math.max(0, Math.floor(scrollPosition / itemHeight) - overscan);
  const endIndex = Math.min(
    itemCount,
    Math.ceil((scrollPosition + containerHeight) / itemHeight) + overscan
  );

  return { startIndex, endIndex };
};

/**
 * Performance metrics collector
 * Helps identify performance bottlenecks
 */
export class PerformanceMonitor {
  constructor(name) {
    this.name = name;
    this.marks = {};
    this.measures = {};
  }

  start(label) {
    this.marks[`${label}-start`] = performance.now();
  }

  end(label) {
    this.marks[`${label}-end`] = performance.now();
    const duration = this.marks[`${label}-end`] - this.marks[`${label}-start`];
    this.measures[label] = duration;
    
    if (duration > 100) {
      console.warn(`⚠️ Performance: ${this.name} - ${label} took ${duration.toFixed(2)}ms`);
    }
  }

  getMetrics() {
    return this.measures;
  }

  reset() {
    this.marks = {};
    this.measures = {};
  }
}

/**
 * Check if data has changed (shallow comparison)
 * Useful for conditional renders and memoization
 * @param {Object} objA - First object
 * @param {Object} objB - Second object
 * @returns {boolean} True if objects are shallowly equal
 */
export const shallowEqual = (objA, objB) => {
  if (objA === objB) return true;
  if (!objA || !objB) return false;

  const keysA = Object.keys(objA);
  const keysB = Object.keys(objB);

  if (keysA.length !== keysB.length) return false;

  return keysA.every(key => objA[key] === objB[key]);
};

/**
 * Memoization decorator for expensive operations
 * Caches results based on arguments
 * @param {Function} fn - Function to memoize
 * @returns {Function} Memoized function
 */
export const memoize = (fn) => {
  const cache = new Map();

  return (...args) => {
    const key = JSON.stringify(args);

    if (cache.has(key)) {
      return cache.get(key);
    }

    const result = fn(...args);
    cache.set(key, result);

    // Limit cache size to prevent memory leaks
    if (cache.size > 100) {
      const firstKey = cache.keys().next().value;
      cache.delete(firstKey);
    }

    return result;
  };
};

export default {
  useDebounce,
  useThrottle,
  useMemoized,
  usePrevious,
  calculateVisibleRange,
  PerformanceMonitor,
  shallowEqual,
  memoize
};
