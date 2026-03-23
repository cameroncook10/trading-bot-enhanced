import { useEffect, useState } from 'react'
import axios, { AxiosError } from 'axios'

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000'

export function useApi<T>(endpoint: string) {
  const [data, setData] = useState<T | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<AxiosError | null>(null)

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true)
        const response = await axios.get<T>(`${API_BASE_URL}${endpoint}`)
        setData(response.data)
        setError(null)
      } catch (err) {
        setError(err as AxiosError)
        setData(null)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
    const interval = setInterval(fetchData, 5000) // Refresh every 5 seconds

    return () => clearInterval(interval)
  }, [endpoint])

  return { data, loading, error }
}

export async function fetchData<T>(endpoint: string): Promise<T> {
  const response = await axios.get<T>(`${API_BASE_URL}${endpoint}`)
  return response.data
}

export async function postData<T>(endpoint: string, payload: unknown): Promise<T> {
  const response = await axios.post<T>(`${API_BASE_URL}${endpoint}`, payload)
  return response.data
}

export async function putData<T>(endpoint: string, payload: unknown): Promise<T> {
  const response = await axios.put<T>(`${API_BASE_URL}${endpoint}`, payload)
  return response.data
}
