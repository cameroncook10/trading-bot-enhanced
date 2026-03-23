import { mockTradeLogs, mockPerformanceMetrics } from '../utils/mockData'
import { formatTimeAgo } from '../utils/formatting'
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts'

export default function Activity() {
  const logs = mockTradeLogs
  const metrics = mockPerformanceMetrics.slice(-14)

  const getLevelColor = (level: string) => {
    switch (level) {
      case 'SUCCESS':
        return 'bg-success-500/10 text-success-500'
      case 'INFO':
        return 'bg-brand-500/10 text-brand-400'
      case 'WARNING':
        return 'bg-warning-500/10 text-warning-500'
      case 'ERROR':
        return 'bg-danger-500/10 text-danger-500'
      default:
        return 'bg-dark-700 text-dark-400'
    }
  }

  const getLevelIcon = (level: string) => {
    switch (level) {
      case 'SUCCESS':
        return '✓'
      case 'INFO':
        return 'ℹ'
      case 'WARNING':
        return '⚠'
      case 'ERROR':
        return '✕'
      default:
        return '•'
    }
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-4xl font-bold text-dark-50">Bot Activity</h1>
        <p className="text-dark-400 mt-2">Real-time trading logs and bot decision-making reasoning</p>
      </div>

      {/* Performance Trend */}
      <div className="card">
        <h2 className="text-xl font-bold text-dark-50 mb-6">Activity Trend (14 days)</h2>
        <ResponsiveContainer width="100%" height={350}>
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
              dataKey="trades_executed"
              stroke="#0ea5e9"
              strokeWidth={2}
              dot={{ fill: '#0ea5e9', r: 3 }}
              name="Trades Executed"
            />
            <Line
              yAxisId="right"
              type="monotone"
              dataKey="win_rate"
              stroke="#22c55e"
              strokeWidth={2}
              dot={{ fill: '#22c55e', r: 3 }}
              name="Win Rate %"
            />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* Activity Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="card">
          <p className="text-dark-400 text-sm mb-2">Trades Today</p>
          <p className="text-3xl font-bold text-brand-400">8</p>
          <p className="text-xs text-dark-400 mt-2">4 wins, 2 losses, 2 pending</p>
        </div>
        <div className="card">
          <p className="text-dark-400 text-sm mb-2">Decision Confidence</p>
          <p className="text-3xl font-bold text-success-500">78.4%</p>
          <p className="text-xs text-dark-400 mt-2">Average across all trades</p>
        </div>
        <div className="card">
          <p className="text-dark-400 text-sm mb-2">Avg Response Time</p>
          <p className="text-3xl font-bold text-warning-500">2.3s</p>
          <p className="text-xs text-dark-400 mt-2">Since last signal</p>
        </div>
        <div className="card">
          <p className="text-dark-400 text-sm mb-2">System Status</p>
          <div className="flex items-center space-x-2 mt-2">
            <div className="w-3 h-3 bg-success-500 rounded-full animate-pulse"></div>
            <p className="text-lg font-bold text-success-500">Running</p>
          </div>
          <p className="text-xs text-dark-400 mt-2">0 errors</p>
        </div>
      </div>

      {/* Live Activity Log */}
      <div className="card">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold text-dark-50">Live Activity Log</h2>
          <div className="flex items-center space-x-2">
            <div className="w-2 h-2 bg-success-500 rounded-full animate-pulse"></div>
            <span className="text-xs text-success-500 font-medium">LIVE</span>
          </div>
        </div>

        <div className="space-y-3 max-h-[600px] overflow-y-auto">
          {logs.map((log) => (
            <div
              key={log.id}
              className={`p-4 rounded-lg border border-dark-700 transition-all hover:border-brand-600/30 ${
                log.level === 'ERROR' ? 'bg-danger-500/5' : 'bg-dark-700/30'
              }`}
            >
              <div className="flex items-start space-x-4">
                {/* Level Badge */}
                <div className={`px-2 py-1 rounded text-xs font-bold flex items-center justify-center w-12 h-12 ${getLevelColor(log.level)}`}>
                  {getLevelIcon(log.level)}
                </div>

                {/* Content */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between">
                    <div>
                      <h3 className="font-bold text-dark-50">{log.action}</h3>
                      <p className="text-dark-400 text-sm mt-1">{log.details}</p>
                    </div>
                    <span className="text-xs text-dark-400 whitespace-nowrap ml-4">
                      {formatTimeAgo(log.timestamp)}
                    </span>
                  </div>

                  {/* Reasoning */}
                  {log.reasoning && (
                    <div className="mt-3 p-3 bg-dark-900/50 rounded border border-dark-700 text-xs text-dark-300">
                      <p className="font-mono">{log.reasoning}</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Decision Making Details */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Last Trade Analysis */}
        <div className="card">
          <h2 className="text-xl font-bold text-dark-50 mb-4">Last Trade Analysis</h2>
          <div className="space-y-4">
            <div className="p-3 bg-dark-700/50 rounded-lg">
              <p className="text-xs text-dark-400 mb-1">SYMBOL</p>
              <p className="font-bold text-dark-50">AAPL</p>
            </div>
            <div className="p-3 bg-dark-700/50 rounded-lg">
              <p className="text-xs text-dark-400 mb-1">DECISION</p>
              <p className="font-bold text-success-500">BUY</p>
            </div>
            <div className="p-3 bg-dark-700/50 rounded-lg">
              <p className="text-xs text-dark-400 mb-1">CONFIDENCE</p>
              <div className="flex items-center space-x-2 mt-1">
                <div className="flex-1 h-2 bg-dark-900 rounded-full overflow-hidden">
                  <div className="h-full w-4/5 bg-gradient-accent rounded-full"></div>
                </div>
                <span className="font-bold text-brand-400">87%</span>
              </div>
            </div>
            <div className="p-3 bg-dark-700/50 rounded-lg">
              <p className="text-xs text-dark-400 mb-1">REASONING</p>
              <p className="text-sm text-dark-300 mt-1">Golden cross detected with strong volume confirmation. RSI shows oversold recovery signal.</p>
            </div>
          </div>
        </div>

        {/* Model Performance */}
        <div className="card">
          <h2 className="text-xl font-bold text-dark-50 mb-4">Model Performance</h2>
          <div className="space-y-4">
            <div className="p-3 bg-dark-700/50 rounded-lg">
              <p className="text-xs text-dark-400 mb-2">PREDICTION ACCURACY</p>
              <div className="flex items-center space-x-2">
                <div className="flex-1 h-2 bg-dark-900 rounded-full overflow-hidden">
                  <div className="h-full w-3/4 bg-success-500 rounded-full"></div>
                </div>
                <span className="font-bold text-success-500">74%</span>
              </div>
            </div>
            <div className="p-3 bg-dark-700/50 rounded-lg">
              <p className="text-xs text-dark-400 mb-2">SIGNAL QUALITY</p>
              <div className="flex items-center space-x-2">
                <div className="flex-1 h-2 bg-dark-900 rounded-full overflow-hidden">
                  <div className="h-full w-4/5 bg-brand-500 rounded-full"></div>
                </div>
                <span className="font-bold text-brand-400">81%</span>
              </div>
            </div>
            <div className="p-3 bg-dark-700/50 rounded-lg">
              <p className="text-xs text-dark-400 mb-2">EXECUTION TIME</p>
              <p className="font-bold text-dark-50">2.3s average</p>
              <p className="text-xs text-dark-400 mt-1">From signal to execution</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
