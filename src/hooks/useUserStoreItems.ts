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
      revalidateOnFocus: true,
      revalidateOnReconnect: true,
    }
  );

  return {
    userStoreItems: data,
    isLoadingUserStoreItems: isLoading,
    userStoreItemsError: error,
    mutateUserStoreItems: mutate,
  };
}
