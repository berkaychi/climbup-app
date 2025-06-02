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

// Variable to hold the promise of an ongoing token refresh
let ongoingRefreshPromise: Promise<string> | null = null;

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
  }

  const originalResponse = await fetch(url, options);

  if (originalResponse.status === 401) {
    if (!ongoingRefreshPromise) {
      ongoingRefreshPromise = new Promise<string>(async (resolve, reject) => {
        const refreshTokenString = authActions.getRefreshToken();

        if (!refreshTokenString) {
          authActions.logout();
          reject(new Error("No refresh token available. User logged out."));
          return;
        }

        try {
          const refreshResponse = await fetch(
            "https://climbupapi.duckdns.org/api/Auth/refresh",
            {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ refreshToken: refreshTokenString }),
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
            resolve(newData.accessToken);
          } else {
            const errorData = await refreshResponse.text();
            authActions.logout();
            reject(
              new Error(
                `Failed to refresh token: ${refreshResponse.status} ${errorData}. User logged out.`
              )
            );
          }
        } catch (error) {
          console.error(
            "[fetchWithAuth] Error during token refresh API call or subsequent logic:",
            error
          );
          authActions.logout();
          reject(
            new Error(
              `Error during token refresh process. User logged out. Original error: ${error}`
            )
          );
        }
      }).finally(() => {
        // Reset the promise once it's settled (resolved or rejected)
        ongoingRefreshPromise = null;
      });
    }

    try {
      const newAccessToken = await ongoingRefreshPromise;
      // If ongoingRefreshPromise resolved successfully, retry the original request
      (options.headers as Record<string, string>)[
        "Authorization"
      ] = `Bearer ${newAccessToken}`;
      return fetch(url, options);
    } catch (refreshError) {
      // If ongoingRefreshPromise rejected (e.g., logout happened or another error)
      // The error from the refresh promise (which should include "User logged out.") will propagate.
      throw refreshError;
    }
  }

  return originalResponse;
}
