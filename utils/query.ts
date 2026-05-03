import { QueryClient } from "@tanstack/react-query"

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5, // 5 min — avoids redundant refetches for stable data
      gcTime: 1000 * 60 * 10,   // 10 min — keep unused cache longer than staleTime
      retry: 1,
      refetchOnWindowFocus: true,
      refetchOnReconnect: true,  // useful for flaky connections
    },
    mutations: {
      retry: 0, // mutations should not auto-retry by default
      onError: (error) => {
        // global mutation error handler — e.g. toast notification
        console.error("Mutation error:", error)
      },
    },
  },
})