import express from 'express';
import cors from 'cors';
import { Server } from 'socket.io';
import http from 'http';
import 'dotenv/config';
import { logger } from './utils/logger.js';
import { createRateLimitMiddleware } from './utils/rateLimiter.js';
import { asyncHandler } from './utils/errorHandler.js';
import { metricsEndpoint } from './utils/apiMetrics.js';

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: process.env.CLIENT_URL || 'http://localhost:3000',
    methods: ['GET', 'POST'],
    credentials: true
  },
  transports: ['websocket', 'polling'],
  pingInterval: 25000,
  pingTimeout: 60000
});

// Middleware
app.use(cors({
  origin: process.env.CLIENT_URL || 'http://localhost:3000',
  credentials: true
}));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ limit: '10mb', extended: true }));

// Request ID middleware for tracking
app.use((req, res, next) => {
  req.id = `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  next();
});

// Rate limiting middleware
app.use(createRateLimitMiddleware({
  maxRequests: 100,
  windowMs: 60000,
  keyGenerator: (req) => req.ip || req.connection.remoteAddress || 'unknown'
}));

// Request logging middleware with enhanced tracking
app.use((req, res, next) => {
  const start = Date.now();
  res.on('finish', () => {
    const duration = Date.now() - start;
    const level = res.statusCode >= 400 ? 'warn' : 'info';
    logger[level](`${req.method} ${req.path}`, {
      statusCode: res.statusCode,
      duration: `${duration}ms`,
      requestId: req.id
    });
  });
  next();
});

// Request validation helper
const validateRequest = (schema) => (req, res, next) => {
  if (req.body && typeof req.body === 'object' && Object.keys(req.body).length === 0) {
    return res.status(400).json({ error: 'Request body cannot be empty' });
  }
  next();
};

/**
 * ROUTES
 * All endpoints include comprehensive error handling and validation
 */

/**
 * Health Check
 * GET /api/health
 */
app.get('/api/health', asyncHandler(async (req, res) => {
  res.json({
    status: 'ok',
    message: 'Trading Agent Backend Running',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    version: '1.0.0',
    requestId: req.id
  });
}));

/**
 * API Metrics
 * GET /api/metrics?view=summary|health|endpoints|errors|requests
 */
app.get('/api/metrics', asyncHandler(async (req, res) => {
  metricsEndpoint(req, res);
}));

/**
 * Bot Status
 * GET /api/bot/status
 */
app.get('/api/bot/status', asyncHandler(async (req, res) => {
  const now = new Date();
  const lastDecision = new Date(Date.now() - 5 * 60000);
  
  if (isNaN(lastDecision.getTime())) {
    throw new Error('Invalid date calculation for lastDecision');
  }
  
  res.json({
    status: 'online',
    lastDecision: lastDecision.toISOString(),
    lastDecisionAgo: '5 minutes',
    portfolio: {
      totalValue: 35420,
      totalPNL: 420,
      totalPNLPercent: 1.2,
      winRate: 62,
      activePositions: 2
    },
    marketCondition: 'bullish',
    nextSignalCheck: new Date(Date.now() + 5 * 60000).toISOString(),
    timestamp: now.toISOString(),
    requestId: req.id
  });
}));

/**
 * Get Trades
 * GET /api/trades?limit=50&offset=0
 */
app.get('/api/trades', asyncHandler(async (req, res) => {
  let limit = parseInt(req.query.limit) || 50;
  let offset = parseInt(req.query.offset) || 0;
  
  if (isNaN(limit) || limit < 1) limit = 50;
  if (limit > 500) limit = 500;
  if (isNaN(offset) || offset < 0) offset = 0;
  
  const mockTrades = [
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
      entryTime: new Date(Date.now() - 2 * 3600000).toISOString(),
      status: 'open',
      riskReward: 3.0,
      confidence: 87
    }
  ];
  
  const total = mockTrades.length;
  const paginatedTrades = mockTrades.slice(offset, offset + limit);
  
  res.json({
    trades: paginatedTrades,
    pagination: { 
      limit, 
      offset, 
      total,
      hasMore: offset + limit < total
    },
    timestamp: new Date().toISOString(),
    requestId: req.id
  });
}));

/**
 * Get Signals
 * GET /api/signals?status=pending
 */
app.get('/api/signals', asyncHandler(async (req, res) => {
  const status = (req.query.status || 'all').toLowerCase();
  const validStatuses = ['all', 'pending', 'executed', 'rejected', 'expired'];
  
  if (!validStatuses.includes(status)) {
    return res.status(400).json({
      error: 'Invalid status filter',
      validStatuses,
      timestamp: new Date().toISOString()
    });
  }
  
  const mockSignals = [
    {
      id: 'sig-001',
      asset: 'Bitcoin',
      symbol: 'BTC',
      direction: 'buy',
      confidence: 87,
      reasoning: 'Price above 200-day moving average. Strong on-chain accumulation detected.',
      status: 'pending',
      timestamp: new Date().toISOString(),
      technicalScore: 8.2,
      sentiment: 'positive'
    },
    {
      id: 'sig-002',
      asset: 'Ethereum',
      symbol: 'ETH',
      direction: 'wait',
      confidence: 65,
      reasoning: 'Consolidating after recent gains. Waiting for RSI to normalize.',
      status: 'executed',
      timestamp: new Date(Date.now() - 30 * 60000).toISOString(),
      technicalScore: 6.5,
      sentiment: 'positive'
    }
  ];
  
  const filteredSignals = status === 'all' 
    ? mockSignals 
    : mockSignals.filter(s => s.status === status);
  
  res.json({
    signals: filteredSignals,
    filter: { status, count: filteredSignals.length },
    timestamp: new Date().toISOString(),
    requestId: req.id
  });
}));

/**
 * Execute Trade
 * POST /api/trades/execute
 */
app.post('/api/trades/execute', validateRequest(), asyncHandler(async (req, res) => {
  const { symbol, type, amount, price } = req.body;
  
  if (!symbol || !type || !amount || !price) {
    return res.status(400).json({
      error: 'Missing required fields: symbol, type, amount, price'
    });
  }
  
  if (!['long', 'short'].includes(type)) {
    return res.status(400).json({ error: 'Invalid trade type' });
  }
  
  if (amount <= 0 || price <= 0) {
    return res.status(400).json({ error: 'Amount and price must be positive' });
  }
  
  res.status(201).json({
    success: true,
    trade: {
      id: `trade-${Date.now()}`,
      symbol,
      type,
      amount,
      price,
      timestamp: new Date().toISOString(),
      status: 'executed'
    },
    requestId: req.id
  });
}));

// WebSocket connection handling
io.on('connection', (socket) => {
  logger.info('Client connected', { socketId: socket.id });
  
  try {
    socket.emit('bot-status', {
      status: 'online',
      lastDecision: new Date(),
      clientId: socket.id,
      timestamp: Date.now()
    });
  } catch (error) {
    logger.error('WebSocket connection error', { error: error.message });
  }

  let updateInterval;
  try {
    updateInterval = setInterval(() => {
      try {
        socket.emit('activity-update', {
          id: `act-${Date.now()}`,
          type: 'info',
          message: 'Bot checking markets...',
          timestamp: new Date().toISOString()
        });
      } catch (emitError) {
        logger.error('Error emitting activity update', { error: emitError.message });
      }
    }, 30000);
  } catch (error) {
    logger.error('Error setting up update interval', { error: error.message });
  }

  socket.on('disconnect', () => {
    logger.info('Client disconnected', { socketId: socket.id });
    if (updateInterval) {
      clearInterval(updateInterval);
    }
  });

  socket.on('error', (error) => {
    logger.error('Socket error', { socketId: socket.id, error: error.message });
  });

  socket.on('execute-trade', (data, callback) => {
    try {
      logger.info('Trade execution requested', { data });
      
      if (!data || !data.symbol) {
        if (typeof callback === 'function') {
          callback({ success: false, error: 'Invalid trade data' });
        }
        return;
      }
      
      const result = {
        ...data,
        executedAt: new Date().toISOString(),
        status: 'success'
      };
      
      socket.emit('trade-executed', result);
      
      if (typeof callback === 'function') {
        callback({ success: true, result });
      }
    } catch (error) {
      logger.error('Error executing trade', { error: error.message });
      if (typeof callback === 'function') {
        callback({ success: false, error: error.message });
      }
    }
  });

  socket.on('override-trade', (data, callback) => {
    try {
      logger.info('Trade override requested', { data });
      
      if (!data || !data.tradeId) {
        if (typeof callback === 'function') {
          callback({ success: false, error: 'Invalid override data' });
        }
        return;
      }
      
      const result = {
        ...data,
        overriddenAt: new Date().toISOString(),
        status: 'success'
      };
      
      socket.emit('trade-overridden', result);
      
      if (typeof callback === 'function') {
        callback({ success: true, result });
      }
    } catch (error) {
      logger.error('Error overriding trade', { error: error.message });
      if (typeof callback === 'function') {
        callback({ success: false, error: error.message });
      }
    }
  });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    error: 'Endpoint not found',
    path: req.path,
    method: req.method,
    requestId: req.id
  });
});

// Comprehensive error handling middleware
app.use((err, req, res, next) => {
  logger.error('Unhandled error', {
    message: err.message,
    path: req.path,
    method: req.method
  });
  
  const statusCode = err.statusCode || 500;
  res.status(statusCode).json({
    error: process.env.NODE_ENV === 'production' ? 'Internal Server Error' : err.message,
    requestId: req.id
  });
});

// Start server with graceful shutdown
const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  logger.info('Trading Agent Backend started', {
    port: PORT,
    environment: process.env.NODE_ENV || 'development'
  });
});

// Graceful shutdown
process.on('SIGTERM', () => {
  logger.info('SIGTERM signal received: closing HTTP server');
  server.close(() => {
    logger.info('HTTP server closed');
    process.exit(0);
  });
});

process.on('SIGINT', () => {
  logger.info('SIGINT signal received: closing HTTP server');
  server.close(() => {
    logger.info('HTTP server closed');
    process.exit(0);
  });
});

export default app;
