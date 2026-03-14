import axios from 'axios'

const api = axios.create({
  baseURL: '/api',
  timeout: 5000
})

export interface HealthResponse {
  code: number
  message: string
  data: {
    timestamp: number
    service: string
    version: string
  }
}

export const checkHealth = async (): Promise<HealthResponse> => {
  const response = await api.get<HealthResponse>('/health')
  return response.data
}