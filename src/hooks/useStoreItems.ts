import useSWR from "swr";
import { useAuth, AuthContextType } from "../context/AuthContext";
import { swrFetcher } from "../lib/swrFetchers";
import { StoreItemResponseDto } from "../types/store";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL;

export function useStoreItems() {
  const authContext = useAuth();
  const swrKey =
    authContext.user && API_BASE_URL ? `${API_BASE_URL}/api/Store/items` : null;

  const { data, error, isLoading, mutate } = useSWR<StoreItemResponseDto[]>(
    swrKey,
    (url: string) => swrFetcher(url, authContext as AuthContextType),
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
