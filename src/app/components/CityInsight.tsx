"use client";

import { useEffect, useMemo, useState } from "react";

type WikiSummary = {
  title?: string;
  extract?: string;
  content_urls?: { desktop?: { page?: string } };
  thumbnail?: { source?: string };
  originalimage?: { source?: string };
  coordinates?: { lat: number; lon: number };
  type?: string; // "standard" | "disambiguation" | ...
};

function normalizeCity(input: string) {
  const s = (input || "").trim();
  if (!s) return "";
  // 简单规范化：每个词首字母大写（兼容多词城市，如 New York）
  return s
    .split(/\s+/)
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(" ");
}

async function fetchWikiSummary(city: string): Promise<WikiSummary | null> {
  const title = encodeURIComponent(city);
  const url = `https://en.wikipedia.org/api/rest_v1/page/summary/${title}`;
  const res = await fetch(url, { cache: "no-store" });
  if (!res.ok) return null;
  const data = (await res.json()) as WikiSummary;
  // 过滤掉消歧义页或非标准页面
  if (!data || (data.type && data.type !== "standard")) return null;
  return data;
}

export default function CityInsight({ city }: { city: string }) {
  const normalized = useMemo(() => normalizeCity(city), [city]);
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState<WikiSummary | null>(null);
  const [error, setError] = useState<string | null>(null);

  // 简单“像城市名”的判定：长度>=2 且不包含数字（可按需加强）
  const looksLikeCity = useMemo(
    () => !!normalized && normalized.length >= 2 && !/\d/.test(normalized),
    [normalized]
  );

  useEffect(() => {
    let cancelled = false;
    if (!looksLikeCity) {
      setData(null);
      setError(null);
      return;
    }

    setLoading(true);
    setError(null);
    // 轻量防抖：输入停止 400ms 再查
    const t = setTimeout(async () => {
      try {
        const summary = await fetchWikiSummary(normalized);
        if (!cancelled) setData(summary);
      } catch (e: any) {
        if (!cancelled) setError(e?.message || "Failed to load city info.");
      } finally {
        if (!cancelled) setLoading(false);
      }
    }, 400);

    return () => {
      cancelled = true;
      clearTimeout(t);
    };
  }, [normalized, looksLikeCity]);

  if (!looksLikeCity) return null;
  if (loading) {
    return (
      <div className="mt-4 rounded border p-3 text-sm text-gray-600">
        Loading {normalized}…
      </div>
    );
  }
  if (error) {
    return (
      <div className="mt-4 rounded border border-red-200 bg-red-50 p-3 text-sm text-red-700">
        {error}
      </div>
    );
  }
  if (!data) return null;

  const img =
    data.originalimage?.source ||
    data.thumbnail?.source ||
    undefined;
  const wikiUrl = data.content_urls?.desktop?.page;
  const coords = data.coordinates;

  return (
    <div className="mt-4 rounded border p-4 bg-white">
      <div className="flex items-start gap-4">
        {img && (
          <img
            src={img}
            alt={data.title || normalized}
            className="w-32 h-32 object-cover rounded"
          />
        )}
        <div className="min-w-0">
          <div className="text-lg font-semibold">
            {data.title || normalized}
          </div>
          {data.extract && (
            <p className="text-sm text-gray-700 mt-1">{data.extract}</p>
          )}
          <div className="text-sm mt-2 flex flex-wrap items-center gap-3">
            {wikiUrl && (
              <a
                href={wikiUrl}
                target="_blank"
                rel="noreferrer"
                className="text-blue-600 underline"
              >
                View on Wikipedia
              </a>
            )}
            {coords && (
              <a
                href={`https://www.openstreetmap.org/?mlat=${coords.lat}&mlon=${coords.lon}#map=10/${coords.lat}/${coords.lon}`}
                target="_blank"
                rel="noreferrer"
                className="text-blue-600 underline"
              >
                View on Map
              </a>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}