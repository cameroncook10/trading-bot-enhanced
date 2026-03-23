/**
 * API Response Types
 * Centralized type definitions for all API endpoints
 */

// Common types
export interface Pagination {
  limit: number;
  offset: number;
  total: number;
  hasMore: boolean;
}

export interface ApiResponse<T> {
  data?: T;
  error?: string;
  timestamp: string;
  requestId?: string;
}

// Health
export interface HealthResponse extends ApiResponse<{
  status: 'ok' | 'degraded' | 'down';
  message: string;
  uptime: number;
  version: string;
}> {}

// Bot Status
export interface PortfolioMetrics {
  totalValue: number;
  totalPNL: number;
  totalPNLPercent: number;
  winRate: number;
  activePositions: number;
}

export interface BotStatusResponse extends ApiResponse<{
  status: 'online' | 'offline';
  lastDecision: string;
  lastDecisionAgo: string;
  portfolio: PortfolioMetrics;
  marketCondition: 'bullish' | 'bearish' | 'neutral';
  nextSignalCheck: string;
}> {}

// Trades
export interface Trade {
  id: string;
  asset: string;
  symbol: string;
  type: 'long' | 'short';
  entryPrice: number;
  currentPrice: number;
  quantity: number;
  pnl: number;
  pnlPercent: number;
  entryTime: string;
  status: 'open' | 'closed';
  riskReward: number;
  confidence: number;
}

export interface TradesResponse extends ApiResponse<{
  trades: Trade[];
  pagination: Pagination;
}> {}

// Signals
export interface Signal {
  id: string;
  asset: string;
  symbol: string;
  direction: 'buy' | 'sell' | 'wait';
  confidence: number;
  reasoning: string;
  status: 'pending' | 'executed' | 'rejected' | 'expired';
  timestamp: string;
  technicalScore: number;
  sentiment: 'positive' | 'negative' | 'neutral';
}

export interface SignalsResponse extends ApiResponse<{
  signals: Signal[];
  filter: {
    status: string;
    count: number;
  };
}> {}

// Trade Execution
export interface ExecuteTradeRequest {
  symbol: string;
  type: 'long' | 'short';
  amount: number;
  price: number;
}

export interface ExecuteTradeResponse extends ApiResponse<{
  success: boolean;
  trade: Trade;
}> {}

// Metrics
export interface EndpointMetric {
  endpoint: string;
  count: number;
  totalDuration: number;
  avgDuration: number;
  minDuration: number;
  maxDuration: number;
  errors: number;
}

export interface MetricsResponse extends ApiResponse<{
  uptime: number;
  totalRequests: number;
  totalErrors: number;
  avgDuration: number;
  errorRate: number;
  statusCodes: Record<number, number>;
  topEndpoints: EndpointMetric[];
  slowestEndpoints: EndpointMetric[];
}> {}

export interface HealthMetrics extends ApiResponse<{
  status: 'healthy' | 'degraded' | 'unhealthy';
  uptime: number;
  totalRequests: number;
  recentErrorRate: number;
  avgResponseTime: number;
  statusCodes: Record<number, number>;
}> {}
