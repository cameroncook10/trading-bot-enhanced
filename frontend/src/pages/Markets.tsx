export default function Markets() {
  const markets = [
    {
      id: '1',
      name: 'Polymarket',
      status: 'connected',
      lastSync: '2 minutes ago',
      markets: 156,
      volume24h: '$12.5M',
    },
    {
      id: '2',
      name: 'Manifold Markets',
      status: 'connected',
      lastSync: '5 minutes ago',
      markets: 89,
      volume24h: '$3.2M',
    },
  ]

  const topMarkets = [
    {
      id: '1',
      title: 'Will BTC reach $100K by EOY?',
      platform: 'Polymarket',
      probability: 72,
      volume: '$2.3M',
      status: 'ACTIVE',
    },
    {
      id: '2',
      title: 'Will Fed cut rates in next meeting?',
      platform: 'Manifold',
      probability: 45,
      volume: '$450K',
      status: 'ACTIVE',
    },
    {
      id: '3',
      title: 'S&P 500 closes above 5500 today?',
      platform: 'Polymarket',
      probability: 68,
      volume: '$1.8M',
      status: 'ACTIVE',
    },
    {
      id: '4',
      title: 'Inflation CPI > 3% next print?',
      platform: 'Manifold',
      probability: 38,
      volume: '$220K',
      status: 'ACTIVE',
    },
  ]

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-4xl font-bold text-dark-50">Prediction Markets</h1>
        <p className="text-dark-400 mt-2">Polymarket and Manifold Markets integration</p>
      </div>

      {/* Platform Status */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {markets.map((market) => (
          <div key={market.id} className="card">
            <div className="flex items-start justify-between mb-4">
              <h3 className="text-xl font-bold text-dark-50">{market.name}</h3>
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 bg-success-500 rounded-full animate-pulse"></div>
                <span className="text-xs font-bold text-success-500 uppercase">Connected</span>
              </div>
            </div>

            <div className="space-y-3">
              <div className="flex items-center justify-between p-3 bg-dark-700/50 rounded-lg">
                <span className="text-dark-400 text-sm">Active Markets</span>
                <span className="font-bold text-dark-50">{market.markets}</span>
              </div>
              <div className="flex items-center justify-between p-3 bg-dark-700/50 rounded-lg">
                <span className="text-dark-400 text-sm">24h Volume</span>
                <span className="font-bold text-brand-400">{market.volume24h}</span>
              </div>
              <div className="flex items-center justify-between p-3 bg-dark-700/50 rounded-lg">
                <span className="text-dark-400 text-sm">Last Sync</span>
                <span className="font-mono text-dark-300 text-sm">{market.lastSync}</span>
              </div>
              <button className="w-full btn btn-secondary mt-4">
                View Markets
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Top Markets */}
      <div className="card">
        <h2 className="text-xl font-bold text-dark-50 mb-6">Top Markets by Volume</h2>
        <div className="space-y-4">
          {topMarkets.map((market) => (
            <div
              key={market.id}
              className="p-4 bg-dark-700/50 rounded-lg border border-dark-700 hover:border-brand-600/30 hover:bg-dark-700/80 transition-all cursor-pointer"
            >
              <div className="flex items-start justify-between mb-3">
                <div className="flex-1">
                  <h3 className="font-bold text-dark-50 text-lg">{market.title}</h3>
                  <p className="text-xs text-dark-400 mt-1">{market.platform}</p>
                </div>
                <span className="badge badge-success">{market.status}</span>
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div>
                  <p className="text-xs text-dark-400 mb-1">Probability</p>
                  <div className="flex items-center space-x-2">
                    <div className="flex-1 h-2 bg-dark-900 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-gradient-accent"
                        style={{ width: `${market.probability}%` }}
                      />
                    </div>
                    <span className="font-bold text-brand-400 text-sm">{market.probability}%</span>
                  </div>
                </div>
                <div>
                  <p className="text-xs text-dark-400 mb-1">Volume</p>
                  <p className="font-bold text-dark-50">{market.volume}</p>
                </div>
                <div className="text-right">
                  <button className="btn btn-sm btn-secondary">
                    Trade
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Market Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="card">
          <p className="text-dark-400 text-sm mb-2">Total Markets</p>
          <p className="text-3xl font-bold text-brand-400">245</p>
          <p className="text-xs text-dark-400 mt-2">Across all platforms</p>
        </div>
        <div className="card">
          <p className="text-dark-400 text-sm mb-2">Total Volume</p>
          <p className="text-3xl font-bold text-success-500">$15.7M</p>
          <p className="text-xs text-dark-400 mt-2">24 hour volume</p>
        </div>
        <div className="card">
          <p className="text-dark-400 text-sm mb-2">Avg Probability</p>
          <p className="text-3xl font-bold text-warning-500">54%</p>
          <p className="text-xs text-dark-400 mt-2">All markets</p>
        </div>
        <div className="card">
          <p className="text-dark-400 text-sm mb-2">Bot Positions</p>
          <p className="text-3xl font-bold text-blue-400">8</p>
          <p className="text-xs text-dark-400 mt-2">Active bets</p>
        </div>
      </div>

      {/* Bot Positions in Markets */}
      <div className="card">
        <h2 className="text-xl font-bold text-dark-50 mb-6">Bot Positions</h2>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-dark-700">
                <th className="text-left py-3 px-4 text-dark-400 font-medium">Market</th>
                <th className="text-left py-3 px-4 text-dark-400 font-medium">Platform</th>
                <th className="text-left py-3 px-4 text-dark-400 font-medium">Position</th>
                <th className="text-left py-3 px-4 text-dark-400 font-medium">Entry Price</th>
                <th className="text-left py-3 px-4 text-dark-400 font-medium">Current Value</th>
                <th className="text-left py-3 px-4 text-dark-400 font-medium">P&L</th>
              </tr>
            </thead>
            <tbody>
              {topMarkets.slice(0, 3).map((market) => (
                <tr key={market.id} className="border-b border-dark-700 hover:bg-dark-700/30 transition-colors">
                  <td className="py-3 px-4 text-dark-50">{market.title}</td>
                  <td className="py-3 px-4 text-dark-400 text-sm">{market.platform}</td>
                  <td className="py-3 px-4">
                    <span className="badge badge-success">YES</span>
                  </td>
                  <td className="py-3 px-4 font-mono text-dark-300">$0.42</td>
                  <td className="py-3 px-4 font-bold text-dark-50">$520</td>
                  <td className="py-3 px-4 font-bold text-success-500">+$85 (+19.3%)</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Market Insights */}
      <div className="card">
        <h2 className="text-xl font-bold text-dark-50 mb-6">Market Insights</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="p-4 bg-dark-700/50 rounded-lg">
            <p className="text-sm text-dark-400 mb-3 font-bold">Most Bullish Market</p>
            <p className="text-dark-50">Will BTC reach $100K by EOY?</p>
            <p className="text-success-500 font-bold mt-2">72% probability</p>
          </div>
          <div className="p-4 bg-dark-700/50 rounded-lg">
            <p className="text-sm text-dark-400 mb-3 font-bold">Most Bearish Market</p>
            <p className="text-dark-50">Inflation CPI &gt; 3% next print?</p>
            <p className="text-danger-500 font-bold mt-2">38% probability</p>
          </div>
          <div className="p-4 bg-dark-700/50 rounded-lg">
            <p className="text-sm text-dark-400 mb-3 font-bold">Highest Volume</p>
            <p className="text-dark-50">Will BTC reach $100K by EOY?</p>
            <p className="text-brand-400 font-bold mt-2">$2.3M volume</p>
          </div>
        </div>
      </div>
    </div>
  )
}
