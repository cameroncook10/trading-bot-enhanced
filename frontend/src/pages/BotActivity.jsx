import React, { useState } from 'react';
import { useBotStore } from '../store/botStore';
import { Eye } from 'lucide-react';
import '../styles/pages.css';

function BotActivity() {
  const { watchers, trades, signals } = useBotStore();
  const [selectedWatcher, setSelectedWatcher] = useState(null);

  return (
    <div className="page bot-activity-page">
      <div className="page-header">
        <h1>🤖 Bot Activity Tracker</h1>
        <p>Real-time bot actions, signals, and decisions with full reasoning</p>
      </div>

      <div className="content-grid">
        {/* What the bot is watching */}
        <section className="card">
          <h2>What the Bot is Watching</h2>
          <div className="watchers-grid">
            {watchers.map((watcher) => (
              <div key={watcher.symbol} className="watcher-card">
                <div className="watcher-header">
                  <h3>{watcher.asset}</h3>
                  <span className="watcher-price">${watcher.currentPrice}</span>
                </div>

                <div className="watcher-status">
                  <p className="status-label">Signal: <strong>{watcher.signal}</strong></p>
                </div>

                <div className="watcher-detail">
                  <label>Next Trigger</label>
                  <p>{watcher.nextTrigger}</p>
                </div>

                <div className="watcher-metrics">
                  <div className="metric">
                    <label>Confidence</label>
                    <p>{watcher.confidence}%</p>
                  </div>
                  <div className="metric">
                    <label>RSI</label>
                    <p>{watcher.rsiBands.current}</p>
                  </div>
                </div>

                <button 
                  className="btn-small secondary"
                  onClick={() => setSelectedWatcher(watcher)}
                >
                  <Eye size={14} /> View Analysis
                </button>
              </div>
            ))}
          </div>
        </section>

        {/* Signals it's considering */}
        <section className="card">
          <h2>Signals It's Considering</h2>
          <div className="signals-list">
            {signals.map((signal) => (
              <div key={signal.id} className="signal-item">
                <div className="signal-header">
                  <h3>{signal.asset}</h3>
                  <span className={`signal-direction ${signal.direction}`}>
                    {signal.direction.toUpperCase()}
                  </span>
                </div>

                <p className="signal-reasoning">{signal.reasoning}</p>

                <div className="signal-confidence">
                  <div className="confidence-bar">
                    <div 
                      className="confidence-fill"
                      style={{ width: `${signal.confidence}%` }}
                    ></div>
                  </div>
                  <span className="confidence-text">{signal.confidence}% confident</span>
                </div>

                <div className="signal-status">
                  <span className={`status-badge ${signal.status}`}>
                    {signal.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Trades made with reasoning */}
        <section className="card">
          <h2>Recent Trades with Full Reasoning</h2>
          <div className="trades-detailed">
            {trades.slice(0, 3).map((trade) => (
              <div key={trade.id} className="trade-detail-box">
                <h3>{trade.asset} {trade.type.toUpperCase()}</h3>

                <div className="trade-info-grid">
                  <div>
                    <label>Entry</label>
                    <p>${trade.entryPrice}</p>
                  </div>
                  <div>
                    <label>Current</label>
                    <p>${trade.currentPrice}</p>
                  </div>
                  <div>
                    <label>P&L</label>
                    <p style={{ color: trade.pnl >= 0 ? '#10b981' : '#ef4444' }}>
                      ${trade.pnl}
                    </p>
                  </div>
                </div>

                <div className="reasoning-section">
                  <h4>Opus Reasoning</h4>
                  <p>{trade.opusReasoning}</p>
                </div>

                <div className="confidence-section">
                  <h4>Confidence</h4>
                  <p>{trade.confidence}% (based on {trade.historicalAccuracy}% historical accuracy)</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Performance stats */}
        <section className="card">
          <h2>Win/Loss Record</h2>
          <div className="performance-grid">
            <div className="perf-stat">
              <label>Total Trades</label>
              <p className="large-number">{trades.length}</p>
            </div>
            <div className="perf-stat">
              <label>Winning Trades</label>
              <p className="large-number" style={{ color: '#10b981' }}>
                {trades.filter(t => t.pnl > 0).length}
              </p>
            </div>
            <div className="perf-stat">
              <label>Win Rate</label>
              <p className="large-number">
                {Math.round((trades.filter(t => t.pnl > 0).length / trades.length) * 100)}%
              </p>
            </div>
            <div className="perf-stat">
              <label>Average Win</label>
              <p className="large-number" style={{ color: '#10b981' }}>
                ${Math.round(trades.filter(t => t.pnl > 0).reduce((s, t) => s + t.pnl, 0) / Math.max(1, trades.filter(t => t.pnl > 0).length))}
              </p>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}

export default BotActivity;
