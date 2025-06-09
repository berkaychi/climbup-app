import useSWR from "swr";
import { useAuth } from "@/stores/authStore";
import { StatisticsService } from "@/lib/statisticsService";
import { useMemo } from "react";

// Main statistics hooks
export function useUserStatsSummary() {
  const authHelpers = useAuth();
  const statsService = useMemo(
    () => new StatisticsService(authHelpers),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [authHelpers.user?.id] // Only depend on user ID to prevent unnecessary re-renders
  );

  const { data, error, isLoading, mutate } = useSWR(
    authHelpers.user ? "/stats/summary" : null,
    () => statsService.getUserStatsSummary(),
    {
      revalidateOnFocus: false,
      dedupingInterval: 300000, // 5 minutes
      refreshInterval: 0,
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
    stats: data,
    isLoading,
    error,
    refetch: mutate,
  };
}

export function useTagFocusStats(startDate: string, endDate: string) {
  const authHelpers = useAuth();
  const statsService = useMemo(
    () => new StatisticsService(authHelpers),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [authHelpers.user?.id] // Only depend on user ID to prevent unnecessary re-renders
  );

  const { data, error, isLoading, mutate } = useSWR(
    authHelpers.user ? `/stats/tags/${startDate}/${endDate}` : null,
    () => statsService.getTagFocusStats(startDate, endDate),
    {
      revalidateOnFocus: false,
      dedupingInterval: 300000, // 5 minutes
      refreshInterval: 0,
    }
  );

  return {
    tagStats: data || [],
    isLoading,
    error,
    refetch: mutate,
  };
}

export function useDailyRangeStats(startDate: string, endDate: string) {
  const authHelpers = useAuth();
  const statsService = useMemo(
    () => new StatisticsService(authHelpers),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [authHelpers.user?.id] // Only depend on user ID to prevent unnecessary re-renders
  );

  const { data, error, isLoading, mutate } = useSWR(
    authHelpers.user ? `/stats/daily-range/${startDate}/${endDate}` : null,
    () => statsService.getDailyRangeStats(startDate, endDate),
    {
      revalidateOnFocus: false,
      dedupingInterval: 300000, // 5 minutes
      refreshInterval: 0,
    }
  );

  return {
    dailyStats: data || [],
    isLoading,
    error,
    refetch: mutate,
  };
}

// Helper hooks for processed data
export function useWeeklyProgress() {
  const now = new Date();
  const weekStart = new Date(
    now.getFullYear(),
    now.getMonth(),
    now.getDate() - now.getDay() + 1
  );
  const weekEnd = new Date(weekStart);
  weekEnd.setDate(weekStart.getDate() + 6);

  const startDate = weekStart.toISOString().split("T")[0];
  const endDate = weekEnd.toISOString().split("T")[0];

  const { dailyStats, isLoading, error } = useDailyRangeStats(
    startDate,
    endDate
  );

  const processedData = useMemo(() => {
    if (!dailyStats?.length) {
      return Array.from({ length: 7 }, (_, i) => ({
        day: ["Pzt", "Sal", "Çar", "Per", "Cum", "Cmt", "Paz"][i],
        value: 0,
        date: new Date(weekStart.getTime() + i * 24 * 60 * 60 * 1000)
          .toISOString()
          .split("T")[0],
      }));
    }

    // Create a map of date to stats for easy lookup
    const statsMap = new Map();
    dailyStats.forEach((stat) => {
      const date = new Date(stat.date).toISOString().split("T")[0];
      statsMap.set(date, stat.totalFocusDurationSecondsToday / 60); // Convert to minutes
    });

    return Array.from({ length: 7 }, (_, i) => {
      const currentDate = new Date(
        weekStart.getTime() + i * 24 * 60 * 60 * 1000
      );
      const dateStr = currentDate.toISOString().split("T")[0];

      return {
        day: ["Pzt", "Sal", "Çar", "Per", "Cum", "Cmt", "Paz"][i],
        value: statsMap.get(dateStr) || 0,
        date: dateStr,
      };
    });
  }, [dailyStats, weekStart]);

  return {
    weeklyData: processedData,
    isLoading,
    error,
  };
}
