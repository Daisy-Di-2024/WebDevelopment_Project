"use client";
import Link from "next/link";
import { useUserAuth } from "../_utils/auth-context";

export default function Navbar() {
  const { user, firebaseSignOut } = useUserAuth();

  return (
    <nav className="sticky top-0 z-40 w-full backdrop-blur supports-[backdrop-filter]:bg-white/50 bg-white/70 border-b border-black/5">
      <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between">
        <Link href="/" className="group inline-flex items-center gap-2">
          <span className="text-xl font-extrabold tracking-tight bg-gradient-to-r from-fuchsia-600 via-rose-500 to-orange-500 bg-clip-text text-transparent">
            Travel Plan App
          </span>
          <span className="inline-block h-2 w-2 rounded-full bg-emerald-400 group-hover:scale-125 transition" />
        </Link>

        {user ? (
          <div className="flex items-center gap-4">
            <span className="hidden sm:block text-sm text-gray-700 truncate max-w-[18ch]">
              {user.displayName || user.email}
            </span>
            <Link
              href="/plan-list"
              className="px-3 py-1.5 text-sm rounded-full bg-gradient-to-r from-indigo-600 to-blue-600 text-white shadow hover:shadow-md transition"
            >
              My Plans
            </Link>
            <button
              onClick={firebaseSignOut}
              className="px-3 py-1.5 text-sm rounded-full bg-white text-gray-900 border border-gray-200 shadow-sm hover:bg-gray-50 transition"
            >
              Logout
            </button>
          </div>
        ) : (
          <div className="flex items-center gap-3 text-sm text-gray-600">
            <Link href="/" className="hover:text-gray-900">Home</Link>
            <Link href="/plan-list" className="hover:text-gray-900">Plans</Link>
          </div>
        )}
      </div>
    </nav>
  );
}