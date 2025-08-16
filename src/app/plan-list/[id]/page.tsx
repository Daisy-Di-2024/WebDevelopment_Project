"use client";

import { useEffect, useMemo, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { useUserAuth } from "../../_utils/auth-context";
import CityInsight from "@/app/components/CityInsight";
import { getItem, addItem, updateItem, deleteItem } from "../../_services/travel-plan-service";

// ------------ Types & initial state ------------
type FormState = {
  title: string;
  departure: string;
  destination: string;
  startDate: string;
  endDate: string;
  description: string;
};

const emptyForm: FormState = {
  title: "",
  departure: "",
  destination: "",
  startDate: "",
  endDate: "",
  description: "",
};

function FieldLabel({ children }: { children: React.ReactNode }) {
  return <span className="text-sm text-white/70">{children}</span>;
}

function InputBase(props: React.InputHTMLAttributes<HTMLInputElement>) {
  return (
    <input
      {...props}
      className={cn(
        "w-full rounded-xl border border-white/10 bg-white/10 px-3 py-2 text-sm text-white placeholder:text-white/60 outline-none",
        "focus:border-white/20 focus:bg-white/15",
        props.className
      )}
    />
  );
}

function TextareaBase(
  props: React.TextareaHTMLAttributes<HTMLTextAreaElement>
) {
  return (
    <textarea
      {...props}
      className={cn(
        "w-full min-h-[120px] rounded-xl border border-white/10 bg-white/10 px-3 py-2 text-sm text-white placeholder:text-white/60 outline-none",
        "focus:border-white/20 focus:bg-white/15",
        props.className
      )}
    />
  );
}

function cn(...cls: (string | false | null | undefined)[]) {
  return cls.filter(Boolean).join(" ");
}

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
              description: data.description ?? "",
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
    <div className="min-h-screen bg-[radial-gradient(80%_60%_at_10%_0%,#f0abfc_0%,transparent_60%),radial-gradient(60%_50%_at_100%_10%,#7dd3fc_0%,transparent_60%),linear-gradient(180deg,#0b1220_0%,#0b1220_40%,#0e1726_100%)] text-white">
      {/* Header */}
      <div className="sticky top-0 z-20 backdrop-blur supports-[backdrop-filter]:bg-black/30 bg-black/50 border-b border-white/10">
        <div className="mx-auto flex max-w-3xl items-center justify-between px-6 py-4">
          <h1 className="text-xl sm:text-2xl font-bold tracking-tight">
            {isNew ? "New Travel Plan" : "Edit Travel Plan"}
          </h1>
          <button
            onClick={() => router.replace("/plan-list")}
            className="rounded-full border border-white/15 px-4 py-2 text-sm transition hover:bg-white/10"
          >
            Back to List
          </button>
        </div>
      </div>

      {/* Body */}
      <div className="mx-auto max-w-3xl px-6 py-8">
        {loading ? (
          <div className="animate-pulse space-y-4">
            <div className="h-9 w-64 rounded-xl bg-white/10" />
            <div className="h-28 rounded-2xl bg-white/10" />
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div className="h-24 rounded-2xl bg-white/10" />
              <div className="h-24 rounded-2xl bg-white/10" />
            </div>
            <div className="h-40 rounded-2xl bg-white/10" />
          </div>
        ) : (
          <>
            {err && (
              <div className="mb-4 rounded-2xl border border-red-300/30 bg-red-500/10 p-3 text-red-200">
                {err}
              </div>
            )}

            <div className="rounded-3xl border border-white/10 bg-white/5 p-6 shadow-2xl shadow-blue-600/10">
              <div className="grid grid-cols-1 gap-4">
                <label className="flex flex-col gap-1">
                  <FieldLabel>Title</FieldLabel>
                  <InputBase
                    value={form.title}
                    onChange={onChange("title")}
                    placeholder="Trip title"
                  />
                </label>

                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <label className="flex flex-col gap-1">
                    <FieldLabel>Departure</FieldLabel>
                    <InputBase
                      value={form.departure}
                      onChange={onChange("departure")}
                      placeholder="e.g. Calgary"
                    />
                  </label>
                  <label className="flex flex-col gap-1">
                    <FieldLabel>Destination</FieldLabel>
                    <InputBase
                      value={form.destination}
                      onChange={onChange("destination")}
                      placeholder="e.g. Vancouver"
                    />
                  </label>
                </div>

                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <label className="flex flex-col gap-1">
                    <FieldLabel>Start Date</FieldLabel>
                    <InputBase
                      type="date"
                      value={form.startDate}
                      onChange={onChange("startDate")}
                    />
                  </label>
                  <label className="flex flex-col gap-1">
                    <FieldLabel>End Date</FieldLabel>
                    <InputBase
                      type="date"
                      value={form.endDate}
                      onChange={onChange("endDate")}
                    />
                  </label>
                </div>

                <label className="flex flex-col gap-1">
                  <FieldLabel>Description</FieldLabel>
                  <TextareaBase
                    value={form.description}
                    onChange={onChange("description")}
                    placeholder="Overview of this trip, key activities, notes..."
                  />
                </label>
              </div>

              {/* City insights */}
              <div className="mt-8 space-y-6">
                {form.departure?.trim() ? (
                  <div>
                    <div className="mb-1 text-sm font-medium text-white/80">
                      About “{form.departure.trim()}”
                    </div>
                    <div className="overflow-hidden rounded-2xl border border-white/10 bg-white/5">
                      <CityInsight city={form.departure} />
                    </div>
                  </div>
                ) : null}

                {form.destination?.trim() ? (
                  <div>
                    <div className="mb-1 text-sm font-medium text-white/80">
                      About “{form.destination.trim()}”
                    </div>
                    <div className="overflow-hidden rounded-2xl border border-white/10 bg-white/5">
                      <CityInsight city={form.destination} />
                    </div>
                  </div>
                ) : null}
              </div>

              {/* Actions */}
              <div className="sticky bottom-6 mt-8 flex flex-wrap items-center gap-3 rounded-2xl border border-white/10 bg-black/40 p-3 backdrop-blur">
                <button
                  onClick={handleSave}
                  disabled={saving}
                  className={cn(
                    "rounded-full px-5 py-2 text-sm font-semibold shadow-lg transition",
                    "bg-gradient-to-r from-indigo-500 to-blue-500 shadow-indigo-500/30 hover:from-indigo-400 hover:to-blue-400",
                    saving && "opacity-60"
                  )}
                >
                  {saving ? "Saving..." : "Save"}
                </button>

                <button
                  onClick={handleCancel}
                  disabled={saving}
                  className={cn(
                    "rounded-full border border-white/15 px-5 py-2 text-sm transition hover:bg-white/10",
                    saving && "opacity-60"
                  )}
                >
                  Cancel
                </button>

                {!isNew && (
                  <button
                    onClick={handleDelete}
                    disabled={saving}
                    className={cn(
                      "ml-auto rounded-full bg-red-600/90 px-5 py-2 text-sm font-semibold text-white shadow-lg shadow-red-600/30 transition hover:bg-red-600",
                      saving && "opacity-60"
                    )}
                  >
                    Delete
                  </button>
                )}
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
