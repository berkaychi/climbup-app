"use client";

import { SWRConfig } from "swr";
import { ReactNode } from "react";

interface SWRProviderProps {
  children: ReactNode;
}

export function SWRProvider({ children }: SWRProviderProps) {
  return (
    <SWRConfig
      value={{
        onError: (error, key) => {
          // Token yenileme hataları için özel işlem yapma
          if (
            error?.message?.includes("Failed to refresh token") ||
            error?.message?.includes("User logged out")
          ) {
            console.warn(
              "Authentication error, user has been logged out:",
              error
            );
            return; // Bu hataları console.error ile loglamayı engelleyelim
          }
          // Diğer hatalar için normal logging
          console.error("SWR Error:", error, "Key:", key);
        },
        shouldRetryOnError: (error) => {
          // Authentication hatalarında retry yapma
          if (
            error?.message?.includes("Failed to refresh token") ||
            error?.message?.includes("User logged out") ||
            error?.status === 401
          ) {
            return false;
          }
          return true;
        },
        errorRetryCount: 3,
        errorRetryInterval: 5000,
      }}
    >
      {children}
    </SWRConfig>
  );
}
