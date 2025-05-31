import { fetchWithAuth } from "./authFetch";
import { AuthContextType } from "../context/AuthContext";

const API_BASE = "https://climbupapi.duckdns.org/api";

export interface UserStatsSummary {
  totalFocusDurationSeconds: number;
  totalCompletedSessions: number;
  totalStartedSessions: number;
  sessionCompletionRate: number;
  averageSessionDurationSeconds: number;
  longestSingleSessionDurationSeconds: number;
  totalToDosCompletedWithFocus: number;
  currentStreakDays: number;
  longestStreakDays: number;
  lastSessionCompletionDate?: string;
}

export interface PeriodFocusStats {
  startDate: string;
  endDate: string;
  totalFocusDurationSeconds: number;
  totalCompletedSessions: number;
}

export interface TagFocusStats {
  tagId: number;
  tagName: string;
  tagColor: string;
  totalFocusDurationSeconds: number;
  totalCompletedSessions: number;
}

export interface DailyFocusSummary {
  date: string;
  totalFocusDurationSecondsToday: number;
  completedSessionsToday: number;
}

export class StatisticsService {
  constructor(private authHelpers: AuthContextType) {}

  // Get user statistics summary
  async getUserStatsSummary(): Promise<UserStatsSummary> {
    const response = await fetchWithAuth(
      `${API_BASE}/Statistics/summary`,
      {},
      this.authHelpers
    );

    if (!response.ok) {
      throw new Error(`Failed to fetch user stats: ${response.status}`);
    }

    return response.json();
  }

  // Get period focus statistics
  async getPeriodFocusStats(
    startDate: string,
    endDate: string
  ): Promise<PeriodFocusStats> {
    const params = new URLSearchParams({
      startDate,
      endDate,
    });

    const response = await fetchWithAuth(
      `${API_BASE}/Statistics/period?${params}`,
      {},
      this.authHelpers
    );

    if (!response.ok) {
      throw new Error(`Failed to fetch period stats: ${response.status}`);
    }

    return response.json();
  }

  // Get tag focus statistics
  async getTagFocusStats(
    startDate: string,
    endDate: string
  ): Promise<TagFocusStats[]> {
    const params = new URLSearchParams({
      startDate,
      endDate,
    });

    const response = await fetchWithAuth(
      `${API_BASE}/Statistics/tags?${params}`,
      {},
      this.authHelpers
    );

    if (!response.ok) {
      throw new Error(`Failed to fetch tag stats: ${response.status}`);
    }

    return response.json();
  }

  // Get daily focus statistics for a specific date
  async getDailyFocusStats(date: string): Promise<DailyFocusSummary> {
    const params = new URLSearchParams({ date });

    const response = await fetchWithAuth(
      `${API_BASE}/Statistics/daily?${params}`,
      {},
      this.authHelpers
    );

    if (!response.ok) {
      throw new Error(`Failed to fetch daily stats: ${response.status}`);
    }

    return response.json();
  }

  // Get daily focus statistics for a date range
  async getDailyRangeStats(
    startDate: string,
    endDate: string
  ): Promise<DailyFocusSummary[]> {
    const params = new URLSearchParams({
      startDate,
      endDate,
    });

    const response = await fetchWithAuth(
      `${API_BASE}/Statistics/daily-range?${params}`,
      {},
      this.authHelpers
    );

    if (!response.ok) {
      throw new Error(`Failed to fetch daily range stats: ${response.status}`);
    }

    return response.json();
  }

  // Helper function to format seconds to hours:minutes
  formatDuration(seconds: number): string {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);

    if (hours > 0) {
      return `${hours}s ${minutes}dk`;
    }
    return `${minutes}dk`;
  }

  // Helper function to format seconds to decimal hours
  formatHours(seconds: number): number {
    return Math.round((seconds / 3600) * 10) / 10;
  }
}
