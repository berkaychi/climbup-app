import { fetchWithAuth } from "./authFetch";
import { AuthContextType } from "../stores/authStore";
import { API_CONFIG, API_ENDPOINTS } from "@/config/api";
import {
  Plan,
  PlanTemplate,
  DailyPlans,
  WeeklyProgress,
  CreatePlanRequest,
  UpdatePlanRequest,
  CreatePlanTemplateRequest,
  PlanFilters,
} from "../types/plan";

const API_BASE = API_CONFIG.BASE_URL;

export class PlanService {
  constructor(private authHelpers: AuthContextType) {}

  // Plan CRUD Operations (using ToDo endpoints)
  async getPlans(filters?: PlanFilters): Promise<Plan[]> {
    const params = new URLSearchParams();

    // If only a single date filter is provided, use it
    if (filters?.date && !filters?.startDate && !filters?.endDate) {
      params.append("forDate", filters.date);
    }
    // If date range is provided, we'll need to fetch all and filter client-side
    // as ToDo API may not support date range queries

    const queryString = params.toString();
    const url = `${API_BASE}${API_ENDPOINTS.PLANS.BASE}${
      queryString ? `?${queryString}` : ""
    }`;

    const response = await fetchWithAuth(url, {}, this.authHelpers);

    if (!response.ok) {
      throw new Error(`Failed to fetch plans: ${response.status}`);
    }

    const todos = await response.json();

    // Transform ToDo items to Plan format and filter out invalid dates
    let plans = todos
      .map((todo: TodoApiResponse) => {
        const startTime = todo.userIntendedStartTime || todo.forDate;
        const startDate = new Date(startTime);

        // Check if date is invalid, too old (before year 1900), or too far in future (> 2030)
        const isInvalidDate =
          isNaN(startDate.getTime()) ||
          startDate.getFullYear() < 1900 ||
          startDate.getFullYear() > 2030;

        // Return null for invalid dates so we can filter them out
        if (isInvalidDate) {
          return null;
        }

        return {
          id: todo.id.toString(),
          userId: "current-user", // Will be filled by backend
          title: todo.title,
          description: todo.description || "",
          startTime: startTime,
          endTime: startTime, // Will calculate based on duration
          duration: todo.targetWorkDuration
            ? this.parseTimeSpanToMinutes(todo.targetWorkDuration)
            : 60,
          tagId: todo.tags?.[0]?.id?.toString(),
          tagName: todo.tags?.[0]?.name,
          color: todo.tags?.[0]?.color,
          isCompleted: todo.status === "Completed",
          isOverdue: todo.status === "Overdue",
          isRecurring: false, // ToDo API doesn't support recurring
          recurringPattern: undefined,
          createdAt: todo.forDate,
          updatedAt: todo.forDate,
        };
      })
      .filter((plan: Plan | null) => plan !== null) as Plan[]; // Remove null entries

    // Client-side filtering for date range
    if (filters?.startDate || filters?.endDate) {
      plans = plans.filter((plan: Plan) => {
        const planDate = new Date(plan.startTime).toISOString().split("T")[0];

        if (filters.startDate && planDate < filters.startDate) {
          return false;
        }

        if (filters.endDate && planDate > filters.endDate) {
          return false;
        }

        return true;
      });
    }

    return plans;
  }

  private parseTimeSpanToMinutes(timeSpan: string): number {
    // Parse "01:30:00" format to minutes
    const parts = timeSpan.split(":");
    if (parts.length !== 3) return 60;

    const hours = parseInt(parts[0], 10);
    const minutes = parseInt(parts[1], 10);
    return hours * 60 + minutes;
  }

  private formatMinutesToTimeSpan(minutes: number): string {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return `${hours.toString().padStart(2, "0")}:${mins
      .toString()
      .padStart(2, "0")}:00`;
  }

  async getPlanById(id: string): Promise<Plan> {
    const response = await fetchWithAuth(
      `${API_BASE}${API_ENDPOINTS.PLANS.BY_ID(id)}`,
      {},
      this.authHelpers
    );

    if (!response.ok) {
      throw new Error(`Failed to fetch plan: ${response.status}`);
    }

    const todo = await response.json();

    const startTime = todo.userIntendedStartTime || todo.forDate;
    const startDate = new Date(startTime);

    // Check if date is invalid, too old (before year 1900), or too far in future (> 2030)
    const isInvalidDate =
      isNaN(startDate.getTime()) ||
      startDate.getFullYear() < 1900 ||
      startDate.getFullYear() > 2030;

    // Throw error for invalid dates instead of returning them
    if (isInvalidDate) {
      throw new Error(`Plan has invalid date: ${startTime}`);
    }

    return {
      id: todo.id.toString(),
      userId: "current-user",
      title: todo.title,
      description: todo.description || "",
      startTime: startTime,
      endTime: startTime,
      duration: todo.targetWorkDuration
        ? this.parseTimeSpanToMinutes(todo.targetWorkDuration)
        : 60,
      tagId: todo.tags?.[0]?.id?.toString(),
      tagName: todo.tags?.[0]?.name,
      color: todo.tags?.[0]?.color,
      isCompleted: todo.status === "Completed",
      isOverdue: todo.status === "Overdue",
      isRecurring: false,
      recurringPattern: undefined,
      createdAt: todo.forDate,
      updatedAt: todo.forDate,
    };
  }

  async createPlan(planData: CreatePlanRequest): Promise<Plan> {
    // Transform Plan data to ToDo format
    const todoData = {
      title: planData.title,
      description: planData.description || "",
      forDate: new Date(planData.startTime).toISOString().split("T")[0], // YYYY-MM-DD format
      userIntendedStartTime: planData.startTime,
      targetWorkDuration: planData.endTime
        ? this.formatMinutesToTimeSpan(
            Math.floor(
              (new Date(planData.endTime).getTime() -
                new Date(planData.startTime).getTime()) /
                60000
            )
          )
        : undefined,
      tagIds: planData.tagId ? [parseInt(planData.tagId)] : [],
    };

    const response = await fetchWithAuth(
      `${API_BASE}${API_ENDPOINTS.PLANS.BASE}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(todoData),
      },
      this.authHelpers
    );

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Failed to create plan: ${response.status} ${errorText}`);
    }

    const todo = await response.json();

    const startTime = todo.userIntendedStartTime || todo.forDate;
    const startDate = new Date(startTime);

    // Check if date is invalid, too old (before year 1900), or too far in future (> 2030)
    const isInvalidDate =
      isNaN(startDate.getTime()) ||
      startDate.getFullYear() < 1900 ||
      startDate.getFullYear() > 2030;

    // Throw error for invalid dates instead of returning them
    if (isInvalidDate) {
      throw new Error(`Created plan has invalid date: ${startTime}`);
    }

    return {
      id: todo.id.toString(),
      userId: "current-user",
      title: todo.title,
      description: todo.description || "",
      startTime: startTime,
      endTime: startTime,
      duration: todo.targetWorkDuration
        ? this.parseTimeSpanToMinutes(todo.targetWorkDuration)
        : 60,
      tagId: todo.tags?.[0]?.id?.toString(),
      tagName: todo.tags?.[0]?.name,
      color: todo.tags?.[0]?.color,
      isCompleted: todo.status === "Completed",
      isOverdue: todo.status === "Overdue",
      isRecurring: false,
      recurringPattern: undefined,
      createdAt: todo.forDate,
      updatedAt: todo.forDate,
    };
  }

  async updatePlan(id: string, planData: UpdatePlanRequest): Promise<Plan> {
    // Transform Plan update data to ToDo format
    const todoUpdateData: Partial<{
      title: string;
      description: string;
      forDate: string;
      userIntendedStartTime: string;
      status: "Open" | "Completed";
      tagIds: number[];
    }> = {};

    if (planData.title) todoUpdateData.title = planData.title;
    if (planData.description !== undefined)
      todoUpdateData.description = planData.description;
    if (planData.startTime) {
      todoUpdateData.forDate = new Date(planData.startTime)
        .toISOString()
        .split("T")[0];
      todoUpdateData.userIntendedStartTime = planData.startTime;
    }
    if (planData.isCompleted !== undefined) {
      todoUpdateData.status = planData.isCompleted ? "Completed" : "Open";
    }
    if (planData.tagId) {
      todoUpdateData.tagIds = [parseInt(planData.tagId)];
    }

    const response = await fetchWithAuth(
      `${API_BASE}/ToDo/${id}`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(todoUpdateData),
      },
      this.authHelpers
    );

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Failed to update plan: ${response.status} ${errorText}`);
    }

    // Get updated todo item
    return this.getPlanById(id);
  }

  async deletePlan(id: string): Promise<void> {
    // First get the plan to check its status
    const plan = await this.getPlanById(id);

    if (plan.isCompleted) {
      throw new Error("Tamamlanan planlar silinemez.");
    }

    if (plan.isOverdue) {
      throw new Error("Süresi geçmiş planlar silinemez.");
    }

    const response = await fetchWithAuth(
      `${API_BASE}/ToDo/${id}`,
      {
        method: "DELETE",
      },
      this.authHelpers
    );

    if (!response.ok) {
      throw new Error(`Failed to delete plan: ${response.status}`);
    }
  }

  async markPlanComplete(id: string): Promise<Plan> {
    const response = await fetchWithAuth(
      `${API_BASE}/ToDo/${id}/complete`,
      {
        method: "PATCH",
      },
      this.authHelpers
    );

    if (!response.ok) {
      throw new Error(`Failed to complete plan: ${response.status}`);
    }

    // Get updated todo item
    return this.getPlanById(id);
  }

  async markPlanIncomplete(id: string): Promise<Plan> {
    // ToDo API doesn't support uncompleting tasks
    throw new Error(
      `Plan ${id} tamamlanan planlar tekrar açılamaz. Yeni bir plan oluşturun.`
    );
  }

  async togglePlanStatus(id: string, isCompleted: boolean): Promise<Plan> {
    if (isCompleted) {
      return this.markPlanComplete(id);
    } else {
      // Cannot uncomplete plans in ToDo API
      throw new Error(
        "Tamamlanan planlar tekrar açılamaz. Yeni bir plan oluşturun."
      );
    }
  }

  // Daily Plans
  async getDailyPlans(date: string): Promise<DailyPlans> {
    // Use regular getPlans with date filter
    const plans = await this.getPlans({ date });
    const totalDuration = plans.reduce((sum, plan) => sum + plan.duration, 0);
    const completedDuration = plans
      .filter((plan) => plan.isCompleted)
      .reduce((sum, plan) => sum + plan.duration, 0);

    return {
      date,
      plans,
      totalDuration,
      completedDuration,
      completionRate:
        totalDuration > 0 ? (completedDuration / totalDuration) * 100 : 0,
    };
  }

  // Weekly Progress
  async getWeeklyProgress(weekStart: string): Promise<WeeklyProgress> {
    // Don't make API calls if weekStart is empty (optimization)
    if (!weekStart) {
      return {
        week: "",
        days: [],
        totalMinutes: 0,
        completedMinutes: 0,
        averageDaily: 0,
      };
    }

    // Mock implementation since ToDo API doesn't have this endpoint
    const days = [];
    const startDate = new Date(weekStart);

    for (let i = 0; i < 7; i++) {
      const date = new Date(startDate);
      date.setDate(startDate.getDate() + i);
      const dateStr = date.toISOString().split("T")[0];

      try {
        const dailyPlans = await this.getDailyPlans(dateStr);
        days.push({
          date: dateStr,
          totalMinutes: dailyPlans.totalDuration,
          completedMinutes: dailyPlans.completedDuration,
        });
      } catch {
        days.push({
          date: dateStr,
          totalMinutes: 0,
          completedMinutes: 0,
        });
      }
    }

    const totalMinutes = days.reduce((sum, day) => sum + day.totalMinutes, 0);
    const completedMinutes = days.reduce(
      (sum, day) => sum + day.completedMinutes,
      0
    );

    return {
      week: weekStart,
      days,
      totalMinutes,
      completedMinutes,
      averageDaily: totalMinutes / 7,
    };
  }

  // Plan Templates
  async getPlanTemplates(): Promise<PlanTemplate[]> {
    // Return empty array since ToDo API doesn't have templates
    return [];
  }

  async getPlanTemplateById(id: string): Promise<PlanTemplate> {
    // Remove unused parameter warning by using the parameter
    console.warn(`Plan template ${id} not supported in ToDo API`);
    throw new Error("Plan templates not supported in ToDo API");
  }

  async createPlanTemplate(
    templateData: CreatePlanTemplateRequest
  ): Promise<PlanTemplate> {
    // Remove unused parameter warning by using the parameter
    console.warn(`Template creation not supported:`, templateData);
    throw new Error("Plan templates not supported in ToDo API");
  }

  async deletePlanTemplate(id: string): Promise<void> {
    // Remove unused parameter warning by using the parameter
    console.warn(`Template deletion ${id} not supported in ToDo API`);
    throw new Error("Plan templates not supported in ToDo API");
  }

  async createPlanFromTemplate(
    templateId: string,
    startTime: string
  ): Promise<Plan> {
    // Remove unused parameter warning by using the parameter
    console.warn(
      `Template to plan conversion not supported:`,
      templateId,
      startTime
    );
    throw new Error("Plan templates not supported in ToDo API");
  }

  // New method for getting plans in date ranges (for lazy loading)
  async getPlansInRange(startDate: string, endDate: string): Promise<Plan[]> {
    return this.getPlans({ startDate, endDate });
  }
}

// Type definitions for ToDo API responses
interface TodoApiResponse {
  id: number;
  title: string;
  description: string | null;
  forDate: string;
  userIntendedStartTime: string | null;
  targetWorkDuration: string | null;
  accumulatedWorkDuration: string;
  status: "Open" | "Overdue" | "Completed";
  isManuallyCompleted: boolean;
  tags: {
    id: number;
    name: string;
    color: string;
    description: string;
    isSystemDefined: boolean;
    isArchived: boolean;
  }[];
}
