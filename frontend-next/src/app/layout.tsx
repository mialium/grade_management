import type { Metadata } from "next";
import { Inter, Noto_Sans_SC } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "@/contexts/auth-context";
import { Suspense } from "react";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });
const notoSansSC = Noto_Sans_SC({ 
  subsets: ["latin"],
  weight: ["300", "400", "500", "700"],
  variable: "--font-noto-sans-sc"
});

export const metadata: Metadata = {
  title: "成绩管理系统",
  description: "现代化的成绩管理系统",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="zh-CN">
      <body className={`${inter.variable} ${notoSansSC.variable} font-sans`}>
        <AuthProvider>
          <Suspense fallback={<div>加载中...</div>}>
            {children}
          </Suspense>
        </AuthProvider>
      </body>
    </html>
  );
}