import { fetchWithAuth } from "./authFetch";
import { AuthContextType } from "../context/AuthContext";

const API_BASE = "https://climbupapi.duckdns.org/api";

export enum LeaderboardSortCriteria {
  TotalFocusDuration = "TotalFocusDuration",
  TotalCompletedSessions = "TotalCompletedSessions",
}

export enum LeaderboardPeriod {
  AllTime = "AllTime",
  CurrentWeek = "CurrentWeek",
  CurrentMonth = "CurrentMonth",
}

export interface LeaderboardEntry {
  rank: number;
  userId: string;
  fullName: string;
  profilePictureUrl?: string | null;
  score: number;
  formattedScore?: string | null;
}

export interface LeaderboardResponse {
  entries: LeaderboardEntry[];
  totalEntries: number;
  totalPages: number;
  currentPage: number;
  pageSize: number;
}

export interface LeaderboardFilters {
  sortBy?: LeaderboardSortCriteria;
  period?: LeaderboardPeriod;
  limit?: number;
  page?: number;
}

export class LeaderboardService {
  constructor(private authHelpers: AuthContextType) {}

  async getLeaderboard(
    filters?: LeaderboardFilters
  ): Promise<LeaderboardResponse> {
    const params = new URLSearchParams();

    if (filters?.sortBy) {
      params.append("SortBy", filters.sortBy);
    }

    if (filters?.period) {
      params.append("Period", filters.period);
    }

    if (filters?.limit) {
      params.append("Limit", filters.limit.toString());
    }

    if (filters?.page) {
      params.append("Page", filters.page.toString());
    }

    const queryString = params.toString();
    const url = `${API_BASE}/Leaderboard${
      queryString ? `?${queryString}` : ""
    }`;

    const response = await fetchWithAuth(url, {}, this.authHelpers);

    if (!response.ok) {
      throw new Error(`Failed to fetch leaderboard: ${response.status}`);
    }

    return response.json();
  }

  // Helper function to format duration from seconds
  formatDuration(seconds: number): string {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);

    if (hours > 0) {
      return `${hours}s ${minutes}dk`;
    }
    return `${minutes}dk`;
  }

  // Helper function to get climbing rank emoji
  getClimbingRankEmoji(rank: number): string {
    if (rank === 1) return "🏆";
    if (rank === 2) return "🥈";
    if (rank === 3) return "🥉";
    if (rank <= 10) return "🧗‍♂️";
    if (rank <= 25) return "⛰️";
    return "🏔️";
  }

  // Helper function to get climbing level based on score
  getClimbingLevel(score: number, sortBy: LeaderboardSortCriteria): string {
    if (sortBy === LeaderboardSortCriteria.TotalFocusDuration) {
      const hours = score / 3600;
      if (hours >= 1000) return "Everest Zirvesi";
      if (hours >= 500) return "K2 Tırmanıcısı";
      if (hours >= 200) return "Dağ Ustası";
      if (hours >= 100) return "Kaya Tırmanıcısı";
      if (hours >= 50) return "Tecrübeli Tırmanıcı";
      if (hours >= 20) return "Orta Seviye";
      if (hours >= 5) return "Başlangıç Seviyesi";
      return "Yeni Başlayan";
    } else {
      if (score >= 1000) return "Seans Ustası";
      if (score >= 500) return "Odaklanma Şampiyonu";
      if (score >= 200) return "Konsantrasyon Uzmanı";
      if (score >= 100) return "Düzenli Çalışan";
      if (score >= 50) return "Kararlı Tırmanıcı";
      if (score >= 20) return "Azimli Öğrenci";
      if (score >= 5) return "Umutlu Başlangıç";
      return "İlk Adım";
    }
  }
}
