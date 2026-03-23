# Frontend Utilities

This directory contains reusable utility modules for the trading bot frontend.

## Modules

### `api.js` - API Service
Centralized API client with error handling and consistent response format.

**Usage:**
```javascript
import { apiService } from './utils/api';

// Check backend health
const health = await apiService.checkHealth();
if (health.success) {
  console.log('Backend is healthy');
}

// Get trades with pagination
const trades = await apiService.getTrades(50, 0);
if (trades.success) {
  console.log('Trades:', trades.data);
}

// Execute a trade
const result = await apiService.executeTrade({
  symbol: 'BTC',
  type: 'long',
  amount: 0.1,
  price: 42500
});
```

### `socketService.js` - WebSocket Management
Encapsulated socket connection with auto-reconnection and error handling.

**Usage:**
```javascript
import {
  initializeSocket,
  emitEvent,
  onEvent,
  isSocketConnected
} from './utils/socketService';

// Initialize connection
initializeSocket(
  (socketId) => console.log('Connected:', socketId),
  (reason) => console.log('Disconnected:', reason),
  (error) => console.error('Socket error:', error)
);

// Listen to events
onEvent('bot-status', (data) => {
  console.log('Bot status:', data);
});

// Emit events
emitEvent('execute-trade', {
  symbol: 'BTC',
  type: 'long'
}, (response) => {
  console.log('Trade response:', response);
});

// Check connection
if (isSocketConnected()) {
  console.log('Connected to server');
}
```

### `validation.js` - Data Validation
Comprehensive validation utilities for trades, signals, and positions.

**Usage:**
```javascript
import {
  validateTrade,
  validateSignal,
  calculatePNL,
  isRiskAcceptable
} from './utils/validation';

// Validate trade data
const trade = { symbol: 'BTC', type: 'long', entryPrice: 42500, quantity: 0.1 };
const errors = validateTrade(trade);
if (errors.length > 0) {
  console.error('Trade validation failed:', errors);
}

// Calculate P&L
const pnl = calculatePNL(42500, 43000, 0.1, 'long');
console.log(`P&L: ${pnl.pnl} (${pnl.pnlPercent}%)`);

// Check risk acceptability
const isAcceptable = isRiskAcceptable('moderate', 0.10, 0.15);
```

### `performance.js` - Performance Monitoring
Tools for monitoring, optimizing, and measuring performance.

**Usage:**
```javascript
import {
  PerformanceMonitor,
  debounce,
  throttle,
  memoize,
  MetricsCollector
} from './utils/performance';

// Monitor function execution time
const monitor = new PerformanceMonitor('Data Processing');
processData();
monitor.end(); // Logs: ⏱️  Data Processing: 45.23ms

// Debounce expensive search
const debouncedSearch = debounce((query) => {
  searchAPI(query);
}, 300);

input.addEventListener('change', (e) => {
  debouncedSearch(e.target.value);
});

// Memoize expensive calculation
const calculateMetrics = memoize((trades) => {
  return trades.reduce((acc, trade) => acc + trade.pnl, 0);
});

// Collect metrics
const metrics = new MetricsCollector();
metrics.record('apiResponseTime', 150);
metrics.record('apiResponseTime', 200);
metrics.printStats('apiResponseTime');
// Output: 📈 apiResponseTime: { min: 150, max: 200, avg: 175, median: 175, count: 2 }
```

## Environment Configuration

Create a `.env` file in the frontend directory:

```
REACT_APP_API_URL=http://localhost:5000
REACT_APP_SOCKET_URL=http://localhost:5000
```

## Error Handling

All utilities follow a consistent error handling pattern:

```javascript
// API calls return objects with success flag
const result = await apiService.getTrades();
if (result.success) {
  // Handle success
} else {
  // Handle error
  console.error(result.error);
}

// Socket operations use callbacks
emitEvent('event-name', data, (response) => {
  if (response.success) {
    // Handle success
  } else {
    // Handle error
  }
});

// Validation returns error arrays
const errors = validateTrade(tradeData);
if (errors.length > 0) {
  // Handle errors
}
```

## Best Practices

1. **Always check `success` flag** in API responses
2. **Use error boundary** for component-level error handling
3. **Validate user input** before submitting to API
4. **Use debounce/throttle** for frequent events (search, scroll)
5. **Use memoization** for expensive computations
6. **Monitor performance** in development with metrics

## Testing

Each utility includes built-in error handling for graceful degradation:

```javascript
// Try-catch blocks prevent crashes
try {
  const result = await apiService.executeTrade(data);
} catch (error) {
  console.error('Trade execution failed:', error);
}

// Validation prevents invalid state
const errors = validateTrade(data);
if (errors.length === 0) {
  // Safe to use data
}
```

## Integration with React

### Using in Components

```javascript
import React, { useState, useEffect } from 'react';
import { apiService } from '../utils/api';
import { initializeSocket, onEvent } from '../utils/socketService';

function MyComponent() {
  const [status, setStatus] = useState(null);

  useEffect(() => {
    // Initialize socket
    initializeSocket(
      () => console.log('Connected'),
      () => console.log('Disconnected')
    );

    // Listen to updates
    onEvent('bot-status', (data) => {
      setStatus(data);
    });

    // Fetch initial data
    apiService.getBotStatus().then(result => {
      if (result.success) {
        setStatus(result.data);
      }
    });
  }, []);

  return <div>{status && <p>Status: {status.status}</p>}</div>;
}
```

## Further Reading

- See `IMPROVEMENTS_LOG.md` for implementation details
- Check component files for usage examples
- Review store implementation for state management patterns
