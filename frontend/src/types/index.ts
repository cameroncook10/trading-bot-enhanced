export interface Trade {
  id: string
  symbol: string
  entry_price: number
  current_price: number
  quantity: number
  side: 'LONG' | 'SHORT'
  status: 'OPEN' | 'CLOSED' | 'PENDING'
  confidence: number
  entry_time: string
  exit_time?: string
  pnl?: number
  pnl_percent?: number
  reasoning: string
  tags: string[]
}

export interface Position {
  id: string
  symbol: string
  quantity: number
  entry_price: number
  current_price: number
  value: number
  unrealized_pnl: number
  unrealized_pnl_percent: number
  confidence_score: number
  side: 'LONG' | 'SHORT'
}

export interface Portfolio {
  total_value: number
  total_invested: number
  total_pnl: number
  total_pnl_percent: number
  cash_available: number
  positions: Position[]
  allocation: AllocationItem[]
}

export interface AllocationItem {
  symbol: string
  value: number
  percent: number
  type: 'stock' | 'crypto' | 'commodity' | 'forex'
}

export interface Signal {
  id: string
  type: 'BUY' | 'SELL' | 'HOLD'
  symbol: string
  strength: 'STRONG' | 'MODERATE' | 'WEAK'
  indicators: {
    name: string
    value: string
    signal: 'bullish' | 'bearish' | 'neutral'
  }[]
  sentiment: {
    social: number // -100 to 100
    news: number
    technical: number
  }
  generated_at: string
  confidence: number
}

export interface TradeLog {
  id: string
  timestamp: string
  action: string
  details: string
  level: 'INFO' | 'WARNING' | 'ERROR' | 'SUCCESS'
  reasoning?: string
}

export interface BotSettings {
  model: 'claude-3-opus' | 'claude-3-sonnet' | 'gpt-4' | 'gpt-4-turbo'
  max_position_size: number
  max_daily_loss: number
  min_confidence_threshold: number
  risk_per_trade: number
  trailing_stop_percent: number
  notifications_enabled: boolean
  email_notifications: boolean
  push_notifications: boolean
  webhook_url?: string
}

export interface PerformanceMetric {
  date: string
  total_pnl: number
  win_rate: number
  trades_executed: number
  avg_confidence: number
}

export interface WebSocketMessage {
  type: 'trade' | 'signal' | 'position' | 'log' | 'metric'
  data: unknown
}
