import React, { useState } from 'react';
import { useBotStore } from '../store/botStore';
import { formatDistanceToNow } from 'date-fns';
import TradeCard from '../components/TradeCard';
import '../styles/pages.css';

function TradeHistory() {
  const { trades, portfolio } = useBotStore();
  const [filter, setFilter] = useState('all');
  const [expandedTrade, setExpandedTrade] = useState(null);

  const filteredTrades = trades.filter(t => {
    if (filter === 'winners') return t.pnl > 0;
    if (filter === 'losers') return t.pnl < 0;
    return true;
  });

  const averageWin = trades
    .filter(t => t.pnl > 0)
    .reduce((sum, t) => sum + t.pnl, 0) / Math.max(1, trades.filter(t => t.pnl > 0).length);

  const averageLoss = trades
    .filter(t => t.pnl < 0)
    .reduce((sum, t) => sum + t.pnl, 0) / Math.max(1, trades.filter(t => t.pnl < 0).length);

  return (
    <div className="page trade-history-page">
      <div className="page-header">
        <h1>📊 Trade History</h1>
        <p>Every trade with full Opus reasoning and P&L</p>
      </div>

      {/* Performance Summary */}
      <section className="card performance-summary">
        <h2>Performance Summary</h2>
        <div className="summary-grid">
          <div className="summary-item">
            <label>Total Trades</label>
            <p className="large-number">{trades.length}</p>
          </div>
          <div className="summary-item">
            <label>Win Rate</label>
            <p className="large-number" style={{ color: '#10b981' }}>
              {portfolio.winRate}%
            </p>
            <p className="small-text">{portfolio.winningTrades} wins</p>
          </div>
          <div className="summary-item">
            <label>Average Win</label>
            <p className="large-number" style={{ color: '#10b981' }}>
              ${averageWin.toFixed(0)}
            </p>
          </div>
          <div className="summary-item">
            <label>Average Loss</label>
            <p className="large-number" style={{ color: '#ef4444' }}>
              ${averageLoss.toFixed(0)}
            </p>
          </div>
          <div className="summary-item">
            <label>Best Trade</label>
            <p className="large-number" style={{ color: '#10b981' }}>
              ${Math.max(...trades.map(t => t.pnl))}
            </p>
          </div>
          <div className="summary-item">
            <label>Worst Trade</label>
            <p className="large-number" style={{ color: '#ef4444' }}>
              ${Math.min(...trades.map(t => t.pnl))}
            </p>
          </div>
        </div>
      </section>

      {/* Filters */}
      <div className="trade-filters">
        <button 
          className={`filter-btn ${filter === 'all' ? 'active' : ''}`}
          onClick={() => setFilter('all')}
        >
          All Trades ({trades.length})
        </button>
        <button 
          className={`filter-btn ${filter === 'winners' ? 'active' : ''}`}
          onClick={() => setFilter('winners')}
        >
          Winners ({trades.filter(t => t.pnl > 0).length})
        </button>
        <button 
          className={`filter-btn ${filter === 'losers' ? 'active' : ''}`}
          onClick={() => setFilter('losers')}
        >
          Losers ({trades.filter(t => t.pnl < 0).length})
        </button>
      </div>

      {/* Trade List */}
      <div className="trades-list">
        {filteredTrades.map((trade) => (
          <TradeCard
            key={trade.id}
            trade={trade}
            isExpanded={expandedTrade === trade.id}
            onToggle={() => setExpandedTrade(expandedTrade === trade.id ? null : trade.id)}
          />
        ))}
      </div>

      {/* Advanced Metrics */}
      <section className="card advanced-metrics">
        <h2>Advanced Metrics</h2>
        <div className="metrics-grid">
          <div className="metric-box">
            <label>Sharpe Ratio</label>
            <p className="metric-value">1.62</p>
            <p className="metric-help">Risk-adjusted returns. Higher = better risk management.</p>
          </div>
          <div className="metric-box">
            <label>Maximum Drawdown</label>
            <p className="metric-value">-8.5%</p>
            <p className="metric-help">Worst peak-to-trough decline. Shows downside risk.</p>
          </div>
          <div className="metric-box">
            <label>Recovery Time</label>
            <p className="metric-value">3 days</p>
            <p className="metric-help">How long to recover from max drawdown. Fast = good.</p>
          </div>
          <div className="metric-box">
            <label>Profit Factor</label>
            <p className="metric-value">2.45</p>
            <p className="metric-help">Gross profit / Gross loss. Above 1.5 is strong.</p>
          </div>
        </div>
      </section>
    </div>
  );
}

export default TradeHistory;
