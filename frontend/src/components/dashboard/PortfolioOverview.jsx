import React from 'react';
import TooltipHelper from '../TooltipHelper';
import '../../styles/components.css';

function PortfolioOverview({ portfolio }) {
  const pnlColor = portfolio.totalPNLPercent >= 0 ? '#10b981' : '#ef4444';

  return (
    <div className="card portfolio-overview-card">
      <div className="card-header">
        <h3>
          Portfolio Overview
          <TooltipHelper text="Total portfolio value, P&L, and win rate statistics" />
        </h3>
      </div>

      <div className="portfolio-content">
        <div className="portfolio-metric">
          <label>Total Value</label>
          <p className="metric-large">${portfolio.totalValue.toLocaleString()}</p>
        </div>

        <div className="portfolio-metric">
          <label>
            Total P&L
            <TooltipHelper text="Profit and Loss: total gains/losses across all positions" />
          </label>
          <p className="metric-large" style={{ color: pnlColor }}>
            ${portfolio.totalPNL.toLocaleString()}
            <span className="metric-percent">({portfolio.totalPNLPercent}%)</span>
          </p>
        </div>

        <div className="portfolio-metric">
          <label>
            Win Rate
            <TooltipHelper text="Percentage of winning trades out of total trades executed" />
          </label>
          <p className="metric-large">{portfolio.winRate}%</p>
          <p className="metric-detail">{portfolio.winningTrades} wins / {portfolio.totalTrades} trades</p>
        </div>
      </div>
    </div>
  );
}

export default PortfolioOverview;
