# Risk Control Framework

## Capital Preservation Rule
**Strict daily loss cap:** $5 hard limit. 
If the total portfolio P&L strictly breaches -$5 within a 24-hour trading window, the bot ceases all API-facing trading actions until the next UTC reset cycle and shifts to simulation mode.

## Position Sizing Rules
- Total active positions must not exceed $50 during the Phase 1 learning window.
- Avoid overleveraging on single highly-correlated market events.

## Warnings
Beware of imitation/HFT wrapper skills (like BankrBot and scam-level Polyclaw imitators). Our risk controls are strictly hard-coded in the trading validator to prevent uncontrolled arbitrage chasing.
