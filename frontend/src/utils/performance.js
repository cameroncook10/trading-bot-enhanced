/**
 * Performance monitoring utilities
 */

// Simple performance logger
export class PerformanceMonitor {
  constructor(name) {
    this.name = name;
    this.startTime = performance.now();
  }

  end() {
    const duration = performance.now() - this.startTime;
    console.log(`⏱️  ${this.name}: ${duration.toFixed(2)}ms`);
    return duration;
  }
}

// Monitor API call performance
export const monitorApiCall = async (apiFunction, name) => {
  const monitor = new PerformanceMonitor(name);
  try {
    const result = await apiFunction();
    monitor.end();
    return result;
  } catch (error) {
    monitor.end();
    throw error;
  }
};

// Debounce function for expensive operations
export const debounce = (func, delay = 300) => {
  let timeoutId;
  return (...args) => {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => func(...args), delay);
  };
};

// Throttle function for rate limiting
export const throttle = (func, limit = 1000) => {
  let inThrottle;
  return (...args) => {
    if (!inThrottle) {
      func.apply(this, args);
      inThrottle = true;
      setTimeout(() => (inThrottle = false), limit);
    }
  };
};

// Memoization for expensive computations
export const memoize = (func) => {
  const cache = new Map();
  return (...args) => {
    const key = JSON.stringify(args);
    if (cache.has(key)) {
      return cache.get(key);
    }
    const result = func(...args);
    cache.set(key, result);
    return result;
  };
};

// Batch updates to reduce renders
export const batchUpdates = (updates, callback) => {
  const batch = Array.isArray(updates) ? updates : [updates];
  requestAnimationFrame(() => {
    batch.forEach(update => {
      if (typeof update === 'function') {
        update();
      }
    });
    if (typeof callback === 'function') {
      callback();
    }
  });
};

// Memory usage tracking
export const getMemoryUsage = () => {
  if (performance.memory) {
    return {
      usedJSHeapSize: (performance.memory.usedJSHeapSize / 1048576).toFixed(2) + ' MB',
      totalJSHeapSize: (performance.memory.totalJSHeapSize / 1048576).toFixed(2) + ' MB',
      jsHeapSizeLimit: (performance.memory.jsHeapSizeLimit / 1048576).toFixed(2) + ' MB'
    };
  }
  return null;
};

// Log memory usage periodically (for debugging)
export const logMemoryUsage = (interval = 30000) => {
  setInterval(() => {
    const memory = getMemoryUsage();
    if (memory) {
      console.log('📊 Memory:', memory);
    }
  }, interval);
};

// Performance metrics collector
export class MetricsCollector {
  constructor() {
    this.metrics = {};
  }

  record(name, value) {
    if (!this.metrics[name]) {
      this.metrics[name] = [];
    }
    this.metrics[name].push(value);
  }

  getStats(name) {
    const values = this.metrics[name] || [];
    if (values.length === 0) return null;

    const sorted = [...values].sort((a, b) => a - b);
    const sum = sorted.reduce((a, b) => a + b, 0);
    const avg = sum / sorted.length;
    const median = sorted[Math.floor(sorted.length / 2)];
    const min = sorted[0];
    const max = sorted[sorted.length - 1];

    return { min, max, avg, median, count: sorted.length };
  }

  printStats(name) {
    const stats = this.getStats(name);
    if (!stats) {
      console.log(`No metrics recorded for ${name}`);
      return;
    }
    console.log(`📈 ${name}:`, stats);
  }
}

// React component render tracking
export const useRenderCount = (componentName) => {
  const renderCountRef = React.useRef(0);

  React.useEffect(() => {
    renderCountRef.current++;
    console.log(`🔄 ${componentName} rendered ${renderCountRef.current} times`);
  });

  return renderCountRef.current;
};
