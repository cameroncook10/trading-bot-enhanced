import React, { useState } from 'react';
import { useBotStore } from '../store/botStore';
import BotStatus from '../components/dashboard/BotStatus';
import PortfolioOverview from '../components/dashboard/PortfolioOverview';
import TodayActivity from '../components/dashboard/TodayActivity';
import UpcomingEvents from '../components/dashboard/UpcomingEvents';
import LastTrades from '../components/dashboard/LastTrades';
import RiskGauge from '../components/dashboard/RiskGauge';
import ActivityFeed from '../components/ActivityFeed';
import LearningPanel from '../components/LearningPanel';
import '../styles/Dashboard.css';

function Dashboard() {
  const {
    botStatus,
    lastDecisionTime,
    portfolio,
    positions,
    trades,
    activities,
    predictionMarkets,
    portfolioHeat
  } = useBotStore();

  const [selectedItem, setSelectedItem] = useState(null);

  return (
    <div className="dashboard">
      <div className="dashboard-grid">
        <div className="dashboard-main">
          {/* Top Row: Status & Key Metrics */}
          <div className="top-row">
            <BotStatus status={botStatus} lastDecisionTime={lastDecisionTime} />
            <PortfolioOverview portfolio={portfolio} />
            <RiskGauge heat={portfolioHeat} positions={positions} />
          </div>

          {/* Middle Row: Activity Stats */}
          <div className="middle-row">
            <TodayActivity trades={trades} signals={trades} />
            <UpcomingEvents markets={predictionMarkets} />
          </div>

          {/* Bottom Row: Recent Activity */}
          <div className="bottom-row">
            <LastTrades trades={trades.slice(0, 5)} />
          </div>

          {/* Full Width: Activity Feed */}
          <div className="activity-section">
            <ActivityFeed activities={activities} />
          </div>
        </div>

        {/* Right Sidebar: Learning Hub */}
        <aside className="learning-sidebar">
          <LearningPanel selectedItem={selectedItem} />
        </aside>
      </div>
    </div>
  );
}

export default Dashboard;
