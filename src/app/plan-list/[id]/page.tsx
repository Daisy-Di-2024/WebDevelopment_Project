"use client";

import { useEffect, useMemo, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { useUserAuth } from "../../_utils/auth-context";
import CityInsight from "@/app/components/CityInsight";
import {
  getItem,
  addItem,
  updateItem,
  deleteItem,
} from "../../_services/travel-plan-service";

type FormState = {
  title: string;
  departure: string;
  destination: string;
  startDate: string;
  endDate: string;
  description: string; // <-- 新增
};

const emptyForm: FormState = {
  title: "",
  departure: "",
  destination: "",
  startDate: "",
  endDate: "",
  description: "", // <-- 新增
};

export default function PlanDetailPage() {
  const { id } = useParams<{ id: string }>();
  const isNew = useMemo(() => id === "new", [id]);
  const { user } = useUserAuth();
  const router = useRouter();

  const [form, setForm] = useState<FormState>(emptyForm);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [err, setErr] = useState<string | null>(null);

  useEffect(() => {
    if (!user) {
      router.replace("/");
      return;
    }
    (async () => {
      setErr(null);
      setLoading(true);
      try {
        if (isNew) {
          setForm(emptyForm);
        } else {
          const data = await getItem(user.uid, id as string);
          if (data) {
            setForm({
              title: data.title ?? "",
              departure: data.departure ?? "",
              destination: data.destination ?? "",
              startDate: data.startDate ?? "",
              endDate: data.endDate ?? "",
              description: data.description ?? "", // <-- 新增
            });
          } else {
            setErr("This plan does not exist or was removed.");
          }
        }
      } catch (e: any) {
        setErr(e?.message || "Failed to load plan.");
      } finally {
        setLoading(false);
      }
    })();
  }, [user, id, isNew, router]);

  if (!user) return null;

  const onChange =
    (k: keyof FormState) =>
      (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
        setForm((s) => ({ ...s, [k]: e.target.value }));

  const handleSave = async () => {
    setSaving(true);
    setErr(null);
    try {
      if (isNew) {
        const newId = await addItem(user.uid, form);
        router.replace(`/plan-list/${newId}`);
      } else {
        await updateItem(user.uid, id as string, form);
        router.replace("/plan-list");
      }
    } catch (e: any) {
      setErr(e?.message || "Failed to save.");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (isNew) {
      router.back();
      return;
    }
    const ok = confirm("Delete this plan?");
    if (!ok) return;
    setSaving(true);
    setErr(null);
    try {
      await deleteItem(user.uid, id as string);
      router.replace("/plan-list");
    } catch (e: any) {
      setErr(e?.message || "Failed to delete.");
    } finally {
      setSaving(false);
    }
  };

  const handleCancel = () => {
    router.back();
  };

  return (
    <div className="max-w-3xl mx-auto p-6">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">
          {isNew ? "New Travel Plan" : "Edit Travel Plan"}
        </h1>
        <button
          onClick={() => router.replace("/plan-list")}
          className="px-3 py-2 border rounded hover:bg-gray-50"
        >
          Back to List
        </button>
      </div>

      {loading ? (
        <p>Loading...</p>
      ) : (
        <>
          {err && (
            <div className="mb-4 rounded border border-red-200 bg-red-50 p-3 text-red-700">
              {err}
            </div>
          )}

          {/* 表单区域 */}
          <div className="grid grid-cols-1 gap-4">
            <label className="flex flex-col gap-1">
              <span className="text-sm text-gray-600">Title</span>
              <input
                value={form.title}
                onChange={onChange("title")}
                className="border rounded px-3 py-2"
                placeholder="Trip title"
              />
            </label>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <label className="flex flex-col gap-1">
                <span className="text-sm text-gray-600">Departure</span>
                <input
                  value={form.departure}
                  onChange={onChange("departure")}
                  className="border rounded px-3 py-2"
                  placeholder="e.g. Calgary"
                />
              </label>
              <label className="flex flex-col gap-1">
                <span className="text-sm text-gray-600">Destination</span>
                <input
                  value={form.destination}
                  onChange={onChange("destination")}
                  className="border rounded px-3 py-2"
                  placeholder="e.g. Vancouver"
                />
              </label>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <label className="flex flex-col gap-1">
                <span className="text-sm text-gray-600">Start Date</span>
                <input
                  type="date"
                  value={form.startDate}
                  onChange={onChange("startDate")}
                  className="border rounded px-3 py-2"
                />
              </label>
              <label className="flex flex-col gap-1">
                <span className="text-sm text-gray-600">End Date</span>
                <input
                  type="date"
                  value={form.endDate}
                  onChange={onChange("endDate")}
                  className="border rounded px-3 py-2"
                />
              </label>
            </div>

            {/* 描述 */}
            <label className="flex flex-col gap-1">
              <span className="text-sm text-gray-600">Description</span>
              <textarea
                value={form.description}
                onChange={onChange("description")}
                className="border rounded px-3 py-2 min-h-[120px]"
                placeholder="Overview of this trip, key activities, notes..."
              />
            </label>
          </div>

          {/* 城市洞察：放在表单下面、按钮上面 */}
          <div className="mt-8 space-y-6">
            {form.departure?.trim() ? (
              <div>
                <div className="text-sm font-medium text-gray-600 mb-1">
                  About “{form.departure.trim()}”
                </div>
                <CityInsight city={form.departure} />
              </div>
            ) : null}

            {form.destination?.trim() ? (
              <div>
                <div className="text-sm font-medium text-gray-600 mb-1">
                  About “{form.destination.trim()}”
                </div>
                <CityInsight city={form.destination} />
              </div>
            ) : null}
          </div>

          {/* 按钮区域 */}
          <div className="mt-6 flex gap-3">
            <button
              onClick={handleSave}
              disabled={saving}
              className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50"
            >
              {saving ? "Saving..." : "Save"}
            </button>

            <button
              onClick={handleCancel}
              disabled={saving}
              className="px-4 py-2 border rounded hover:bg-gray-50 disabled:opacity-50"
            >
              Cancel
            </button>

            {!isNew && (
              <button
                onClick={handleDelete}
                disabled={saving}
                className="ml-auto px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 disabled:opacity-50"
              >
                Delete
              </button>
            )}
          </div>
        </>
      )}
    </div>
  );
}