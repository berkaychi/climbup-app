"use client";

import Cookies from "js-cookie";
import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";
import { useRouter } from "next/navigation";

export interface User {
  id: string;
  fullName: string;
  userName: string;
  email: string;
  profilePictureUrl?: string | null;
  roles: string[];
}

export interface AuthContextType {
  user: User | null;
  accessToken: string | null;
  isLoading: boolean;
  login: (accessToken: string, refreshToken: string, userData: User) => void;
  logout: (shouldRedirect?: boolean) => void;
  updateTokensAndUser: (
    newAccessToken: string,
    newRefreshToken: string,
    userData: User
  ) => void;
  updateUser: (updatedFields: Partial<User>) => void;
  getAccessToken: () => string | null;
  getRefreshToken: () => string | null;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [accessToken, setAccessToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true); // Sayfa ilk yüklendiğinde token kontrolü için
  const router = useRouter();

  useEffect(() => {
    // Sayfa yüklendiğinde localStorage'dan token ve kullanıcı bilgilerini kontrol et
    const storedToken = localStorage.getItem("accessToken");
    const storedUser = localStorage.getItem("userData");
    const storedRefreshToken = localStorage.getItem("refreshToken");

    if (storedToken && storedUser && storedRefreshToken) {
      try {
        setAccessToken(storedToken);
        setUser(JSON.parse(storedUser));
      } catch (error) {
        console.error("Error parsing stored user data:", error);
        // Hatalı veri varsa temizle
        localStorage.removeItem("accessToken");
        localStorage.removeItem("refreshToken");
        localStorage.removeItem("userData");
      }
    } else if (storedToken || storedUser || storedRefreshToken) {
      // Eksik token verileri varsa hepsini temizle
      console.warn("Incomplete token data found, cleaning up...");
      localStorage.removeItem("accessToken");
      localStorage.removeItem("refreshToken");
      localStorage.removeItem("userData");
      Cookies.remove("accessToken", { path: "/" });
    }
    setIsLoading(false);
  }, []);

  const login = (
    newAccessToken: string,
    newRefreshToken: string,
    userData: User
  ) => {
    localStorage.setItem("accessToken", newAccessToken);
    Cookies.set("accessToken", newAccessToken, { expires: 7, path: "/" });
    localStorage.setItem("refreshToken", newRefreshToken); // Refresh token'ı da saklayalım
    localStorage.setItem("userData", JSON.stringify(userData));
    setAccessToken(newAccessToken);
    setUser(userData);

    // Login sonrası direkt home'a yönlendir
    router.push("/home");
  };

  const updateTokensAndUser = (
    newAccessToken: string,
    newRefreshToken: string,
    userData: User
  ) => {
    localStorage.setItem("accessToken", newAccessToken);
    Cookies.set("accessToken", newAccessToken, { expires: 7, path: "/" });
    localStorage.setItem("refreshToken", newRefreshToken);
    localStorage.setItem("userData", JSON.stringify(userData));
    setAccessToken(newAccessToken);
    setUser(userData);
    // Bu fonksiyon yönlendirme yapmaz
  };

  const updateUser = (updatedFields: Partial<User>) => {
    setUser((prev) => {
      if (!prev) return prev;
      const newUser = { ...prev, ...updatedFields };
      localStorage.setItem("userData", JSON.stringify(newUser));
      return newUser;
    });
  };

  const logout = async (shouldRedirect: boolean = true) => {
    const storedRefreshToken = localStorage.getItem("refreshToken");
    const currentAccessToken = accessToken; // Context state'inden accessToken alınıyor

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
        // Ağ hatası gibi durumlarda lokal temizliğe devam edilir
      }
    }

    localStorage.removeItem("accessToken");
    Cookies.remove("accessToken", { path: "/" });
    localStorage.removeItem("refreshToken");
    localStorage.removeItem("userData");
    setAccessToken(null);
    setUser(null);
    if (shouldRedirect) {
      router.push("/login"); // Çıkış sonrası giriş sayfasına yönlendir
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        accessToken,
        isLoading,
        login,
        logout,
        updateTokensAndUser,
        updateUser,
        getAccessToken: () => localStorage.getItem("accessToken"),
        getRefreshToken: () => localStorage.getItem("refreshToken"),
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
