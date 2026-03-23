import React from 'react';
import { formatDistanceToNow } from 'date-fns';
import TooltipHelper from '../TooltipHelper';
import '../../styles/components.css';

function UpcomingEvents({ markets }) {
  return (
    <div className="card upcoming-events-card">
      <div className="card-header">
        <h3>
          Next 24 Hours
          <TooltipHelper text="Prediction market events the bot is watching" />
        </h3>
      </div>

      <div className="events-list">
        {markets.slice(0, 3).map((market) => (
          <div key={market.id} className="event-item">
            <div className="event-header">
              <h4>{market.event}</h4>
              <span className="event-time">
                {formatDistanceToNow(market.resolveDate, { addSuffix: true })}
              </span>
            </div>
            <div className="event-odds">
              <span className="odds-label">Current Odds:</span>
              <span className="odds-value">{(market.currentOdds * 100).toFixed(0)}%</span>
            </div>
            {market.botWatching && (
              <div className="event-bot-watch">
                🤖 Bot watching · {market.botConfidence}% confident
              </div>
            )}
          </div>
        ))}
      </div>

      <a href="/prediction-markets" className="view-all-link">
        View All Markets →
      </a>
    </div>
  );
}

export default UpcomingEvents;
