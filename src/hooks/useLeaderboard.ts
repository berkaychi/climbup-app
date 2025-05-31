import useSWR from "swr";
import { useAuth } from "@/context/AuthContext";
import {
  LeaderboardService,
  LeaderboardFilters,
} from "@/lib/leaderboardService";
import { useMemo } from "react";

export function useLeaderboard(filters?: LeaderboardFilters) {
  const authHelpers = useAuth();
  const leaderboardService = useMemo(
    () => new LeaderboardService(authHelpers),
    [authHelpers]
  );

  // Create a cache key based on filters
  const cacheKey = authHelpers.user
    ? `/leaderboard/${JSON.stringify(filters || {})}`
    : null;

  const { data, error, isLoading, mutate } = useSWR(
    cacheKey,
    () => leaderboardService.getLeaderboard(filters),
    {
      revalidateOnFocus: false,
      dedupingInterval: 300000, // 5 minutes
      refreshInterval: 300000, // Refresh every 5 minutes
      shouldRetryOnError: (error) => {
        // Auth hatalarında retry yapma
        if (
          error?.message?.includes("Failed to refresh token") ||
          error?.message?.includes("User logged out") ||
          error?.status === 401
        ) {
          return false;
        }
        return true;
      },
    }
  );

  return {
    leaderboard: data,
    isLoading,
    error,
    refetch: mutate,
    service: leaderboardService,
  };
}
