import { mockSignals } from '../utils/mockData'
import { getBadgeColor } from '../utils/formatting'

export default function Signals() {
  const signals = mockSignals

  const getStrengthColor = (strength: string) => {
    switch (strength) {
      case 'STRONG':
        return 'text-success-500'
      case 'MODERATE':
        return 'text-warning-500'
      case 'WEAK':
        return 'text-danger-500'
      default:
        return 'text-dark-400'
    }
  }

  const getSentimentColor = (value: number) => {
    if (value > 50) return 'text-success-500'
    if (value > 0) return 'text-warning-500'
    if (value > -50) return 'text-danger-500'
    return 'text-danger-600'
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-4xl font-bold text-dark-50">Market Signals</h1>
        <p className="text-dark-400 mt-2">Real-time trading signals and sentiment analysis</p>
      </div>

      {/* Signal Summary */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="card">
          <p className="text-dark-400 text-sm mb-2">Total Signals</p>
          <p className="text-3xl font-bold text-brand-400">{signals.length}</p>
          <p className="text-xs text-dark-400 mt-2">Last 24 hours</p>
        </div>
        <div className="card">
          <p className="text-dark-400 text-sm mb-2">Buy Signals</p>
          <p className="text-3xl font-bold text-success-500">1</p>
          <p className="text-xs text-dark-400 mt-2">Strong conviction</p>
        </div>
        <div className="card">
          <p className="text-dark-400 text-sm mb-2">Sell Signals</p>
          <p className="text-3xl font-bold text-danger-500">1</p>
          <p className="text-xs text-dark-400 mt-2">Moderate conviction</p>
        </div>
        <div className="card">
          <p className="text-dark-400 text-sm mb-2">Avg Confidence</p>
          <p className="text-3xl font-bold text-warning-500">73.7%</p>
          <p className="text-xs text-dark-400 mt-2">All signals</p>
        </div>
      </div>

      {/* Signals List */}
      <div className="space-y-4">
        {signals.map((signal) => (
          <div key={signal.id} className="card-hover cursor-pointer">
            {/* Header */}
            <div className="flex items-start justify-between mb-6 pb-4 border-b border-dark-700">
              <div>
                <div className="flex items-center space-x-3">
                  <h3 className="text-2xl font-bold text-dark-50">{signal.symbol}</h3>
                  <span className={`badge ${getBadgeColor(signal.type)}`}>
                    {signal.type}
                  </span>
                  <span className={`text-xs font-bold px-3 py-1 rounded ${getStrengthColor(signal.strength)} border ${
                    signal.strength === 'STRONG' ? 'border-success-500/30 bg-success-500/10' :
                    signal.strength === 'MODERATE' ? 'border-warning-500/30 bg-warning-500/10' :
                    'border-danger-500/30 bg-danger-500/10'
                  }`}>
                    {signal.strength}
                  </span>
                </div>
                <p className="text-sm text-dark-400 mt-2">
                  Generated {new Date(signal.generated_at).toLocaleTimeString()}
                </p>
              </div>
              <div className="text-right">
                <p className="text-sm text-dark-400 mb-1">Confidence</p>
                <div className="flex items-center space-x-2">
                  <div className="w-24 h-2 bg-dark-700 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-gradient-accent rounded-full"
                      style={{ width: `${signal.confidence}%` }}
                    />
                  </div>
                  <span className="font-bold text-brand-400 text-sm">{signal.confidence}%</span>
                </div>
              </div>
            </div>

            {/* Indicators */}
            <div className="mb-6 pb-6 border-b border-dark-700">
              <h4 className="text-sm font-bold text-dark-400 mb-3 uppercase">Technical Indicators</h4>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                {signal.indicators.map((indicator, idx) => (
                  <div key={idx} className="p-3 bg-dark-700/50 rounded-lg">
                    <p className="text-xs text-dark-400 mb-2">{indicator.name}</p>
                    <div className="flex items-center justify-between">
                      <p className="font-mono font-bold text-dark-50">{indicator.value}</p>
                      <span className={`text-xs font-bold px-2 py-1 rounded ${
                        indicator.signal === 'bullish' ? 'bg-success-500/10 text-success-500' :
                        indicator.signal === 'bearish' ? 'bg-danger-500/10 text-danger-500' :
                        'bg-dark-600 text-dark-300'
                      }`}>
                        {indicator.signal === 'bullish' ? '↑' : indicator.signal === 'bearish' ? '↓' : '→'}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Sentiment Analysis */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <p className="text-xs text-dark-400 mb-2 uppercase font-bold">Social Sentiment</p>
                <div className="flex items-center space-x-3">
                  <div className="flex-1">
                    <div className="w-full h-3 bg-dark-700 rounded-full overflow-hidden">
                      <div
                        className={`h-full ${signal.sentiment.social > 0 ? 'bg-success-500' : 'bg-danger-500'}`}
                        style={{ width: `${50 + signal.sentiment.social / 2}%` }}
                      />
                    </div>
                  </div>
                  <span className={`font-bold text-sm ${getSentimentColor(signal.sentiment.social)}`}>
                    {signal.sentiment.social > 0 ? '+' : ''}{signal.sentiment.social}
                  </span>
                </div>
              </div>
              <div>
                <p className="text-xs text-dark-400 mb-2 uppercase font-bold">News Sentiment</p>
                <div className="flex items-center space-x-3">
                  <div className="flex-1">
                    <div className="w-full h-3 bg-dark-700 rounded-full overflow-hidden">
                      <div
                        className={`h-full ${signal.sentiment.news > 0 ? 'bg-success-500' : 'bg-danger-500'}`}
                        style={{ width: `${50 + signal.sentiment.news / 2}%` }}
                      />
                    </div>
                  </div>
                  <span className={`font-bold text-sm ${getSentimentColor(signal.sentiment.news)}`}>
                    {signal.sentiment.news > 0 ? '+' : ''}{signal.sentiment.news}
                  </span>
                </div>
              </div>
              <div>
                <p className="text-xs text-dark-400 mb-2 uppercase font-bold">Technical Sentiment</p>
                <div className="flex items-center space-x-3">
                  <div className="flex-1">
                    <div className="w-full h-3 bg-dark-700 rounded-full overflow-hidden">
                      <div
                        className={`h-full ${signal.sentiment.technical > 0 ? 'bg-success-500' : 'bg-danger-500'}`}
                        style={{ width: `${50 + signal.sentiment.technical / 2}%` }}
                      />
                    </div>
                  </div>
                  <span className={`font-bold text-sm ${getSentimentColor(signal.sentiment.technical)}`}>
                    {signal.sentiment.technical > 0 ? '+' : ''}{signal.sentiment.technical}
                  </span>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Market Overview */}
      <div className="card">
        <h2 className="text-xl font-bold text-dark-50 mb-6">Market Overview</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="p-4 bg-dark-700/50 rounded-lg">
            <p className="text-sm text-dark-400 mb-3">Market Trend</p>
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-success-500 rounded-full"></div>
              <span className="font-bold text-dark-50">Bullish</span>
            </div>
            <p className="text-xs text-dark-400 mt-2">Strong upward momentum</p>
          </div>
          <div className="p-4 bg-dark-700/50 rounded-lg">
            <p className="text-sm text-dark-400 mb-3">Volatility Index</p>
            <p className="font-bold text-warning-500 text-lg">28.4</p>
            <p className="text-xs text-dark-400 mt-2">Elevated volatility</p>
          </div>
          <div className="p-4 bg-dark-700/50 rounded-lg">
            <p className="text-sm text-dark-400 mb-3">Market Sentiment</p>
            <p className="font-bold text-success-500">+62%</p>
            <p className="text-xs text-dark-400 mt-2">Positive overall</p>
          </div>
        </div>
      </div>
    </div>
  )
}
