# 🏗️ Trading Agent - Architecture & Technical Documentation

Complete technical reference for the Trading Agent platform.

## 📐 System Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                    Trading Agent Platform                     │
├─────────────────────────────────────────────────────────────┤
│                                                               │
│  ┌──────────────────┐              ┌──────────────────┐     │
│  │   React Frontend │              │  Express Backend │     │
│  │   (Port 3000)    │◄────────────►│  (Port 5000)     │     │
│  │                  │   REST/WS    │                  │     │
│  └──────────────────┘              └──────────────────┘     │
│         │                                    │                │
│         │                                    │                │
│    ┌────▼─────┐                      ┌──────▼──────┐         │
│    │  Zustand │                      │   WebSocket │         │
│    │   Store  │                      │   Server    │         │
│    └──────────┘                      └─────────────┘         │
│                                              │                │
│                                       ┌──────▼───────┐        │
│                                       │  Third-party │        │
│                                       │    APIs      │        │
│                                       │              │        │
│                                       │ • Opus       │        │
│                                       │ • Polymarket │        │
│                                       │ • Exchanges  │        │
│                                       └──────────────┘        │
│                                                               │
└─────────────────────────────────────────────────────────────┘
```

## 🎯 Component Hierarchy

### Frontend Structure
```
App
├── Navbar
│   ├── Logo
│   ├── Notifications
│   └── User Menu
├── Sidebar
│   └── Navigation Items
└── Main Content
    ├── Dashboard (/)
    │   ├── BotStatus
    │   ├── PortfolioOverview
    │   ├── TodayActivity
    │   ├── UpcomingEvents
    │   ├── LastTrades
    │   └── ActivityFeed
    ├── BotActivity (/bot-activity)
    │   ├── Watchers
    │   ├── Signals
    │   └── Trades
    ├── PredictionMarkets (/prediction-markets)
    │   └── MarketCards
    ├── Portfolio (/portfolio)
    │   ├── PieChart
    │   ├── PositionsTable
    │   └── RiskHeatmap
    ├── Signals (/signals)
    │   └── SignalCards
    ├── TradeHistory (/trade-history)
    │   └── TradeCards
    ├── Settings (/settings)
    │   ├── RiskModes
    │   ├── BotControls
    │   └── Notifications
    └── LearningHub (/learning)
        └── LearningCards
```

## 🗄️ Data Structure

### Bot Store (Zustand)
```javascript
{
  // Bot Status
  botStatus: 'online' | 'offline' | 'paused'
  lastDecisionTime: Date
  
  // Portfolio
  portfolio: {
    totalValue: number
    totalPNL: number
    totalPNLPercent: number
    winRate: number
    totalTrades: number
    winningTrades: number
    losingTrades: number
  }
  
  // Configuration
  riskMode: 'conservative' | 'moderate' | 'aggressive'
  portfolioHeat: number (0-1)
  
  // Positions
  positions: Array<{
    id: string
    asset: string
    symbol: string
    type: 'long' | 'short'
    entryPrice: number
    currentPrice: number
    quantity: number
    pnl: number
    pnlPercent: number
    entryTime: Date
    stopLoss: number
    profitTarget: number
    confidence: number
    reasoning: string
    status: 'healthy' | 'caution' | 'danger'
    riskReward: number
  }>
  
  // Signals
  signals: Array<{
    id: string
    asset: string
    symbol: string
    direction: 'buy' | 'sell' | 'wait'
    confidence: number (0-100)
    reasoning: string
    data: {
      rsi: number
      macd: string
      sentiment: string
      technicalScore: number
      onChain: string
    }
    timestamp: Date
    status: 'pending' | 'executed' | 'rejected' | 'expired'
    alternative: string
  }>
  
  // Trades
  trades: Array<{
    id: string
    asset: string
    symbol: string
    type: 'long' | 'short'
    entryPrice: number
    currentPrice: number
    quantity: number
    pnl: number
    pnlPercent: number
    entryTime: Date
    exitTime: Date | null
    reason: string
    opusReasoning: string
    status: 'open' | 'closed'
    confidence: number
    historicalAccuracy: number
  }>
  
  // Activities
  activities: Array<{
    id: string
    type: 'signal' | 'trade' | 'risk-alert' | 'override'
    timestamp: Date
    asset: string
    message: string
    reasoning: string
    severity: 'info' | 'success' | 'warning' | 'error'
  }>
  
  // Prediction Markets
  predictionMarkets: Array<{
    id: string
    event: string
    description: string
    currentOdds: number (0-1)
    resolveDate: Date
    trend: 'up' | 'down' | 'stable'
    botWatching: boolean
    botConfidence: number
    botPosition: { side: string, amount: number, currentValue: number } | null
    historicalOdds: number[]
  }>
  
  // Watchers
  watchers: Array<{
    asset: string
    symbol: string
    currentPrice: number
    signal: string
    nextTrigger: string
    confidence: number
    rsiBands: { overbought: number, oversold: number, current: number }
  }>
}
```

## 🔄 Data Flow

### Trade Execution Flow
```
User clicks "Execute Trade"
        ↓
TradeCard component emits event
        ↓
WebSocket sends to backend
        ↓
Backend validates trade
        ↓
Backend calls exchange API
        ↓
Trade executed or rejected
        ↓
WebSocket sends confirmation
        ↓
Frontend updates UI + store
        ↓
Activity logged to feed
        ↓
User sees real-time update
```

### Signal Generation Flow
```
Bot analyzes market data
        ↓
Claude Opus generates signal
        ↓
Signal stored in botStore
        ↓
Frontend shows in Signals page
        ↓
User can execute or skip
        ↓
Decision logged to activities
        ↓
Trade executed (if approved)
```

### Real-Time Update Flow
```
Backend detects market change
        ↓
WebSocket emits to connected clients
        ↓
Frontend receives event
        ↓
Updates Zustand store
        ↓
React re-renders affected components
        ↓
User sees instant update
```

## 💾 State Management (Zustand)

### Store Pattern
```javascript
import { create } from 'zustand';

export const useBotStore = create((set, get) => ({
  // State
  botStatus: 'online',
  
  // Methods
  pauseBot: () => set({ botStatus: 'paused' }),
  resumeBot: () => set({ botStatus: 'online' }),
  
  // Derived data
  getWinRate: () => {
    const state = get();
    return (state.portfolio.winningTrades / state.portfolio.totalTrades) * 100;
  }
}));
```

### Using in Components
```javascript
function Component() {
  const { botStatus, pauseBot, portfolio } = useBotStore();
  
  return (
    <button onClick={pauseBot}>
      Status: {botStatus}
      P&L: {portfolio.totalPNL}
    </button>
  );
}
```

## 🌐 API Endpoints

### Health Check
```
GET /api/health
Response: { status: 'ok', message: 'Trading Agent Backend Running' }
```

### Bot Status
```
GET /api/bot/status
Response: {
  status: 'online',
  lastDecision: Date,
  portfolio: { ... }
}
```

### Trades
```
GET /api/trades
Response: { trades: [...] }

POST /api/trades/execute
Body: { tradeId, asset, quantity, ... }
Response: { success, trade, message }

POST /api/trades/override
Body: { tradeId, action: 'approve' | 'reject' }
Response: { success, tradeId, action }
```

### Signals
```
GET /api/signals
Response: { signals: [...] }

GET /api/signals/:id
Response: { signal: {...} }

POST /api/signals/execute
Body: { signalId }
Response: { success, trade }
```

### Portfolio
```
GET /api/portfolio
Response: {
  totalValue: number,
  positions: [...],
  performance: { ... }
}
```

### Prediction Markets
```
GET /api/markets
Response: { markets: [...] }

GET /api/markets/:id
Response: { market: {...} }

POST /api/markets/:id/position
Body: { side: 'yes' | 'no', amount: number }
Response: { success, position }
```

## 🔌 WebSocket Events

### Server → Client
```javascript
// Bot status update
socket.emit('bot-status', {
  status: 'online',
  lastDecision: Date
});

// Portfolio update
socket.emit('portfolio-update', {
  totalValue: number,
  totalPNL: number
});

// New activity
socket.emit('activity-update', {
  id: string,
  type: string,
  message: string,
  timestamp: Date
});

// Trade executed
socket.emit('trade-executed', {
  tradeId: string,
  asset: string,
  status: 'success' | 'error'
});

// Signal generated
socket.emit('signal-generated', {
  signalId: string,
  asset: string,
  direction: string,
  confidence: number
});
```

### Client → Server
```javascript
// Execute trade
socket.emit('execute-trade', {
  signalId: string,
  asset: string,
  quantity: number
});

// Override trade
socket.emit('override-trade', {
  tradeId: string,
  action: 'approve' | 'reject'
});

// Change settings
socket.emit('settings-changed', {
  riskMode: string,
  maxPositionSize: number
});

// Pause bot
socket.emit('bot-control', {
  action: 'pause' | 'resume'
});
```

## 🎨 CSS Architecture

### Color Scheme
```css
:root {
  /* Primary Colors */
  --primary: #3b82f6;           /* Blue */
  --primary-dark: #1e40af;      /* Dark Blue */
  
  /* Status Colors */
  --success: #10b981;           /* Green */
  --warning: #f59e0b;           /* Orange */
  --danger: #ef4444;            /* Red */
  --info: #06b6d4;              /* Cyan */
  
  /* Dark Theme */
  --bg-primary: #0f172a;        /* Darkest */
  --bg-secondary: #1e293b;      /* Dark */
  --bg-tertiary: #334155;       /* Medium */
  --text-primary: #f1f5f9;      /* Light */
  --text-secondary: #cbd5e1;    /* Gray */
  --border: #475569;            /* Border */
  
  /* Shadows */
  --shadow-sm: 0 1px 2px rgba(0, 0, 0, 0.5);
  --shadow-md: 0 4px 6px rgba(0, 0, 0, 0.5);
  --shadow-lg: 0 10px 15px rgba(0, 0, 0, 0.5);
}
```

### Component Spacing
```css
/* Padding */
--spacing-xs: 4px;
--spacing-sm: 8px;
--spacing-md: 12px;
--spacing-lg: 16px;
--spacing-xl: 24px;
--spacing-2xl: 32px;

/* Border Radius */
--radius-sm: 4px;
--radius-md: 6px;
--radius-lg: 8px;
--radius-xl: 12px;
```

## 📦 Dependencies

### Frontend
```json
{
  "react": "^18.2.0",
  "react-dom": "^18.2.0",
  "react-router-dom": "^6.11.2",
  "zustand": "^4.3.8",
  "axios": "^1.4.0",
  "socket.io-client": "^4.6.1",
  "date-fns": "^2.30.0",
  "recharts": "^2.7.2",
  "lucide-react": "^0.263.1"
}
```

### Backend
```json
{
  "express": "^4.18.2",
  "dotenv": "^16.0.3",
  "cors": "^2.8.5",
  "axios": "^1.4.0",
  "socket.io": "^4.6.1",
  "date-fns": "^2.30.0",
  "uuid": "^9.0.0"
}
```

## 🔐 Security Implementation

### API Security
```javascript
// CORS configuration
app.use(cors({
  origin: process.env.CLIENT_URL,
  credentials: true
}));

// Rate limiting (to be implemented)
const rateLimit = require('express-rate-limit');
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,  // 15 minutes
  max: 100                    // limit each IP to 100 requests per windowMs
});
app.use('/api/', limiter);

// Request validation (to be implemented)
const { body, validationResult } = require('express-validator');

// Sanitization (to be implemented)
app.use(express.json({ limit: '10mb' }));
```

### Frontend Security
```javascript
// Prevent XSS
// - React escapes all content by default
// - Use dangerouslySetInnerHTML carefully

// Prevent CSRF
// - Use same-origin policy
// - Implement CSRF tokens for state-changing operations

// Secure local storage
// - Don't store sensitive data
// - Clear on logout
```

## ⚡ Performance Optimization

### Frontend Optimization
- Code splitting with React.lazy()
- Memoization with React.memo()
- useCallback for function stability
- Virtual scrolling for long lists

### Backend Optimization
- Database indexing
- Caching with Redis
- Compression middleware
- Connection pooling

## 🧪 Testing Strategy

### Unit Tests
- Store methods (Zustand)
- Utility functions
- Component logic

### Integration Tests
- API endpoints
- WebSocket events
- State management

### E2E Tests
- User flows
- Multi-page navigation
- Real-time updates

## 📈 Scalability

### Current Capacity
- ~100 concurrent users
- ~1000 trades/day
- Real-time updates to all users

### Future Scaling
- Implement message queuing (Redis, RabbitMQ)
- Database sharding
- Microservices architecture
- Load balancing
- CDN for static assets

## 🔄 Deployment Pipeline

```
Development
    ↓
Code committed to main branch
    ↓
GitHub Actions/CI tests code
    ↓
Tests pass
    ↓
Automated deployment to staging
    ↓
Manual testing on staging
    ↓
Approved for production
    ↓
Deployed to production
    ↓
Monitoring and alerting activated
```

## 📊 Monitoring & Logging

### Server Logs
```javascript
// Log levels
debug   // Detailed diagnostic info
info    // General information
warn    // Warning messages
error   // Error messages
fatal   // Critical errors
```

### Metrics to Track
- API response times
- Error rates
- User active sessions
- Trade execution times
- Database query times
- Memory usage
- CPU usage

## 🎓 Development Workflow

1. **Feature branch** from main
2. **Code changes** with tests
3. **Pull request** for review
4. **Code review** by team
5. **Merge to main** after approval
6. **Automated tests** run
7. **Deploy to staging**
8. **Manual testing**
9. **Deploy to production**

---

This architecture is designed to be:
- **Scalable**: Easy to add new features
- **Maintainable**: Clear code organization
- **Performant**: Optimized for speed
- **Secure**: Follows best practices
- **Testable**: Easy to write tests

For questions, refer to the README.md or code comments.
