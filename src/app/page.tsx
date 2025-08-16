"use client";

import Link from "next/link";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useUserAuth } from "./_utils/auth-context";

export default function Home() {
  const { user, gitHubSignIn, firebaseSignOut } = useUserAuth();
  const router = useRouter();

  useEffect(() => {
    if (user) router.replace("/plan-list");
  }, [user, router]);

  return (
    <div className="relative grid place-items-center min-h-[70vh] p-8">
      <section className="text-center py-10">
        {!user ? (
          <div className="flex flex-col items-center gap-6">
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold leading-tight">
              Plan trips with
              <span className="block bg-gradient-to-r from-fuchsia-600 via-rose-500 to-orange-500 bg-clip-text text-transparent">
                style & speed
              </span>
            </h1>
            <p className="max-w-2xl text-gray-600 text-base sm:text-lg">
              Create, edit, and admire your itineraries with a gorgeous, responsive UI.
            </p>
            <button
              onClick={gitHubSignIn}
              className="group inline-flex items-center gap-3 px-5 py-3 rounded-full bg-black text-white shadow-lg shadow-black/20 hover:shadow-black/30 transition"
            >
              <svg viewBox="0 0 24 24" aria-hidden className="h-5 w-5 fill-current">
                <path d="M12 .5A11.5 11.5 0 0 0 .6 12.3a11.5 11.5 0 0 0 7.9 10.9c.6.1.8-.2.8-.5v-1.9c-3.2.7-3.9-1.5-3.9-1.5-.5-1.3-1.2-1.7-1.2-1.7-1-.7.1-.7.1-.7 1.1.1 1.6 1.2 1.6 1.2 1 .1.8 1.8 2.9 1.3.1-.8.4-1.3.7-1.6-2.6-.3-5.3-1.3-5.3-5.8 0-1.3.5-2.4 1.2-3.3 0-.3-.5-1.5.1-3.1 0 0 1-.3 3.4 1.2a11.7 11.7 0 0 1 6.1 0c2.3-1.5 3.4-1.2 3.4-1.2.6 1.6.1 2.8.1 3.1.8.9 1.2 2 1.2 3.3 0 4.5-2.7 5.5-5.3 5.8.4.3.8 1 .8 2.1v3.2c0 .3.2.6.8.5A11.5 11.5 0 0 0 23.4 12 11.5 11.5 0 0 0 12 .5z"/>
              </svg>
              <span className="text-base font-semibold">Login with GitHub</span>
            </button>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 w-full max-w-3xl mt-4">
              {[
                { title: "Categorize & filter", desc: "Quickly scan your plans with elegant cards." },
                { title: "Progress tracking", desc: "Dates & details, beautifully organized." },
                { title: "Smart tips", desc: "City insights appear as you type." },
              ].map((f) => (
                <div key={f.title} className="rounded-2xl border border-black/5 bg-white/70 backdrop-blur p-4 shadow-sm">
                  <div className="font-semibold">{f.title}</div>
                  <div className="text-sm text-gray-600 mt-1">{f.desc}</div>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <div className="flex flex-col items-center gap-5">
            <p className="text-lg font-medium text-gray-800">
              Welcome, <span className="font-semibold">{user.displayName} ({user.email})</span>
            </p>
            <div className="flex gap-3">
              <Link
                href="/plan-list"
                className="px-5 py-2.5 rounded-full bg-gradient-to-r from-indigo-600 to-blue-600 text-white shadow hover:shadow-md transition"
              >
                Go to Travel Plan
              </Link>
              <button
                onClick={firebaseSignOut}
                className="px-5 py-2.5 rounded-full bg-white text-gray-900 border border-gray-200 shadow-sm hover:bg-gray-50 transition"
              >
                Logout
              </button>
            </div>
          </div>
        )}
      </section>
    </div>
  );
}