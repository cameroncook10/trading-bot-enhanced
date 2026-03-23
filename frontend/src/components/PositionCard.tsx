import { Position } from '../types'
import { formatCurrency, formatPercent, getChangeColor, getConfidenceBg } from '../utils/formatting'

interface PositionCardProps {
  position: Position
  onClick?: () => void
}

export default function PositionCard({ position, onClick }: PositionCardProps) {
  const isLong = position.side === 'LONG'

  return (
    <div
      onClick={onClick}
      className="card-hover cursor-pointer"
    >
      <div className="flex items-start justify-between mb-4">
        <div>
          <div className="flex items-center space-x-2">
            <h3 className="text-lg font-bold text-dark-50">{position.symbol}</h3>
            <span className={`
              text-xs font-bold px-2 py-1 rounded
              ${isLong ? 'bg-success-500/10 text-success-500' : 'bg-danger-500/10 text-danger-500'}
            `}>
              {position.side}
            </span>
          </div>
          <p className="text-sm text-dark-400 mt-1">{position.quantity} shares</p>
        </div>
        <div className="text-right">
          <p className="text-xl font-bold text-dark-50">{formatCurrency(position.value)}</p>
          <p className={`text-sm font-medium ${getChangeColor(position.unrealized_pnl_percent)}`}>
            {formatPercent(position.unrealized_pnl_percent)}
          </p>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-4 mb-4 pb-4 border-b border-dark-700">
        <div>
          <p className="text-xs text-dark-400 mb-1">Entry</p>
          <p className="text-sm font-mono text-dark-50">${position.entry_price.toFixed(2)}</p>
        </div>
        <div>
          <p className="text-xs text-dark-400 mb-1">Current</p>
          <p className="text-sm font-mono text-dark-50">${position.current_price.toFixed(2)}</p>
        </div>
        <div>
          <p className="text-xs text-dark-400 mb-1">P&L</p>
          <p className={`text-sm font-mono ${getChangeColor(position.unrealized_pnl)}`}>
            {formatCurrency(position.unrealized_pnl)}
          </p>
        </div>
      </div>

      <div className="flex items-center justify-between">
        <span className="text-xs text-dark-400">Confidence</span>
        <div className="flex items-center space-x-2">
          <div className={`text-sm font-bold ${getConfidenceBg(position.confidence_score)} px-2 py-1 rounded`}>
            {position.confidence_score}%
          </div>
        </div>
      </div>
    </div>
  )
}
