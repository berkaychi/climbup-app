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
      revalidateOnFocus: true,
      revalidateOnReconnect: true,
    }
  );

  return {
    storeItems: data,
    isLoadingStoreItems: isLoading,
    storeItemsError: error,
    mutateStoreItems: mutate,
  };
}
