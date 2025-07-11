import { QueryClient } from "@tanstack/react-query"

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5, // 5 minutes
      retry: 1,
    },
  },
})

const API_BASE_URL = import.meta.env.PROD ? "" : "http://localhost:3000"

export async function apiRequest(
  method: "GET" | "POST" | "PUT" | "DELETE",
  endpoint: string,
  data?: any,
): Promise<Response> {
  const url = `${API_BASE_URL}${endpoint}`

  const config: RequestInit = {
    method,
    headers: {
      "Content-Type": "application/json",
    },
  }

  if (data) {
    config.body = JSON.stringify(data)
  }

  const response = await fetch(url, config)

  if (!response.ok) {
    throw new Error(`API request failed: ${response.status} ${response.statusText}`)
  }

  return response
}
