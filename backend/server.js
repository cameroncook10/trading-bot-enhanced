import express from 'express';
import cors from 'cors';
import { Server } from 'socket.io';
import http from 'http';
import 'dotenv/config';

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

// Request logging middleware
app.use((req, res, next) => {
  const start = Date.now();
  res.on('finish', () => {
    const duration = Date.now() - start;
    console.log(`${req.method} ${req.path} ${res.statusCode} ${duration}ms`);
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
 * Returns: Server status, uptime, and timestamp
 */
app.get('/api/health', (req, res) => {
  try {
    res.json({
      status: 'ok',
      message: 'Trading Agent Backend Running',
      timestamp: new Date().toISOString(),
      uptime: process.uptime(),
      version: '1.0.0'
    });
  } catch (error) {
    console.error('[HEALTH] Unexpected error:', error);
    res.status(500).json({ error: 'Health check failed', timestamp: new Date().toISOString() });
  }
});

/**
 * Bot Status
 * GET /api/bot/status
 * Returns: Current bot status, portfolio metrics, and decision time
 */
app.get('/api/bot/status', (req, res) => {
  try {
    const now = new Date();
    const lastDecision = new Date(Date.now() - 5 * 60000);
    
    // Validate date calculations
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
      marketCondition: 'bullish', // bullish, bearish, neutral
      nextSignalCheck: new Date(Date.now() + 5 * 60000).toISOString(),
      timestamp: now.toISOString()
    });
  } catch (error) {
    console.error('[BOT_STATUS] Error fetching bot status:', error);
    res.status(500).json({ 
      error: 'Failed to fetch bot status',
      details: process.env.NODE_ENV === 'development' ? error.message : undefined,
      timestamp: new Date().toISOString()
    });
  }
});

/**
 * Get Trades
 * GET /api/trades?limit=50&offset=0
 * Returns: List of trades with pagination
 */
app.get('/api/trades', (req, res) => {
  try {
    // Validate and parse pagination parameters
    let limit = parseInt(req.query.limit) || 50;
    let offset = parseInt(req.query.offset) || 0;
    
    // Enforce bounds
    if (isNaN(limit) || limit < 1) limit = 50;
    if (limit > 500) limit = 500; // Max 500 per request
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
    
    // Simulate pagination
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
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('[TRADES] Error fetching trades:', error);
    res.status(500).json({ 
      error: 'Failed to fetch trades',
      details: process.env.NODE_ENV === 'development' ? error.message : undefined,
      timestamp: new Date().toISOString()
    });
  }
});

/**
 * Get Signals
 * GET /api/signals?status=pending
 * Returns: List of trading signals, optionally filtered by status
 * Valid statuses: all, pending, executed, rejected, expired
 */
app.get('/api/signals', (req, res) => {
  try {
    const status = (req.query.status || 'all').toLowerCase();
    const validStatuses = ['all', 'pending', 'executed', 'rejected', 'expired'];
    
    // Validate status parameter
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
    
    // Filter signals by status
    const filteredSignals = status === 'all' 
      ? mockSignals 
      : mockSignals.filter(s => s.status === status);
    
    res.json({
      signals: filteredSignals,
      filter: { status, count: filteredSignals.length },
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('[SIGNALS] Error fetching signals:', error);
    res.status(500).json({ 
      error: 'Failed to fetch signals',
      details: process.env.NODE_ENV === 'development' ? error.message : undefined,
      timestamp: new Date().toISOString()
    });
  }
});

// POST endpoint for trade execution with validation
app.post('/api/trades/execute', validateRequest(), (req, res) => {
  try {
    const { symbol, type, amount, price } = req.body;
    
    // Basic validation
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
      }
    });
  } catch (error) {
    console.error('Error executing trade:', error);
    res.status(500).json({ error: 'Failed to execute trade' });
  }
});

// WebSocket connection handling with better error management
io.on('connection', (socket) => {
  console.log(`✓ Client connected: ${socket.id}`);
  
  try {
    // Emit initial data with timestamp
    socket.emit('bot-status', {
      status: 'online',
      lastDecision: new Date(),
      clientId: socket.id,
      timestamp: Date.now()
    });
  } catch (error) {
    console.error('Error on WebSocket connection:', error);
  }

  // Simulate real-time updates with better interval management
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
        console.error('Error emitting activity update:', emitError);
      }
    }, 30000);
  } catch (error) {
    console.error('Error setting up update interval:', error);
  }

  socket.on('disconnect', () => {
    console.log(`✗ Client disconnected: ${socket.id}`);
    if (updateInterval) {
      clearInterval(updateInterval);
    }
  });

  socket.on('error', (error) => {
    console.error(`Socket error for ${socket.id}:`, error);
  });

  socket.on('execute-trade', (data, callback) => {
    try {
      console.log('Trade execution requested:', data);
      
      // Validate trade data
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
      
      // Acknowledge with callback
      if (typeof callback === 'function') {
        callback({ success: true, result });
      }
    } catch (error) {
      console.error('Error executing trade:', error);
      if (typeof callback === 'function') {
        callback({ success: false, error: error.message });
      }
    }
  });

  socket.on('override-trade', (data, callback) => {
    try {
      console.log('Trade override requested:', data);
      
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
      console.error('Error overriding trade:', error);
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
    method: req.method
  });
});

// Comprehensive error handling middleware
app.use((err, req, res, next) => {
  console.error('Unhandled error:', {
    message: err.message,
    stack: err.stack,
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
  console.log(`🚀 Trading Agent Backend running on port ${PORT}`);
  console.log(`📱 Real-time updates enabled via WebSocket`);
  console.log(`🔐 CORS enabled for: ${process.env.CLIENT_URL || 'http://localhost:3000'}`);
});

// Graceful shutdown
process.on('SIGTERM', () => {
  console.log('SIGTERM signal received: closing HTTP server');
  server.close(() => {
    console.log('HTTP server closed');
    process.exit(0);
  });
});

process.on('SIGINT', () => {
  console.log('SIGINT signal received: closing HTTP server');
  server.close(() => {
    console.log('HTTP server closed');
    process.exit(0);
  });
});

export default app;
