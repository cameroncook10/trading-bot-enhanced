# TradeBot - AI Trading Dashboard

A production-ready React trading bot dashboard with real-time portfolio tracking, AI-powered trade analysis, and market signal visualization.

## Features

✨ **Real-Time Dashboard**
- Live portfolio metrics (P&L, positions, confidence scores)
- Interactive charts and data visualizations
- 7-day performance tracking

📊 **Portfolio Management**
- Detailed holdings breakdown
- Asset allocation with visual pie charts
- Risk metrics (Sharpe ratio, max drawdown, volatility)

🤖 **Bot Activity**
- Real-time trade logs with decision reasoning
- Performance trends and win rate tracking
- Model confidence analysis

📈 **Market Signals**
- Technical indicator analysis (RSI, MACD, Moving Averages)
- Sentiment analysis (social, news, technical)
- Multi-symbol signal generation

💼 **Trade History**
- Complete trade records with entry/exit reasoning
- Filterable by status (open, closed, pending)
- Sortable by date, P&L, or confidence

🎯 **Prediction Markets**
- Polymarket and Manifold Markets integration
- Real-time probability tracking
- Bot position management

📚 **Learning Hub**
- 30-day performance analysis
- Key learnings and improvement recommendations
- Strategy performance breakdown by type

⚙️ **Settings & Configuration**
- Model selection (Claude 3 Opus, GPT-4, etc.)
- Risk management parameters
- Notification preferences
- Webhook integration

## Tech Stack

- **Frontend Framework**: React 18+ with TypeScript
- **Build Tool**: Vite
- **Styling**: Tailwind CSS (dark mode)
- **Charts**: Recharts
- **HTTP Client**: Axios
- **Routing**: React Router v6

## Installation

### Prerequisites
- Node.js 18+ and npm

### Setup

1. Clone or navigate to the project directory:
```bash
cd trading-bot-ui
```

2. Install dependencies:
```bash
npm install
```

3. Create environment file:
```bash
cp .env.example .env
```

4. Update `.env` with your API endpoints:
```
VITE_API_BASE_URL=http://localhost:8000
VITE_WS_URL=ws://localhost:8000/ws
VITE_ENVIRONMENT=development
```

## Development

Start the development server:
```bash
npm run dev
```

The app will be available at `http://localhost:5173`

Type checking:
```bash
npm run type-check
```

## Build

Build for production:
```bash
npm run build
```

Preview production build:
```bash
npm run preview
```

## Project Structure

```
trading-bot-ui/
├── src/
│   ├── components/        # Reusable UI components
│   │   ├── Layout.tsx
│   │   ├── Navigation.tsx
│   │   ├── StatCard.tsx
│   │   └── PositionCard.tsx
│   ├── pages/            # Route pages
│   │   ├── Dashboard.tsx
│   │   ├── Portfolio.tsx
│   │   ├── Activity.tsx
│   │   ├── Signals.tsx
│   │   ├── History.tsx
│   │   ├── Markets.tsx
│   │   ├── Learning.tsx
│   │   └── Settings.tsx
│   ├── hooks/            # Custom React hooks
│   │   ├── useApi.ts
│   │   └── useWebSocket.ts
│   ├── types/            # TypeScript type definitions
│   │   └── index.ts
│   ├── utils/            # Utility functions
│   │   ├── formatting.ts
│   │   └── mockData.ts
│   ├── App.tsx           # Main app component
│   ├── main.tsx          # Entry point
│   └── index.css         # Global styles
├── index.html
├── package.json
├── tsconfig.json
├── vite.config.ts
├── tailwind.config.js
└── vercel.json
```

## API Integration

The dashboard expects a backend API with the following endpoints:

### Portfolio Data
- `GET /api/portfolio` - Portfolio overview and positions
- `GET /api/positions` - Detailed position list

### Trading Data
- `GET /api/trades` - Trade history
- `GET /api/trades/:id` - Trade details

### Signals
- `GET /api/signals` - Current market signals
- `GET /api/signals/:symbol` - Symbol-specific signals

### Logs
- `GET /api/logs` - Trade activity logs
- `GET /api/logs?level=WARNING` - Filtered logs

### Settings
- `GET /api/settings` - Bot settings
- `PUT /api/settings` - Update bot settings

### Real-Time Updates
- WebSocket at `/ws` for real-time trade updates, signals, and logs

## WebSocket Events

The dashboard subscribes to these WebSocket message types:

```typescript
type: 'trade' | 'signal' | 'position' | 'log' | 'metric'
```

Example payload:
```json
{
  "type": "trade",
  "data": {
    "id": "123",
    "symbol": "AAPL",
    "side": "LONG",
    "entry_price": 175.50,
    "confidence": 87
  }
}
```

## Environment Variables

Create a `.env` file with these variables:

```
VITE_API_BASE_URL=http://localhost:8000          # Backend API base URL
VITE_WS_URL=ws://localhost:8000/ws               # WebSocket URL
VITE_ENVIRONMENT=development|production|staging  # Environment
```

## Styling

### Color Scheme

- **Primary Brand**: Sky blue (`brand-*`)
- **Success**: Green (`success-*`)
- **Danger**: Red (`danger-*`)
- **Warning**: Amber (`warning-*`)
- **Dark**: Neutral grays (`dark-*`)

### Custom Components

The dashboard includes custom Tailwind components:

- `.card` - Basic card container
- `.card-hover` - Interactive card with hover effects
- `.btn` - Button base class
- `.btn-primary` - Primary CTA button
- `.btn-secondary` - Secondary button
- `.badge` - Small label badges
- `.stat-card` - Statistics card

## Performance Optimization

- Code splitting via Vite
- Lazy loading routes
- Image optimization
- CSS purging in production

## Browser Support

- Chrome/Edge (latest 2 versions)
- Firefox (latest 2 versions)
- Safari (latest 2 versions)

## Deployment

See [DEPLOYMENT.md](./DEPLOYMENT.md) for detailed deployment instructions to Vercel.

## Mock Data

The dashboard includes mock data for development:
- Sample portfolio with 3 positions
- Historical trade data
- Market signals across multiple symbols
- Activity logs with trade reasoning
- 30-day performance metrics

To use real data, replace imports in page components from `mockData` to actual API calls via the `useApi` hook.

## Contributing

Guidelines for contributing to this project:

1. Follow existing component structure
2. Use TypeScript for type safety
3. Maintain responsive design (mobile-first)
4. Test in dark mode (default theme)
5. Keep accessibility in mind

## License

MIT

## Support

For issues or questions:
1. Check existing documentation
2. Review component examples
3. Check mock data for expected formats
4. Ensure API endpoints are correctly configured

## Future Enhancements

- [ ] Dark/light mode toggle
- [ ] Advanced charting with TradingView Lightweight Charts
- [ ] Real-time notifications with toast
- [ ] Mobile app version
- [ ] Export trade reports (CSV/PDF)
- [ ] Strategy backtesting UI
- [ ] User authentication and multi-account support
