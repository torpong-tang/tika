import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { LanguageProvider } from "@/context/LanguageContext";
import { AuthProvider } from "@/context/AuthContext";
import AuthenticatedLayout from "@/components/Layout/AuthenticatedLayout";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "TIKA - Defect Tracker",
  description: "Defect tracking application with Jira-like features",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <AuthProvider>
          <LanguageProvider>
            <AuthenticatedLayout>{children}</AuthenticatedLayout>
          </LanguageProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
