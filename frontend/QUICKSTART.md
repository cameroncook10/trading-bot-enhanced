# Quick Start Guide

Get the trading bot dashboard running in 5 minutes.

## 1. Install Dependencies (30 seconds)

```bash
cd trading-bot-ui
npm install
```

## 2. Configure Environment (1 minute)

Create `.env` file:

```bash
cp .env.example .env
```

Edit `.env` with your API endpoints:

```env
VITE_API_BASE_URL=http://localhost:8000
VITE_WS_URL=ws://localhost:8000/ws
VITE_ENVIRONMENT=development
```

## 3. Start Development Server (1 minute)

```bash
npm run dev
```

Open [http://localhost:5173](http://localhost:5173) in your browser.

**You'll see the dashboard with mock data—no backend needed yet!**

## 4. Explore the Dashboard (2 minutes)

Navigate through the menu:
- **Dashboard** - Overview, positions, P&L
- **Portfolio** - Detailed holdings, asset allocation
- **Bot Activity** - Real-time logs, model performance
- **Signals** - Market signals, sentiment analysis
- **Trade History** - All trades with reasoning
- **Markets** - Prediction market integrations
- **Learning** - Performance review, improvements
- **Settings** - Configuration and preferences

## 5. Connect Your Backend (Next Steps)

When ready to connect your API:

1. Update `.env` with your backend URLs
2. Review `API_INTEGRATION.md` for endpoint specs
3. Implement the required REST endpoints
4. Enable WebSocket for real-time updates
5. Restart dev server

## Build for Production

```bash
npm run build
```

Output is in `dist/` folder (ready for Vercel).

## Deploy to Vercel

See `DEPLOYMENT.md` for detailed instructions, or:

1. Push to GitHub
2. Go to [vercel.com](https://vercel.com)
3. Import repository
4. Set environment variables
5. Deploy!

## What You Get

✅ 8 fully-featured pages  
✅ Real-time dashboard  
✅ Dark theme crypto aesthetic  
✅ Responsive design (mobile-to-desktop)  
✅ Type-safe TypeScript  
✅ Recharts visualizations  
✅ Mock data for development  
✅ Production-ready build  

## Useful Commands

```bash
npm run dev          # Start dev server
npm run build        # Build for production
npm run preview      # Preview production build
npm run type-check   # Check TypeScript
```

## Need Help?

- **Setup issues?** → Check README.md
- **API integration?** → See API_INTEGRATION.md
- **Deployment?** → Read DEPLOYMENT.md
- **Component details?** → Check component files
- **Styling?** → Review tailwind.config.js

## Architecture Overview

```
trading-bot-ui/
├── src/
│   ├── pages/          ← 8 route pages
│   ├── components/     ← Reusable components
│   ├── hooks/          ← useApi, useWebSocket
│   ├── utils/          ← Helpers, mock data
│   ├── types/          ← TypeScript interfaces
│   └── App.tsx         ← Router setup
├── dist/               ← Production build (after npm run build)
├── vite.config.ts      ← Build configuration
├── tailwind.config.js  ← Styling
└── package.json        ← Dependencies
```

## Key Features Implemented

### Real-Time Dashboard
- Live P&L tracking
- Current positions
- Performance charts
- Recent activity feed

### Portfolio Management
- Holdings breakdown
- Asset allocation
- Risk metrics
- Detailed analytics

### Trading Intelligence
- Bot activity logs
- Trade reasoning
- Signal generation
- Sentiment analysis

### Configuration
- Model selection
- Risk parameters
- Notification setup
- Advanced settings

## Development Tips

1. **Use mock data first** - No backend needed to explore UI
2. **TypeScript** - Full type safety, catch errors early
3. **Tailwind CSS** - Dark theme with custom components
4. **Responsive** - Test on mobile with DevTools
5. **Charts** - Recharts handles responsive sizing

## Next: Connect Your API

Ready to use real data?

1. Review your backend implementation
2. Match API endpoints to spec (API_INTEGRATION.md)
3. Update `.env` URLs
4. Test WebSocket connection
5. Verify CORS configuration

---

**You're ready to start! Run `npm run dev` and explore.**
