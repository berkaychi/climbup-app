import useSWR from "swr";
import { useAuth } from "../stores/authStore";
import { swrFetcher } from "../lib/swrFetchers";
import { UserProfileResponseDto } from "../types/users";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL;

export function useUserProfile() {
  const authContext = useAuth();
  const swrKey =
    authContext.user && API_BASE_URL ? `${API_BASE_URL}/api/Users/me` : null;

  const { data, error, isLoading, mutate } = useSWR<UserProfileResponseDto>(
    swrKey,
    swrFetcher,
    {
      revalidateOnFocus: true,
      revalidateOnReconnect: true,
    }
  );

  return {
    userProfile: data,
    isLoadingUserProfile: isLoading,
    userProfileError: error,
    mutateUserProfile: mutate,
  };
}
