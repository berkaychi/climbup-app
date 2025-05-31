// climbup-app/src/lib/swrFetchers.ts
import { fetchWithAuth } from "./authFetch";
import { AuthContextType } from "../context/AuthContext";

export const swrFetcher = async (url: string, authHelpers: AuthContextType) => {
  const response = await fetchWithAuth(url, {}, authHelpers);

  if (!response.ok) {
    let errorInfo = "Bilinmeyen bir hata oluştu.";
    try {
      const errorData = await response.json();
      errorInfo = errorData.message || JSON.stringify(errorData);
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (_e) {
      errorInfo = `Sunucudan hata mesajı alınamadı (HTTP ${response.status})`;
    }
    const error: Error & { info?: string; status?: number } = new Error(
      `Veri çekilirken bir hata oluştu: ${response.status}`
    );
    error.info = errorInfo;
    error.status = response.status;
    throw error;
  }
  return response.json();
};
