# Integration Guide - Using New Utilities

This guide shows how to integrate the new utility modules into your components and pages.

## Quick Start

### 1. Setup Environment Variables

Create `.env` in the root directory:
```
PORT=5000
NODE_ENV=development
CLIENT_URL=http://localhost:3000
```

Create `.env` in the frontend directory:
```
REACT_APP_API_URL=http://localhost:5000
REACT_APP_SOCKET_URL=http://localhost:5000
```

### 2. Initialize Socket Connection

In your main App.jsx:

```javascript
import { useEffect } from 'react';
import { initializeSocket } from './utils/socketService';

function App() {
  useEffect(() => {
    // Initialize socket connection once
    initializeSocket(
      (socketId) => console.log('Connected to server:', socketId),
      (reason) => console.log('Disconnected:', reason),
      (error) => console.error('Socket error:', error)
    );
  }, []);

  return (
    // Your app components
  );
}
```

### 3. Use API Service in Components

```javascript
import { useEffect, useState } from 'react';
import { apiService } from '../utils/api';

function Dashboard() {
  const [botStatus, setBotStatus] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchStatus = async () => {
      const result = await apiService.getBotStatus();
      if (result.success) {
        setBotStatus(result.data);
      } else {
        setError(result.error);
      }
      setLoading(false);
    };

    fetchStatus();
  }, []);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;
  
  return <div>Status: {botStatus?.status}</div>;
}
```

### 4. Validate User Input

```javascript
import { validateTrade } from '../utils/validation';

function TradeForm({ onSubmit }) {
  const handleSubmit = (formData) => {
    // Validate before submitting
    const errors = validateTrade(formData);
    
    if (errors.length > 0) {
      // Show errors to user
      console.error('Validation errors:', errors);
      return;
    }

    // Safe to submit
    onSubmit(formData);
  };

  return (
    <form onSubmit={(e) => {
      e.preventDefault();
      handleSubmit({
        symbol: 'BTC',
        type: 'long',
        entryPrice: 42500,
        quantity: 0.1
      });
    }}>
      {/* Form fields */}
    </form>
  );
}
```

### 5. Listen to Real-Time Events

```javascript
import { useEffect } from 'react';
import { onEvent, offEvent } from '../utils/socketService';
import { useBotStore } from '../store/botStore';

function ActivityPanel() {
  const addActivity = useBotStore((state) => state.addActivity);

  useEffect(() => {
    const handleActivityUpdate = (data) => {
      addActivity({
        id: data.id,
        type: 'info',
        timestamp: new Date(),
        message: data.message,
        severity: 'info'
      });
    };

    // Listen for activity updates
    onEvent('activity-update', handleActivityUpdate);

    // Cleanup
    return () => {
      offEvent('activity-update', handleActivityUpdate);
    };
  }, [addActivity]);

  return <div>Activity Panel</div>;
}
```

### 6. Use Performance Utilities

```javascript
import { debounce, memoize } from '../utils/performance';

function SearchComponent() {
  // Debounce API calls on search input
  const debouncedSearch = debounce(async (query) => {
    const result = await apiService.getSignals(query);
    setResults(result.data);
  }, 300);

  const handleSearchChange = (e) => {
    debouncedSearch(e.target.value);
  };

  return (
    <input 
      type="text" 
      onChange={handleSearchChange}
      placeholder="Search signals..."
    />
  );
}

// Memoize expensive calculation
const calculatePortfolioMetrics = memoize((positions) => {
  return positions.reduce((acc, pos) => {
    return {
      totalValue: acc.totalValue + pos.quantity * pos.currentPrice,
      totalPNL: acc.totalPNL + pos.pnl
    };
  }, { totalValue: 0, totalPNL: 0 });
});

function Portfolio({ positions }) {
  const metrics = calculatePortfolioMetrics(positions);
  return <div>Total Value: ${metrics.totalValue}</div>;
}
```

## Common Patterns

### Pattern 1: Fetch Data on Mount

```javascript
useEffect(() => {
  const loadData = async () => {
    const result = await apiService.getTrades(50, 0);
    if (result.success) {
      setTrades(result.data.trades);
    } else {
      setError(result.error);
    }
  };
  
  loadData();
}, []);
```

### Pattern 2: Execute Trade with Validation

```javascript
const handleExecuteTrade = async (tradeData) => {
  // Validate
  const errors = validateTrade(tradeData);
  if (errors.length > 0) {
    showErrors(errors);
    return;
  }

  // Execute
  const result = await apiService.executeTrade(tradeData);
  if (result.success) {
    showSuccess('Trade executed');
    addActivity({
      id: `trade-${Date.now()}`,
      type: 'trade',
      timestamp: new Date(),
      message: `Trade executed: ${tradeData.symbol}`,
      severity: 'success'
    });
  } else {
    showError(result.error);
  }
};
```

### Pattern 3: Real-Time Updates via Socket

```javascript
useEffect(() => {
  // Listen for bot status updates
  onEvent('bot-status', (data) => {
    setBotStatus(data.status);
  });

  // Listen for trade executions
  onEvent('trade-executed', (data) => {
    addTrade(data);
    addActivity({
      id: `trade-${Date.now()}`,
      type: 'trade',
      timestamp: new Date(),
      message: `Trade executed`,
      severity: 'success'
    });
  });

  return () => {
    offEvent('bot-status', null);
    offEvent('trade-executed', null);
  };
}, []);
```

### Pattern 4: Wrap Components with Error Boundary

```javascript
import ErrorBoundary from './components/ErrorBoundary';

function App() {
  return (
    <ErrorBoundary>
      <Dashboard />
      <ActivityFeed />
    </ErrorBoundary>
  );
}
```

## Migration Guide

If you have existing components using different patterns:

### Before: Direct API calls
```javascript
// Old pattern
axios.get('/api/trades').then(res => {
  setTrades(res.data.trades);
}).catch(err => {
  console.error(err);
});
```

### After: Using apiService
```javascript
// New pattern
const result = await apiService.getTrades();
if (result.success) {
  setTrades(result.data.trades);
} else {
  console.error(result.error);
}
```

## Testing Your Integration

### Test API calls
```javascript
// In browser console
import { apiService } from './utils/api';

apiService.checkHealth().then(result => {
  console.log('Health check:', result);
});
```

### Test Socket connection
```javascript
// In browser console
import { initializeSocket, isSocketConnected } from './utils/socketService';

initializeSocket();
setTimeout(() => {
  console.log('Connected:', isSocketConnected());
}, 1000);
```

### Test validation
```javascript
// In browser console
import { validateTrade } from './utils/validation';

const errors = validateTrade({ symbol: 'BTC' });
console.log('Validation errors:', errors);
```

## Troubleshooting

### Socket not connecting
1. Check that backend is running on correct port
2. Verify CORS configuration
3. Check browser console for connection errors
4. Try refreshing the page

### API calls failing
1. Verify backend health: `curl http://localhost:5000/api/health`
2. Check that endpoints exist
3. Verify request data format
4. Check network tab in dev tools

### Validation errors
1. Review error messages
2. Check data format matches expected schema
3. Verify all required fields are present

## Performance Tips

1. Use `debounce` for search and filter inputs
2. Use `memoize` for expensive calculations
3. Use `throttle` for scroll/resize events
4. Monitor performance with MetricsCollector
5. Check memory usage with getMemoryUsage()

## Security Best Practices

1. Always validate user input with validation utilities
2. Never send sensitive data in plain text
3. Use HTTPS in production
4. Keep API keys in environment variables
5. Validate API responses before using data

## Next Steps

1. Integrate socket initialization in your main App
2. Replace API calls with apiService
3. Add input validation to forms
4. Wrap app with ErrorBoundary
5. Monitor performance in development

For more details, see the individual utility READMEs in `/frontend/src/utils/`.
