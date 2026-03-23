import React, { useState } from 'react';
import { ChevronDown } from 'lucide-react';
import '../styles/components.css';

function LearningPanel({ selectedItem }) {
  const [expandedSections, setExpandedSections] = useState({});

  const toggleSection = (id) => {
    setExpandedSections(prev => ({
      ...prev,
      [id]: !prev[id]
    }));
  };

  const sections = [
    {
      id: 'prediction-market',
      title: '💡 What\'s a Prediction Market?',
      content: 'A prediction market is like betting on future events. Instead of traditional betting, people trade shares based on the likelihood of something happening. For example: "Will Bitcoin be above $45K by March 31?" If you buy YES shares at $0.72, you\'re saying "I think there\'s a 72% chance this happens." If you\'re right, you win. It\'s a way for Cam to leverage her forecasting skills for profit.'
    },
    {
      id: 'how-bot-works',
      title: '🤖 How Does This Bot Work?',
      content: 'The bot watches crypto markets 24/7 using Opus (Claude\'s reasoning model). It analyzes technical indicators (RSI, MACD), on-chain data (whale movements), and sentiment. When it spots a high-confidence setup, it generates a signal. You can: 1) Let it auto-trade, 2) Approve before trading, or 3) Override and skip the trade. Everything is logged so you can learn.'
    },
    {
      id: 'signal-meanings',
      title: '📊 What Do Signals Mean?',
      content: 'Signals are opportunities the bot found. Green signals = bot very confident (80%+). Yellow = moderate confidence (60-80%). Red = caution or sell signal. Each signal shows: what it sees, why it matters, confidence level, and how much of your portfolio to risk. You don\'t have to follow signals—you can always skip or modify them.'
    },
    {
      id: 'risk-explained',
      title: '⚠️ Your Risk Level Explained',
      content: 'Conservative: Max 5% per trade, perfect for learning. Moderate: Max 10% per trade, balanced. Aggressive: Max 15% per trade, high growth potential. Higher = more potential profit but bigger losses. All modes use paper trading first so you can practice without real money. Choose based on how comfortable you are with loss.'
    },
    {
      id: 'crypto-basics',
      title: '₿ Crypto Basics (What You Need)',
      content: 'Bitcoin (BTC) = digital gold, most stable crypto. Ethereum (ETH) = smart contract platform, more volatile. Altcoins = newer coins, higher risk/reward. Key terms: Long = bet price goes up. Short = bet price goes down. Liquidation = losing all position value. HODLing = holding long-term. Do NOT invest money you can\'t afford to lose.'
    },
    {
      id: 'dashboard-tour',
      title: '🎯 Understanding Your Dashboard',
      content: 'Top: Bot status and portfolio overview. Middle: Today\'s stats and upcoming events. Bottom: Recent trades with full reasoning. Right panel: Learning hub (you are here!). Click on any trade to see exactly why Opus made it. Use tooltips (? icons) to learn more about any metric.'
    }
  ];

  return (
    <div className="learning-panel">
      <div className="panel-header">
        <h2>📚 Learning Hub</h2>
        <p>Everything explained simply</p>
      </div>

      <div className="learning-sections">
        {sections.map((section) => (
          <div key={section.id} className="learning-section">
            <button 
              className="section-header"
              onClick={() => toggleSection(section.id)}
            >
              <span>{section.title}</span>
              <ChevronDown 
                size={18} 
                className={`chevron ${expandedSections[section.id] ? 'expanded' : ''}`}
              />
            </button>

            {expandedSections[section.id] && (
              <div className="section-content">
                {section.content}
              </div>
            )}
          </div>
        ))}
      </div>

      <div className="panel-footer">
        <p className="hint">💬 Hover over (?) icons throughout the app for more tips</p>
      </div>
    </div>
  );
}

export default LearningPanel;
