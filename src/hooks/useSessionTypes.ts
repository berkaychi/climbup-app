import useSWR from "swr";
import { swrFetcher } from "../lib/swrFetchers";
import { useAuth, AuthContextType } from "../context/AuthContext";

export interface SessionTypeResponseDto {
  id: number; // Updated to number
  name: string;
  description: string | null;
  workDuration: number; // in seconds
  breakDuration: number; // in seconds
  numberOfCycles: number | null; // Updated to number | null
  isSystemDefined: boolean;
  isActive: boolean;
}

const useSessionTypes = () => {
  const authContext = useAuth();
  const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL;

  const swrKey =
    authContext.user && API_BASE_URL ? `${API_BASE_URL}/api/SessionType` : null;

  const { data, error, isLoading, mutate } = useSWR<SessionTypeResponseDto[]>(
    swrKey,
    (url: string) => swrFetcher(url, authContext as AuthContextType)
  );

  const sessionTypes = data?.filter((st) => st.isActive);

  return {
    sessionTypes,
    isLoadingSessionTypes: isLoading,
    sessionTypeError: error,
    mutateSessionTypes: mutate,
  };
};

export default useSessionTypes;
