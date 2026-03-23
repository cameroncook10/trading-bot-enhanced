# API Integration Guide

This guide explains how to integrate the trading bot dashboard with your backend API.

## Overview

The dashboard is pre-configured with hooks and utilities for API communication:
- **useApi** hook - RESTful API calls with auto-refresh
- **useWebSocket** hook - Real-time WebSocket updates
- Mock data - For development and testing

## Environment Configuration

Update your `.env` file with your API endpoints:

```env
# Backend API
VITE_API_BASE_URL=https://api.yourcompany.com
VITE_WS_URL=wss://api.yourcompany.com/ws

# Environment
VITE_ENVIRONMENT=production
```

## REST API Endpoints

The dashboard expects these endpoints from your backend:

### Portfolio Data

#### GET /api/portfolio
Returns full portfolio overview with positions.

**Response**:
```json
{
  "total_value": 45000,
  "total_invested": 38500,
  "total_pnl": 6500,
  "total_pnl_percent": 16.88,
  "cash_available": 5000,
  "positions": [
    {
      "id": "1",
      "symbol": "AAPL",
      "quantity": 50,
      "entry_price": 150.25,
      "current_price": 175.80,
      "value": 8790,
      "unrealized_pnl": 1277.5,
      "unrealized_pnl_percent": 17.04,
      "confidence_score": 87,
      "side": "LONG"
    }
  ],
  "allocation": [
    {
      "symbol": "AAPL",
      "value": 8790,
      "percent": 19.5,
      "type": "stock"
    }
  ]
}
```

**Usage in component**:
```typescript
import { useApi } from '../hooks/useApi'

function MyComponent() {
  const { data: portfolio, loading, error } = useApi('/api/portfolio')
  
  if (loading) return <div>Loading...</div>
  if (error) return <div>Error loading portfolio</div>
  
  return <div>{portfolio?.total_value}</div>
}
```

### Trades

#### GET /api/trades
Returns list of all trades with optional filtering.

**Query Parameters**:
- `status` - OPEN, CLOSED, PENDING
- `symbol` - Filter by symbol
- `limit` - Maximum results (default: 100)

**Response**:
```json
{
  "trades": [
    {
      "id": "1",
      "symbol": "AAPL",
      "entry_price": 150.25,
      "current_price": 175.80,
      "quantity": 50,
      "side": "LONG",
      "status": "OPEN",
      "confidence": 87,
      "entry_time": "2024-03-20T10:30:00Z",
      "exit_time": null,
      "pnl": null,
      "pnl_percent": null,
      "reasoning": "Golden cross detected on daily chart",
      "tags": ["technical", "momentum"]
    }
  ],
  "total": 42,
  "page": 1
}
```

#### GET /api/trades/:id
Get detailed information about a specific trade.

### Signals

#### GET /api/signals
Returns current market signals across all symbols.

**Response**:
```json
{
  "signals": [
    {
      "id": "1",
      "type": "BUY",
      "symbol": "BTC",
      "strength": "STRONG",
      "indicators": [
        {
          "name": "RSI",
          "value": "32",
          "signal": "bullish"
        }
      ],
      "sentiment": {
        "social": 68,
        "news": 72,
        "technical": 85
      },
      "generated_at": "2024-03-23T18:30:00Z",
      "confidence": 88
    }
  ]
}
```

#### GET /api/signals/:symbol
Get signals for a specific symbol.

### Activity & Logs

#### GET /api/logs
Returns activity logs with filtering options.

**Query Parameters**:
- `level` - INFO, WARNING, ERROR, SUCCESS
- `limit` - Maximum results (default: 50)

**Response**:
```json
{
  "logs": [
    {
      "id": "1",
      "timestamp": "2024-03-23T18:30:00Z",
      "action": "TRADE EXECUTED",
      "details": "Executed long on AAPL at $175.50",
      "level": "SUCCESS",
      "reasoning": "Confidence score 87%, within risk parameters"
    }
  ]
}
```

### Settings

#### GET /api/settings
Returns current bot configuration.

**Response**:
```json
{
  "model": "claude-3-opus",
  "max_position_size": 50000,
  "max_daily_loss": 500,
  "min_confidence_threshold": 65,
  "risk_per_trade": 2,
  "trailing_stop_percent": 5,
  "notifications_enabled": true,
  "email_notifications": true,
  "push_notifications": true,
  "webhook_url": "https://example.com/webhook"
}
```

#### PUT /api/settings
Update bot configuration.

**Request Body**:
```json
{
  "model": "claude-3-opus",
  "max_position_size": 75000,
  "max_daily_loss": 750,
  "min_confidence_threshold": 70
}
```

**Response**: Updated settings object

## WebSocket Integration

The dashboard maintains a persistent WebSocket connection for real-time updates.

### Connection Setup

The `useWebSocket` hook automatically handles connection and reconnection:

```typescript
import { useWebSocket } from '../hooks/useWebSocket'

function RealtimeComponent() {
  const { isConnected, lastMessage, send } = useWebSocket()
  
  return (
    <div>
      Status: {isConnected ? 'Connected' : 'Disconnected'}
    </div>
  )
}
```

### Message Types

The WebSocket sends and receives JSON messages with these types:

#### Trade Updates
```json
{
  "type": "trade",
  "data": {
    "id": "1",
    "symbol": "AAPL",
    "side": "LONG",
    "entry_price": 175.50,
    "confidence": 87,
    "status": "OPEN"
  }
}
```

#### Signal Updates
```json
{
  "type": "signal",
  "data": {
    "id": "sig-1",
    "symbol": "BTC",
    "type": "BUY",
    "strength": "STRONG",
    "confidence": 88
  }
}
```

#### Position Updates
```json
{
  "type": "position",
  "data": {
    "id": "1",
    "symbol": "AAPL",
    "quantity": 50,
    "current_price": 175.80,
    "unrealized_pnl": 1277.5
  }
}
```

#### Activity Logs
```json
{
  "type": "log",
  "data": {
    "id": "log-1",
    "timestamp": "2024-03-23T18:30:00Z",
    "action": "TRADE EXECUTED",
    "details": "Executed long on AAPL",
    "level": "SUCCESS"
  }
}
```

#### Performance Metrics
```json
{
  "type": "metric",
  "data": {
    "date": "2024-03-23",
    "total_pnl": 450,
    "win_rate": 62.5,
    "trades_executed": 8,
    "avg_confidence": 78.3
  }
}
```

## CORS Configuration

Your backend must allow requests from the dashboard domain.

### Development
```javascript
const cors = require('cors');

app.use(cors({
  origin: 'http://localhost:5173',
  credentials: true
}));
```

### Production
```javascript
app.use(cors({
  origin: [
    'https://your-dashboard.vercel.app',
    'https://trading-bot-dashboard.yourdomain.com'
  ],
  credentials: true
}));
```

## Error Handling

The hooks handle errors gracefully:

```typescript
function Dashboard() {
  const { data, loading, error } = useApi('/api/portfolio')
  
  if (error) {
    return (
      <div className="error">
        <h3>Failed to load portfolio</h3>
        <p>{error.message}</p>
        <button onClick={() => window.location.reload()}>Retry</button>
      </div>
    )
  }
  
  return <div>{/* content */}</div>
}
```

## Rate Limiting

Implement rate limiting in your backend to protect against abuse:

```javascript
const rateLimit = require('express-rate-limit');

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100 // limit each IP to 100 requests per windowMs
});

app.use('/api/', limiter);
```

## Authentication

If your API requires authentication:

### Option 1: API Key in Header

```typescript
// Update useApi hook
const response = await axios.get(
  `${API_BASE_URL}${endpoint}`,
  {
    headers: {
      'Authorization': `Bearer ${process.env.VITE_API_KEY}`
    }
  }
)
```

### Option 2: JWT Token

```typescript
// Store token in localStorage
const token = localStorage.getItem('auth_token')

const response = await axios.get(
  `${API_BASE_URL}${endpoint}`,
  {
    headers: {
      'Authorization': `Bearer ${token}`
    }
  }
)
```

### Option 3: OAuth

For OAuth, implement a login flow and store the access token:

```typescript
// In your auth service
async function getAccessToken() {
  const token = localStorage.getItem('oauth_token')
  
  if (isTokenExpired(token)) {
    const newToken = await refreshToken()
    localStorage.setItem('oauth_token', newToken)
    return newToken
  }
  
  return token
}
```

## Example Backend Implementations

### Python/Flask
```python
from flask import Flask, jsonify
from flask_cors import CORS

app = Flask(__name__)
CORS(app)

@app.route('/api/portfolio')
def get_portfolio():
    return jsonify({
        'total_value': 45000,
        'total_pnl': 6500,
        'positions': [...]
    })
```

### Node.js/Express
```javascript
const express = require('express');
const cors = require('cors');

const app = express();
app.use(cors());

app.get('/api/portfolio', (req, res) => {
  res.json({
    total_value: 45000,
    total_pnl: 6500,
    positions: [...]
  });
});
```

### Python/FastAPI
```python
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["https://your-domain.com"],
    allow_credentials=True,
)

@app.get("/api/portfolio")
async def get_portfolio():
    return {
        "total_value": 45000,
        "total_pnl": 6500,
        "positions": [...]
    }
```

## Troubleshooting

### CORS Errors
**Error**: `Access to XMLHttpRequest has been blocked by CORS policy`

**Solution**: Ensure backend CORS headers include your domain:
```
Access-Control-Allow-Origin: https://your-dashboard.vercel.app
Access-Control-Allow-Credentials: true
```

### WebSocket Connection Failed
**Error**: WebSocket connection failed

**Solution**: 
- Verify WebSocket URL (use `wss://` in production)
- Check backend WebSocket handler
- Verify firewall allows WebSocket connections

### Slow API Responses
**Solution**:
- Implement pagination (limit results)
- Add caching (Redis, etc.)
- Optimize database queries
- Add response compression (gzip)

### Missing Data
**Solution**:
- Verify API endpoints match exactly
- Check response format matches TypeScript types
- Review API logs for errors
- Test endpoints with Postman/curl

## Testing

Use the mock data for development without a backend:

```typescript
import { mockPortfolio, mockTrades } from '../utils/mockData'

// Mock data is already complete for all pages
// Simply replace API calls with mock imports
```

## Performance Tips

1. **Use pagination** for large datasets
2. **Implement caching** for frequently accessed data
3. **Compress responses** with gzip
4. **Use WebSocket** for real-time updates instead of polling
5. **Add indexes** to database queries
6. **Implement lazy loading** for charts
7. **Batch updates** to reduce API calls

## Production Checklist

- [ ] API endpoints secured with HTTPS
- [ ] CORS properly configured
- [ ] Rate limiting implemented
- [ ] Authentication implemented
- [ ] Error handling on backend
- [ ] Logging and monitoring set up
- [ ] Database indexes optimized
- [ ] Response compression enabled
- [ ] WebSocket heartbeat configured
- [ ] API documentation complete
