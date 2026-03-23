import React, { useState } from 'react';
import { useBotStore } from '../store/botStore';
import '../styles/pages.css';

function Settings() {
  const { riskMode, setRiskMode, riskModes } = useBotStore();
  const [selectedMode, setSelectedMode] = useState(riskMode);

  return (
    <div className="page settings-page">
      <div className="page-header">
        <h1>⚙️ Settings</h1>
        <p>Choose your trading style and bot behavior</p>
      </div>

      <section className="card risk-mode-selector">
        <h2>Risk Level</h2>
        <p className="section-description">
          Choose your comfort level. You can change this anytime.
        </p>

        <div className="risk-modes-grid">
          {Object.entries(riskModes).map(([key, mode]) => (
            <div 
              key={key}
              className={`risk-mode-card ${selectedMode === key ? 'selected' : ''}`}
              onClick={() => {
                setSelectedMode(key);
                setRiskMode(key);
              }}
            >
              <h3>{mode.description}</h3>
              
              <div className="mode-config">
                <div className="config-item">
                  <label>Max Position Size</label>
                  <p className="config-value">{(mode.maxPositionSize * 100).toFixed(0)}%</p>
                </div>
                <div className="config-item">
                  <label>Trading Mode</label>
                  <p className="config-value">{mode.paperTrading ? 'Paper' : 'Live'}</p>
                </div>
                <div className="config-item">
                  <label>Daily Stop</label>
                  <p className="config-value">{(mode.dailyStopLoss * 100).toFixed(0)}%</p>
                </div>
              </div>

              <p className="mode-example">
                <strong>Example:</strong> {mode.example}
              </p>

              <button 
                className={`btn-select ${selectedMode === key ? 'primary' : 'secondary'}`}
              >
                {selectedMode === key ? '✓ Selected' : 'Select'}
              </button>
            </div>
          ))}
        </div>
      </section>

      {/* Bot Control */}
      <section className="card bot-controls">
        <h2>Bot Controls</h2>
        
        <div className="control-group">
          <h3>Bot Status</h3>
          <div className="control-buttons">
            <button className="btn-large secondary">Pause Bot</button>
            <button className="btn-large secondary">Resume Bot</button>
          </div>
          <p className="control-note">Bot is currently ONLINE. It will keep monitoring markets.</p>
        </div>

        <div className="control-group">
          <h3>Auto-Stop Settings</h3>
          <div className="setting-item">
            <label>Daily Loss Limit</label>
            <p>Bot auto-pauses if portfolio drops {(riskModes[selectedMode].dailyStopLoss * 100).toFixed(0)}% in a day</p>
            <button className="btn-small secondary">Adjust</button>
          </div>
        </div>

        <div className="control-group">
          <h3>Paper Trading</h3>
          <p>
            All current modes use paper trading. This means:
          </p>
          <ul>
            <li>✓ Trades are simulated against real market prices</li>
            <li>✓ No real money is at risk</li>
            <li>✓ You learn without losing</li>
            <li>✓ Switch to live trading when ready</li>
          </ul>
        </div>
      </section>

      {/* Notification Settings */}
      <section className="card notification-settings">
        <h2>Notifications</h2>
        
        <div className="notification-item">
          <div className="item-header">
            <h3>New Signal Generated</h3>
            <input type="checkbox" defaultChecked />
          </div>
          <p>Notify when bot creates a trading signal</p>
        </div>

        <div className="notification-item">
          <div className="item-header">
            <h3>Trade Executed</h3>
            <input type="checkbox" defaultChecked />
          </div>
          <p>Notify when a trade is executed</p>
        </div>

        <div className="notification-item">
          <div className="item-header">
            <h3>Risk Alerts</h3>
            <input type="checkbox" defaultChecked />
          </div>
          <p>Notify when portfolio risk gets high</p>
        </div>

        <div className="notification-item">
          <div className="item-header">
            <h3>Daily Summary</h3>
            <input type="checkbox" defaultChecked />
          </div>
          <p>Receive daily email summary at 5 PM</p>
        </div>
      </section>

      {/* API Keys & Connections */}
      <section className="card api-settings">
        <h2>Exchange Connections</h2>
        
        <div className="connection-item">
          <h3>Polymarket API</h3>
          <p>Status: <span className="status-connected">Connected</span></p>
          <button className="btn-small secondary">Disconnect</button>
        </div>

        <div className="connection-item">
          <h3>Crypto Exchange API</h3>
          <p>Status: <span className="status-connected">Connected</span></p>
          <button className="btn-small secondary">Manage Keys</button>
        </div>
      </section>

      {/* Data & Privacy */}
      <section className="card data-privacy">
        <h2>Data & Privacy</h2>
        
        <div className="privacy-item">
          <h3>Trade Data</h3>
          <p>All your trade history, signals, and decisions are stored locally.</p>
          <button className="btn-small secondary">Export Data</button>
          <button className="btn-small danger">Delete All Data</button>
        </div>

        <div className="privacy-item">
          <h3>Performance Sharing</h3>
          <label>
            <input type="checkbox" defaultChecked />
            {' '}Allow sharing anonymized performance metrics for improvement
          </label>
        </div>
      </section>
    </div>
  );
}

export default Settings;
