export const API_CONFIG = {
  BASE_URL: process.env.NEXT_PUBLIC_API_URL || "https://climbupapi.duckdns.org",
  TIMEOUT: 10000,
  RETRY_ATTEMPTS: 3,
  RETRY_DELAY: 1000,
} as const;

export const API_ENDPOINTS = {
  AUTH: {
    LOGIN: "/api/Auth/login",
    REGISTER: "/api/Auth/register",
    REFRESH: "/api/Auth/refresh",
    LOGOUT: "/api/Auth/logout",
    CONFIRM_EMAIL: "/api/Auth/confirm-email",
    FORGOT_PASSWORD: "/api/Auth/password/reset",
    RESET_PASSWORD: "/api/Auth/password/reset/confirm",
  },
  USERS: {
    PROFILE: "/api/Users/profile",
    ME: "/api/Users/me",
    INITIATE_DELETION: "/api/Users/me/initiate-deletion",
    CONFIRM_DELETION: "/api/Users/me/confirm-deletion",
    CONFIRM_EMAIL_CHANGE: "/api/Users/confirm-email-change",
  },
  PLANS: {
    BASE: "/api/ToDo",
    COMPLETE: (id: string) => `/api/ToDo/${id}/complete`,
    BY_ID: (id: string) => `/api/ToDo/${id}`,
  },
  STATISTICS: {
    SUMMARY: "/api/Statistics/summary",
    PERIOD: "/api/Statistics/period",
    TAGS: "/api/Statistics/tags",
    DAILY: "/api/Statistics/daily",
    DAILY_RANGE: "/api/Statistics/daily-range",
  },
  STORE: {
    ITEMS: "/api/Store/items",
    MY_ITEMS: "/api/Store/my-items",
    PURCHASE: "/api/Store/purchase",
    USE_CONSUMABLE: "/api/Store/use-consumable",
  },
  BADGES: {
    DEFINITIONS: "/api/badges/definitions",
    USER_BADGES: "/api/badges/user",
  },
  LEADERBOARD: "/api/Leaderboard",
  TASKS: "/api/task/my-current",
  SESSION_TYPES: "/api/SessionType",
  TAGS: "/api/tags",
} as const;

export const SWR_KEYS = {
  AUTH: {
    USER: "auth/user",
  },
  PLANS: {
    ALL: "plans/all",
    BY_DATE: (date: string) => `plans/date/${date}`,
    BY_ID: (id: string) => `plans/${id}`,
  },
  STATISTICS: {
    SUMMARY: "statistics/summary",
    PERIOD: (start: string, end: string) => `statistics/period/${start}/${end}`,
    DAILY: (date: string) => `statistics/daily/${date}`,
  },
  STORE: {
    ITEMS: "store/items",
    USER_ITEMS: "store/user-items",
  },
  BADGES: {
    DEFINITIONS: "badges/definitions",
    USER_BADGES: "badges/user",
  },
  LEADERBOARD: {
    BASE: "leaderboard",
    WITH_FILTERS: (filters: Record<string, string>) =>
      `leaderboard?${new URLSearchParams(filters).toString()}`,
  },
} as const;
