import { useEffect, useRef, useState, useCallback } from 'react'
import { WebSocketMessage } from '../types'

export function useWebSocket(url?: string) {
  const [isConnected, setIsConnected] = useState(false)
  const [lastMessage, setLastMessage] = useState<WebSocketMessage | null>(null)
  const ws = useRef<WebSocket | null>(null)

  const connect = useCallback(() => {
    const wsUrl = url || import.meta.env.VITE_WS_URL || 'ws://localhost:8000/ws'
    
    try {
      ws.current = new WebSocket(wsUrl)

      ws.current.onopen = () => {
        setIsConnected(true)
      }

      ws.current.onmessage = (event) => {
        try {
          const message = JSON.parse(event.data) as WebSocketMessage
          setLastMessage(message)
        } catch (e) {
          console.error('Failed to parse WebSocket message:', e)
        }
      }

      ws.current.onerror = () => {
        setIsConnected(false)
      }

      ws.current.onclose = () => {
        setIsConnected(false)
        // Reconnect after 3 seconds
        setTimeout(connect, 3000)
      }
    } catch (e) {
      console.error('WebSocket connection error:', e)
    }
  }, [url])

  useEffect(() => {
    connect()

    return () => {
      if (ws.current) {
        ws.current.close()
      }
    }
  }, [connect])

  const send = useCallback((message: unknown) => {
    if (ws.current && ws.current.readyState === WebSocket.OPEN) {
      ws.current.send(JSON.stringify(message))
    }
  }, [])

  return {
    isConnected,
    lastMessage,
    send,
  }
}
