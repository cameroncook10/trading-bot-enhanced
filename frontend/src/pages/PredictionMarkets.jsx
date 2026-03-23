import React, { useState } from 'react';
import { useBotStore } from '../store/botStore';
import { TrendingUp, TrendingDown } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import '../styles/pages.css';

function PredictionMarkets() {
  const { predictionMarkets } = useBotStore();
  const [selectedMarket, setSelectedMarket] = useState(null);

  return (
    <div className="page prediction-markets-page">
      <div className="page-header">
        <h1>🎯 Prediction Markets</h1>
        <p>Polymarket opportunities with bot analysis</p>
      </div>

      <div className="markets-intro">
        <div className="intro-card">
          <h2>How to Read Odds</h2>
          <p>
            <strong>87% odds means:</strong> The market thinks there's an 87% chance this happens. 
            If you buy YES at $0.87 and you're right, you profit. This is how smart money 
            forecasts the future—and you can too.
          </p>
        </div>
      </div>

      <div className="markets-grid">
        {predictionMarkets.map((market) => {
          const trendIcon = market.trend === 'up' ? 
            <TrendingUp size={16} color="#10b981" /> : 
            <TrendingDown size={16} color="#ef4444" />;

          return (
            <div 
              key={market.id} 
              className="market-card"
              onClick={() => setSelectedMarket(market)}
            >
              <div className="market-header">
                <h3>{market.event}</h3>
                <span className="market-trend">{trendIcon}</span>
              </div>

              <p className="market-description">{market.description}</p>

              <div className="market-odds-section">
                <label>Current Odds</label>
                <div className="odds-display">
                  <span className="odds-value">{(market.currentOdds * 100).toFixed(0)}%</span>
                  <p className="odds-explanation">Market thinks {(market.currentOdds * 100).toFixed(0)}% chance it happens</p>
                </div>
              </div>

              <div className="market-resolve">
                <label>Resolves</label>
                <p>{formatDistanceToNow(market.resolveDate, { addSuffix: true })}</p>
              </div>

              {market.botWatching && (
                <div className="bot-watching">
                  <p>🤖 Bot is watching ({market.botConfidence}% confident)</p>
                </div>
              )}

              {market.botPosition && (
                <div className="bot-position">
                  <label>Bot's Position</label>
                  <p>Bet ${market.botPosition.amount} on YES</p>
                  <p className="position-value">Current value: ${market.botPosition.currentValue}</p>
                </div>
              )}

              <div className="odds-history">
                <label>Odds Trend (past 5 updates)</label>
                <div className="mini-chart">
                  {market.historicalOdds.map((odds, idx) => (
                    <div 
                      key={idx} 
                      className="chart-bar"
                      style={{ height: `${odds * 100}%` }}
                      title={`${(odds * 100).toFixed(0)}%`}
                    ></div>
                  ))}
                </div>
              </div>

              <div className="market-actions">
                <button className="btn-small primary">View on Polymarket</button>
                <button className="btn-small secondary">View Bot Analysis</button>
              </div>
            </div>
          );
        })}
      </div>

      {selectedMarket && (
        <div className="market-detail-modal">
          <div className="modal-content">
            <h2>{selectedMarket.event}</h2>

            <div className="detail-section">
              <h3>What's This About?</h3>
              <p>{selectedMarket.description}</p>
            </div>

            <div className="detail-section">
              <h3>Market Analysis</h3>
              <div className="analysis-grid">
                <div>
                  <label>Current Odds</label>
                  <p className="large-number">{(selectedMarket.currentOdds * 100).toFixed(0)}%</p>
                </div>
                <div>
                  <label>Trend</label>
                  <p className="large-number">{selectedMarket.trend === 'up' ? '📈' : '📉'} {selectedMarket.trend.toUpperCase()}</p>
                </div>
                <div>
                  <label>Bot Confidence</label>
                  <p className="large-number">{selectedMarket.botConfidence}%</p>
                </div>
                <div>
                  <label>Days Until Resolution</label>
                  <p className="large-number">
                    {Math.ceil((selectedMarket.resolveDate - new Date()) / 86400000)}
                  </p>
                </div>
              </div>
            </div>

            {selectedMarket.botPosition && (
              <div className="detail-section bot-position-detail">
                <h3>Your Position</h3>
                <p>Bet: ${selectedMarket.botPosition.amount} on YES</p>
                <p>Current Value: ${selectedMarket.botPosition.currentValue}</p>
                <p style={{ color: '#10b981' }}>P&L: +${selectedMarket.botPosition.currentValue - selectedMarket.botPosition.amount}</p>
              </div>
            )}

            <div className="modal-actions">
              <button className="btn-small secondary" onClick={() => setSelectedMarket(null)}>Close</button>
              <button className="btn-small primary">Manage Position</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default PredictionMarkets;
