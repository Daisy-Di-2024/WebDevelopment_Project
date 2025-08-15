import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { AuthContextProvider } from "./_utils/auth-context";
import Navbar from "./components/Navbar";
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
  title: "Travel Plan App",
  description: "Manage your travel plans",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        <AuthContextProvider>
          <Navbar />
          <main className="max-w-5xl mx-auto w-full p-6">{children}</main>
        </AuthContextProvider>
      </body>
    </html>
  );
}