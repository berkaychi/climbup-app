import useSWR from "swr";
import { useAuth } from "@/context/AuthContext";
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
import { useMemo, useCallback } from "react";

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
    [authHelpers]
  );

  const { data, error, isLoading, mutate } = useSWR(
    authHelpers.user ? createKey("/plans", filters) : null,
    () => planService.getPlans(filters),
    {
      revalidateOnFocus: false,
      revalidateOnReconnect: false,
      dedupingInterval: 60000, // 1 minute
      refreshInterval: 0, // Disable automatic refresh
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
    async (id: string) => {
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
        if (error instanceof Error) {
          if (error.message.includes("Tamamlanan planlar silinemez")) {
            alert("Tamamlanan planlar silinemez.");
          } else if (
            error.message.includes("Süresi geçmiş planlar silinemez")
          ) {
            alert("Süresi geçmiş planlar silinemez.");
          } else {
            alert("Plan silinirken bir hata oluştu. Lütfen tekrar deneyin.");
          }
        } else {
          alert("Plan silinirken bir hata oluştu. Lütfen tekrar deneyin.");
        }
        throw error;
      }
    },
    [planService, mutate]
  );

  const markComplete = useCallback(
    async (id: string, isCompleted: boolean) => {
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
        if (
          error instanceof Error &&
          error.message.includes("tekrar açılamaz")
        ) {
          alert(
            "Tamamlanan planlar tekrar açılamaz. Yeni bir plan oluşturabilirsiniz."
          );
        } else {
          alert(
            "Plan durumu değiştirilirken bir hata oluştu. Lütfen tekrar deneyin."
          );
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
    [authHelpers]
  );

  const { data, error, isLoading, mutate } = useSWR(
    authHelpers.user ? `/plans/daily/${date}` : null,
    () => planService.getDailyPlans(date),
    {
      revalidateOnFocus: true,
      refreshInterval: 60000, // Refresh every minute
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
    [authHelpers]
  );

  const { data, error, isLoading, mutate } = useSWR(
    authHelpers.user ? `/plans/weekly-progress/${weekStart}` : null,
    () => planService.getWeeklyProgress(weekStart),
    {
      revalidateOnFocus: false,
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
    [authHelpers]
  );

  const { data, error, isLoading, mutate } = useSWR(
    authHelpers.user ? "/plan-templates" : null,
    () => planService.getPlanTemplates(),
    {
      revalidateOnFocus: false,
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
    [authHelpers]
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
