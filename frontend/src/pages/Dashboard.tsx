import { useEffect, useState } from 'react'
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts'
import StatCard from '../components/StatCard'
import PositionCard from '../components/PositionCard'
import { useTradingData } from '../hooks/useTradingData'
import { formatCurrency, formatPercent, formatTimeAgo } from '../utils/formatting'

export default function Dashboard() {
  const { portfolio, positions, trades } = useTradingData()
  const [metrics, setMetrics] = useState<any[]>([])

  // Generate empty metrics array (will be populated as trades occur)
  useEffect(() => {
    // For now, show empty chart data until trades are made
    // In production, this would come from historical data
    setMetrics(Array.from({ length: 7 }, (_, i) => ({
      date: new Date(Date.now() - (6 - i) * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      total_pnl: 0,
      win_rate: 0,
      trades_executed: 0,
      avg_confidence: 0
    })))
  }, [])

  const recentTrades = trades.slice(0, 3)

  const COLORS = ['#14b8a6', '#3b82f6', '#8b5cf6', '#ec4899', '#f59e0b']

  return (
    <div className="space-y-8 animate-fade-in relative z-10">
      {/* Header */}
      <div className="mb-10">
        <h1 className="glow-text">Trading Dashboard</h1>
        <p className="text-dark-400 mt-2 text-lg">Real-time portfolio overview and trading activity</p>
      </div>

      {/* Key Metrics */}
      {portfolio && (
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
            value={positions.length.toString()}
            change={0}
            trend={positions.length > 0 ? 'up' : 'neutral'}
          />
          <StatCard
            label="Available Cash"
            value={formatCurrency(portfolio.cash_available)}
            change={0}
            trend="neutral"
          />
        </div>
      )}

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
          {portfolio && portfolio.allocation.length > 0 ? (
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
          ) : (
            <div className="h-[300px] flex items-center justify-center text-dark-400">
              <p>Starting with $50 USDC - No positions yet</p>
            </div>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Win Rate & Trade Stats */}
        <div className="card">
          <h2 className="text-xl font-bold text-dark-50 mb-6">Trade Statistics</h2>
          <div className="space-y-4">
            {trades.length > 0 ? (
              <>
                <div className="flex items-center justify-between p-4 bg-dark-950/50 border border-dark-800 rounded-xl transition-colors hover:border-dark-700">
                  <span className="text-dark-400 font-medium">Win Rate</span>
                  <span className="font-bold text-success-400 text-lg">
                    {trades.filter(t => (t.pnl || 0) > 0).length > 0
                      ? ((trades.filter(t => (t.pnl || 0) > 0).length / trades.length) * 100).toFixed(1)
                      : '0'}%
                  </span>
                </div>
                <div className="flex items-center justify-between p-4 bg-dark-950/50 border border-dark-800 rounded-xl transition-colors hover:border-dark-700">
                  <span className="text-dark-400 font-medium">Avg Confidence</span>
                  <span className="font-bold text-brand-400 text-lg">
                    {(trades.reduce((sum, t) => sum + (t.confidence || 0), 0) / trades.length).toFixed(1)}%
                  </span>
                </div>
                <div className="flex items-center justify-between p-4 bg-dark-950/50 border border-dark-800 rounded-xl transition-colors hover:border-dark-700">
                  <span className="text-dark-400 font-medium">Total Trades</span>
                  <span className="font-bold text-dark-50 text-lg">{trades.length}</span>
                </div>
                <div className="flex items-center justify-between p-4 bg-dark-950/50 border border-dark-800 rounded-xl transition-colors hover:border-dark-700">
                  <span className="text-dark-400 font-medium">Total P&L</span>
                  <span className={`font-bold text-lg ${portfolio && portfolio.total_pnl >= 0 ? 'text-success-400' : 'text-danger-400'}`}>
                    {formatCurrency(portfolio?.total_pnl || 0)}
                  </span>
                </div>
              </>
            ) : (
              <div className="text-center py-6 text-dark-400">
                <p className="text-lg font-medium">No trades yet</p>
                <p className="text-sm mt-1">Portfolio: {formatCurrency(portfolio?.total_value || 0)}</p>
              </div>
            )}
          </div>
        </div>

        {/* Recent Activity */}
        <div className="lg:col-span-2 card">
          <h2 className="text-xl font-bold text-dark-50 mb-6">Recent Activity</h2>
          {trades.length > 0 ? (
            <div className="space-y-4">
              {recentTrades.map((trade) => (
                <div key={trade.id} className="flex items-start space-x-4 p-4 bg-dark-950/40 border border-dark-800/50 rounded-xl hover:bg-dark-800 transition-colors">
                  <div className={`
                    w-2.5 h-2.5 rounded-full mt-1.5 flex-shrink-0
                    ${(trade.pnl || 0) >= 0 ? 'bg-success-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]' : 'bg-danger-500 shadow-[0_0_8px_rgba(244,63,94,0.5)]'}
                  `} />
                  <div className="flex-1 min-w-0">
                    <p className="text-base font-semibold text-dark-50 tracking-tight">{trade.symbol} - {trade.side}</p>
                    <p className="text-sm text-dark-400 mt-0.5">Entry: ${trade.entry_price.toFixed(2)} | Confidence: {trade.confidence}%</p>
                  <p className="text-xs text-dark-500 mt-2 font-mono">{formatTimeAgo(trade.entry_time)}</p>
                </div>
              </div>
            ))}
          </div>
          ) : (
            <div className="text-center py-8 text-dark-400">
              <p className="text-lg">No activity yet</p>
              <p className="text-sm mt-1">Activity will appear when trades are executed</p>
            </div>
          )}
        </div>
      </div>

      {/* Open Positions */}
      <div className="pt-4">
        <h2 className="text-2xl font-bold text-dark-50 mb-6 flex items-center">
          <span className="w-1.5 h-6 bg-brand-500 rounded-full mr-3 shadow-[0_0_8px_rgba(20,184,166,0.6)]"></span>
          Open Positions
        </h2>
        {positions.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {positions.map((position) => (
              <PositionCard
                key={position.id}
                position={position}
              />
            ))}
          </div>
        ) : (
          <div className="card text-center py-12">
            <p className="text-dark-400 text-lg">No positions yet</p>
            <p className="text-dark-500 text-sm mt-2">Positions will appear here after your first trade</p>
            <div className="mt-4 p-4 bg-dark-950/50 rounded-lg inline-block border border-dark-800">
              <p className="text-dark-300 text-sm font-mono">Portfolio: {formatCurrency(portfolio?.total_value || 0)}</p>
              <p className="text-dark-400 text-xs mt-1">Waiting for trading signals...</p>
            </div>
          </div>
        )}
      </div>

      {/* Recent Trades */}
      <div className="pt-4">
        <h2 className="text-2xl font-bold text-dark-50 mb-6 flex items-center">
          <span className="w-1.5 h-6 bg-accent-blue rounded-full mr-3 shadow-[0_0_8px_rgba(59,130,246,0.6)]"></span>
          Trade History
        </h2>
        {trades.length > 0 ? (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {trades.slice(0, 10).map((trade) => (
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
        ) : (
          <div className="card text-center py-12">
            <p className="text-dark-400 text-lg">No trades yet</p>
            <p className="text-dark-500 text-sm mt-2">Trade history will appear here once trades are executed</p>
          </div>
        )}
      </div>
    </div>
  )
}
