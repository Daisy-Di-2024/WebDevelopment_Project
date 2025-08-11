"use client";
import Link from "next/link";
import { useUserAuth } from "./_utils/auth-context";

export default function Home() {
  const { user, gitHubSignIn, firebaseSignOut } = useUserAuth();
  return (
    <div className="font-sans grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20">
      <main className="flex flex-col items-center justify-center h-screen gap-4">
        {!user ? (
          <div>
            <h1 className="text-2xl font-bold">Shopping List App</h1>
            <button
              onClick={gitHubSignIn}
              className="px-4 py-2 bg-black text-white rounded hover:bg-gray-800"
            >
              Login with GitHub
            </button>
          </div>
        ) : (
          <div>
            <p className="text-lg">
              Welcome, {user.displayName} ({user.email})
            </p>
            <button
              onClick={firebaseSignOut}
              className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
            >
              Logout
            </button>
            <Link
              href="./shopping-list"
              className="mt-4 text-blue-600 underline hover:text-blue-800"
            >
              Go to Shopping List
            </Link>
          </div>
        )}
      </main>
    </div>
  );
}
