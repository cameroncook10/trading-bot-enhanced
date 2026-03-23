import { useState } from 'react'
import { mockTrades } from '../utils/mockData'
import { formatCurrency, formatPercent, formatTime } from '../utils/formatting'

export default function History() {
  const [filterStatus, setFilterStatus] = useState<'ALL' | 'OPEN' | 'CLOSED'>('ALL')
  const [sortBy, setSortBy] = useState<'date' | 'pnl' | 'confidence'>('date')

  const filteredTrades = mockTrades.filter(trade => {
    if (filterStatus === 'ALL') return true
    return trade.status === filterStatus
  })

  const sortedTrades = [...filteredTrades].sort((a, b) => {
    if (sortBy === 'date') {
      return new Date(b.entry_time).getTime() - new Date(a.entry_time).getTime()
    }
    if (sortBy === 'pnl' && a.pnl && b.pnl) {
      return b.pnl - a.pnl
    }
    if (sortBy === 'confidence') {
      return b.confidence - a.confidence
    }
    return 0
  })

  const stats = {
    total: mockTrades.length,
    open: mockTrades.filter(t => t.status === 'OPEN').length,
    closed: mockTrades.filter(t => t.status === 'CLOSED').length,
    winning: mockTrades.filter(t => t.pnl && t.pnl > 0).length,
    losing: mockTrades.filter(t => t.pnl && t.pnl < 0).length,
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-4xl font-bold text-dark-50">Trade History</h1>
        <p className="text-dark-400 mt-2">Complete record of all trades with entry, exit, and reasoning</p>
      </div>

      {/* Statistics */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        <div className="card">
          <p className="text-dark-400 text-sm mb-2">Total Trades</p>
          <p className="text-3xl font-bold text-brand-400">{stats.total}</p>
        </div>
        <div className="card">
          <p className="text-dark-400 text-sm mb-2">Open Trades</p>
          <p className="text-3xl font-bold text-blue-400">{stats.open}</p>
        </div>
        <div className="card">
          <p className="text-dark-400 text-sm mb-2">Closed Trades</p>
          <p className="text-3xl font-bold text-dark-400">{stats.closed}</p>
        </div>
        <div className="card">
          <p className="text-dark-400 text-sm mb-2">Winning Trades</p>
          <p className="text-3xl font-bold text-success-500">{stats.winning}</p>
        </div>
        <div className="card">
          <p className="text-dark-400 text-sm mb-2">Losing Trades</p>
          <p className="text-3xl font-bold text-danger-500">{stats.losing}</p>
        </div>
      </div>

      {/* Filters & Sort */}
      <div className="card">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => setFilterStatus('ALL')}
              className={`btn btn-sm ${
                filterStatus === 'ALL'
                  ? 'btn-primary'
                  : 'btn-secondary'
              }`}
            >
              All Trades
            </button>
            <button
              onClick={() => setFilterStatus('OPEN')}
              className={`btn btn-sm ${
                filterStatus === 'OPEN'
                  ? 'btn-primary'
                  : 'btn-secondary'
              }`}
            >
              Open
            </button>
            <button
              onClick={() => setFilterStatus('CLOSED')}
              className={`btn btn-sm ${
                filterStatus === 'CLOSED'
                  ? 'btn-primary'
                  : 'btn-secondary'
              }`}
            >
              Closed
            </button>
          </div>

          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as any)}
            className="select bg-dark-700 border-dark-600 text-dark-50 px-4 py-2 rounded-lg max-w-xs"
          >
            <option value="date">Sort by Date</option>
            <option value="pnl">Sort by P&L</option>
            <option value="confidence">Sort by Confidence</option>
          </select>
        </div>
      </div>

      {/* Trades Table */}
      <div className="card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-dark-700">
                <th className="text-left py-4 px-6 text-dark-400 font-medium">Symbol</th>
                <th className="text-left py-4 px-6 text-dark-400 font-medium">Side</th>
                <th className="text-left py-4 px-6 text-dark-400 font-medium">Entry Price</th>
                <th className="text-left py-4 px-6 text-dark-400 font-medium">Current</th>
                <th className="text-left py-4 px-6 text-dark-400 font-medium">Quantity</th>
                <th className="text-left py-4 px-6 text-dark-400 font-medium">Status</th>
                <th className="text-left py-4 px-6 text-dark-400 font-medium">P&L</th>
                <th className="text-left py-4 px-6 text-dark-400 font-medium">Confidence</th>
                <th className="text-left py-4 px-6 text-dark-400 font-medium">Entry Time</th>
              </tr>
            </thead>
            <tbody>
              {sortedTrades.map((trade) => (
                <tr
                  key={trade.id}
                  className="border-b border-dark-700 hover:bg-dark-700/30 transition-colors cursor-pointer group"
                >
                  <td className="py-4 px-6 font-bold text-dark-50">{trade.symbol}</td>
                  <td className="py-4 px-6">
                    <span className={`text-xs font-bold px-2 py-1 rounded ${
                      trade.side === 'LONG' ? 'bg-success-500/10 text-success-500' : 'bg-danger-500/10 text-danger-500'
                    }`}>
                      {trade.side}
                    </span>
                  </td>
                  <td className="py-4 px-6 font-mono text-dark-300">${trade.entry_price.toFixed(2)}</td>
                  <td className="py-4 px-6 font-mono text-dark-300">
                    {trade.status === 'CLOSED' ? '-' : `$${trade.current_price.toFixed(2)}`}
                  </td>
                  <td className="py-4 px-6 text-dark-300">{trade.quantity}</td>
                  <td className="py-4 px-6">
                    <span className={`text-xs font-bold px-2 py-1 rounded ${
                      trade.status === 'OPEN' ? 'bg-brand-500/10 text-brand-400' :
                      trade.status === 'CLOSED' ? 'bg-dark-600 text-dark-300' :
                      'bg-warning-500/10 text-warning-500'
                    }`}>
                      {trade.status}
                    </span>
                  </td>
                  <td className="py-4 px-6 font-bold">
                    {trade.pnl !== undefined ? (
                      <span className={trade.pnl >= 0 ? 'text-success-500' : 'text-danger-500'}>
                        {trade.pnl >= 0 ? '+' : ''}{formatCurrency(trade.pnl)} ({formatPercent(trade.pnl_percent || 0)})
                      </span>
                    ) : (
                      <span className="text-dark-400">-</span>
                    )}
                  </td>
                  <td className="py-4 px-6">
                    <div className="flex items-center space-x-2">
                      <div className="w-12 h-2 bg-dark-700 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-gradient-accent"
                          style={{ width: `${trade.confidence}%` }}
                        />
                      </div>
                      <span className="text-xs font-bold text-dark-400">{trade.confidence}%</span>
                    </div>
                  </td>
                  <td className="py-4 px-6 text-dark-400 text-xs">{formatTime(trade.entry_time)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Trade Details Modal-like View */}
      <div className="card">
        <h2 className="text-xl font-bold text-dark-50 mb-6">Trade Analysis</h2>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {sortedTrades.slice(0, 2).map((trade) => (
            <div key={trade.id} className="p-4 bg-dark-700/50 rounded-lg border border-dark-700">
              <div className="mb-4 pb-4 border-b border-dark-700">
                <h3 className="text-lg font-bold text-dark-50">{trade.symbol}</h3>
                <div className="flex items-center space-x-2 mt-2">
                  <span className={`text-xs font-bold px-2 py-1 rounded ${
                    trade.side === 'LONG' ? 'bg-success-500/10 text-success-500' : 'bg-danger-500/10 text-danger-500'
                  }`}>
                    {trade.side}
                  </span>
                  <span className={`text-xs font-bold px-2 py-1 rounded ${
                    trade.status === 'OPEN' ? 'bg-brand-500/10 text-brand-400' :
                    trade.status === 'CLOSED' ? 'bg-dark-600 text-dark-300' :
                    'bg-warning-500/10 text-warning-500'
                  }`}>
                    {trade.status}
                  </span>
                </div>
              </div>

              <div className="space-y-3">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-dark-400">Entry Price</span>
                  <span className="font-mono font-bold text-dark-50">${trade.entry_price.toFixed(2)}</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-dark-400">Current Price</span>
                  <span className="font-mono font-bold text-dark-50">
                    {trade.status === 'CLOSED' ? '-' : `$${trade.current_price.toFixed(2)}`}
                  </span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-dark-400">Quantity</span>
                  <span className="font-bold text-dark-50">{trade.quantity}</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-dark-400">Confidence</span>
                  <span className="font-bold text-brand-400">{trade.confidence}%</span>
                </div>
                <div className="pt-3 border-t border-dark-700">
                  <p className="text-xs text-dark-400 mb-2">REASONING</p>
                  <p className="text-sm text-dark-300">{trade.reasoning}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
