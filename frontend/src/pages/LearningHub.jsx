import React, { useState } from 'react';
import { ChevronDown } from 'lucide-react';
import '../styles/pages.css';

function LearningHub() {
  const [expandedSection, setExpandedSection] = useState(null);

  const sections = [
    {
      id: 'prediction-markets',
      title: '💡 What Are Prediction Markets?',
      content: `
        Prediction markets are like betting on future events, but traded like stocks. 
        
        Instead of traditional betting, people buy and sell shares based on the likelihood of something happening.
        
        Example: "Will Bitcoin be above $45K by March 31?"
        - If odds are 72%, people believe there's a 72% chance it happens
        - If you buy YES at $0.72 and you're right, you get $1.00
        - If you're wrong, you lose your $0.72
        
        Why they matter:
        - Markets aggregate smart money's predictions
        - You can profit from better forecasting than the crowd
        - Real money on the line = predictions are accurate
      `
    },
    {
      id: 'how-bot-works',
      title: '🤖 How Does This Bot Work?',
      content: `
        The bot watches crypto markets 24/7 using Claude Opus (Anthropic's reasoning model).
        
        Daily workflow:
        1. Collect data: Technical indicators, on-chain metrics, sentiment analysis
        2. Analyze: Opus evaluates market conditions using advanced reasoning
        3. Generate signals: If confidence > 60%, a signal is created
        4. Decide: You approve, modify, or skip the trade
        5. Execute: Trade is logged with full reasoning
        6. Track: Monitor position and update your learning
        
        Key metrics Opus watches:
        - RSI: Is the asset overbought/oversold?
        - MACD: Is momentum turning?
        - 200-day Moving Average: Is price above key support?
        - On-chain data: Are whales buying or selling?
        - Sentiment: What's the market feeling?
      `
    },
    {
      id: 'understanding-signals',
      title: '📊 Understanding Trading Signals',
      content: `
        A signal is the bot's recommendation to make a trade.
        
        Signal types:
        - BUY (Green): Bot thinks price will go up. Confidence: 60-100%
        - WAIT (Yellow): Bot is unsure. Watching for more confirmation.
        - SELL (Red): Bot thinks price will go down. Be cautious.
        
        Confidence score:
        - 80%+: Very confident. Opus saw multiple positive signals.
        - 60-80%: Moderate confidence. Good setup, some uncertainty.
        - <60%: Low confidence. Skip this one.
        
        What to do:
        - Green 85%+: Strong signal. Consider executing.
        - Yellow: Wait for more data or skip.
        - Red or low confidence: Skip. No need to force it.
        
        Remember: You can ALWAYS override the bot. If you don't like a signal, skip it.
      `
    },
    {
      id: 'risk-management',
      title: '⚠️ Risk Management Explained',
      content: `
        Risk management is the #1 rule of trading. It's how you survive losses.
        
        Three risk modes:
        
        CONSERVATIVE (Learning mode):
        - Max 5% per trade
        - Paper trading only
        - Stop loss at -5% daily
        - Perfect for: Learning without money risk
        
        MODERATE (Balanced):
        - Max 10% per trade
        - Paper trading option
        - Stop loss at -10% daily
        - Perfect for: Testing your strategy with real dynamics
        
        AGGRESSIVE (Growth):
        - Max 15% per trade
        - Paper trading available
        - Stop loss at -15% daily
        - Perfect for: Experienced traders confident in the system
        
        What each setting means:
        - Position size: How much of your portfolio to risk per trade
        - Paper trading: Simulated trades with real prices (no real money)
        - Daily stop: Bot auto-pauses if you lose this % in a day
        
        Rule of thumb: If you're new to trading, start CONSERVATIVE.
      `
    },
    {
      id: 'crypto-basics',
      title: '₿ Crypto Basics (Must Know)',
      content: `
        Bitcoin (BTC):
        - The original cryptocurrency
        - Often called "digital gold"
        - Most stable, least volatile
        - Market cap: ~$1 trillion
        - Use it as a baseline for crypto market sentiment
        
        Ethereum (ETH):
        - "Smart contract" blockchain
        - More volatile than Bitcoin
        - Used for DeFi, NFTs, and decentralized apps
        - Second-largest crypto by market cap
        
        Altcoins:
        - Any crypto other than Bitcoin/Ethereum
        - Higher risk, higher potential reward
        - Many are speculative
        - Easier to manipulate due to lower liquidity
        
        Essential concepts:
        - LONG: You bet the price will go UP
        - SHORT: You bet the price will go DOWN
        - LIQUIDATION: You lose all your position value (only in leverage trading)
        - HODL: Hold long-term, don't panic sell
        - VOLUME: How much people are trading. Higher = more reliable signals.
        
        Safety first:
        - Only invest money you can afford to LOSE
        - Crypto is volatile. 20% moves in a day are normal.
        - Never use leverage unless you know what you're doing
        - Diversify across multiple assets
      `
    },
    {
      id: 'understanding-dashboard',
      title: '🎯 Understanding Your Dashboard',
      content: `
        Dashboard sections:
        
        TOP ROW:
        - Bot Status: Is the bot online? When did it last decide?
        - Portfolio Overview: Total value, P&L, win rate
        - Risk Gauge: How much heat are you exposed to? Green/Yellow/Red
        
        MIDDLE ROW:
        - Today's Activity: Trades made, signals generated, decisions
        - Upcoming Events: Prediction market events the bot watches
        
        BOTTOM ROW:
        - Last 5 Trades: Recent trades with full reasoning
        - Activity Feed: Real-time log of everything happening
        
        RIGHT SIDEBAR:
        - Learning Hub: Collapsible educational content (you are here)
        
        How to use it:
        1. Check bot status first (is it working?)
        2. Look at portfolio overview (am I making money?)
        3. Read the activity feed (what just happened?)
        4. Click on trades to see reasoning (why did the bot do that?)
        5. Check upcoming events (what should I watch tomorrow?)
      `
    },
    {
      id: 'reading-odds',
      title: '🎲 How to Read Prediction Market Odds',
      content: `
        Odds represent the market's probability of an event happening.
        
        If odds are 72%:
        - Market thinks 72% chance the event happens
        - 28% chance it doesn't happen
        - If you buy YES at $0.72 and it happens, you get $1.00
        - Your profit: $1.00 - $0.72 = $0.28 (39% return)
        
        If odds are 30%:
        - Market thinks 30% chance (unlikely)
        - If you buy YES at $0.30 and it happens, you get $1.00
        - Your profit: $0.70 (233% return!)
        - But odds are against you—most likely you lose
        
        Reading trends:
        - Odds going UP: Market getting more bullish (more people betting YES)
        - Odds going DOWN: Market getting more bearish (more people betting NO)
        - Odds near 50%: Very uncertain market
        - Odds near 0% or 100%: Market is confident
        
        Pro tip:
        - Look for mispricing: When market odds don't match reality
        - Find edge: If you think 72% event has 80% chance, there's profit to make
        - Don't chase: Don't bet just because odds are high. Needs good reasoning.
      `
    },
    {
      id: 'trade-reasoning',
      title: '💭 Understanding Trade Reasoning',
      content: `
        Every trade shows "Opus Reasoning" - exactly why the bot made that trade.
        
        What you'll see:
        1. What data did Opus see? (RSI, MACD, on-chain, sentiment)
        2. How did it decide? (The logic chain)
        3. Alternative outcomes (What if it's wrong?)
        4. Historical accuracy (How often does this setup work?)
        5. Your override option (Can you say no?)
        
        Example reasoning:
        "RSI trending upward from oversold territory (currently 62). MACD histogram 
         turned positive. Price bounced off 200-day MA (support at $41,500). 
         On-chain data shows institutional accumulation. Market sentiment positive.
         Similar setups succeed 81% of the time."
        
        What this means:
        - Multiple positive signals aligned
        - Opus is quite confident (87%)
        - There's a clear stop loss point ($41,500)
        - History says this usually works
        
        How to use it:
        - High confidence (80%+) + good reasoning = probably good to execute
        - Low confidence (60%+) = wait for confirmation
        - Contradicting signals = risk. Maybe skip.
        - You disagree? You can OVERRIDE. The bot is not always right.
      `
    },
    {
      id: 'paper-trading',
      title: '📝 What is Paper Trading?',
      content: `
        Paper trading = simulated trading with REAL market prices.
        
        How it works:
        - Bot suggests a trade
        - You approve (or skip)
        - The trade is executed at current market price
        - But no real money changes hands
        - Your P&L is calculated real-time
        
        Why paper trade first:
        - Learn without risk: Lose paper money, not real money
        - Test the strategy: See if it actually works
        - Get comfortable: Build confidence before going live
        - Practice override: Learn when to say no to the bot
        
        The benefit:
        - You see exactly what would happen with real money
        - Prices are real (you're not practicing in a vacuum)
        - But losses don't hurt your bank account
        
        When to go live:
        - After 50+ paper trades
        - You understand the strategy
        - You've made consistent profits on paper
        - You're comfortable with the volatility
        - You can afford the potential losses
      `
    }
  ];

  return (
    <div className="page learning-hub-page">
      <div className="page-header">
        <h1>📚 Complete Learning Hub</h1>
        <p>Everything you need to know to trade like a pro</p>
      </div>

      <div className="learning-content">
        {sections.map((section) => (
          <div key={section.id} className="learning-section-card">
            <button 
              className="section-header-button"
              onClick={() => setExpandedSection(expandedSection === section.id ? null : section.id)}
            >
              <span className="section-title">{section.title}</span>
              <ChevronDown 
                size={20}
                className={`chevron ${expandedSection === section.id ? 'expanded' : ''}`}
              />
            </button>

            {expandedSection === section.id && (
              <div className="section-body">
                <p className="section-content">
                  {section.content.trim().split('\n').map((paragraph, idx) => (
                    <div key={idx} style={{ marginBottom: '12px' }}>
                      {paragraph}
                    </div>
                  ))}
                </p>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Quick Reference */}
      <section className="card quick-reference">
        <h2>🎓 Quick Reference Card</h2>
        <div className="reference-grid">
          <div className="reference-card">
            <h3>Signal Colors</h3>
            <p>🟢 GREEN = Buy (80%+ confidence)</p>
            <p>🟡 YELLOW = Wait (60-80%)</p>
            <p>🔴 RED = Sell/Caution (low confidence)</p>
          </div>

          <div className="reference-card">
            <h3>Risk Modes</h3>
            <p>📊 Conservative: 5% max per trade</p>
            <p>📊 Moderate: 10% max per trade</p>
            <p>📊 Aggressive: 15% max per trade</p>
          </div>

          <div className="reference-card">
            <h3>Golden Rules</h3>
            <p>✓ Only risk money you can lose</p>
            <p>✓ Diversify across 5-10 assets</p>
            <p>✓ Always use stop losses</p>
          </div>

          <div className="reference-card">
            <h3>Key Metrics</h3>
            <p>📈 RSI: <30 oversold, >70 overbought</p>
            <p>📈 MACD: Positive = uptrend</p>
            <p>📈 Win rate: 60%+ is excellent</p>
          </div>
        </div>
      </section>

      {/* Next Steps */}
      <section className="card next-steps">
        <h2>🚀 Getting Started</h2>
        <div className="steps-list">
          <div className="step">
            <span className="step-number">1</span>
            <div>
              <h3>Choose Risk Level</h3>
              <p>Go to Settings and pick Conservative/Moderate/Aggressive</p>
            </div>
          </div>

          <div className="step">
            <span className="step-number">2</span>
            <div>
              <h3>Watch the Dashboard</h3>
              <p>See the bot in action. Understand what's happening.</p>
            </div>
          </div>

          <div className="step">
            <span className="step-number">3</span>
            <div>
              <h3>Review Signals</h3>
              <p>Click on trades to see full reasoning. Learn the logic.</p>
            </div>
          </div>

          <div className="step">
            <span className="step-number">4</span>
            <div>
              <h3>Paper Trade</h3>
              <p>Let the bot trade simulated money. Build confidence.</p>
            </div>
          </div>

          <div className="step">
            <span className="step-number">5</span>
            <div>
              <h3>Go Live (Optional)</h3>
              <p>After 50+ winning paper trades, consider real money.</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

export default LearningHub;
