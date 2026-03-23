import React from 'react';
import TooltipHelper from '../TooltipHelper';
import '../../styles/components.css';

function RiskGauge({ heat, positions }) {
  const gaugeColor = heat < 0.33 ? '#10b981' : heat < 0.66 ? '#f59e0b' : '#ef4444';
  const gaugeLabel = heat < 0.33 ? 'Low Risk' : heat < 0.66 ? 'Moderate Risk' : 'High Risk';
  const gaugePercentage = Math.round(heat * 100);

  const totalExposure = positions.reduce((sum, pos) => {
    return sum + Math.abs(pos.quantity * pos.currentPrice);
  }, 0);

  return (
    <div className="card risk-gauge-card">
      <div className="card-header">
        <h3>
          Risk Gauge
          <TooltipHelper text="Current portfolio heat: how much risk you're exposed to. Green=safe, Yellow=caution, Red=danger" />
        </h3>
      </div>

      <div className="risk-content">
        <div className="gauge-visual">
          <div className="gauge-circle">
            <div 
              className="gauge-fill"
              style={{
                background: `conic-gradient(${gaugeColor} ${gaugePercentage}%, #4b5563 ${gaugePercentage}%)`,
                width: '120px',
                height: '120px'
              }}
            >
              <div className="gauge-inner">
                <span className="gauge-percent">{gaugePercentage}%</span>
              </div>
            </div>
          </div>

          <div className="gauge-label" style={{ color: gaugeColor }}>
            {gaugeLabel}
          </div>
        </div>

        <div className="risk-details">
          <div className="risk-item">
            <label>Active Positions</label>
            <p>{positions.length}</p>
          </div>
          <div className="risk-item">
            <label>Total Exposure</label>
            <p>${(totalExposure / 1000).toFixed(1)}K</p>
          </div>
          <div className="risk-item">
            <label>Max Drawdown Risk</label>
            <p>4.3%</p>
          </div>
        </div>
      </div>

      <div className="risk-explanation">
        <p>
          <strong>What this means:</strong> {
            heat < 0.33 
              ? "You're well-diversified. The bot is being cautious."
              : heat < 0.66
              ? "Moderate exposure. Keep watching for any sudden moves."
              : "High concentration in a few assets. Consider taking profits or adding stop losses."
          }
        </p>
      </div>
    </div>
  );
}

export default RiskGauge;
