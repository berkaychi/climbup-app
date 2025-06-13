import useSWR from "swr";
import { useAuth } from "@/stores/authStore";
import { PlanService } from "@/lib/planService";
import {
  Plan,
  PlanTemplate,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  DailyPlans,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  WeeklyProgress,
  CreatePlanRequest,
  UpdatePlanRequest,
  CreatePlanTemplateRequest,
  PlanFilters,
} from "@/types/plan";
import { useMemo, useCallback, useState } from "react";

// SWR key generator
const createKey = (endpoint: string, filters?: PlanFilters | string) => {
  if (filters) {
    return [endpoint, JSON.stringify(filters)];
  }
  return endpoint;
};

// Main Plans Hook
export function usePlans(filters?: PlanFilters) {
  const authHelpers = useAuth();
  const planService = useMemo(
    () => new PlanService(authHelpers),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [authHelpers.user?.id] // Only depend on user ID to prevent unnecessary re-renders
  );

  const { data, error, isLoading, mutate } = useSWR(
    authHelpers.user ? createKey("/plans", filters) : null,
    () => planService.getPlans(filters),
    {
      revalidateOnFocus: true, // ✅ Critical for mobile-web sync
      revalidateOnReconnect: true, // ✅ Enable sync when reconnecting
      dedupingInterval: 60000, // 1 minute
      refreshInterval: 0, // Keep disabled for performance
    }
  );

  const createPlan = useCallback(
    async (planData: CreatePlanRequest) => {
      try {
        const newPlan = await planService.createPlan(planData);

        // Optimistically update the cache
        await mutate((currentData: Plan[] | undefined) => {
          if (!currentData) return [newPlan];
          return [newPlan, ...currentData];
        }, false);

        // Revalidate to get fresh data from server
        await mutate();

        return newPlan;
      } catch (error) {
        console.error("Plan creation failed:", error);
        throw error;
      }
    },
    [planService, mutate]
  );

  const updatePlan = useCallback(
    async (id: string, planData: UpdatePlanRequest) => {
      try {
        const updatedPlan = await planService.updatePlan(id, planData);
        // Optimistically update the cache
        await mutate((currentData: Plan[] | undefined) => {
          if (!currentData) return undefined;
          return currentData.map((plan) =>
            plan.id === id ? updatedPlan : plan
          );
        }, false);
        return updatedPlan;
      } catch (error) {
        console.error("Plan update failed:", error);
        throw error;
      }
    },
    [planService, mutate]
  );

  const deletePlan = useCallback(
    async (
      id: string,
      showAlert?: (message: string, type: "error") => void
    ) => {
      try {
        await planService.deletePlan(id);
        // Optimistically update the cache
        await mutate((currentData: Plan[] | undefined) => {
          if (!currentData) return undefined;
          return currentData.filter((plan) => plan.id !== id);
        }, false);
      } catch (error) {
        console.error("Plan silme hatası:", error);
        // Show user-friendly error messages
        if (showAlert) {
          if (error instanceof Error) {
            if (error.message.includes("Tamamlanan planlar silinemez")) {
              showAlert("Tamamlanan planlar silinemez.", "error");
            } else if (
              error.message.includes("Süresi geçmiş planlar silinemez")
            ) {
              showAlert("Süresi geçmiş planlar silinemez.", "error");
            } else {
              showAlert(
                "Plan silinirken bir hata oluştu. Lütfen tekrar deneyin.",
                "error"
              );
            }
          } else {
            showAlert(
              "Plan silinirken bir hata oluştu. Lütfen tekrar deneyin.",
              "error"
            );
          }
        }
        throw error;
      }
    },
    [planService, mutate]
  );

  const markComplete = useCallback(
    async (
      id: string,
      isCompleted: boolean,
      showAlert?: (message: string, type: "error") => void
    ) => {
      try {
        const completedPlan = await planService.togglePlanStatus(
          id,
          isCompleted
        );
        // Optimistically update the cache
        mutate((currentData: Plan[] | undefined) => {
          if (!currentData) return undefined;
          return currentData.map((plan) =>
            plan.id === id ? completedPlan : plan
          );
        }, false);
        return completedPlan;
      } catch (error) {
        console.error("Plan status değiştirme hatası:", error);
        // Show user-friendly error message for uncomplete attempts
        if (showAlert) {
          if (
            error instanceof Error &&
            error.message.includes("tekrar açılamaz")
          ) {
            showAlert(
              "Tamamlanan planlar tekrar açılamaz. Yeni bir plan oluşturabilirsiniz.",
              "error"
            );
          } else {
            showAlert(
              "Plan durumu değiştirilirken bir hata oluştu. Lütfen tekrar deneyin.",
              "error"
            );
          }
        }
        throw error;
      }
    },
    [planService, mutate]
  );

  return {
    plans: data || [],
    isLoading,
    error,
    createPlan,
    updatePlan,
    deletePlan,
    markComplete,
    refetch: mutate,
  };
}

// Daily Plans Hook
export function useDailyPlans(date: string) {
  const authHelpers = useAuth();
  const planService = useMemo(
    () => new PlanService(authHelpers),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [authHelpers.user?.id] // Only depend on user ID to prevent unnecessary re-renders
  );

  const { data, error, isLoading, mutate } = useSWR(
    authHelpers.user ? `/plans/daily/${date}` : null,
    () => planService.getDailyPlans(date),
    {
      revalidateOnFocus: true, // ✅ Critical for mobile-web sync
      revalidateOnReconnect: true,
      dedupingInterval: 300000, // Cache for 5 minutes
      refreshInterval: 0, // Remove automatic refresh - only manual or on data change
    }
  );

  return {
    dailyPlans: data,
    isLoading,
    error,
    refetch: mutate,
  };
}

// Weekly Progress Hook
export function useWeeklyProgress(weekStart: string) {
  const authHelpers = useAuth();
  const planService = useMemo(
    () => new PlanService(authHelpers),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [authHelpers.user?.id] // Only depend on user ID to prevent unnecessary re-renders
  );

  const { data, error, isLoading, mutate } = useSWR(
    authHelpers.user ? `/plans/weekly-progress/${weekStart}` : null,
    () => planService.getWeeklyProgress(weekStart),
    {
      revalidateOnFocus: false, // Don't refresh on tab focus to reduce API calls
      revalidateOnReconnect: true, // ✅ Enable sync when reconnecting
      dedupingInterval: 300000, // 5 minutes
    }
  );

  return {
    weeklyProgress: data,
    isLoading,
    error,
    refetch: mutate,
  };
}

// Plan Templates Hook
export function usePlanTemplates() {
  const authHelpers = useAuth();
  const planService = useMemo(
    () => new PlanService(authHelpers),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [authHelpers.user?.id] // Only depend on user ID to prevent unnecessary re-renders
  );

  const { data, error, isLoading, mutate } = useSWR(
    authHelpers.user ? "/plan-templates" : null,
    () => planService.getPlanTemplates(),
    {
      revalidateOnFocus: false, // Don't refresh on tab focus to reduce API calls
      revalidateOnReconnect: true, // ✅ Enable sync when reconnecting
      dedupingInterval: 600000, // 10 minutes
    }
  );

  const createTemplate = useCallback(
    async (templateData: CreatePlanTemplateRequest) => {
      try {
        const newTemplate = await planService.createPlanTemplate(templateData);
        // Optimistically update the cache
        mutate((currentData: PlanTemplate[] | undefined) => {
          if (!currentData) return [newTemplate];
          return [...currentData, newTemplate];
        }, false);
        return newTemplate;
      } catch (error) {
        throw error;
      }
    },
    [planService, mutate]
  );

  const deleteTemplate = useCallback(
    async (id: string) => {
      try {
        await planService.deletePlanTemplate(id);
        // Optimistically update the cache
        mutate((currentData: PlanTemplate[] | undefined) => {
          if (!currentData) return undefined;
          return currentData.filter((template) => template.id !== id);
        }, false);
      } catch (error) {
        throw error;
      }
    },
    [planService, mutate]
  );

  const createPlanFromTemplate = useCallback(
    async (templateId: string, startTime: string) => {
      try {
        const newPlan = await planService.createPlanFromTemplate(
          templateId,
          startTime
        );
        return newPlan;
      } catch (error) {
        throw error;
      }
    },
    [planService]
  );

  return {
    templates: data || [],
    isLoading,
    error,
    createTemplate,
    deleteTemplate,
    createPlanFromTemplate,
    refetch: mutate,
  };
}

// Single Plan Hook
export function usePlan(id: string | null) {
  const authHelpers = useAuth();
  const planService = useMemo(
    () => new PlanService(authHelpers),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [authHelpers.user?.id] // Only depend on user ID to prevent unnecessary re-renders
  );

  const { data, error, isLoading, mutate } = useSWR(
    authHelpers.user && id ? `/plans/${id}` : null,
    () => (id ? planService.getPlanById(id) : null),
    {
      revalidateOnFocus: false,
    }
  );

  return {
    plan: data,
    isLoading,
    error,
    refetch: mutate,
  };
}

// Lazy Loading Plans Hook - for future use when navigating beyond 3-month window
export function useLazyPlans(initialDateRange: {
  startDate: string;
  endDate: string;
}) {
  const authHelpers = useAuth();
  const planService = useMemo(
    () => new PlanService(authHelpers),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [authHelpers.user?.id]
  );

  const [dateRange, setDateRange] = useState(initialDateRange);
  const [loadedRanges, setLoadedRanges] = useState<
    {
      startDate: string;
      endDate: string;
    }[]
  >([initialDateRange]);

  const { data, error, isLoading, mutate } = useSWR(
    authHelpers.user ? createKey("/plans/lazy", dateRange) : null,
    () =>
      planService.getPlans({
        startDate: dateRange.startDate,
        endDate: dateRange.endDate,
      }),
    {
      revalidateOnFocus: true,
      revalidateOnReconnect: true,
      dedupingInterval: 60000,
    }
  );

  const loadMoreData = useCallback(
    async (newStartDate: string, newEndDate: string) => {
      // Check if this range is already loaded
      const isAlreadyLoaded = loadedRanges.some(
        (range) =>
          newStartDate >= range.startDate && newEndDate <= range.endDate
      );

      if (isAlreadyLoaded) {
        return; // No need to fetch
      }

      // Extend the date range
      const extendedRange = {
        startDate:
          newStartDate < dateRange.startDate
            ? newStartDate
            : dateRange.startDate,
        endDate:
          newEndDate > dateRange.endDate ? newEndDate : dateRange.endDate,
      };

      setDateRange(extendedRange);
      setLoadedRanges((prev) => [...prev, extendedRange]);

      // Trigger re-fetch
      await mutate();
    },
    [dateRange, loadedRanges, mutate]
  );

  const createPlan = useCallback(
    async (planData: CreatePlanRequest) => {
      try {
        const newPlan = await planService.createPlan(planData);
        await mutate((currentData: Plan[] | undefined) => {
          if (!currentData) return [newPlan];
          return [newPlan, ...currentData];
        }, false);
        await mutate();
        return newPlan;
      } catch (error) {
        console.error("Plan creation failed:", error);
        throw error;
      }
    },
    [planService, mutate]
  );

  const updatePlan = useCallback(
    async (id: string, planData: UpdatePlanRequest) => {
      try {
        const updatedPlan = await planService.updatePlan(id, planData);
        await mutate((currentData: Plan[] | undefined) => {
          if (!currentData) return undefined;
          return currentData.map((plan) =>
            plan.id === id ? updatedPlan : plan
          );
        }, false);
        return updatedPlan;
      } catch (error) {
        console.error("Plan update failed:", error);
        throw error;
      }
    },
    [planService, mutate]
  );

  const deletePlan = useCallback(
    async (
      id: string,
      showAlert?: (message: string, type: "error") => void
    ) => {
      try {
        await planService.deletePlan(id);
        await mutate((currentData: Plan[] | undefined) => {
          if (!currentData) return undefined;
          return currentData.filter((plan) => plan.id !== id);
        }, false);
      } catch (error) {
        console.error("Plan silme hatası:", error);
        if (showAlert) {
          if (error instanceof Error) {
            if (error.message.includes("Tamamlanan planlar silinemez")) {
              showAlert("Tamamlanan planlar silinemez.", "error");
            } else if (
              error.message.includes("Süresi geçmiş planlar silinemez")
            ) {
              showAlert("Süresi geçmiş planlar silinemez.", "error");
            } else {
              showAlert(
                "Plan silinirken bir hata oluştu. Lütfen tekrar deneyin.",
                "error"
              );
            }
          } else {
            showAlert(
              "Plan silinirken bir hata oluştu. Lütfen tekrar deneyin.",
              "error"
            );
          }
        }
        throw error;
      }
    },
    [planService, mutate]
  );

  const markComplete = useCallback(
    async (
      id: string,
      isCompleted: boolean,
      showAlert?: (message: string, type: "error") => void
    ) => {
      try {
        const completedPlan = await planService.togglePlanStatus(
          id,
          isCompleted
        );
        mutate((currentData: Plan[] | undefined) => {
          if (!currentData) return undefined;
          return currentData.map((plan) =>
            plan.id === id ? completedPlan : plan
          );
        }, false);
        return completedPlan;
      } catch (error) {
        console.error("Plan status değiştirme hatası:", error);
        if (showAlert) {
          if (
            error instanceof Error &&
            error.message.includes("tekrar açılamaz")
          ) {
            showAlert(
              "Tamamlanan planlar tekrar açılamaz. Yeni bir plan oluşturabilirsiniz.",
              "error"
            );
          } else {
            showAlert(
              "Plan durumu değiştirilirken bir hata oluştu. Lütfen tekrar deneyin.",
              "error"
            );
          }
        }
        throw error;
      }
    },
    [planService, mutate]
  );

  return {
    plans: data || [],
    isLoading,
    error,
    dateRange,
    loadedRanges,
    loadMoreData,
    createPlan,
    updatePlan,
    deletePlan,
    markComplete,
    refetch: mutate,
  };
}
