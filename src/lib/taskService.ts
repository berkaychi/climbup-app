import { fetchWithAuth } from "./authFetch";
import { AuthContextType } from "../stores/authStore";
import { API_CONFIG, API_ENDPOINTS } from "@/config/api";

const API_BASE = API_CONFIG.BASE_URL;

export enum TaskType {
  DailyFocusDuration = 1,
  WeeklyFocusDuration = 2,
}

export enum TaskStatus {
  Pending = 1,
  InProgress = 2,
  Completed = 3,
  Failed = 4,
  Cancelled = 5,
}

export interface AppTaskDefinition {
  id: number;
  title: string;
  description: string;
  taskType: TaskType;
  targetProgress: number;
  recurrence: string;
}

export interface Task {
  id: number;
  appTaskDefinition: AppTaskDefinition;
  assignedDate: string;
  dueDate: string;
  currentProgress: number;
  status: TaskStatus;
  completedDate?: string | null;
}

export interface CurrentTasksResponse {
  dailyTasks: Task[];
  weeklyTasks: Task[];
}

export class TaskService {
  constructor(private authHelpers: AuthContextType) {}

  async getCurrentTasks(): Promise<CurrentTasksResponse> {
    const url = `${API_BASE}${API_ENDPOINTS.TASKS}`;

    const response = await fetchWithAuth(url, {}, this.authHelpers);

    if (!response.ok) {
      throw new Error(`Failed to fetch current tasks: ${response.status}`);
    }

    return response.json();
  }

  // Helper function to get task type display name
  getTaskTypeDisplayName(taskType: TaskType): string {
    switch (taskType) {
      case TaskType.DailyFocusDuration:
        return "Günlük Odak";
      case TaskType.WeeklyFocusDuration:
        return "Haftalık Odak";
      default:
        return "Bilinmeyen";
    }
  }

  // Helper function to get task status display name
  getTaskStatusDisplayName(status: TaskStatus): string {
    switch (status) {
      case TaskStatus.Pending:
        return "Beklemede";
      case TaskStatus.InProgress:
        return "Devam Ediyor";
      case TaskStatus.Completed:
        return "Tamamlandı";
      case TaskStatus.Failed:
        return "Başarısız";
      case TaskStatus.Cancelled:
        return "İptal Edildi";
      default:
        return "Bilinmeyen";
    }
  }

  // Helper function to get progress percentage
  getProgressPercentage(current: number, target: number): number {
    if (target === 0) return 0;
    return Math.min(Math.round((current / target) * 100), 100);
  }

  // Helper function to format duration in minutes
  formatDuration(minutes: number): string {
    const hours = Math.floor(minutes / 60);
    const remainingMinutes = minutes % 60;

    if (hours > 0) {
      return `${hours}s ${remainingMinutes}dk`;
    }
    return `${minutes}dk`;
  }

  // Helper function to get task icon based on type
  getTaskIcon(taskType: TaskType): string {
    switch (taskType) {
      case TaskType.DailyFocusDuration:
        return "📅";
      case TaskType.WeeklyFocusDuration:
        return "📊";
      default:
        return "🎯";
    }
  }

  // Helper function to get status color
  getStatusColor(status: TaskStatus): string {
    switch (status) {
      case TaskStatus.Pending:
        return "text-yellow-600 dark:text-yellow-400";
      case TaskStatus.InProgress:
        return "text-blue-600 dark:text-blue-400";
      case TaskStatus.Completed:
        return "text-green-600 dark:text-green-400";
      case TaskStatus.Failed:
        return "text-red-600 dark:text-red-400";
      case TaskStatus.Cancelled:
        return "text-gray-600 dark:text-gray-400";
      default:
        return "text-gray-600 dark:text-gray-400";
    }
  }

  // Helper function to get progress bar color
  getProgressBarColor(percentage: number, status: TaskStatus): string {
    if (status === TaskStatus.Completed) {
      return "bg-green-500";
    }
    if (percentage >= 80) {
      return "bg-green-500";
    }
    if (percentage >= 50) {
      return "bg-yellow-500";
    }
    return "bg-orange-500";
  }

  // Helper function to check if task is near deadline
  isNearDeadline(dueDate: string): boolean {
    const due = new Date(dueDate);
    const now = new Date();
    const hoursUntilDue = (due.getTime() - now.getTime()) / (1000 * 60 * 60);

    return hoursUntilDue <= 6 && hoursUntilDue > 0; // Son 6 saat
  }

  // Helper function to check if task is overdue
  isOverdue(dueDate: string, status: TaskStatus): boolean {
    if (status === TaskStatus.Completed) return false;

    const due = new Date(dueDate);
    const now = new Date();

    return now > due;
  }
}
