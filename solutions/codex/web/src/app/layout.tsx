import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { Toaster } from "sonner";

import { TooltipProvider, ThemeProvider } from "@nexus/ui";

import { QueryProvider } from "@/components/providers/query-provider";
import { AuthProvider } from "@/components/providers/auth-provider";
import { NotificationProvider } from "@/components/providers/notification-provider";
import { AIButlerProvider } from "@/components/providers/ai-butler-provider";
import { CodexLayout } from "@/components/layout/codex-layout";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Codex — Nexus",
  description:
    "데이터 표준용어, 도메인, 단어 사전을 등록·관리하는 데이터 거버넌스 솔루션",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="ko"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
      suppressHydrationWarning
    >
      <body className="flex min-h-full flex-col">
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
          <QueryProvider>
            <AuthProvider>
              <NotificationProvider>
                <AIButlerProvider>
                  <TooltipProvider>
                    <CodexLayout>{children}</CodexLayout>
                  </TooltipProvider>
                  <Toaster richColors position="top-right" />
                </AIButlerProvider>
              </NotificationProvider>
            </AuthProvider>
          </QueryProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
