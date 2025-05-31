export interface Plan {
  id: string;
  userId: string;
  title: string;
  description?: string;
  startTime: string; // ISO date string
  endTime: string; // ISO date string
  duration: number; // in minutes
  tagId?: string;
  tagName?: string;
  color?: string;
  isCompleted: boolean;
  isOverdue: boolean;
  isRecurring: boolean;
  recurringPattern?: RecurringPattern;
  createdAt: string;
  updatedAt: string;
}

export interface RecurringPattern {
  type: "daily" | "weekly" | "monthly";
  interval: number; // every X days/weeks/months
  daysOfWeek?: number[]; // 0-6, Sunday is 0
  endDate?: string; // ISO date string
}

export interface PlanTemplate {
  id: string;
  userId: string;
  title: string;
  description?: string;
  duration: number; // in minutes
  tags: PlanTemplateTag[];
  color?: string;
  estimatedHours: number;
  isPublic: boolean;
  usageCount: number;
  createdAt: string;
  updatedAt: string;
}

export interface PlanTemplateTag {
  id: string;
  name: string;
  color: string;
}

export interface DailyPlans {
  date: string; // YYYY-MM-DD
  plans: Plan[];
  totalDuration: number; // in minutes
  completedDuration: number; // in minutes
  completionRate: number; // 0-100
}

export interface WeeklyProgress {
  week: string; // YYYY-WW format
  days: {
    date: string;
    totalMinutes: number;
    completedMinutes: number;
  }[];
  totalMinutes: number;
  completedMinutes: number;
  averageDaily: number;
}

export interface CreatePlanRequest {
  title: string;
  description?: string;
  startTime: string; // ISO date string
  endTime?: string; // ISO date string - now optional
  tagId?: string;
  color?: string;
  isRecurring?: boolean;
  recurringPattern?: RecurringPattern;
}

export interface UpdatePlanRequest {
  title?: string;
  description?: string;
  startTime?: string;
  endTime?: string;
  tagId?: string;
  color?: string;
  isCompleted?: boolean;
  isRecurring?: boolean;
  recurringPattern?: RecurringPattern;
}

export interface CreatePlanTemplateRequest {
  title: string;
  description?: string;
  duration: number;
  tagIds: string[];
  color?: string;
  isPublic?: boolean;
}

export interface PlanFilters {
  date?: string; // YYYY-MM-DD
  startDate?: string; // YYYY-MM-DD
  endDate?: string; // YYYY-MM-DD
  tagId?: string;
  isCompleted?: boolean;
  isRecurring?: boolean;
}
