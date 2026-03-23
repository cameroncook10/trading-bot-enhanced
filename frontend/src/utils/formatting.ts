export function formatCurrency(value: number): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(value)
}

export function formatPercent(value: number, decimals = 2): string {
  return `${(value >= 0 ? '+' : '')}${value.toFixed(decimals)}%`
}

export function formatPrice(value: number, decimals = 2): string {
  return value.toFixed(decimals)
}

export function formatLargeNumber(value: number): string {
  if (value >= 1000000) {
    return `${(value / 1000000).toFixed(2)}M`
  }
  if (value >= 1000) {
    return `${(value / 1000).toFixed(2)}K`
  }
  return value.toFixed(2)
}

export function getChangeColor(value: number): string {
  if (value > 0) return 'text-success-500'
  if (value < 0) return 'text-danger-500'
  return 'text-dark-400'
}

export function getBadgeColor(type: string): string {
  switch (type.toUpperCase()) {
    case 'BUY':
    case 'LONG':
    case 'SUCCESS':
      return 'badge-success'
    case 'SELL':
    case 'SHORT':
    case 'DANGER':
      return 'badge-danger'
    case 'HOLD':
    case 'WARNING':
      return 'badge-warning'
    default:
      return 'badge-info'
  }
}

export function getConfidenceColor(confidence: number): string {
  if (confidence >= 80) return 'text-success-500'
  if (confidence >= 60) return 'text-warning-500'
  if (confidence >= 40) return 'text-dark-400'
  return 'text-danger-500'
}

export function getConfidenceBg(confidence: number): string {
  if (confidence >= 80) return 'bg-success-500/10'
  if (confidence >= 60) return 'bg-warning-500/10'
  if (confidence >= 40) return 'bg-dark-600'
  return 'bg-danger-500/10'
}

export function formatTime(date: string | Date): string {
  return new Intl.DateTimeFormat('en-US', {
    month: 'short',
    day: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
    hour12: true,
  }).format(new Date(date))
}

export function formatTimeAgo(date: string | Date): string {
  const now = new Date()
  const past = new Date(date)
  const diff = now.getTime() - past.getTime()
  const seconds = Math.floor(diff / 1000)
  const minutes = Math.floor(seconds / 60)
  const hours = Math.floor(minutes / 60)
  const days = Math.floor(hours / 24)

  if (days > 0) return `${days}d ago`
  if (hours > 0) return `${hours}h ago`
  if (minutes > 0) return `${minutes}m ago`
  return 'just now'
}
