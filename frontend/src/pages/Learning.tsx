import { mockLearnings, mockPerformanceMetrics } from '../utils/mockData'
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts'

export default function Learning() {
  const metrics = mockPerformanceMetrics.slice(-30)

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-4xl font-bold text-dark-50">Learning Hub</h1>
        <p className="text-dark-400 mt-2">Past performance review and lessons learned</p>
      </div>

      {/* Performance Summary */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="card">
          <p className="text-dark-400 text-sm mb-2">Win Rate (30d)</p>
          <p className="text-3xl font-bold text-success-500">62.4%</p>
          <p className="text-xs text-dark-400 mt-2">+2.1% vs. previous month</p>
        </div>
        <div className="card">
          <p className="text-dark-400 text-sm mb-2">Avg Trade P&L</p>
          <p className="text-3xl font-bold text-brand-400">+$284</p>
          <p className="text-xs text-dark-400 mt-2">Per winning trade</p>
        </div>
        <div className="card">
          <p className="text-dark-400 text-sm mb-2">Profit Factor</p>
          <p className="text-3xl font-bold text-success-500">1.82</p>
          <p className="text-xs text-dark-400 mt-2">Wins / Losses ratio</p>
        </div>
        <div className="card">
          <p className="text-dark-400 text-sm mb-2">Risk/Reward Ratio</p>
          <p className="text-3xl font-bold text-warning-500">1:2.3</p>
          <p className="text-xs text-dark-400 mt-2">Average trade</p>
        </div>
      </div>

      {/* Performance Chart */}
      <div className="card">
        <h2 className="text-xl font-bold text-dark-50 mb-6">30-Day Performance</h2>
        <ResponsiveContainer width="100%" height={400}>
          <LineChart data={metrics}>
            <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
            <XAxis
              dataKey="date"
              stroke="#6b7280"
              tick={{ fontSize: 12 }}
              tickFormatter={(date) => date.slice(-2)}
            />
            <YAxis yAxisId="left" stroke="#6b7280" tick={{ fontSize: 12 }} />
            <YAxis yAxisId="right" orientation="right" stroke="#6b7280" tick={{ fontSize: 12 }} />
            <Tooltip
              contentStyle={{ backgroundColor: '#1f2937', border: '1px solid #374151' }}
              labelStyle={{ color: '#d1d5db' }}
            />
            <Legend />
            <Line
              yAxisId="left"
              type="monotone"
              dataKey="total_pnl"
              stroke="#0ea5e9"
              strokeWidth={2}
              name="Daily P&L ($)"
              dot={false}
            />
            <Line
              yAxisId="right"
              type="monotone"
              dataKey="win_rate"
              stroke="#22c55e"
              strokeWidth={2}
              name="Win Rate %"
              dot={false}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* Key Learnings */}
      <div>
        <h2 className="text-2xl font-bold text-dark-50 mb-4">Key Learnings</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {mockLearnings.map((learning) => (
            <div key={learning.id} className="card">
              <div className="flex items-start justify-between mb-3">
                <div>
                  <span className={`text-xs font-bold px-3 py-1 rounded ${
                    learning.category === 'Risk Management' ? 'bg-danger-500/10 text-danger-500' :
                    learning.category === 'Market Events' ? 'bg-warning-500/10 text-warning-500' :
                    'bg-brand-500/10 text-brand-400'
                  }`}>
                    {learning.category}
                  </span>
                  <p className="text-xs text-dark-400 mt-2">{learning.date}</p>
                </div>
              </div>

              <h3 className="font-bold text-dark-50 mb-2">{learning.lesson}</h3>
              <p className="text-sm text-dark-400">{learning.impact}</p>

              <div className="mt-4 pt-4 border-t border-dark-700 flex items-center justify-between">
                <span className="text-xs text-dark-400">Impact Score</span>
                <div className="w-16 h-2 bg-dark-700 rounded-full overflow-hidden">
                  <div className="h-full w-3/4 bg-success-500 rounded-full"></div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Performance by Category */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="card">
          <h2 className="text-xl font-bold text-dark-50 mb-6">Performance by Trade Type</h2>
          <div className="space-y-4">
            <div className="p-3 bg-dark-700/50 rounded-lg">
              <div className="flex items-center justify-between mb-2">
                <span className="text-dark-400 text-sm">Long Trades</span>
                <span className="font-bold text-dark-50">68% win rate</span>
              </div>
              <div className="w-full h-2 bg-dark-900 rounded-full overflow-hidden">
                <div className="h-full w-3/4 bg-success-500 rounded-full"></div>
              </div>
            </div>
            <div className="p-3 bg-dark-700/50 rounded-lg">
              <div className="flex items-center justify-between mb-2">
                <span className="text-dark-400 text-sm">Short Trades</span>
                <span className="font-bold text-dark-50">54% win rate</span>
              </div>
              <div className="w-full h-2 bg-dark-900 rounded-full overflow-hidden">
                <div className="h-full w-1/2 bg-warning-500 rounded-full"></div>
              </div>
            </div>
            <div className="p-3 bg-dark-700/50 rounded-lg">
              <div className="flex items-center justify-between mb-2">
                <span className="text-dark-400 text-sm">Swing Trades</span>
                <span className="font-bold text-dark-50">72% win rate</span>
              </div>
              <div className="w-full h-2 bg-dark-900 rounded-full overflow-hidden">
                <div className="h-full w-4/5 bg-success-500 rounded-full"></div>
              </div>
            </div>
            <div className="p-3 bg-dark-700/50 rounded-lg">
              <div className="flex items-center justify-between mb-2">
                <span className="text-dark-400 text-sm">Day Trades</span>
                <span className="font-bold text-dark-50">58% win rate</span>
              </div>
              <div className="w-full h-2 bg-dark-900 rounded-full overflow-hidden">
                <div className="h-full w-3/5 bg-warning-500 rounded-full"></div>
              </div>
            </div>
          </div>
        </div>

        <div className="card">
          <h2 className="text-xl font-bold text-dark-50 mb-6">Improvement Areas</h2>
          <div className="space-y-3">
            <div className="p-3 bg-danger-500/10 rounded-lg border border-danger-500/20">
              <p className="text-sm font-bold text-danger-500 mb-1">⚠ Reduce Overtrading</p>
              <p className="text-xs text-dark-400">Avoid trading when confidence &lt; 60%</p>
            </div>
            <div className="p-3 bg-warning-500/10 rounded-lg border border-warning-500/20">
              <p className="text-sm font-bold text-warning-500 mb-1">⚡ Improve Entry Timing</p>
              <p className="text-xs text-dark-400">5% avg gain vs 8% potential per trade</p>
            </div>
            <div className="p-3 bg-brand-500/10 rounded-lg border border-brand-500/20">
              <p className="text-sm font-bold text-brand-400 mb-1">📊 Better Risk Management</p>
              <p className="text-xs text-dark-400">Max drawdown still 8.2%, target 5%</p>
            </div>
            <div className="p-3 bg-success-500/10 rounded-lg border border-success-500/20">
              <p className="text-sm font-bold text-success-500 mb-1">✓ Strong Pattern Recognition</p>
              <p className="text-xs text-dark-400">Technical signals 78% accuracy</p>
            </div>
          </div>
        </div>
      </div>

      {/* Strategy Performance */}
      <div className="card">
        <h2 className="text-xl font-bold text-dark-50 mb-6">Strategy Performance Analysis</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="p-4 bg-dark-700/50 rounded-lg">
            <p className="text-dark-400 text-sm mb-3 font-bold">Most Profitable</p>
            <p className="text-lg font-bold text-dark-50">Golden Cross</p>
            <p className="text-success-500 font-bold">+$3,240 YTD</p>
            <p className="text-xs text-dark-400 mt-2">67% win rate | 42 trades</p>
          </div>
          <div className="p-4 bg-dark-700/50 rounded-lg">
            <p className="text-dark-400 text-sm mb-3 font-bold">Most Consistent</p>
            <p className="text-lg font-bold text-dark-50">Mean Reversion</p>
            <p className="text-brand-400 font-bold">+$1,850 YTD</p>
            <p className="text-xs text-dark-400 mt-2">71% win rate | 28 trades</p>
          </div>
          <div className="p-4 bg-dark-700/50 rounded-lg">
            <p className="text-dark-400 text-sm mb-3 font-bold">Needs Improvement</p>
            <p className="text-lg font-bold text-dark-50">Breakout Trading</p>
            <p className="text-warning-500 font-bold">+$420 YTD</p>
            <p className="text-xs text-dark-400 mt-2">52% win rate | 35 trades</p>
          </div>
        </div>
      </div>

      {/* Recommendations */}
      <div className="card">
        <h2 className="text-xl font-bold text-dark-50 mb-4">AI Recommendations</h2>
        <ul className="space-y-2">
          <li className="flex items-start space-x-3 p-2">
            <span className="text-success-500 font-bold mt-1">✓</span>
            <span className="text-dark-300">Focus 80% of capital on Golden Cross strategy—highest ROI</span>
          </li>
          <li className="flex items-start space-x-3 p-2">
            <span className="text-warning-500 font-bold mt-1">⚠</span>
            <span className="text-dark-300">Reduce position size on low-confidence trades (&lt; 60%)</span>
          </li>
          <li className="flex items-start space-x-3 p-2">
            <span className="text-brand-500 font-bold mt-1">→</span>
            <span className="text-dark-300">Implement tighter stops on breakout trades to reduce losses</span>
          </li>
          <li className="flex items-start space-x-3 p-2">
            <span className="text-success-500 font-bold mt-1">✓</span>
            <span className="text-dark-300">Continue sentiment analysis integration—adds 3% to accuracy</span>
          </li>
        </ul>
      </div>
    </div>
  )
}
