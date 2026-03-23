import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { useBotStore } from './store/botStore';
import Navbar from './components/layout/Navbar';
import Sidebar from './components/layout/Sidebar';
import Dashboard from './pages/Dashboard';
import BotActivity from './pages/BotActivity';
import PredictionMarkets from './pages/PredictionMarkets';
import Portfolio from './pages/Portfolio';
import Signals from './pages/Signals';
import TradeHistory from './pages/TradeHistory';
import Settings from './pages/Settings';
import LearningHub from './pages/LearningHub';
import './styles/App.css';

function App() {
  const { initializeBot } = useBotStore();

  useEffect(() => {
    initializeBot();
  }, [initializeBot]);

  return (
    <Router>
      <div className="app-container dark-theme">
        <Navbar />
        <div className="main-content">
          <Sidebar />
          <main className="page-content">
            <Routes>
              <Route path="/" element={<Dashboard />} />
              <Route path="/bot-activity" element={<BotActivity />} />
              <Route path="/prediction-markets" element={<PredictionMarkets />} />
              <Route path="/portfolio" element={<Portfolio />} />
              <Route path="/signals" element={<Signals />} />
              <Route path="/trade-history" element={<TradeHistory />} />
              <Route path="/settings" element={<Settings />} />
              <Route path="/learning" element={<LearningHub />} />
            </Routes>
          </main>
        </div>
      </div>
    </Router>
  );
}

export default App;
