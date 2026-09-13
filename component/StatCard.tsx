// component/StatCard.tsx
import { LucideIcon } from "lucide-react";

interface StatCardProps {
  label: string;
  value: string;
  subtext?: string;
  icon: LucideIcon;
  accent?: "emerald" | "sky" | "amber" | "rose" | "slate";
}

const ACCENT_CLASSES: Record<NonNullable<StatCardProps["accent"]>, string> = {
  emerald: "bg-emerald-500/10 text-emerald-400 ring-emerald-500/20",
  sky: "bg-sky-500/10 text-sky-400 ring-sky-500/20",
  amber: "bg-amber-500/10 text-amber-400 ring-amber-500/20",
  rose: "bg-rose-500/10 text-rose-400 ring-rose-500/20",
  slate: "bg-slate-500/10 text-slate-300 ring-slate-500/20",
};

export default function StatCard({
  label,
  value,
  subtext,
  icon: Icon,
  accent = "slate",
}: StatCardProps) {
  return (
    <div className="rounded-xl border border-slate-800 bg-slate-900/60 p-4 sm:p-5 transition hover:border-slate-700 hover:bg-slate-900">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <p className="text-xs font-medium uppercase tracking-wide text-slate-400">
            {label}
          </p>
          <p className="mt-2 truncate text-2xl font-semibold text-white">
            {value}
          </p>
          {subtext && (
            <p className="mt-1 text-xs text-slate-500">{subtext}</p>
          )}
        </div>
        <div
          className={`flex h-10 w-10 flex-none items-center justify-center rounded-lg ring-1 ${ACCENT_CLASSES[accent]}`}
        >
          <Icon className="h-5 w-5" />
        </div>
      </div>
    </div>
  );
}