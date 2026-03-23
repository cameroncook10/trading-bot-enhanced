import React, { useEffect, Suspense, lazy } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { useBotStore } from './store/botStore';
import Navbar from './components/layout/Navbar';
import Sidebar from './components/layout/Sidebar';
import ErrorBoundary from './components/ErrorBoundary';
import './styles/App.css';

// Lazy load pages for better performance
// Code splitting ensures each page is only loaded when accessed
const Dashboard = lazy(() => import('./pages/Dashboard'));
const BotActivity = lazy(() => import('./pages/BotActivity'));
const PredictionMarkets = lazy(() => import('./pages/PredictionMarkets'));
const Portfolio = lazy(() => import('./pages/Portfolio'));
const Signals = lazy(() => import('./pages/Signals'));
const TradeHistory = lazy(() => import('./pages/TradeHistory'));
const Settings = lazy(() => import('./pages/Settings'));
const LearningHub = lazy(() => import('./pages/LearningHub'));

/**
 * Loading Fallback Component
 * Displayed while a page is loading
 */
const PageLoadingFallback = () => (
  <div style={{
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    height: '100vh',
    fontSize: '1rem',
    color: '#999'
  }}>
    <div style={{ textAlign: 'center' }}>
      <div style={{ fontSize: '2rem', marginBottom: '1rem' }}>⏳</div>
      <p>Loading page...</p>
    </div>
  </div>
);

function App() {
  const { initializeBot } = useBotStore();

  useEffect(() => {
    initializeBot();
  }, [initializeBot]);

  return (
    <ErrorBoundary>
      <Router>
        <div className="app-container dark-theme">
          <Navbar />
          <div className="main-content">
            <Sidebar />
            <main className="page-content">
              <Suspense fallback={<PageLoadingFallback />}>
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
              </Suspense>
            </main>
          </div>
        </div>
      </Router>
    </ErrorBoundary>
  );
}

export default App;
