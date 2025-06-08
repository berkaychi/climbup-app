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
  isLoading: boolean;
  isAuthenticated: boolean;
}

interface AuthActions {
  setUser: (user: User | null) => void;
  setLoading: (loading: boolean) => void;
  updateUser: (updates: Partial<User>) => void;
  login: (accessToken: string, refreshToken: string, user: User) => void;
  logout: () => void;
  initialize: () => Promise<void>;
}

type AuthStore = AuthState & AuthActions;

const initialState: AuthState = {
  user: null,
  isLoading: true,
  isAuthenticated: false,
};

export const useAuthStore = create<AuthStore>()(
  persist(
    (set, get) => ({
      ...initialState,

      setUser: (user) =>
        set({
          user,
          isAuthenticated: !!user,
        }),

      setLoading: (isLoading) => set({ isLoading }),

      updateUser: (updates) => {
        const currentUser = get().user;
        if (currentUser) {
          const updatedUser = { ...currentUser, ...updates };
          set({ user: updatedUser });
          localStorage.setItem("userData", JSON.stringify(updatedUser));
        }
      },

      login: (accessToken, refreshToken, user) => {
        tokenManager.setTokens(accessToken, refreshToken);
        localStorage.setItem("userData", JSON.stringify(user));
        set({
          user,
          isAuthenticated: true,
          isLoading: false,
        });
      },

      logout: () => {
        tokenManager.clearAllTokens();
        localStorage.removeItem("userData");
        set({
          user: null,
          isAuthenticated: false,
          isLoading: false,
        });
      },

      initialize: async () => {
        try {
          // Migrate old tokens first
          tokenManager.migrateOldTokens();

          const storedToken = tokenManager.getAccessToken();
          const storedUser = localStorage.getItem("userData");
          const storedRefreshToken = tokenManager.getRefreshToken();

          if (storedToken && storedUser && storedRefreshToken) {
            const parsedUser = JSON.parse(storedUser);
            set({
              user: parsedUser,
              isAuthenticated: true,
              isLoading: false,
            });
          } else if (storedToken || storedUser || storedRefreshToken) {
            // Clean up incomplete data
            tokenManager.clearAllTokens();
            localStorage.removeItem("userData");
            set({
              user: null,
              isAuthenticated: false,
              isLoading: false,
            });
          } else {
            set({
              user: null,
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
            isAuthenticated: false,
            isLoading: false,
          });
        }
      },
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

// Helper functions for backwards compatibility
export const useAuth = () => {
  const store = useAuthStore();

  return {
    ...store,
    accessToken: tokenManager.getAccessToken(),
    getAccessToken: () => tokenManager.getAccessToken(),
    getRefreshToken: () => tokenManager.getRefreshToken(),
    updateTokensAndUser: (
      newAccessToken: string,
      newRefreshToken: string,
      userData: User
    ) => {
      tokenManager.setTokens(newAccessToken, newRefreshToken);
      localStorage.setItem("userData", JSON.stringify(userData));
      store.setUser(userData);
    },
  };
};
