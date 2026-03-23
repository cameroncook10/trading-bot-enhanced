import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts'
import StatCard from '../components/StatCard'
import { mockPortfolio } from '../utils/mockData'
import { formatCurrency, getChangeColor } from '../utils/formatting'

export default function Portfolio() {
  const portfolio = mockPortfolio
  const COLORS = ['#0ea5e9', '#3b82f6', '#06b6d4', '#ec4899', '#f59e0b']

  // Prepare allocation data for bar chart
  const allocationData = portfolio.allocation.map(item => ({
    symbol: item.symbol,
    value: item.value,
    percent: item.percent,
  }))

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-4xl font-bold text-dark-50">Portfolio</h1>
        <p className="text-dark-400 mt-2">Detailed portfolio holdings and asset breakdown</p>
      </div>

      {/* Summary Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          label="Total Value"
          value={formatCurrency(portfolio.total_value)}
          change={portfolio.total_pnl_percent}
          trend={portfolio.total_pnl_percent >= 0 ? 'up' : 'down'}
        />
        <StatCard
          label="Total Invested"
          value={formatCurrency(portfolio.total_invested)}
        />
        <StatCard
          label="Realized P&L"
          value={formatCurrency(portfolio.total_pnl)}
          change={portfolio.total_pnl_percent}
          trend={portfolio.total_pnl >= 0 ? 'up' : 'down'}
        />
        <StatCard
          label="Cash Available"
          value={formatCurrency(portfolio.cash_available)}
        />
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Asset Allocation Pie Chart */}
        <div className="card">
          <h2 className="text-xl font-bold text-dark-50 mb-6">Asset Allocation</h2>
          <ResponsiveContainer width="100%" height={350}>
            <PieChart>
              <Pie
                data={portfolio.allocation}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ symbol, percent }) => `${symbol} ${percent.toFixed(0)}%`}
                outerRadius={100}
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

        {/* Allocation by Value */}
        <div className="card">
          <h2 className="text-xl font-bold text-dark-50 mb-6">Holdings by Value</h2>
          <ResponsiveContainer width="100%" height={350}>
            <BarChart data={allocationData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
              <XAxis dataKey="symbol" stroke="#6b7280" tick={{ fontSize: 12 }} />
              <YAxis stroke="#6b7280" tick={{ fontSize: 12 }} />
              <Tooltip
                contentStyle={{ backgroundColor: '#1f2937', border: '1px solid #374151' }}
                labelStyle={{ color: '#d1d5db' }}
                formatter={(value) => formatCurrency(value as number)}
              />
              <Bar dataKey="value" fill="#0ea5e9" radius={[8, 8, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Holdings Table */}
      <div className="card">
        <h2 className="text-xl font-bold text-dark-50 mb-6">Holdings Details</h2>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-dark-700">
                <th className="text-left py-3 px-4 text-dark-400 font-medium">Symbol</th>
                <th className="text-left py-3 px-4 text-dark-400 font-medium">Quantity</th>
                <th className="text-left py-3 px-4 text-dark-400 font-medium">Avg Price</th>
                <th className="text-left py-3 px-4 text-dark-400 font-medium">Current Price</th>
                <th className="text-left py-3 px-4 text-dark-400 font-medium">Value</th>
                <th className="text-left py-3 px-4 text-dark-400 font-medium">P&L</th>
                <th className="text-left py-3 px-4 text-dark-400 font-medium">% of Portfolio</th>
              </tr>
            </thead>
            <tbody>
              {portfolio.positions.map((position) => (
                <tr key={position.id} className="border-b border-dark-700 hover:bg-dark-700/50 transition-colors">
                  <td className="py-3 px-4 font-bold text-dark-50">{position.symbol}</td>
                  <td className="py-3 px-4 text-dark-300">{position.quantity}</td>
                  <td className="py-3 px-4 font-mono text-dark-300">${position.entry_price.toFixed(2)}</td>
                  <td className="py-3 px-4 font-mono text-dark-300">${position.current_price.toFixed(2)}</td>
                  <td className="py-3 px-4 font-bold text-dark-50">{formatCurrency(position.value)}</td>
                  <td className={`py-3 px-4 font-bold ${getChangeColor(position.unrealized_pnl)}`}>
                    {position.unrealized_pnl >= 0 ? '+' : ''}{formatCurrency(position.unrealized_pnl)}
                  </td>
                  <td className="py-3 px-4">
                    <div className="w-full bg-dark-700 rounded-full h-2">
                      <div
                        className="bg-gradient-accent h-2 rounded-full"
                        style={{ width: `${(position.value / portfolio.total_value) * 100}%` }}
                      />
                    </div>
                    <span className="text-xs text-dark-400 mt-1">
                      {((position.value / portfolio.total_value) * 100).toFixed(1)}%
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Performance Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="card">
          <h3 className="text-lg font-bold text-dark-50 mb-4">Risk Metrics</h3>
          <div className="space-y-3">
            <div className="flex items-center justify-between p-2 bg-dark-700/50 rounded">
              <span className="text-dark-400 text-sm">Sharpe Ratio</span>
              <span className="font-bold text-brand-400">2.34</span>
            </div>
            <div className="flex items-center justify-between p-2 bg-dark-700/50 rounded">
              <span className="text-dark-400 text-sm">Max Drawdown</span>
              <span className="font-bold text-danger-500">-8.2%</span>
            </div>
            <div className="flex items-center justify-between p-2 bg-dark-700/50 rounded">
              <span className="text-dark-400 text-sm">Volatility</span>
              <span className="font-bold text-warning-500">12.4%</span>
            </div>
          </div>
        </div>

        <div className="card">
          <h3 className="text-lg font-bold text-dark-50 mb-4">Concentration</h3>
          <div className="space-y-3">
            <div className="flex items-center justify-between p-2 bg-dark-700/50 rounded">
              <span className="text-dark-400 text-sm">Top Position</span>
              <span className="font-bold text-dark-50">21.4%</span>
            </div>
            <div className="flex items-center justify-between p-2 bg-dark-700/50 rounded">
              <span className="text-dark-400 text-sm">Top 3 Positions</span>
              <span className="font-bold text-dark-50">51.2%</span>
            </div>
            <div className="flex items-center justify-between p-2 bg-dark-700/50 rounded">
              <span className="text-dark-400 text-sm">Diversification</span>
              <span className="font-bold text-success-500">Good</span>
            </div>
          </div>
        </div>

        <div className="card">
          <h3 className="text-lg font-bold text-dark-50 mb-4">Beta & Correlation</h3>
          <div className="space-y-3">
            <div className="flex items-center justify-between p-2 bg-dark-700/50 rounded">
              <span className="text-dark-400 text-sm">Portfolio Beta</span>
              <span className="font-bold text-dark-50">1.15</span>
            </div>
            <div className="flex items-center justify-between p-2 bg-dark-700/50 rounded">
              <span className="text-dark-400 text-sm">Avg Correlation</span>
              <span className="font-bold text-dark-50">0.68</span>
            </div>
            <div className="flex items-center justify-between p-2 bg-dark-700/50 rounded">
              <span className="text-dark-400 text-sm">Hedge Positions</span>
              <span className="font-bold text-warning-500">None</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
