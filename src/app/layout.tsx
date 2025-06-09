import type { Metadata } from "next";
import { Inter, Pacifico } from "next/font/google";
import { ThemeProvider } from "@/context/ThemeContext";
import { QueryProvider } from "@/components/providers/QueryProvider";
import { SWRProvider } from "@/components/SWRProvider";
import { AuthInitializer } from "@/components/providers/AuthInitializer";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

const pacifico = Pacifico({
  subsets: ["latin"],
  weight: "400",
  variable: "--font-pacifico",
  display: "swap",
});

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
      <body
        className={`${inter.variable} ${pacifico.variable} font-sans antialiased`}
      >
        <ThemeProvider>
          <AuthInitializer>
            <QueryProvider>
              <SWRProvider>{children}</SWRProvider>
            </QueryProvider>
          </AuthInitializer>
        </ThemeProvider>
      </body>
    </html>
  );
}
