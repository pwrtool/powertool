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
      <body
        className={`${inter.className} h-screen flex flex-col justify-between`}
      >
        <AuthProvider>
          <GithubProvider>
            <Header />
            <main>{children}</main>
            <Footer />
          </GithubProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
