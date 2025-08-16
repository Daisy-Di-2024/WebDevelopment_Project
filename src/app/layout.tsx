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
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className="bg-white">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased min-h-screen relative overflow-x-hidden`}
      >
        {/* Soft animated gradient background blobs (pure CSS, no deps) */}
        <div aria-hidden className="pointer-events-none fixed inset-0 -z-10">
          <div className="absolute -top-24 -left-24 h-72 w-72 rounded-full bg-gradient-to-tr from-rose-400 via-fuchsia-400 to-indigo-400 blur-3xl opacity-30" />
          <div className="absolute top-1/3 -right-24 h-80 w-80 rounded-full bg-gradient-to-br from-cyan-300 via-sky-400 to-blue-500 blur-3xl opacity-25" />
          <div className="absolute bottom-0 left-1/4 h-96 w-96 rounded-full bg-gradient-to-tr from-amber-300 via-pink-300 to-rose-400 blur-3xl opacity-20" />
        </div>

        <AuthContextProvider>
          <Navbar />
          {/* Constrain content and add gentle glass effect */}
          <main className="max-w-5xl mx-auto w-full p-6">
            <div className="rounded-2xl bg-white/60 backdrop-blur-md shadow-xl ring-1 ring-black/5">
              {children}
            </div>
          </main>
        </AuthContextProvider>
      </body>
    </html>
  );
}