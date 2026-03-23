import { useEffect, useState } from 'react'
import { apiClient } from '../utils/apiClient'
import type { Position, Trade, Portfolio } from '../types'

interface TradingData {
  portfolio: Portfolio | null
  positions: Position[]
  trades: Trade[]
  status: 'idle' | 'loading' | 'error'
  error: Error | null
}

const DEFAULT_PORTFOLIO: Portfolio = {
  total_value: 50,
  total_invested: 0,
  total_pnl: 0,
  total_pnl_percent: 0,
  cash_available: 50,
  positions: [],
  allocation: [
    { symbol: 'USDC', value: 50, percent: 100, type: 'stock' }
  ]
}

/**
 * Custom hook to fetch real trading data from backend
 * Refreshes every 5 seconds to get live updates
 * Falls back to empty state on error (not mock data)
 */
export function useTradingData(): TradingData {
  const [data, setData] = useState<TradingData>({
    portfolio: DEFAULT_PORTFOLIO,
    positions: [],
    trades: [],
    status: 'loading',
    error: null
  })

  useEffect(() => {
    let isMounted = true
    let interval: ReturnType<typeof setInterval> | null = null

    const fetchTradingData = async () => {
      if (!isMounted) return

      try {
        setData(prev => ({ ...prev, status: 'loading', error: null }))

        // Fetch real data from backend
        const [positionsRes, tradesRes, portfolioRes] = await Promise.allSettled([
          apiClient.getPositions(),
          apiClient.getTradeHistory(),
          apiClient.getPortfolio()
        ])

        if (!isMounted) return

        // Extract successful results, fall back to empty/default
        const positions = positionsRes.status === 'fulfilled' ? positionsRes.value : []
        const trades = tradesRes.status === 'fulfilled' ? tradesRes.value : []
        const portfolio = portfolioRes.status === 'fulfilled' 
          ? portfolioRes.value 
          : DEFAULT_PORTFOLIO

        // Ensure positions have all required fields
        const validPositions = positions.map((pos: any) => ({
          ...pos,
          unrealized_pnl: pos.unrealized_pnl || pos.pnl || 0,
          unrealized_pnl_percent: pos.unrealized_pnl_percent || pos.pnl_percent || 0,
          confidence_score: pos.confidence_score || 75
        }))

        // Calculate portfolio allocation from positions
        const allocation = validPositions.length > 0
          ? validPositions.map((pos: Position) => ({
              symbol: pos.symbol,
              value: pos.value,
              percent: (pos.value / (portfolio.total_value || 50)) * 100,
              type: 'crypto' as const
            }))
          : [{ symbol: 'USDC', value: portfolio.cash_available, percent: 100, type: 'stock' as const }]

        const updatedPortfolio: Portfolio = {
          ...portfolio,
          positions,
          allocation
        }

        setData({
          portfolio: updatedPortfolio,
          positions: validPositions,
          trades,
          status: 'idle',
          error: null
        })
      } catch (error) {
        if (!isMounted) return
        
        console.error('Error fetching trading data:', error)
        setData(prev => ({
          ...prev,
          status: 'error',
          error: error instanceof Error ? error : new Error('Unknown error'),
          // Keep previous data on error, don't reset to nothing
          portfolio: prev.portfolio || DEFAULT_PORTFOLIO
        }))
      }
    }

    // Initial fetch
    fetchTradingData()

    // Set up polling every 5 seconds
    interval = setInterval(fetchTradingData, 5000)

    return () => {
      isMounted = false
      if (interval) clearInterval(interval)
    }
  }, [])

  return data
}
