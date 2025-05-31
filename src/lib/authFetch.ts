import { User } from "../context/AuthContext";

interface AuthActions {
  getAccessToken: () => string | null;
  getRefreshToken: () => string | null;
  updateTokensAndUser: (
    newAccessToken: string,
    newRefreshToken: string,
    userData: User
  ) => void;
  logout: () => void;
}

export async function fetchWithAuth(
  url: string,
  options: RequestInit = {},
  authActions: AuthActions
): Promise<Response> {
  const token = authActions.getAccessToken();

  options.headers = options.headers || {};
  if (token) {
    (options.headers as Record<string, string>)[
      "Authorization"
    ] = `Bearer ${token}`;
  } else {
  }

  const originalResponse = await fetch(url, options);

  if (originalResponse.status === 401) {
    const refreshToken = authActions.getRefreshToken();

    if (!refreshToken) {
      authActions.logout();
      // Hata fırlatmak yerine, belki de originalResponse'u döndürmek daha iyi olabilir
      // ki çağıran yer kendi mantığına göre davransın, ama logout sonrası bu çok önemli olmayabilir.
      throw new Error("No refresh token available. User logged out.");
    }

    try {
      const refreshResponse = await fetch(
        "https://climbupapi.duckdns.org/api/Auth/refresh", // Doğrudan API URL'i
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ refreshToken }),
        }
      );

      if (refreshResponse.ok) {
        const newData = await refreshResponse.json();
        authActions.updateTokensAndUser(
          newData.accessToken,
          newData.refreshToken,
          {
            id: newData.userId,
            fullName: newData.fullName,
            userName: newData.userName,
            email: newData.email,
            profilePictureUrl: newData.profilePictureUrl,
            roles: newData.roles || [],
          }
        );
        (options.headers as Record<string, string>)[
          "Authorization"
        ] = `Bearer ${newData.accessToken}`;
        return fetch(url, options); // Orijinal isteği yeni token ile tekrarla
      } else {
        const errorData = await refreshResponse.text(); // Hata detayını al
        authActions.logout();
        // Burada da originalResponse'u veya yeni bir Error'u döndürmek/fırlatmak düşünülebilir.
        // Şimdilik logout sonrası hata fırlatıyoruz.
        throw new Error(
          `Failed to refresh token: ${refreshResponse.status} ${errorData}. User logged out.`
        );
      }
    } catch (error) {
      console.error(
        "[fetchWithAuth] Error during token refresh API call or subsequent logic:",
        error
      ); // LOG
      authActions.logout();
      throw new Error(
        `Error during token refresh process. User logged out. Original error: ${error}`
      );
    }
  }

  return originalResponse;
}
