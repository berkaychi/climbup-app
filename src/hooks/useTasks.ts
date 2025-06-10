import useSWR from "swr";
import { useAuth } from "@/stores/authStore";
import { TaskService } from "@/lib/taskService";
import { useMemo } from "react";

export function useTasks() {
  const authHelpers = useAuth();
  const taskService = useMemo(
    () => new TaskService(authHelpers),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [authHelpers.user?.id] // Only depend on user ID to prevent unnecessary re-renders
  );

  const cacheKey = authHelpers.user ? "/tasks/my-current" : null;

  const { data, error, isLoading, mutate } = useSWR(
    cacheKey,
    () => taskService.getCurrentTasks(),
    {
      revalidateOnFocus: true, // ✅ Critical for mobile-web sync - tasks updated on mobile
      dedupingInterval: 60000, // 1 minute
      refreshInterval: 0, // Remove automatic refresh - only manual refresh
      // 401 hatalarında retry yapma
      shouldRetryOnError: (error) => {
        // Token yenileme hataları ve 401 durumunda retry yapma
        if (
          error?.message?.includes("Failed to refresh token") ||
          error?.message?.includes("User logged out") ||
          error?.status === 401
        ) {
          return false;
        }
        return true;
      },
      errorRetryCount: 3,
      errorRetryInterval: 5000, // 5 saniye bekle
    }
  );

  return {
    tasks: data,
    isLoading,
    error,
    refetch: mutate,
    service: taskService,
  };
}
