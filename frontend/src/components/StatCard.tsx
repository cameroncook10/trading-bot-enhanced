import { ReactNode } from 'react'
import { getChangeColor } from '../utils/formatting'

interface StatCardProps {
  label: string
  value: string
  change?: number
  icon?: ReactNode
  className?: string
  trend?: 'up' | 'down' | 'neutral'
}

export default function StatCard({
  label,
  value,
  change,
  icon,
  className = '',
  trend = 'neutral',
}: StatCardProps) {
  return (
    <div className={`stat-card ${className}`}>
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm text-dark-400 font-medium">{label}</p>
          <p className="text-2xl sm:text-3xl font-bold mt-2 text-dark-50">{value}</p>
        </div>
        {icon && (
          <div className="text-brand-500 opacity-60">
            {icon}
          </div>
        )}
      </div>

      {change !== undefined && (
        <div className={`mt-4 pt-4 border-t border-dark-700 flex items-center space-x-1 ${getChangeColor(change)}`}>
          {trend === 'up' && (
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 2l4.25 8.5h8.5l-6.875 5.5 2.625 8.5L12 19.5l-7.5 6L7.125 17 .25 11.5h8.5L12 2z" />
            </svg>
          )}
          {trend === 'down' && (
            <svg className="w-4 h-4 rotate-180" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 2l4.25 8.5h8.5l-6.875 5.5 2.625 8.5L12 19.5l-7.5 6L7.125 17 .25 11.5h8.5L12 2z" />
            </svg>
          )}
          <span className="text-sm font-medium">{change > 0 ? '+' : ''}{change.toFixed(2)}%</span>
        </div>
      )}
    </div>
  )
}
