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
    <html lang="tr">
      <head>{}</head>
      <body className="font-sans antialiased w-[1434px] h-[1013px]">
        <ThemeProvider>
          <AuthProvider>
            <SWRProvider>{children}</SWRProvider>
          </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
