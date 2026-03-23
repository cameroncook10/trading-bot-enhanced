import React from 'react';
import TooltipHelper from '../TooltipHelper';
import '../../styles/components.css';

function TodayActivity({ trades, signals }) {
  const todayTrades = trades.filter(t => {
    const today = new Date();
    const tradeDate = new Date(t.entryTime);
    return tradeDate.toDateString() === today.toDateString();
  });

  const winnersToday = todayTrades.filter(t => t.pnl > 0).length;
  const totalPnlToday = todayTrades.reduce((sum, t) => sum + t.pnl, 0);

  return (
    <div className="card today-activity-card">
      <div className="card-header">
        <h3>
          Today's Activity
          <TooltipHelper text="Trades executed and signals generated today" />
        </h3>
      </div>

      <div className="activity-grid">
        <div className="activity-stat">
          <label>Trades Made</label>
          <p className="stat-number">{todayTrades.length}</p>
          <p className="stat-detail">{winnersToday} winners</p>
        </div>

        <div className="activity-stat">
          <label>
            Today's P&L
            <TooltipHelper text="Profit/Loss from trades executed today only" />
          </label>
          <p className="stat-number" style={{ color: totalPnlToday >= 0 ? '#10b981' : '#ef4444' }}>
            ${totalPnlToday.toLocaleString()}
          </p>
          <p className="stat-detail">
            {((totalPnlToday / 35000) * 100).toFixed(2)}% of portfolio
          </p>
        </div>

        <div className="activity-stat">
          <label>Signals Generated</label>
          <p className="stat-number">{signals.length}</p>
          <p className="stat-detail">2 executed, 3 pending</p>
        </div>

        <div className="activity-stat">
          <label>Decisions</label>
          <p className="stat-number">5</p>
          <p className="stat-detail">All logged</p>
        </div>
      </div>
    </div>
  );
}

export default TodayActivity;
