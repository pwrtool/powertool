import AuthProvider from "@/components/AuthProvider";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import "./globals.css";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { GithubProvider } from "@/components/GithubProvider";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Powertool",
  description: "Automate everything using anything",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={`${inter.className}`}>
        <AuthProvider>
          <GithubProvider>
            <Header />
            <div className="min-h-[calc(100vh-14rem)]">{children}</div>
            <Footer />
          </GithubProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
