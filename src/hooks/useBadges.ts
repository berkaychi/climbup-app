import useSWR from "swr";
import { useAuth } from "../stores/authStore";
import { swrFetcher } from "../lib/swrFetchers";
import {
  BadgeDefinitionResponseDto,
  UserBadgeResponseDto,
} from "../types/badges";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL;

// Cloudinary URL transformation for badge icons
const transformCloudinaryUrl = (originalUrl: string): string => {
  // If it's already a Cloudinary URL or a full URL, return as is
  if (
    originalUrl.includes("cloudinary.com") ||
    originalUrl.startsWith("http")
  ) {
    return originalUrl;
  }

  // If it's a path like "/images/badges/focus_sessions_1.png"
  // Transform it to Cloudinary URL with optimizations
  const cloudinaryBaseUrl = "https://res.cloudinary.com/dvlpiwat8/image/upload";
  const transformations = "c_fit,h_64,w_64,f_auto,q_auto"; // 64x64 optimized badge icons

  // Remove leading slash and .png extension from path to get the public_id
  const publicId = originalUrl
    .replace(/^\//, "")
    .replace(/\.(png|jpg|jpeg|gif|webp)$/i, "");

  return `${cloudinaryBaseUrl}/${transformations}/${publicId}`;
};

// Hook to get all badge definitions (gallery)
export function useBadgeDefinitions() {
  const swrKey = API_BASE_URL ? `${API_BASE_URL}/api/badges/definitions` : null;

  const { data, error, isLoading, mutate } = useSWR<
    BadgeDefinitionResponseDto[]
  >(swrKey, swrFetcher, {
    revalidateOnFocus: false,
    revalidateOnReconnect: true,
  });

  // Transform iconURLs to Cloudinary URLs
  const badgeDefinitions = data?.map((definition) => ({
    ...definition,
    levels: definition.levels.map((level) => ({
      ...level,
      iconURL: transformCloudinaryUrl(level.iconURL),
    })),
  }));

  return {
    badgeDefinitions,
    isLoadingBadgeDefinitions: isLoading,
    badgeDefinitionsError: error,
    mutateBadgeDefinitions: mutate,
  };
}

// Hook to get user's earned badges
export function useUserBadges() {
  const { user } = useAuth();
  const swrKey = user && API_BASE_URL ? `${API_BASE_URL}/api/badges/me` : null;

  const { data, error, isLoading, mutate } = useSWR<UserBadgeResponseDto[]>(
    swrKey,
    swrFetcher,
    {
      revalidateOnFocus: true,
      revalidateOnReconnect: true,
    }
  );

  // Transform iconURLs to Cloudinary URLs
  const userBadges = data?.map((badge) => ({
    ...badge,
    achievedLevel: {
      ...badge.achievedLevel,
      iconURL: transformCloudinaryUrl(badge.achievedLevel.iconURL),
    },
  }));

  return {
    userBadges,
    isLoadingUserBadges: isLoading,
    userBadgesError: error,
    mutateUserBadges: mutate,
  };
}

// NEW: Hook to get current user's badge progress (real-time tracking)
export function useUserBadgeProgress() {
  const { user } = useAuth();
  const swrKey =
    user && API_BASE_URL ? `${API_BASE_URL}/api/badges/me/progress` : null;

  const { data, error, isLoading, mutate } = useSWR<
    BadgeDefinitionResponseDto[]
  >(swrKey, swrFetcher, {
    revalidateOnFocus: true,
    revalidateOnReconnect: true,
    refreshInterval: 30000, // Refresh every 30 seconds for real-time progress
  });

  // Transform iconURLs to Cloudinary URLs
  const badgeProgress = data?.map((definition) => ({
    ...definition,
    levels: definition.levels.map((level) => ({
      ...level,
      iconURL: transformCloudinaryUrl(level.iconURL),
    })),
  }));

  return {
    badgeProgress,
    isLoadingBadgeProgress: isLoading,
    badgeProgressError: error,
    mutateBadgeProgress: mutate,
  };
}

// Hook to get specific user's badge progress (for viewing other users)
export function useSpecificUserBadgeProgress(userId: string | null) {
  const swrKey =
    userId && API_BASE_URL
      ? `${API_BASE_URL}/api/users/${userId}/badges/progress`
      : null;

  const { data, error, isLoading, mutate } = useSWR<
    BadgeDefinitionResponseDto[]
  >(swrKey, swrFetcher, {
    revalidateOnFocus: false,
    revalidateOnReconnect: true,
  });

  // Transform iconURLs to Cloudinary URLs
  const badgeProgress = data?.map((definition) => ({
    ...definition,
    levels: definition.levels.map((level) => ({
      ...level,
      iconURL: transformCloudinaryUrl(level.iconURL),
    })),
  }));

  return {
    badgeProgress,
    isLoadingBadgeProgress: isLoading,
    badgeProgressError: error,
    mutateBadgeProgress: mutate,
  };
}

// Enhanced combined hook for easier usage with progress tracking
export function useBadges() {
  const badgeDefinitions = useBadgeDefinitions();
  const userBadges = useUserBadges();
  const userBadgeProgress = useUserBadgeProgress();

  return {
    ...badgeDefinitions,
    ...userBadges,
    ...userBadgeProgress,
    isLoading:
      badgeDefinitions.isLoadingBadgeDefinitions ||
      userBadges.isLoadingUserBadges ||
      userBadgeProgress.isLoadingBadgeProgress,
    error:
      badgeDefinitions.badgeDefinitionsError ||
      userBadges.userBadgesError ||
      userBadgeProgress.badgeProgressError,
  };
}
