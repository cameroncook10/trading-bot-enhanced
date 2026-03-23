import React from 'react';
import { formatDistanceToNow } from 'date-fns';
import TooltipHelper from '../TooltipHelper';
import '../../styles/components.css';

function BotStatus({ status, lastDecisionTime }) {
  const statusColor = {
    online: '#10b981',
    offline: '#ef4444',
    paused: '#f59e0b'
  }[status] || '#6b7280';

  return (
    <div className="card bot-status-card">
      <div className="card-header">
        <h3>
          Bot Status
          <TooltipHelper text="Real-time bot operational status and decision timestamp" />
        </h3>
      </div>
      
      <div className="status-content">
        <div className="status-indicator">
          <div 
            className="status-dot"
            style={{ backgroundColor: statusColor }}
          ></div>
          <span className="status-text">{status.toUpperCase()}</span>
        </div>

        <div className="status-detail">
          <label>Last Decision</label>
          <p>{formatDistanceToNow(lastDecisionTime, { addSuffix: true })}</p>
        </div>

        <div className="status-actions">
          <button className={`btn-small ${status === 'paused' ? 'primary' : 'secondary'}`}>
            {status === 'paused' ? 'Resume' : 'Pause'}
          </button>
          <button className="btn-small secondary">Logs</button>
        </div>
      </div>
    </div>
  );
}

export default BotStatus;
