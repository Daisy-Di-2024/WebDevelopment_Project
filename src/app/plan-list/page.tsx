"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useUserAuth } from "../_utils/auth-context";
import { getItems } from "../_services/travel-plan-service";

// ------------ Types ------------
type Item = {
  id: string;
  title: string;
  departure: string;
  destination: string;
  startDate: string;
  endDate: string;
  description: string;
};

// ------------ Small UI helpers ------------
function cn(...cls: (string | false | null | undefined)[]) {
  return cls.filter(Boolean).join(" ");
}

function formatRange(a?: string, b?: string) {
  if (!a && !b) return "";
  if (a && !b) return a;
  if (!a && b) return b;
  if (a === b) return a as string;
  return `${a} ~ ${b}`;
}

function ShimmerRow() {
  return (
    <div className="animate-pulse rounded-2xl border border-white/10 bg-white/5 p-4">
      <div className="flex items-center justify-between gap-4">
        <div className="flex-1">
          <div className="h-4 w-40 rounded bg-white/40" />
          <div className="mt-2 h-3 w-56 rounded bg-white/25" />
          <div className="mt-2 h-3 w-72 rounded bg-white/20" />
        </div>
        <div className="h-3 w-28 rounded bg-white/20" />
      </div>
    </div>
  );
}

export default function PlanListPage() {
  const { user } = useUserAuth();
  const router = useRouter();
  const [items, setItems] = useState<Item[]>([]);
  const [loading, setLoading] = useState(true);
  const [q, setQ] = useState("");

  useEffect(() => {
    if (!user) {
      router.replace("/");
      return;
    }
    (async () => {
      setLoading(true);
      const data = await getItems(user.uid);
      setItems(data);
      setLoading(false);
    })();
  }, [user, router]);

  if (!user) return null;

  const filtered = useMemo(() => {
    if (!q.trim()) return items;
    const k = q.toLowerCase();
    return items.filter((it) =>
      [it.title, it.departure, it.destination, it.description]
        .filter(Boolean)
        .some((s) => s!.toLowerCase().includes(k))
    );
  }, [items, q]);

  return (
    <div className="min-h-screen bg-[radial-gradient(80%_60%_at_20%_10%,#c4b5fd_0%,transparent_60%),radial-gradient(60%_50%_at_90%_10%,#93c5fd_0%,transparent_60%),linear-gradient(180deg,#0b1220_0%,#0b1220_40%,#0e1726_100%)] text-white">
      {/* Top bar */}
      <header className="sticky top-0 z-20 backdrop-blur supports-[backdrop-filter]:bg-black/30 bg-black/50 border-b border-white/10">
        <div className="mx-auto flex max-w-5xl items-center justify-between px-6 py-4">
          <h1 className="text-xl sm:text-2xl font-bold tracking-tight">
            ✈️ Travel Plans
          </h1>
          <div className="flex items-center gap-2">
            <Link
              href="/plan-list/new"
              className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-indigo-500 to-blue-500 px-4 py-2 text-sm font-semibold shadow-lg shadow-indigo-500/30 transition hover:from-indigo-400 hover:to-blue-400"
            >
              <span className="i-lucide-plus" aria-hidden /> + Add Plan
            </Link>
            <Link
              href="/"
              className="inline-flex items-center rounded-full border border-white/15 px-4 py-2 text-sm transition hover:bg-white/10"
            >
              Home
            </Link>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-5xl px-6 pb-20 pt-8">
        {/* Search */}
        <div className="mb-6">
          <div className="relative">
            <input
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="Search by title, city or notes..."
              className="w-full rounded-2xl border border-white/10 bg-white/10 px-4 py-3 pr-10 text-sm text-white placeholder:text-white/60 outline-none ring-0 focus:border-white/20 focus:bg-white/15"
            />
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              className="pointer-events-none absolute right-3 top-1/2 h-5 w-5 -translate-y-1/2 opacity-70"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <path d="m21 21-4.3-4.3" />
              <circle cx="11" cy="11" r="7" />
            </svg>
          </div>
        </div>

        {/* Content */}
        {loading ? (
          <div className="space-y-3">
            <ShimmerRow />
            <ShimmerRow />
            <ShimmerRow />
          </div>
        ) : filtered.length === 0 ? (
          <div className="mx-auto max-w-lg rounded-3xl border border-white/10 bg-white/5 p-8 text-center">
            <div className="text-5xl">🗺️</div>
            <h2 className="mt-4 text-xl font-semibold">No plans yet</h2>
            <p className="mt-2 text-white/70">
              Start your journey by adding your first trip.
            </p>
            <Link
              href="/plan-list/new"
              className="mt-5 inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-indigo-500 to-blue-500 px-5 py-2.5 text-sm font-semibold shadow-lg shadow-indigo-500/30 transition hover:from-indigo-400 hover:to-blue-400"
            >
              Create Plan
            </Link>
          </div>
        ) : (
          <ul className="grid grid-cols-1 gap-4">
            {filtered.map((it) => (
              <li key={it.id}>
                <Link
                  href={`/plan-list/${it.id}`}
                  className={cn(
                    "group block rounded-3xl border border-white/10 bg-[linear-gradient(180deg,rgba(255,255,255,0.08),rgba(255,255,255,0.04))] p-5 transition",
                    "hover:border-white/20 hover:bg-white/10 hover:shadow-xl hover:shadow-blue-500/10"
                  )}
                >
                  <div className="flex items-center justify-between gap-4">
                    <div className="min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="inline-flex h-6 w-6 items-center justify-center rounded-full bg-gradient-to-br from-indigo-400 to-blue-400 text-xs font-bold text-black/90 ring-2 ring-white/30">{it.title?.trim()?.[0] || "T"}</span>
                        <h3 className="truncate text-lg font-semibold tracking-tight">
                          {it.title || "(Untitled)"}
                        </h3>
                      </div>
                      <div className="mt-1 text-sm text-white/80">
                        <span className="mr-1">{it.departure || "—"}</span>
                        <span className="opacity-60">→</span>
                        <span className="ml-1">{it.destination || "—"}</span>
                      </div>
                      {it.description ? (
                        <p className="mt-1 line-clamp-1 text-sm text-white/70">
                          {it.description}
                        </p>
                      ) : null}
                    </div>
                    <div className="shrink-0 text-right text-sm text-white/70">
                      <div className="rounded-full border border-white/15 bg-white/5 px-3 py-1">
                        {formatRange(it.startDate, it.endDate) || "Dates TBD"}
                      </div>
                    </div>
                  </div>
                </Link>
              </li>
            ))}
          </ul>
        )}
      </main>
    </div>
  );
}