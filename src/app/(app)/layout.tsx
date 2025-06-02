// climbup-app/src/app/(app)/layout.tsx
import Navbar from "@/components/Navbar";
import { ThemeProvider } from "../../context/ThemeContext";
import React from "react";

export default function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider>
      <div
        className="min-h-screen transition-colors duration-300"
        style={{
          background: `linear-gradient(135deg, #C0E8DE 0%, #BED2D1 50%, #C0E8DE 100%)`,
        }}
      >
        {/* Dark mode background overlay */}
        <div className="hidden dark:block fixed inset-0 bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 opacity-95"></div>

        {/* Content */}
        <div className="relative z-10">
          <Navbar />
          <main className="container mx-auto px-4 py-8">{children}</main>
        </div>
      </div>
    </ThemeProvider>
  );
}
