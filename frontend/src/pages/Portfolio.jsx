import React from 'react';
import { useBotStore } from '../store/botStore';
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts';
import '../styles/pages.css';

function Portfolio() {
  const { positions, portfolio } = useBotStore();

  const pieData = positions.map(pos => ({
    name: pos.asset,
    value: pos.quantity * pos.currentPrice
  }));

  const totalPortfolioValue = pieData.reduce((sum, item) => sum + item.value, 0);
  const COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6'];

  const diversificationScore = Math.min(100, (positions.length / 8) * 100 + 20);

  return (
    <div className="page portfolio-page">
      <div className="page-header">
        <h1>💼 Portfolio Breakdown</h1>
        <p>Visual breakdown and risk analysis of all positions</p>
      </div>

      <div className="portfolio-content">
        {/* Visual Breakdown */}
        <section className="card portfolio-visual">
          <h2>Asset Allocation</h2>
          <div className="chart-container">
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={pieData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {pieData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip formatter={(value) => `$${value.toFixed(0)}`} />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </section>

        {/* Position Details Table */}
        <section className="card">
          <h2>Individual Positions</h2>
          <div className="positions-table">
            <div className="table-header">
              <div>Asset</div>
              <div>Entry</div>
              <div>Current</div>
              <div>P&L</div>
              <div>%</div>
              <div>Status</div>
            </div>

            {positions.map((pos) => (
              <div key={pos.id} className="table-row">
                <div className="asset-name">
                  <strong>{pos.asset}</strong>
                  <p className="small">{pos.symbol}</p>
                </div>
                <div>${pos.entryPrice.toFixed(2)}</div>
                <div>${pos.currentPrice.toFixed(2)}</div>
                <div style={{ color: pos.pnl >= 0 ? '#10b981' : '#ef4444' }}>
                  ${pos.pnl.toFixed(0)}
                </div>
                <div style={{ color: pos.pnlPercent >= 0 ? '#10b981' : '#ef4444' }}>
                  {pos.pnlPercent > 0 ? '+' : ''}{pos.pnlPercent.toFixed(2)}%
                </div>
                <div>
                  <span className={`status-badge ${pos.status}`}>
                    {pos.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Risk Heatmap */}
        <section className="card">
          <h2>Risk Heatmap</h2>
          <p className="section-note">Which positions are most dangerous?</p>
          
          <div className="risk-heatmap">
            {positions.map((pos) => {
              const riskColor = pos.status === 'danger' ? '#ef4444' : 
                                pos.status === 'caution' ? '#f59e0b' : '#10b981';
              
              return (
                <div key={pos.id} className="heatmap-item">
                  <div className="heatmap-label">{pos.asset}</div>
                  <div className="heatmap-bar">
                    <div 
                      className="heatmap-fill"
                      style={{
                        width: `${(pos.confidence / 100) * 100}%`,
                        backgroundColor: riskColor,
                        height: '30px'
                      }}
                    ></div>
                  </div>
                  <div className="heatmap-value">{pos.confidence}% confidence</div>
                  <div className="heatmap-note">{pos.status}</div>
                </div>
              );
            })}
          </div>
        </section>

        {/* Portfolio Health */}
        <section className="card">
          <h2>Portfolio Health</h2>
          <div className="health-grid">
            <div className="health-item">
              <label>Diversification Score</label>
              <p className="large-number">{Math.round(diversificationScore)}/100</p>
              <p className="small-text">
                {diversificationScore > 70 ? '✅ Well diversified' : 
                 diversificationScore > 40 ? '⚠️ Moderate concentration' : 
                 '🔴 Too concentrated'}
              </p>
            </div>

            <div className="health-item">
              <label>Number of Positions</label>
              <p className="large-number">{positions.length}</p>
              <p className="small-text">Ideal: 5-10 positions</p>
            </div>

            <div className="health-item">
              <label>Largest Position</label>
              <p className="large-number">
                {Math.round((Math.max(...positions.map(p => p.quantity * p.currentPrice)) / totalPortfolioValue) * 100)}%
              </p>
              <p className="small-text">Max recommended: 30%</p>
            </div>

            <div className="health-item">
              <label>Average Confidence</label>
              <p className="large-number">
                {Math.round(positions.reduce((sum, p) => sum + p.confidence, 0) / positions.length)}%
              </p>
              <p className="small-text">All positions</p>
            </div>
          </div>
        </section>

        {/* Position Explanations */}
        <section className="card">
          <h2>Position Details with Context</h2>
          <div className="position-details">
            {positions.map((pos) => (
              <div key={pos.id} className="position-detail-card">
                <h3>{pos.asset} ({pos.symbol})</h3>
                <p className="position-reason">{pos.reasoning}</p>
                
                <div className="position-info">
                  <div>
                    <label>Entry Price</label>
                    <p>${pos.entryPrice}</p>
                  </div>
                  <div>
                    <label>Current Price</label>
                    <p>${pos.currentPrice}</p>
                  </div>
                  <div>
                    <label>Target</label>
                    <p>${pos.profitTarget}</p>
                  </div>
                  <div>
                    <label>Stop Loss</label>
                    <p>${pos.stopLoss}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}

export default Portfolio;
