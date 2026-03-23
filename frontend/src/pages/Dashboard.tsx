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

  const COLORS = ['#14b8a6', '#3b82f6', '#8b5cf6', '#ec4899', '#f59e0b']

  return (
    <div className="space-y-8 animate-fade-in relative z-10">
      {/* Header */}
      <div className="mb-10">
        <h1 className="glow-text">Trading Dashboard</h1>
        <p className="text-dark-400 mt-2 text-lg">Real-time portfolio overview and trading activity</p>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          label="Total Portfolio Value"
          value={formatCurrency(portfolio.total_value)}
          change={portfolio.total_pnl_percent}
          trend={portfolio.total_pnl_percent >= 0 ? 'up' : 'down'}
          icon={
            <div className="p-3 bg-brand-500/10 rounded-lg border border-brand-500/20">
              <svg className="w-6 h-6 text-brand-400" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 2c5.523 0 10 4.477 10 10s-4.477 10-10 10S2 17.523 2 12 6.477 2 12 2z" />
              </svg>
            </div>
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
              <CartesianGrid strokeDasharray="3 3" stroke="#334155" opacity={0.4} />
              <XAxis
                dataKey="date"
                stroke="#64748b"
                tick={{ fontSize: 12 }}
                tickFormatter={(date) => date.slice(-2)}
                axisLine={false}
                tickLine={false}
                dy={10}
              />
              <YAxis 
                stroke="#64748b" 
                tick={{ fontSize: 12 }} 
                axisLine={false}
                tickLine={false}
                dx={-10}
              />
              <Tooltip
                contentStyle={{ backgroundColor: '#0f172a', border: '1px solid #1e293b', borderRadius: '0.5rem', boxShadow: '0 4px 20px rgba(0,0,0,0.5)' }}
                labelStyle={{ color: '#e2e8f0', fontWeight: 'bold', marginBottom: '4px' }}
                itemStyle={{ color: '#14b8a6' }}
              />
              <Legend wrapperStyle={{ paddingTop: '20px' }} />
              <Line
                name="Total P&L"
                type="monotone"
                dataKey="total_pnl"
                stroke="#14b8a6"
                strokeWidth={3}
                dot={{ fill: '#0f172a', stroke: '#14b8a6', strokeWidth: 2, r: 4 }}
                activeDot={{ fill: '#14b8a6', stroke: '#fff', strokeWidth: 2, r: 6 }}
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
                label={({ symbol, percent }) => `${symbol} ${(percent * 100).toFixed(0)}%`}
                outerRadius={90}
                innerRadius={60}
                fill="#8884d8"
                dataKey="value"
                stroke="#0f172a"
                strokeWidth={4}
              >
                {portfolio.allocation.map((_, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip 
                formatter={(value) => formatCurrency(value as number)} 
                contentStyle={{ backgroundColor: '#0f172a', border: '1px solid #1e293b', borderRadius: '0.5rem' }}
              />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Win Rate & Trade Stats */}
        <div className="card">
          <h2 className="text-xl font-bold text-dark-50 mb-6">Trade Statistics</h2>
          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 bg-dark-950/50 border border-dark-800 rounded-xl transition-colors hover:border-dark-700">
              <span className="text-dark-400 font-medium">Win Rate</span>
              <span className="font-bold text-success-400 text-lg">62.5%</span>
            </div>
            <div className="flex items-center justify-between p-4 bg-dark-950/50 border border-dark-800 rounded-xl transition-colors hover:border-dark-700">
              <span className="text-dark-400 font-medium">Avg Confidence</span>
              <span className="font-bold text-brand-400 text-lg">78.3%</span>
            </div>
            <div className="flex items-center justify-between p-4 bg-dark-950/50 border border-dark-800 rounded-xl transition-colors hover:border-dark-700">
              <span className="text-dark-400 font-medium">Trades This Week</span>
              <span className="font-bold text-dark-50 text-lg">14</span>
            </div>
            <div className="flex items-center justify-between p-4 bg-dark-950/50 border border-dark-800 rounded-xl transition-colors hover:border-dark-700">
              <span className="text-dark-400 font-medium">Largest Win</span>
              <span className="font-bold text-success-400 text-lg">+$1,245</span>
            </div>
          </div>
        </div>

        {/* Recent Activity */}
        <div className="lg:col-span-2 card">
          <h2 className="text-xl font-bold text-dark-50 mb-6">Recent Activity</h2>
          <div className="space-y-4">
            {recentLogs.map((log) => (
              <div key={log.id} className="flex items-start space-x-4 p-4 bg-dark-950/40 border border-dark-800/50 rounded-xl hover:bg-dark-800 transition-colors">
                <div className={`
                  w-2.5 h-2.5 rounded-full mt-1.5 flex-shrink-0
                  ${log.level === 'SUCCESS' ? 'bg-success-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]' : ''}
                  ${log.level === 'INFO' ? 'bg-brand-500 shadow-[0_0_8px_rgba(20,184,166,0.5)]' : ''}
                  ${log.level === 'WARNING' ? 'bg-warning-500 shadow-[0_0_8px_rgba(245,158,11,0.5)]' : ''}
                  ${log.level === 'ERROR' ? 'bg-danger-500 shadow-[0_0_8px_rgba(244,63,94,0.5)]' : ''}
                `} />
                <div className="flex-1 min-w-0">
                  <p className="text-base font-semibold text-dark-50 tracking-tight">{log.action}</p>
                  <p className="text-sm text-dark-400 mt-0.5">{log.details}</p>
                  <p className="text-xs text-dark-500 mt-2 font-mono">{formatTimeAgo(log.timestamp)}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Open Positions */}
      <div className="pt-4">
        <h2 className="text-2xl font-bold text-dark-50 mb-6 flex items-center">
          <span className="w-1.5 h-6 bg-brand-500 rounded-full mr-3 shadow-[0_0_8px_rgba(20,184,166,0.6)]"></span>
          Open Positions
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {portfolio.positions.map((position) => (
            <PositionCard
              key={position.id}
              position={position}
            />
          ))}
        </div>
      </div>

      {/* Recent Trades */}
      <div className="pt-4">
        <h2 className="text-2xl font-bold text-dark-50 mb-6 flex items-center">
          <span className="w-1.5 h-6 bg-accent-blue rounded-full mr-3 shadow-[0_0_8px_rgba(59,130,246,0.6)]"></span>
          Recent Trades
        </h2>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {recentTrades.map((trade) => (
            <div key={trade.id} className="card-hover cursor-pointer p-5">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center space-x-3 mb-3">
                    <h3 className="font-bold text-lg text-dark-50">{trade.symbol}</h3>
                    <span className={`
                      badge ${trade.side === 'LONG' ? 'badge-success' : 'badge-danger'}
                    `}>
                      {trade.side}
                    </span>
                    <span className={`
                      badge ${trade.status === 'OPEN' ? 'badge-info' : 'bg-dark-800 text-dark-400 border border-dark-700'}
                    `}>
                      {trade.status}
                    </span>
                  </div>
                  <p className="text-sm text-dark-300 leading-relaxed">{trade.reasoning}</p>
                </div>
                <div className="text-right ml-6 flex flex-col items-end">
                  <span className="text-xs text-dark-400 mb-1 uppercase tracking-wider font-semibold">Entry Price</span>
                  <p className="font-mono text-dark-100 mb-3">${trade.entry_price.toFixed(2)}</p>
                  
                  {trade.pnl !== undefined && (
                    <div className={`px-3 py-1.5 rounded-lg border flex flex-col items-end min-w-[80px]
                      ${trade.pnl >= 0 ? 'bg-success-500/10 border-success-500/20 text-success-400' : 'bg-danger-500/10 border-danger-500/20 text-danger-400'}
                    `}>
                      <span className="text-[10px] uppercase font-bold opacity-70 mb-0.5">P&L</span>
                      <p className="font-bold text-sm">
                        {trade.pnl >= 0 ? '+' : ''}{formatPercent(trade.pnl_percent || 0)}
                      </p>
                    </div>
                  )}
                  <p className="text-xs text-dark-500 mt-3 font-medium">
                    Conf: {trade.confidence}%
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
