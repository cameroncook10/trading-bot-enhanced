import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts'
import StatCard from '../components/StatCard'
import PositionCard from '../components/PositionCard'
import { mockPortfolio, mockTrades, mockPerformanceMetrics, mockTradeLogs } from '../utils/mockData'
import { formatCurrency, formatPercent, formatTimeAgo } from '../utils/formatting'

export default function Dashboard() {

  const portfolio = mockPortfolio
  const recentTrades = mockTrades.slice(0, 3)
  const metrics = mockPerformanceMetrics.slice(-7)
  const recentLogs = mockTradeLogs.slice(0, 3)

  const COLORS = ['#0ea5e9', '#3b82f6', '#06b6d4', '#ec4899', '#f59e0b']

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-4xl font-bold text-dark-50">Trading Dashboard</h1>
        <p className="text-dark-400 mt-2">Real-time portfolio overview and trading activity</p>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          label="Total Portfolio Value"
          value={formatCurrency(portfolio.total_value)}
          change={portfolio.total_pnl_percent}
          trend={portfolio.total_pnl_percent >= 0 ? 'up' : 'down'}
          icon={
            <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 2c5.523 0 10 4.477 10 10s-4.477 10-10 10S2 17.523 2 12 6.477 2 12 2z" />
            </svg>
          }
        />
        <StatCard
          label="Unrealized P&L"
          value={formatCurrency(portfolio.total_pnl)}
          change={portfolio.total_pnl_percent}
          trend={portfolio.total_pnl >= 0 ? 'up' : 'down'}
        />
        <StatCard
          label="Open Positions"
          value={portfolio.positions.length.toString()}
          change={66.7}
          trend="up"
        />
        <StatCard
          label="Available Cash"
          value={formatCurrency(portfolio.cash_available)}
          change={12.5}
          trend="up"
        />
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Performance Chart */}
        <div className="lg:col-span-2 card">
          <h2 className="text-xl font-bold text-dark-50 mb-6">7-Day Performance</h2>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={metrics}>
              <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
              <XAxis
                dataKey="date"
                stroke="#6b7280"
                tick={{ fontSize: 12 }}
                tickFormatter={(date) => date.slice(-2)}
              />
              <YAxis stroke="#6b7280" tick={{ fontSize: 12 }} />
              <Tooltip
                contentStyle={{ backgroundColor: '#1f2937', border: '1px solid #374151' }}
                labelStyle={{ color: '#d1d5db' }}
              />
              <Legend />
              <Line
                type="monotone"
                dataKey="total_pnl"
                stroke="#0ea5e9"
                strokeWidth={2}
                dot={{ fill: '#0ea5e9', r: 4 }}
                activeDot={{ r: 6 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Portfolio Allocation */}
        <div className="card">
          <h2 className="text-xl font-bold text-dark-50 mb-6">Asset Allocation</h2>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={portfolio.allocation}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ symbol, percent }) => `${symbol} ${percent.toFixed(0)}%`}
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
              >
                {portfolio.allocation.map((_, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip formatter={(value) => formatCurrency(value as number)} />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Win Rate & Trade Stats */}
        <div className="card">
          <h2 className="text-xl font-bold text-dark-50 mb-6">Trade Statistics</h2>
          <div className="space-y-4">
            <div className="flex items-center justify-between p-3 bg-dark-700/50 rounded-lg">
              <span className="text-dark-400">Win Rate</span>
              <span className="font-bold text-success-500">62.5%</span>
            </div>
            <div className="flex items-center justify-between p-3 bg-dark-700/50 rounded-lg">
              <span className="text-dark-400">Avg Confidence</span>
              <span className="font-bold text-brand-400">78.3%</span>
            </div>
            <div className="flex items-center justify-between p-3 bg-dark-700/50 rounded-lg">
              <span className="text-dark-400">Trades This Week</span>
              <span className="font-bold text-dark-50">14</span>
            </div>
            <div className="flex items-center justify-between p-3 bg-dark-700/50 rounded-lg">
              <span className="text-dark-400">Largest Win</span>
              <span className="font-bold text-success-500">+$1,245</span>
            </div>
          </div>
        </div>

        {/* Recent Activity */}
        <div className="lg:col-span-2 card">
          <h2 className="text-xl font-bold text-dark-50 mb-6">Recent Activity</h2>
          <div className="space-y-3">
            {recentLogs.map((log) => (
              <div key={log.id} className="flex items-start space-x-3 p-3 bg-dark-700/50 rounded-lg">
                <div className={`
                  w-2 h-2 rounded-full mt-2 flex-shrink-0
                  ${log.level === 'SUCCESS' ? 'bg-success-500' : ''}
                  ${log.level === 'INFO' ? 'bg-brand-500' : ''}
                  ${log.level === 'WARNING' ? 'bg-warning-500' : ''}
                  ${log.level === 'ERROR' ? 'bg-danger-500' : ''}
                `} />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-dark-50">{log.action}</p>
                  <p className="text-xs text-dark-400">{log.details}</p>
                  <p className="text-xs text-dark-500 mt-1">{formatTimeAgo(log.timestamp)}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Open Positions */}
      <div>
        <h2 className="text-2xl font-bold text-dark-50 mb-4">Open Positions</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {portfolio.positions.map((position) => (
            <PositionCard
              key={position.id}
              position={position}
            />
          ))}
        </div>
      </div>

      {/* Recent Trades */}
      <div>
        <h2 className="text-2xl font-bold text-dark-50 mb-4">Recent Trades</h2>
        <div className="space-y-3">
          {recentTrades.map((trade) => (
            <div key={trade.id} className="card-hover cursor-pointer">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center space-x-3 mb-2">
                    <h3 className="font-bold text-dark-50">{trade.symbol}</h3>
                    <span className={`
                      text-xs font-bold px-2 py-1 rounded
                      ${trade.side === 'LONG' ? 'bg-success-500/10 text-success-500' : 'bg-danger-500/10 text-danger-500'}
                    `}>
                      {trade.side}
                    </span>
                    <span className={`
                      text-xs font-bold px-2 py-1 rounded
                      ${trade.status === 'OPEN' ? 'bg-brand-500/10 text-brand-400' : 'bg-dark-700 text-dark-400'}
                    `}>
                      {trade.status}
                    </span>
                  </div>
                  <p className="text-sm text-dark-400">{trade.reasoning}</p>
                </div>
                <div className="text-right ml-4">
                  <p className="font-mono text-dark-50 text-sm">Entry: ${trade.entry_price.toFixed(2)}</p>
                  {trade.pnl !== undefined && (
                    <p className={`font-bold text-sm ${trade.pnl >= 0 ? 'text-success-500' : 'text-danger-500'}`}>
                      {trade.pnl >= 0 ? '+' : ''}{formatPercent(trade.pnl_percent || 0)}
                    </p>
                  )}
                  <p className="text-xs text-dark-400 mt-1">
                    Confidence: {trade.confidence}%
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
