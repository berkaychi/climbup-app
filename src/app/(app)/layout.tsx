// climbup-app/src/app/(app)/layout.tsx
import Navbar from "@/components/Navbar";
import { ThemeProvider } from "../../context/ThemeContext";
import React from "react";

export default function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider data-oid="_d5978v">
      <div
        className="min-h-screen transition-colors duration-300"
        style={{
          background: `linear-gradient(135deg, #C0E8DE 0%, #BED2D1 50%, #C0E8DE 100%)`,
        }}
        data-oid="qgz5cg1"
      >
        {/* Dark mode background overlay */}
        <div
          className="hidden dark:block fixed inset-0 bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 opacity-95"
          data-oid="rtpaant"
        ></div>

        {/* Content */}
        <div className="relative z-10" data-oid="rnxmj2t">
          <Navbar data-oid="0jxgo64" />
          <main className="container mx-auto px-4 py-8" data-oid="1e09cbs">
            {children}
          </main>
        </div>
      </div>
    </ThemeProvider>
  );
}
