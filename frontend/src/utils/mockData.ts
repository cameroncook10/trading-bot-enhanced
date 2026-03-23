import { Trade, Position, Portfolio, Signal, TradeLog, PerformanceMetric, BotSettings } from '../types'

export const mockPositions: Position[] = [
  {
    id: '1',
    symbol: 'AAPL',
    quantity: 50,
    entry_price: 150.25,
    current_price: 175.80,
    value: 8790,
    unrealized_pnl: 1277.5,
    unrealized_pnl_percent: 17.04,
    confidence_score: 87,
    side: 'LONG',
  },
  {
    id: '2',
    symbol: 'NVDA',
    quantity: 25,
    entry_price: 320.50,
    current_price: 385.20,
    value: 9630,
    unrealized_pnl: 1617.5,
    unrealized_pnl_percent: 20.09,
    confidence_score: 92,
    side: 'LONG',
  },
  {
    id: '3',
    symbol: 'QQQ',
    quantity: 15,
    entry_price: 285.00,
    current_price: 312.45,
    value: 4686.75,
    unrealized_pnl: 411.75,
    unrealized_pnl_percent: 9.61,
    confidence_score: 71,
    side: 'LONG',
  },
]

export const mockPortfolio: Portfolio = {
  total_value: 45000,
  total_invested: 38500,
  total_pnl: 6500,
  total_pnl_percent: 16.88,
  cash_available: 5000,
  positions: mockPositions,
  allocation: [
    { symbol: 'AAPL', value: 8790, percent: 19.5, type: 'stock' },
    { symbol: 'NVDA', value: 9630, percent: 21.4, type: 'stock' },
    { symbol: 'QQQ', value: 4686.75, percent: 10.4, type: 'stock' },
    { symbol: 'CASH', value: 5000, percent: 11.1, type: 'stock' },
  ],
}

export const mockTrades: Trade[] = [
  {
    id: '1',
    symbol: 'AAPL',
    entry_price: 150.25,
    current_price: 175.80,
    quantity: 50,
    side: 'LONG',
    status: 'OPEN',
    confidence: 87,
    entry_time: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
    reasoning: 'Golden cross detected on daily chart with strong volume confirmation. RSI oversold recovery signal.',
    tags: ['technical', 'momentum'],
  },
  {
    id: '2',
    symbol: 'TSLA',
    entry_price: 245.50,
    current_price: 238.20,
    quantity: 30,
    side: 'LONG',
    status: 'OPEN',
    confidence: 64,
    entry_time: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
    reasoning: 'Earnings upcoming, market sentiment positive. Support level holding strong.',
    tags: ['news', 'sentiment'],
  },
  {
    id: '3',
    symbol: 'SPY',
    entry_price: 450.00,
    current_price: 0,
    quantity: 40,
    side: 'SHORT',
    status: 'CLOSED',
    confidence: 75,
    entry_time: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(),
    exit_time: new Date(Date.now() - 20 * 24 * 60 * 60 * 1000).toISOString(),
    pnl: 800,
    pnl_percent: 3.56,
    reasoning: 'Resistance level confirmed, bearish divergence on 4H chart.',
    tags: ['technical', 'reversal'],
  },
]

export const mockSignals: Signal[] = [
  {
    id: '1',
    type: 'BUY',
    symbol: 'BTC',
    strength: 'STRONG',
    indicators: [
      { name: 'RSI', value: '32', signal: 'bullish' },
      { name: 'MACD', value: 'Positive', signal: 'bullish' },
      { name: 'Moving Avg', value: 'Above 50MA', signal: 'bullish' },
    ],
    sentiment: { social: 68, news: 72, technical: 85 },
    generated_at: new Date().toISOString(),
    confidence: 88,
  },
  {
    id: '2',
    type: 'HOLD',
    symbol: 'ETH',
    strength: 'MODERATE',
    indicators: [
      { name: 'RSI', value: '55', signal: 'neutral' },
      { name: 'MACD', value: 'Neutral', signal: 'neutral' },
      { name: 'Bollinger', value: 'Mid-band', signal: 'neutral' },
    ],
    sentiment: { social: 45, news: 52, technical: 48 },
    generated_at: new Date().toISOString(),
    confidence: 62,
  },
  {
    id: '3',
    type: 'SELL',
    symbol: 'DOGE',
    strength: 'WEAK',
    indicators: [
      { name: 'RSI', value: '68', signal: 'bearish' },
      { name: 'MACD', value: 'Divergence', signal: 'bearish' },
      { name: 'Volume', value: 'Declining', signal: 'bearish' },
    ],
    sentiment: { social: -42, news: -35, technical: -58 },
    generated_at: new Date().toISOString(),
    confidence: 71,
  },
]

export const mockTradeLogs: TradeLog[] = [
  {
    id: '1',
    timestamp: new Date(Date.now() - 5 * 60 * 1000).toISOString(),
    action: 'BUY SIGNAL',
    details: 'BTC/USD strong buy signal generated',
    level: 'INFO',
    reasoning: 'RSI oversold + golden cross confirmation',
  },
  {
    id: '2',
    timestamp: new Date(Date.now() - 15 * 60 * 1000).toISOString(),
    action: 'TRADE EXECUTED',
    details: 'Executed long on AAPL at $175.50',
    level: 'SUCCESS',
    reasoning: 'Confidence score 87%, within risk parameters',
  },
  {
    id: '3',
    timestamp: new Date(Date.now() - 45 * 60 * 1000).toISOString(),
    action: 'POSITION CLOSED',
    details: 'Closed short position on SPY, +3.56% gain',
    level: 'SUCCESS',
    reasoning: 'Take profit at resistance level',
  },
  {
    id: '4',
    timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
    action: 'RISK CHECK',
    details: 'Daily loss limit approaching 60% utilization',
    level: 'WARNING',
    reasoning: 'Current loss: $240 of $400 daily limit',
  },
]

export const mockPerformanceMetrics: PerformanceMetric[] = Array.from({ length: 30 }, (_, i) => ({
  date: new Date(Date.now() - (29 - i) * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
  total_pnl: Math.floor(Math.random() * 800 - 200),
  win_rate: 55 + Math.random() * 30,
  trades_executed: Math.floor(Math.random() * 8) + 2,
  avg_confidence: 70 + Math.random() * 20,
}))

export const mockBotSettings: BotSettings = {
  model: 'claude-3-opus',
  max_position_size: 50000,
  max_daily_loss: 500,
  min_confidence_threshold: 65,
  risk_per_trade: 2,
  trailing_stop_percent: 5,
  notifications_enabled: true,
  email_notifications: true,
  push_notifications: true,
  webhook_url: 'https://example.com/webhook',
}

export const mockLearnings = [
  {
    id: '1',
    date: '2024-03-20',
    lesson: 'Earnings volatility is unpredictable - reduce position size ahead of events',
    impact: 'Saved ~$200 on TSLA trade',
    category: 'Risk Management',
  },
  {
    id: '2',
    date: '2024-03-18',
    lesson: 'Fed announcements cause market gaps - avoid holding overnight',
    impact: 'Avoided potential loss on QQQ',
    category: 'Market Events',
  },
  {
    id: '3',
    date: '2024-03-15',
    lesson: 'Social sentiment peaks just before reversals - ignore extreme readings',
    impact: 'Better entries on crypto trades',
    category: 'Sentiment Analysis',
  },
]
