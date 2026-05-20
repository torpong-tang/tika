import type { Metadata } from "next";
import { Prompt } from "next/font/google";
import "./globals.css";
import { LanguageProvider } from "@/context/LanguageContext";
import { AuthProvider } from "@/context/AuthContext";
import AuthenticatedLayout from "@/components/Layout/AuthenticatedLayout";
import ApiBasePathPatch from "@/components/ApiBasePathPatch";

const prompt = Prompt({
  subsets: ["latin", "thai"],
  weight: ["300", "400", "500", "600", "700"],
});

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
      <body className={prompt.className}>
        <ApiBasePathPatch />
        <AuthProvider>
          <LanguageProvider>
            <AuthenticatedLayout>{children}</AuthenticatedLayout>
          </LanguageProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
