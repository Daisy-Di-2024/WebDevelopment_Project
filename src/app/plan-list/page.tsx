"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useUserAuth } from "../_utils/auth-context";
import { getItems } from "../_services/travel-plan-service";

type Item = {
  id: string;
  title: string;
  departure: string;
  destination: string;
  startDate: string;
  endDate: string;
  description: string; // <-- 新增
};

export default function PlanListPage() {
  const { user } = useUserAuth();
  const router = useRouter();
  const [items, setItems] = useState<Item[]>([]);
  const [loading, setLoading] = useState(true);

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

  return (
    <div className="max-w-3xl mx-auto p-6">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">Travel Plans</h1>
        <div className="flex gap-3">
          <Link
            href="/plan-list/new"
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            + Add Plan
          </Link>
          <Link href="/" className="px-4 py-2 border rounded hover:bg-gray-50">
            Home
          </Link>
        </div>
      </div>

      {loading ? (
        <p>Loading...</p>
      ) : items.length === 0 ? (
        <div className="text-gray-600">
          <p>No plans yet.</p>
          <p className="mt-2">
            Click{" "}
            <Link href="/plan-list/new" className="text-blue-600 underline">
              Add Plan
            </Link>{" "}
            to create your first trip.
          </p>
        </div>
      ) : (
        <ul className="space-y-3">
          {items.map((it) => (
            <li key={it.id}>
              <Link
                href={`/plan-list/${it.id}`}
                className="block border rounded p-4 hover:bg-gray-50"
              >
                <div className="flex items-center justify-between">
                  <div className="min-w-0">
                    <div className="font-semibold">
                      {it.title || "(Untitled)"}
                    </div>
                    <div className="text-sm text-gray-600">
                      {it.departure} → {it.destination}
                    </div>
                    {it.description ? (
                      <div className="text-sm text-gray-500 truncate">
                        {it.description}
                      </div>
                    ) : null}
                  </div>
                  <div className="text-sm text-gray-500 text-right">
                    {it.startDate} ~ {it.endDate}
                  </div>
                </div>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}