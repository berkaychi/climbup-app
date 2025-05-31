// climbup-app/src/hooks/useTags.ts
import useSWR from "swr";
import { useAuth, AuthContextType } from "../context/AuthContext";
import { swrFetcher } from "../lib/swrFetchers";

// Bu DTO, projenin types/interfaces gibi global bir dosyasına taşınabilir.
export interface TagDto {
  id: number;
  name: string;
  color: string;
  description?: string;
  isSystemDefined: boolean;
  isArchived: boolean;
}

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL;

export function useTags() {
  const authContext = useAuth();
  const swrKey =
    authContext.user && API_BASE_URL ? `${API_BASE_URL}/api/Tag` : null;

  const { data, error, isLoading, mutate } = useSWR<TagDto[]>(
    swrKey,
    (url: string) => swrFetcher(url, authContext as AuthContextType),
    {
      revalidateOnFocus: true,
      revalidateOnReconnect: true,
    }
  );

  return {
    tags: data,
    isLoadingTags: isLoading,
    tagError: error,
    mutateTags: mutate,
  };
}
