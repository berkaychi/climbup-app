"use client";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { useState } from "react";

export function QueryProvider({ children }: { children: React.ReactNode }) {
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            // Stale time: How long data is considered fresh
            staleTime: 1000 * 60 * 5, // 5 minutes
            // Cache time: How long data stays in cache when not in use
            gcTime: 1000 * 60 * 30, // 30 minutes (formerly cacheTime)
            // Retry failed requests
            retry: (failureCount, error: unknown) => {
              // Don't retry on 4xx errors (client errors)
              const errorWithStatus = error as { status?: number };
              if (
                errorWithStatus?.status &&
                errorWithStatus.status >= 400 &&
                errorWithStatus.status < 500
              ) {
                return false;
              }
              // Retry up to 3 times for other errors
              return failureCount < 3;
            },
            // Refetch on window focus for important data
            refetchOnWindowFocus: false,
            // Refetch on reconnect
            refetchOnReconnect: true,
          },
          mutations: {
            // Retry mutations once on failure
            retry: 1,
          },
        },
      })
  );

  return (
    <QueryClientProvider client={queryClient}>
      {children}
      {process.env.NODE_ENV === "development" && (
        <ReactQueryDevtools
          initialIsOpen={false}
          buttonPosition="bottom-left"
        />
      )}
    </QueryClientProvider>
  );
}
