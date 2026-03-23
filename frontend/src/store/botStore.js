import { create } from 'zustand';
import { formatDistanceToNow } from 'date-fns';

export const useBotStore = create((set, get) => ({
  // Bot Status
  botStatus: 'online', // 'online', 'offline', 'paused'
  lastDecisionTime: new Date(Date.now() - 5 * 60000), // 5 mins ago
  
  // Portfolio
  portfolio: {
    totalValue: 35420,
    totalPNL: 420,
    totalPNLPercent: 1.2,
    winRate: 62,
    totalTrades: 50,
    winningTrades: 31,
    losingTrades: 19
  },

  // Risk & Mode
  riskMode: 'moderate', // 'conservative', 'moderate', 'aggressive'
  portfolioHeat: 0.35, // 0-1, where 1 is max danger
  
  // Positions
  positions: [
    {
      id: 'pos-btc-001',
      asset: 'Bitcoin',
      symbol: 'BTC',
      type: 'long',
      entryPrice: 42500,
      currentPrice: 42750,
      quantity: 0.05,
      pnl: 125,
      pnlPercent: 0.59,
      entryTime: new Date(Date.now() - 2 * 3600000),
      stopLoss: 41800,
      profitTarget: 44200,
      confidence: 87,
      reasoning: 'Technical reversal at key support. 200-day MA + sentiment positive.',
      status: 'healthy', // 'healthy', 'caution', 'danger'
      riskReward: 3.0
    },
    {
      id: 'pos-eth-001',
      asset: 'Ethereum',
      symbol: 'ETH',
      type: 'long',
      entryPrice: 2200,
      currentPrice: 2280,
      quantity: 1.5,
      pnl: 1200,
      pnlPercent: 3.64,
      entryTime: new Date(Date.now() - 1 * 86400000),
      stopLoss: 2050,
      profitTarget: 2500,
      confidence: 74,
      reasoning: 'Strong uptrend breakout. Volume confirms strength.',
      status: 'healthy',
      riskReward: 2.5
    }
  ],

  // Signals
  signals: [
    {
      id: 'sig-001',
      asset: 'Bitcoin',
      symbol: 'BTC',
      direction: 'buy',
      confidence: 87,
      reasoning: 'Price above 200-day moving average. Strong on-chain accumulation detected.',
      data: {
        rsi: 62,
        macd: 'bullish',
        sentiment: 'positive',
        technicalScore: 8.2,
        onChain: 'accumulation'
      },
      timestamp: new Date(Date.now() - 15 * 60000),
      status: 'executed', // 'pending', 'executed', 'rejected', 'expired'
      alternative: 'Could be false breakout. Watch support at $41,500.'
    },
    {
      id: 'sig-002',
      asset: 'Ethereum',
      symbol: 'ETH',
      direction: 'wait',
      confidence: 65,
      reasoning: 'Consolidating after recent gains. Waiting for RSI to normalize.',
      data: {
        rsi: 78,
        macd: 'neutral',
        sentiment: 'positive',
        technicalScore: 6.5,
        onChain: 'holding'
      },
      timestamp: new Date(Date.now() - 30 * 60000),
      status: 'pending',
      alternative: 'Breakout could happen within 4 hours.'
    },
    {
      id: 'sig-003',
      asset: 'Solana',
      symbol: 'SOL',
      direction: 'sell',
      confidence: 73,
      reasoning: 'Resistance rejection at $21. Sentiment turning negative.',
      data: {
        rsi: 72,
        macd: 'bearish',
        sentiment: 'negative',
        technicalScore: 3.2,
        onChain: 'distribution'
      },
      timestamp: new Date(Date.now() - 45 * 60000),
      status: 'pending',
      alternative: 'Could bounce off $20 if market-wide support holds.'
    }
  ],

  // Trades
  trades: [
    {
      id: 'trade-001',
      asset: 'Bitcoin',
      symbol: 'BTC',
      type: 'long',
      entryPrice: 42500,
      currentPrice: 42750,
      quantity: 0.05,
      pnl: 125,
      pnlPercent: 0.59,
      entryTime: new Date(Date.now() - 2 * 3600000),
      exitTime: null,
      reason: 'Technical analysis + sentiment positive. Risk/reward 3:1.',
      opusReasoning: 'Multiple bullish indicators aligned: RSI trending upward from oversold, MACD histogram positive, 200-day MA support held. On-chain data shows accumulation by institutions.',
      status: 'open',
      confidence: 87,
      historicalAccuracy: 81 // % of similar setups that worked
    },
    {
      id: 'trade-002',
      asset: 'Ethereum',
      symbol: 'ETH',
      type: 'long',
      entryPrice: 2200,
      currentPrice: 2280,
      quantity: 1.5,
      pnl: 1200,
      pnlPercent: 3.64,
      entryTime: new Date(Date.now() - 24 * 3600000),
      exitTime: null,
      reason: 'Breakout above key resistance with volume.',
      opusReasoning: 'Confirmed uptrend: Price above all major moving averages, volume increasing, funding rates elevated (bullish bias).',
      status: 'open',
      confidence: 74,
      historicalAccuracy: 76
    },
    {
      id: 'trade-003',
      asset: 'Bitcoin',
      symbol: 'BTC',
      type: 'short',
      entryPrice: 43000,
      currentPrice: 42750,
      quantity: 0.02,
      pnl: 50,
      pnlPercent: 0.12,
      entryTime: new Date(Date.now() - 6 * 3600000),
      exitTime: null,
      reason: 'Resistance rejection.',
      opusReasoning: 'Rejected at resistance 3 times. Divergence on hourly chart. Risk/reward ratio favorable at 1:2.5.',
      status: 'open',
      confidence: 58,
      historicalAccuracy: 64
    }
  ],

  // Activities (real-time feed)
  activities: [
    {
      id: 'act-001',
      type: 'signal',
      timestamp: new Date(Date.now() - 15 * 60000),
      asset: 'Bitcoin',
      message: 'Signal: BUY Bitcoin',
      reasoning: 'Price above 200-day moving average. Strong on-chain accumulation detected. Confidence: 87%. Position size: 2.5% of portfolio.',
      severity: 'info'
    },
    {
      id: 'act-002',
      type: 'trade',
      timestamp: new Date(Date.now() - 30 * 60000),
      asset: 'Ethereum',
      message: 'Trade Executed: Bought 1.5 ETH at $2,200',
      reasoning: 'Entry reason: Technical analysis + sentiment positive. Risk/reward 3:1.',
      severity: 'info'
    },
    {
      id: 'act-003',
      type: 'risk-alert',
      timestamp: new Date(Date.now() - 45 * 60000),
      asset: 'Portfolio',
      message: 'Risk Alert: Portfolio up 1.2% today',
      reasoning: 'Current exposure: 8 positions. Max drawdown risk: 4.3%. Status: All green.',
      severity: 'success'
    }
  ],

  // Prediction Markets
  predictionMarkets: [
    {
      id: 'market-001',
      event: 'Bitcoin above $45,000 by March 31, 2026',
      description: 'Will BTC close the month above $45K?',
      currentOdds: 0.72,
      resolveDate: new Date(Date.now() + 8 * 86400000),
      trend: 'up', // 'up', 'down', 'stable'
      botWatching: true,
      botConfidence: 78,
      botPosition: {
        side: 'yes',
        amount: 500,
        currentValue: 612
      },
      historicalOdds: [0.55, 0.60, 0.65, 0.70, 0.72]
    },
    {
      id: 'market-002',
      event: 'Fed announces rate hike in April',
      description: 'Will the Federal Reserve hike rates in their April meeting?',
      currentOdds: 0.45,
      resolveDate: new Date(Date.now() + 18 * 86400000),
      trend: 'down',
      botWatching: true,
      botConfidence: 62,
      botPosition: null,
      historicalOdds: [0.65, 0.58, 0.52, 0.48, 0.45]
    }
  ],

  // Risk Modes Config
  riskModes: {
    conservative: {
      maxPositionSize: 0.05,
      paperTrading: true,
      dailyStopLoss: -0.05,
      description: 'Safe & Steady - Perfect for learning',
      example: 'Max 5% per trade, complete paper trading, auto-stop if you lose 5% in a day'
    },
    moderate: {
      maxPositionSize: 0.10,
      paperTrading: true,
      dailyStopLoss: -0.10,
      description: 'Balanced Growth - Test your skills',
      example: 'Max 10% per trade, complete paper trading, auto-stop if you lose 10% in a day'
    },
    aggressive: {
      maxPositionSize: 0.15,
      paperTrading: true,
      dailyStopLoss: -0.15,
      description: 'Maximum Potential - For experienced traders',
      example: 'Max 15% per trade, paper trading available, auto-stop if you lose 15% in a day'
    }
  },

  // Watchers (assets bot is monitoring)
  watchers: [
    {
      asset: 'Bitcoin',
      symbol: 'BTC',
      currentPrice: 42750,
      signal: 'Building',
      nextTrigger: 'Break above $43,200 or close below $41,500',
      confidence: 75,
      rsiBands: { overbought: 70, oversold: 30, current: 62 }
    },
    {
      asset: 'Ethereum',
      symbol: 'ETH',
      currentPrice: 2280,
      signal: 'Consolidating',
      nextTrigger: 'RSI needs to drop below 70, then setup new breakout',
      confidence: 65,
      rsiBands: { overbought: 70, oversold: 30, current: 78 }
    },
    {
      asset: 'Solana',
      symbol: 'SOL',
      currentPrice: 20.50,
      signal: 'Waiting',
      nextTrigger: 'Hold above $19.50 for upside, break below triggers sell',
      confidence: 58,
      rsiBands: { overbought: 70, oversold: 30, current: 72 }
    }
  ],

  // Methods
  initializeBot: () => {
    // Connect to WebSocket, start listening for real-time updates
    try {
      set({ botStatus: 'online', lastDecisionTime: new Date() });
    } catch (error) {
      console.error('Error initializing bot:', error);
      set({ botStatus: 'offline' });
    }
  },

  pauseBot: () => {
    try {
      set({ botStatus: 'paused' });
      get().addActivity({
        id: `pause-${Date.now()}`,
        type: 'pause',
        timestamp: new Date(),
        message: 'Bot paused by user',
        severity: 'warning'
      });
    } catch (error) {
      console.error('Error pausing bot:', error);
    }
  },

  resumeBot: () => {
    try {
      set({ botStatus: 'online', lastDecisionTime: new Date() });
      get().addActivity({
        id: `resume-${Date.now()}`,
        type: 'resume',
        timestamp: new Date(),
        message: 'Bot resumed by user',
        severity: 'info'
      });
    } catch (error) {
      console.error('Error resuming bot:', error);
    }
  },

  setRiskMode: (mode) => {
    const validModes = ['conservative', 'moderate', 'aggressive'];
    try {
      if (!validModes.includes(mode)) {
        console.warn(`Invalid risk mode: ${mode}. Using moderate.`);
        mode = 'moderate';
      }
      set({ riskMode: mode });
      get().addActivity({
        id: `risk-${Date.now()}`,
        type: 'setting',
        timestamp: new Date(),
        message: `Risk mode changed to ${mode}`,
        severity: 'info'
      });
    } catch (error) {
      console.error('Error setting risk mode:', error);
    }
  },

  addActivity: (activity) => {
    try {
      if (!activity || !activity.id) {
        console.warn('Invalid activity data, skipping');
        return;
      }
      set((state) => ({
        activities: [activity, ...state.activities.slice(0, 99)]
      }));
    } catch (error) {
      console.error('Error adding activity:', error);
    }
  },

  updatePortfolioMetrics: (metrics) => {
    try {
      if (!metrics || typeof metrics !== 'object') {
        console.warn('Invalid metrics data');
        return;
      }
      set((state) => ({
        portfolio: { ...state.portfolio, ...metrics }
      }));
    } catch (error) {
      console.error('Error updating portfolio metrics:', error);
    }
  },

  updatePosition: (positionId, updates) => {
    try {
      if (!positionId || !updates) {
        console.warn('Invalid position update data');
        return;
      }
      set((state) => ({
        positions: state.positions.map((pos) =>
          pos.id === positionId ? { ...pos, ...updates } : pos
        )
      }));
    } catch (error) {
      console.error('Error updating position:', error);
    }
  },

  closeTrade: (tradeId) => {
    try {
      if (!tradeId) {
        console.warn('Invalid trade id');
        return;
      }
      set((state) => ({
        trades: state.trades.map((trade) =>
          trade.id === tradeId ? { ...trade, status: 'closed', exitTime: new Date() } : trade
        )
      }));
      get().addActivity({
        id: `close-${Date.now()}`,
        type: 'trade',
        timestamp: new Date(),
        message: `Trade ${tradeId} closed`,
        severity: 'info'
      });
    } catch (error) {
      console.error('Error closing trade:', error);
    }
  },

  executeTradeOverride: (tradeId, approved) => {
    try {
      if (!tradeId) {
        console.warn('Invalid trade id for override');
        return;
      }
      if (approved) {
        get().addActivity({
          id: `override-${Date.now()}`,
          type: 'override',
          timestamp: new Date(),
          message: `Trade ${tradeId} overridden by user`,
          severity: 'warning'
        });
      }
    } catch (error) {
      console.error('Error executing trade override:', error);
    }
  }
}));
