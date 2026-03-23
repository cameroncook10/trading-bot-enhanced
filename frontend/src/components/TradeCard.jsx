import React from 'react';
import { ChevronDown, TrendingUp, TrendingDown } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import TooltipHelper from './TooltipHelper';
import '../styles/components.css';

function TradeCard({ trade, isExpanded, onToggle }) {
  const isPositive = trade.pnl >= 0;
  const direction = trade.type === 'long' ? <TrendingUp size={18} /> : <TrendingDown size={18} />;

  return (
    <div className={`trade-card ${isExpanded ? 'expanded' : ''}`}>
      <div className="trade-header" onClick={onToggle}>
        <div className="trade-info">
          <div className="trade-icon" style={{ color: isPositive ? '#10b981' : '#ef4444' }}>
            {direction}
          </div>
          <div className="trade-details">
            <h4>{trade.asset} {trade.type.toUpperCase()}</h4>
            <p className="trade-timestamp">
              {formatDistanceToNow(trade.entryTime, { addSuffix: true })}
            </p>
          </div>
        </div>
        <div className="trade-pnl">
          <p className="pnl-amount" style={{ color: isPositive ? '#10b981' : '#ef4444' }}>
            ${isPositive ? '+' : ''}{trade.pnl}
          </p>
          <p className="pnl-percent" style={{ color: isPositive ? '#10b981' : '#ef4444' }}>
            {isPositive ? '+' : ''}{trade.pnlPercent}%
          </p>
        </div>
        <ChevronDown 
          size={20} 
          className={`chevron ${isExpanded ? 'expanded' : ''}`}
        />
      </div>

      {isExpanded && (
        <div className="trade-body">
          <div className="trade-grid">
            <div className="trade-row">
              <label>Entry Price</label>
              <p>${trade.entryPrice}</p>
              <label>Current Price</label>
              <p>${trade.currentPrice}</p>
            </div>

            <div className="trade-row">
              <label>Quantity</label>
              <p>{trade.quantity}</p>
              <label>Risk/Reward</label>
              <p>1:2.5</p>
            </div>

            <div className="trade-divider"></div>

            <div className="trade-reasoning">
              <h4>Bot Reasoning</h4>
              <p className="reasoning-text">{trade.opusReasoning}</p>
            </div>

            <div className="trade-reasoning">
              <h4>What Data Did Opus See?</h4>
              <ul>
                <li><strong>RSI:</strong> 62 (trending upward from oversold)</li>
                <li><strong>MACD:</strong> Positive histogram</li>
                <li><strong>200-day MA:</strong> Price above key support</li>
                <li><strong>On-chain:</strong> Accumulation by institutions</li>
              </ul>
            </div>

            <div className="trade-reasoning">
              <h4>Alternative Outcomes</h4>
              <p className="warning-text">
                ⚠️ What if it's wrong? The bot could see this as a false breakout. 
                Stop loss at ${trade.stopLoss} protects against downside.
              </p>
            </div>

            <div className="trade-reasoning">
              <h4>Historical Accuracy</h4>
              <p>
                Opus wins on <strong>81% of similar setups</strong>. This type of signal 
                (reversal at support) has proven reliable in 81% of cases.
              </p>
            </div>

            <div className="trade-actions">
              <button className="btn-small secondary">Override Trade</button>
              <button className="btn-small secondary">View Full Details</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default TradeCard;
