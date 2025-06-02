import type { Metadata } from "next";
import { AuthProvider } from "@/context/AuthContext";
import { ThemeProvider } from "@/context/ThemeContext";
import { SWRProvider } from "@/components/SWRProvider";
import "./globals.css";
export const metadata: Metadata = {
  title: "ClimbUp - Odaklanma ve Planlama",
  description:
    "ClimbUp ile odaklanma sürenizi artırın ve görevlerinizi planlayın.",
  // viewport meta etiketi Next.js tarafından otomatik eklenir.
};
export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="tr" data-oid="yn2xkr3">
      <head data-oid="-pr8g8n">{}</head>
      <body className="font-sans antialiased" data-oid="j:nrik8">
        <ThemeProvider data-oid="49t-my.">
          <AuthProvider data-oid="jqshi3u">
            <SWRProvider data-oid="emvc-w5">{children}</SWRProvider>
          </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
