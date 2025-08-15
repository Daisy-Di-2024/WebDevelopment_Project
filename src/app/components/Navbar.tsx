
"use client";
import Link from "next/link";
import { useUserAuth } from "../_utils/auth-context";

export default function Navbar() {
  const { user, firebaseSignOut } = useUserAuth();

  return (
    <nav className="w-full bg-gray-100 p-4 flex justify-between items-center">
      <Link href="/plan-list" className="font-bold text-lg">
        Travel Plan App
      </Link>
      {user && (
        <div className="flex gap-4">
          <span className="text-sm text-gray-600">
            {user.displayName || user.email}
          </span>
          <button
            onClick={firebaseSignOut}
            className="px-3 py-1 bg-red-600 text-white rounded hover:bg-red-700"
          >
            Logout
          </button>
        </div>
      )}
    </nav>
  );
}