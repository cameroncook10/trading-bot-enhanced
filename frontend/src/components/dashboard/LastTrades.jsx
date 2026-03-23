import React, { useState } from 'react';
import { formatDistanceToNow } from 'date-fns';
import TradeCard from '../TradeCard';
import '../../styles/components.css';

function LastTrades({ trades }) {
  const [expandedTrade, setExpandedTrade] = useState(null);

  return (
    <div className="card last-trades-card">
      <div className="card-header">
        <h3>Last 5 Trades</h3>
        <p className="card-subheader">Full reasoning and live P&L</p>
      </div>

      <div className="trades-list">
        {trades.map((trade) => (
          <TradeCard
            key={trade.id}
            trade={trade}
            isExpanded={expandedTrade === trade.id}
            onToggle={() => setExpandedTrade(expandedTrade === trade.id ? null : trade.id)}
          />
        ))}
      </div>

      <a href="/trade-history" className="view-all-link">
        View Full History →
      </a>
    </div>
  );
}

export default LastTrades;
