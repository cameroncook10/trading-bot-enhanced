# Trading Bot Dashboard - File Structure

Complete overview of all project files and their purposes.

## Project Root

```
trading-bot-ui/
├── src/                      # Source code
├── dist/                      # Production build (generated)
├── node_modules/              # Dependencies (generated)
├── public/                     # Static assets
│
├── index.html                 # HTML entry point
├── package.json              # Dependencies & scripts
├── package-lock.json         # Dependency lock file
│
├── tsconfig.json             # TypeScript configuration
├── tsconfig.node.json        # TypeScript for Vite config
├── vite.config.ts            # Vite build configuration
├── tailwind.config.js        # Tailwind CSS configuration
├── postcss.config.js         # PostCSS configuration
│
├── vercel.json               # Vercel deployment config
├── .env.example              # Environment variables template
├── .gitignore                # Git ignore rules
│
├── README.md                 # Main documentation
├── QUICKSTART.md            # Quick start guide
├── DEPLOYMENT.md            # Vercel deployment guide
├── API_INTEGRATION.md       # Backend API integration
└── PROJECT_SUMMARY.md       # Project completion summary
```

## Source Code Structure

### /src - Main Application

```
src/
├── App.tsx                   # Router setup, main app component
├── main.tsx                  # React DOM entry point
├── index.css                 # Global Tailwind styles
├── vite-env.d.ts            # Vite environment type definitions
│
├── components/              # Reusable UI components
│   ├── Layout.tsx           # Main layout wrapper
│   ├── Navigation.tsx       # Sidebar navigation
│   ├── StatCard.tsx         # Statistics card component
│   └── PositionCard.tsx     # Position display card
│
├── pages/                   # Route pages (8 pages)
│   ├── Dashboard.tsx        # Home page - overview
│   ├── Portfolio.tsx        # Portfolio breakdown
│   ├── Activity.tsx         # Bot activity logs
│   ├── Signals.tsx          # Market signals
│   ├── History.tsx          # Trade history
│   ├── Markets.tsx          # Prediction markets
│   ├── Learning.tsx         # Performance learning
│   └── Settings.tsx         # Bot configuration
│
├── hooks/                   # Custom React hooks
│   ├── useApi.ts            # API data fetching
│   └── useWebSocket.ts      # WebSocket real-time updates
│
├── types/                   # TypeScript type definitions
│   └── index.ts             # All type interfaces
│
└── utils/                   # Utility functions
    ├── formatting.ts        # Format currency, dates, etc.
    └── mockData.ts          # Mock data for development
```

## Page Components Details

### Dashboard.tsx
- **Route**: `/`
- **Purpose**: Main overview page
- **Sections**:
  - Key metrics (4 stat cards)
  - 7-day performance chart
  - Asset allocation pie chart
  - Trade statistics
  - Recent activity log
  - Open positions grid

### Portfolio.tsx
- **Route**: `/portfolio`
- **Purpose**: Detailed portfolio analysis
- **Sections**:
  - Portfolio summary stats
  - Asset allocation pie chart
  - Holdings by value bar chart
  - Detailed holdings table
  - Risk metrics
  - Concentration & beta analysis

### Activity.tsx
- **Route**: `/activity`
- **Purpose**: Bot activity monitoring
- **Sections**:
  - 14-day activity trend chart
  - Activity statistics
  - Live activity log feed
  - Last trade analysis
  - Model performance metrics

### Signals.tsx
- **Route**: `/signals`
- **Purpose**: Market signal analysis
- **Sections**:
  - Signal summary stats
  - Market signals with strength
  - Technical indicators
  - Sentiment analysis
  - Market overview

### History.tsx
- **Route**: `/history`
- **Purpose**: Complete trade record
- **Sections**:
  - Trade statistics
  - Filter & sort controls
  - Trades data table
  - Trade details cards

### Markets.tsx
- **Route**: `/markets`
- **Purpose**: Prediction market integration
- **Sections**:
  - Platform status (Polymarket, Manifold)
  - Top markets by volume
  - Market statistics
  - Bot positions table
  - Market insights

### Learning.tsx
- **Route**: `/learning`
- **Purpose**: Performance review
- **Sections**:
  - Performance metrics
  - 30-day performance chart
  - Key learnings cards
  - Performance by trade type
  - Improvement areas
  - Strategy analysis
  - AI recommendations

### Settings.tsx
- **Route**: `/settings`
- **Purpose**: Bot configuration
- **Sections**:
  - Model selection
  - Risk management parameters
  - Notification preferences
  - Webhooks configuration
  - Advanced settings
  - System status

## Component Architecture

### Layout.tsx
Wraps all pages with:
- Top header bar with status
- Left sidebar navigation
- Main content area
- Mobile responsive menu
- Live status indicator

### Navigation.tsx
- Desktop sidebar (always visible)
- Mobile menu (toggle)
- 8 navigation items
- Active page highlight
- Status footer

### StatCard.tsx
Displays:
- Label
- Value
- Change percentage with arrow
- Optional icon
- Positive/negative color coding

### PositionCard.tsx
Shows:
- Symbol and side (LONG/SHORT)
- Entry and current price
- P&L with percentage
- Confidence score

## Hook Details

### useApi.ts
- Auto-fetches from API endpoint
- Auto-refreshes every 5 seconds
- Handles loading, error states
- Provides helper functions:
  - fetchData()
  - postData()
  - putData()

### useWebSocket.ts
- Manages WebSocket connection
- Auto-reconnects on disconnect
- Handles message parsing
- Provides:
  - isConnected status
  - lastMessage received
  - send() function

## Utility Functions

### formatting.ts
- formatCurrency() - USD formatting
- formatPercent() - Percentage display
- formatPrice() - Price decimals
- formatLargeNumber() - K/M notation
- getChangeColor() - Color by value
- getBadgeColor() - Badge styling
- getConfidenceColor() - Confidence display
- formatTime() - Date/time formatting
- formatTimeAgo() - Relative time

### mockData.ts
Complete mock datasets:
- mockPositions - 3 sample positions
- mockPortfolio - Portfolio overview
- mockTrades - Trade history
- mockSignals - Market signals
- mockTradeLogs - Activity logs
- mockPerformanceMetrics - 30 days data
- mockBotSettings - Configuration
- mockLearnings - Lessons learned

## Type Definitions (types/index.ts)

```typescript
- Trade
- Position
- Portfolio
- AllocationItem
- Signal
- TradeLog
- BotSettings
- PerformanceMetric
- WebSocketMessage
```

## Configuration Files

### tsconfig.json
- Target: ES2020
- Strict mode enabled
- React JSX support
- Module resolution: bundler

### vite.config.ts
- Plugin: React
- Server port: 5173
- Build optimizations
- Recharts code splitting

### tailwind.config.js
- Dark mode enabled
- Custom colors (brand, success, danger)
- Custom components (.card, .btn, .badge)
- Custom animations
- Extended theme

### postcss.config.js
- Tailwind CSS processor
- Autoprefixer

### vercel.json
- Build command: `npm run build`
- Dev command: `npm run dev`
- Framework: Vite
- Environment variable prefix: VITE_

## Build Output

After `npm run build`:

```
dist/
├── index.html                    # 750 bytes
├── assets/
│   ├── index-*.css              # 22.75 KB (gzipped 4.37 KB)
│   ├── index-*.js               # 98.97 KB (gzipped 21.55 KB)
│   └── recharts-*.js            # 553.04 KB (gzipped 155.87 KB)
```

**Total**: ~672 KB uncompressed, ~180 KB gzipped app code

## Environment Variables

### .env
```
VITE_API_BASE_URL=http://localhost:8000
VITE_WS_URL=ws://localhost:8000/ws
VITE_ENVIRONMENT=development
```

### Production
```
VITE_API_BASE_URL=https://api.yourcompany.com
VITE_WS_URL=wss://api.yourcompany.com/ws
VITE_ENVIRONMENT=production
```

## Dependencies

### Production
- react@18.2.0
- react-dom@18.2.0
- react-router-dom@6.20.0
- recharts@2.10.3
- axios@1.6.2
- date-fns@2.30.0

### Development
- typescript@5.2.2
- vite@5.0.8
- tailwindcss@3.3.6
- @vitejs/plugin-react@4.2.1

## Code Organization Principles

1. **Components** - Reusable UI parts
2. **Pages** - Full-page route components
3. **Hooks** - Custom React logic
4. **Utils** - Helper functions
5. **Types** - TypeScript definitions
6. **Assets** - Styling and static files

## File Naming Conventions

- Components: PascalCase (Layout.tsx)
- Hooks: useXxx (useApi.ts)
- Utils: camelCase (formatting.ts)
- Types: Export from index.ts
- CSS: Global (index.css)

## Key Statistics

- **Lines of Code**: ~2,500 (components + pages)
- **TypeScript Coverage**: 100%
- **Pages**: 8 fully-featured
- **Components**: 4 reusable
- **Hooks**: 2 custom
- **Build Size**: 98 KB JS (gzipped 21 KB)
- **Load Time**: < 3 seconds on 4G

---

This structure provides clean separation of concerns, easy navigation, and scalable organization.
