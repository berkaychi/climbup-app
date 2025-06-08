"use client";

import { useAuthStore } from "@/stores/authStore";
import { useEffect } from "react";

export function AuthInitializer({ children }: { children: React.ReactNode }) {
  const initialize = useAuthStore((state) => state.initialize);

  useEffect(() => {
    initialize();
  }, [initialize]);

  return <>{children}</>;
}
