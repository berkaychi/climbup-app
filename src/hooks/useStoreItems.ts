import useSWR from "swr";
import { useAuth } from "../stores/authStore";
import { swrFetcher } from "../lib/swrFetchers";
import { StoreItemResponseDto } from "../types/store";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL;

export function useStoreItems() {
  const { user } = useAuth();
  const swrKey =
    user && API_BASE_URL ? `${API_BASE_URL}/api/Store/items` : null;

  const { data, error, isLoading, mutate } = useSWR<StoreItemResponseDto[]>(
    swrKey,
    swrFetcher,
    {
      revalidateOnFocus: false, // Don't refresh on tab focus to reduce API calls
      revalidateOnReconnect: true,
      dedupingInterval: 600000, // Cache for 10 minutes - store items don't change often
      refreshInterval: 0, // No automatic refresh
    }
  );

  return {
    storeItems: data,
    isLoadingStoreItems: isLoading,
    storeItemsError: error,
    mutateStoreItems: mutate,
  };
}
