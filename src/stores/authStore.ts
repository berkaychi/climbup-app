import { create } from "zustand";
import { persist } from "zustand/middleware";
import { tokenManager } from "@/lib/auth/tokenManager";

export interface User {
  id: string;
  fullName: string;
  userName: string;
  email: string;
  profilePictureUrl?: string | null;
  roles: string[];
}

interface AuthState {
  user: User | null;
  accessToken: string | null;
  isLoading: boolean;
  isAuthenticated: boolean;
}

interface AuthActions {
  // State setters
  setUser: (user: User | null) => void;
  setLoading: (loading: boolean) => void;
  setAccessToken: (token: string | null) => void;

  // Main auth actions
  login: (accessToken: string, refreshToken: string, user: User) => void;
  logout: (shouldRedirect?: boolean) => Promise<void>;
  initialize: () => Promise<void>;

  // User management
  updateUser: (updates: Partial<User>) => void;
  updateTokensAndUser: (
    newAccessToken: string,
    newRefreshToken: string,
    userData: User
  ) => void;

  // Token helpers
  getAccessToken: () => string | null;
  getRefreshToken: () => string | null;
}

type AuthStore = AuthState & AuthActions;

const initialState: AuthState = {
  user: null,
  accessToken: null,
  isLoading: true,
  isAuthenticated: false,
};

export const useAuthStore = create<AuthStore>()(
  persist(
    (set, get) => ({
      ...initialState,

      // State setters
      setUser: (user) =>
        set({
          user,
          isAuthenticated: !!user,
        }),

      setLoading: (isLoading) => set({ isLoading }),

      setAccessToken: (accessToken) => set({ accessToken }),

      // Main auth actions
      login: (accessToken, refreshToken, user) => {
        tokenManager.setTokens(accessToken, refreshToken);
        localStorage.setItem("userData", JSON.stringify(user));
        set({
          user,
          accessToken,
          isAuthenticated: true,
          isLoading: false,
        });
      },

      logout: async (shouldRedirect: boolean = true) => {
        const storedRefreshToken = tokenManager.getRefreshToken();
        const currentAccessToken = get().accessToken;

        // API logout call
        if (storedRefreshToken && currentAccessToken) {
          try {
            const response = await fetch(
              "https://climbupapi.duckdns.org/api/Auth/logout",
              {
                method: "POST",
                headers: {
                  "Content-Type": "application/json",
                  Authorization: `Bearer ${currentAccessToken}`,
                },
                body: JSON.stringify({ refreshToken: storedRefreshToken }),
              }
            );
            if (response.ok) {
              console.log("Successfully logged out from API.");
            } else {
              const errorBody = await response.text();
              console.error(
                "API logout failed:",
                response.status,
                response.statusText,
                errorBody
              );
            }
          } catch (error) {
            console.error("Error during API logout call:", error);
          }
        }

        // Clean up local state
        tokenManager.clearAllTokens();
        localStorage.removeItem("userData");
        set({
          user: null,
          accessToken: null,
          isAuthenticated: false,
          isLoading: false,
        });

        // Redirect if needed
        if (shouldRedirect && typeof window !== "undefined") {
          window.location.href = "/login";
        }
      },

      initialize: async () => {
        try {
          // Migrate old tokens first
          tokenManager.migrateOldTokens();

          const storedToken = tokenManager.getAccessToken();
          const storedUser = localStorage.getItem("userData");
          const storedRefreshToken = tokenManager.getRefreshToken();

          console.log(
            "Auth init - Token:",
            !!storedToken,
            "User:",
            !!storedUser,
            "Refresh:",
            !!storedRefreshToken
          );

          if (storedToken && storedUser && storedRefreshToken) {
            try {
              const parsedUser = JSON.parse(storedUser);
              set({
                user: parsedUser,
                accessToken: storedToken,
                isAuthenticated: true,
                isLoading: false,
              });
              console.log(
                "Auth restored successfully for user:",
                parsedUser.userName
              );
            } catch (error) {
              console.error("Error parsing stored user data:", error);
              // Clean up on error
              tokenManager.clearAllTokens();
              localStorage.removeItem("userData");
              set({
                user: null,
                accessToken: null,
                isAuthenticated: false,
                isLoading: false,
              });
            }
          } else if (storedToken || storedUser || storedRefreshToken) {
            // Clean up incomplete data
            console.warn("Incomplete token data found, cleaning up...");
            tokenManager.clearAllTokens();
            localStorage.removeItem("userData");
            set({
              user: null,
              accessToken: null,
              isAuthenticated: false,
              isLoading: false,
            });
          } else {
            set({
              user: null,
              accessToken: null,
              isAuthenticated: false,
              isLoading: false,
            });
          }
        } catch (error) {
          console.error("Error initializing auth:", error);
          // Clean up on error
          tokenManager.clearAllTokens();
          localStorage.removeItem("userData");
          set({
            user: null,
            accessToken: null,
            isAuthenticated: false,
            isLoading: false,
          });
        }
      },

      // User management
      updateUser: (updates) => {
        const currentUser = get().user;
        if (currentUser) {
          const updatedUser = { ...currentUser, ...updates };
          localStorage.setItem("userData", JSON.stringify(updatedUser));
          set({ user: updatedUser });
        }
      },

      updateTokensAndUser: (newAccessToken, newRefreshToken, userData) => {
        tokenManager.setTokens(newAccessToken, newRefreshToken);
        localStorage.setItem("userData", JSON.stringify(userData));
        set({
          user: userData,
          accessToken: newAccessToken,
          isAuthenticated: true,
        });
      },

      // Token helpers
      getAccessToken: () => tokenManager.getAccessToken(),
      getRefreshToken: () => tokenManager.getRefreshToken(),
    }),
    {
      name: "auth-storage",
      partialize: (state) => ({
        user: state.user,
        isAuthenticated: state.isAuthenticated,
      }),
    }
  )
);

// Backward compatibility hook - using direct store to avoid re-render issues
export const useAuth = () => useAuthStore();

// Type alias for backward compatibility
export type AuthContextType = ReturnType<typeof useAuth>;
