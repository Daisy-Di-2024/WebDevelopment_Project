"use client";

import Link from "next/link";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useUserAuth } from "./_utils/auth-context";

export default function Home() {
  const { user, gitHubSignIn, firebaseSignOut } = useUserAuth();
  const router = useRouter();

  // 登录后自动跳转到列表页
  useEffect(() => {
    if (user) router.replace("/plan-list");
  }, [user, router]);

  return (
    <div className="font-sans grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20">
      <main className="flex flex-col items-center justify-center h-screen gap-4">
        {!user ? (
          <div className="flex flex-col items-center gap-4">
            <h1 className="text-2xl font-bold">Travel Plan App</h1>
            <button
              onClick={gitHubSignIn}
              className="px-4 py-2 bg-black text-white rounded hover:bg-gray-800"
            >
              Login with GitHub
            </button>
          </div>
        ) : (
          <div className="flex flex-col items-center gap-3">
            <p className="text-lg">
              Welcome, {user.displayName} ({user.email})
            </p>
            <div className="flex gap-3">
              <Link
                href="/plan-list"
                className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
              >
                Go to Travel Plan
              </Link>
              <button
                onClick={firebaseSignOut}
                className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
              >
                Logout
              </button>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}