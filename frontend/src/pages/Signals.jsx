import React, { useState } from 'react';
import { useBotStore } from '../store/botStore';
import { ChevronDown } from 'lucide-react';
import '../styles/pages.css';

function Signals() {
  const { signals } = useBotStore();
  const [expandedSignal, setExpandedSignal] = useState(null);

  const getSignalColor = (direction) => {
    switch(direction) {
      case 'buy':
        return '#10b981';
      case 'sell':
        return '#ef4444';
      case 'wait':
        return '#f59e0b';
      default:
        return '#6b7280';
    }
  };

  return (
    <div className="page signals-page">
      <div className="page-header">
        <h1>⚡ Signals</h1>
        <p>Signal generation with reasoning and confidence scores</p>
      </div>

      <div className="signals-filter">
        <button className="filter-btn active">All</button>
        <button className="filter-btn">Pending</button>
        <button className="filter-btn">Executed</button>
        <button className="filter-btn">Rejected</button>
      </div>

      <div className="signals-container">
        {signals.map((signal) => (
          <div 
            key={signal.id} 
            className={`signal-card ${expandedSignal === signal.id ? 'expanded' : ''}`}
          >
            <div 
              className="signal-header-clickable"
              onClick={() => setExpandedSignal(expandedSignal === signal.id ? null : signal.id)}
            >
              <div className="signal-main-info">
                <div 
                  className="signal-direction-badge"
                  style={{ backgroundColor: getSignalColor(signal.direction) }}
                >
                  {signal.direction.toUpperCase()}
                </div>
                <div className="signal-title">
                  <h3>{signal.asset}</h3>
                  <p className="signal-status-text">{signal.status}</p>
                </div>
              </div>

              <div className="signal-confidence-display">
                <div className="confidence-ring">
                  <svg viewBox="0 0 100 100" width="60" height="60">
                    <circle cx="50" cy="50" r="45" fill="none" stroke="#4b5563" strokeWidth="2" />
                    <circle 
                      cx="50" 
                      cy="50" 
                      r="45" 
                      fill="none" 
                      stroke={getSignalColor(signal.direction)}
                      strokeWidth="2"
                      strokeDasharray={`${signal.confidence * 2.83} 283`}
                      strokeLinecap="round"
                    />
                    <text 
                      x="50" 
                      y="55" 
                      textAnchor="middle" 
                      fontSize="20" 
                      fontWeight="bold"
                      fill={getSignalColor(signal.direction)}
                    >
                      {signal.confidence}%
                    </text>
                  </svg>
                </div>
              </div>

              <ChevronDown 
                size={20} 
                className={`chevron ${expandedSignal === signal.id ? 'expanded' : ''}`}
              />
            </div>

            <p className="signal-reasoning">{signal.reasoning}</p>

            {expandedSignal === signal.id && (
              <div className="signal-details">
                <div className="detail-section">
                  <h4>What Data Did Opus See?</h4>
                  <div className="data-grid">
                    <div className="data-item">
                      <label>RSI</label>
                      <p>{signal.data.rsi}</p>
                    </div>
                    <div className="data-item">
                      <label>MACD</label>
                      <p>{signal.data.macd}</p>
                    </div>
                    <div className="data-item">
                      <label>Sentiment</label>
                      <p>{signal.data.sentiment}</p>
                    </div>
                    <div className="data-item">
                      <label>Technical Score</label>
                      <p>{signal.data.technicalScore}/10</p>
                    </div>
                    <div className="data-item">
                      <label>On-Chain</label>
                      <p>{signal.data.onChain}</p>
                    </div>
                  </div>
                </div>

                <div className="detail-section">
                  <h4>How Did It Decide?</h4>
                  <p className="logic-text">
                    Opus analyzed {signal.confidence}% of conditions that typically lead to winning trades. 
                    The confidence score reflects how many positive signals aligned for this decision.
                  </p>
                </div>

                <div className="detail-section warning">
                  <h4>⚠️ Alternative Outcomes</h4>
                  <p>{signal.alternative}</p>
                </div>

                <div className="signal-actions">
                  <button className="btn-small primary">Execute Trade</button>
                  <button className="btn-small secondary">Skip Signal</button>
                  <button className="btn-small secondary">View Details</button>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>

      <section className="card signal-stats">
        <h2>Signal Performance</h2>
        <div className="stats-grid">
          <div className="stat">
            <label>Pending Signals</label>
            <p className="large-number">{signals.filter(s => s.status === 'pending').length}</p>
          </div>
          <div className="stat">
            <label>Executed Signals</label>
            <p className="large-number">{signals.filter(s => s.status === 'executed').length}</p>
          </div>
          <div className="stat">
            <label>Average Confidence</label>
            <p className="large-number">
              {Math.round(signals.reduce((sum, s) => sum + s.confidence, 0) / signals.length)}%
            </p>
          </div>
          <div className="stat">
            <label>Win Rate on Signals</label>
            <p className="large-number">78%</p>
          </div>
        </div>
      </section>
    </div>
  );
}

export default Signals;
