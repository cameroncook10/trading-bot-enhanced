import React, { useMemo, useCallback } from 'react';
import { formatDistanceToNow, format, isValid as isValidDate } from 'date-fns';
import { AlertCircle, TrendingUp, Zap, AlertTriangle } from 'lucide-react';
import '../styles/components.css';

function ActivityFeed({ activities = [] }) {
  // Validate activities array
  const validActivities = useMemo(() => {
    if (!Array.isArray(activities)) {
      console.warn('ActivityFeed received non-array activities');
      return [];
    }
    return activities.filter(activity => {
      if (!activity || !activity.id) {
        console.warn('Skipping invalid activity:', activity);
        return false;
      }
      if (activity.timestamp && !isValidDate(new Date(activity.timestamp))) {
        console.warn('Invalid timestamp for activity:', activity.id);
        return false;
      }
      return true;
    });
  }, [activities]);

  const getActivityIcon = useCallback((type) => {
    switch(type) {
      case 'signal':
        return <Zap size={16} />;
      case 'trade':
        return <TrendingUp size={16} />;
      case 'risk-alert':
      case 'pause':
      case 'resume':
        return <AlertTriangle size={16} />;
      default:
        return <AlertCircle size={16} />;
    }
  }, []);

  const getActivityColor = useCallback((severity) => {
    switch(severity) {
      case 'success':
        return '#10b981';
      case 'warning':
        return '#f59e0b';
      case 'error':
        return '#ef4444';
      default:
        return '#3b82f6';
    }
  }, []);

  const formatTime = useCallback((timestamp) => {
    try {
      const date = new Date(timestamp);
      return isValidDate(date) ? format(date, 'HH:mm:ss') : 'Invalid date';
    } catch (error) {
      console.error('Error formatting time:', error);
      return 'Invalid date';
    }
  }, []);

  if (validActivities.length === 0) {
    return (
      <div className="card activity-feed-card">
        <div className="card-header">
          <h3>Live Activity Feed</h3>
          <p className="card-subheader">Real-time bot actions in plain English</p>
        </div>
        <div style={{ padding: '20px', textAlign: 'center', color: '#94a3b8' }}>
          <p>No activities yet. Bot will appear here when it takes action.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="card activity-feed-card">
      <div className="card-header">
        <h3>Live Activity Feed</h3>
        <p className="card-subheader">Real-time bot actions in plain English</p>
      </div>

      <div className="activity-feed">
        {validActivities.map((activity) => (
          <div key={activity.id} className="activity-item">
            <div className="activity-icon" style={{ color: getActivityColor(activity.severity) }}>
              {getActivityIcon(activity.type)}
            </div>

            <div className="activity-content">
              <div className="activity-header">
                <span className="activity-time">
                  {formatTime(activity.timestamp)}
                </span>
                <span className="activity-badge">{activity.asset || 'System'}</span>
              </div>

              <p className="activity-message">
                <strong>{activity.message || 'No message'}</strong>
              </p>

              {activity.reasoning && (
                <p className="activity-reasoning">
                  {activity.reasoning}
                </p>
              )}
            </div>
          </div>
        ))}
      </div>

      <div className="activity-footer">
        <a href="#view-full-log">View Full Log →</a>
      </div>
    </div>
  );
}

export default ActivityFeed;
