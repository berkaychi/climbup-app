import useSWR from "swr";
import { useAuth } from "../stores/authStore";
import { swrFetcher } from "../lib/swrFetchers";
import { UserStoreItemResponseDto } from "../types/store";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL;

export function useUserStoreItems() {
  const authContext = useAuth();
  const swrKey =
    authContext.user && API_BASE_URL
      ? `${API_BASE_URL}/api/Store/my-items`
      : null;

  const { data, error, isLoading, mutate } = useSWR<UserStoreItemResponseDto[]>(
    swrKey,
    swrFetcher,
    {
      revalidateOnFocus: false, // Don't refresh on tab focus to reduce API calls
      revalidateOnReconnect: true,
      dedupingInterval: 300000, // Cache for 5 minutes
      refreshInterval: 0, // No automatic refresh
    }
  );

  return {
    userStoreItems: data,
    isLoadingUserStoreItems: isLoading,
    userStoreItemsError: error,
    mutateUserStoreItems: mutate,
  };
}
