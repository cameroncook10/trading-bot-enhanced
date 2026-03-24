# Polymarket Trading Strategy

## Core Philosophy
We do not compete on speed. The 2.7-second arbitrage window is dominated by HFT bots with <100ms execution. Our edge is pure directional prediction using an XGBoost + LLM (Claude) hybrid model.

## Sizing & Risk Management (Kelly Criterion)
- **Position Sizing:** We employ the Kelly Criterion framework tailored to our historically backtested 62.5% win rate.
- **Order Types:** Always default to Maker orders (0% fee) over Taker orders (1.56% fee) whenever liquidity thresholds are met, granting a ~4% monthly structural advantage for smaller account tiers.

## Market Mechanics
- **Liquidity Preferences:** Focus on low-volume, medium-cap markets heavily weighted toward human sentiment, dodging major HFT hunting grounds.
- **Sample Trades:** Predictive analysis on geopolitical/macro events rather than high-frequency sporting arbitrage.
