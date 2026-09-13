// component/CampusOverview.tsx
import { BuildingSummary } from "../data/types";
import { Building2, GraduationCap, BookOpen, BedDouble, Briefcase } from "lucide-react";
import { statusColorClasses, statusDotColor } from "../data/utils";

interface CampusOverviewProps {
  summaries: BuildingSummary[];
}

const BUILDING_ICON: Record<string, typeof Building2> = {
  "Computer Lab": Building2,
  "Lecture Hall": GraduationCap,
  Library: BookOpen,
  Hostel: BedDouble,
  "Administration Office": Briefcase,
};

export default function CampusOverview({ summaries }: CampusOverviewProps) {
  return (
    <div className="rounded-xl border border-slate-800 bg-slate-900/60 p-5">
      <div className="mb-4 flex items-center justify-between">
        <h3 className="text-sm font-semibold text-white">Campus Overview</h3>
        <div className="hidden flex-wrap items-center gap-3 text-[11px] text-slate-400 sm:flex">
          <span className="flex items-center gap-1.5">
            <span className="h-2 w-2 rounded-full bg-emerald-500" /> Normal
          </span>
          <span className="flex items-center gap-1.5">
            <span className="h-2 w-2 rounded-full bg-amber-500" /> High Usage
          </span>
          <span className="flex items-center gap-1.5">
            <span className="h-2 w-2 rounded-full bg-rose-500" /> Waste Alert
          </span>
          <span className="flex items-center gap-1.5">
            <span className="h-2 w-2 rounded-full bg-purple-500" /> Possible Fault
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-5">
        {summaries.map((s) => {
          const Icon = BUILDING_ICON[s.building] ?? Building2;
          return (
            <div
              key={s.building}
              className={`rounded-lg border p-4 transition ${statusColorClasses(
                s.status
              )}`}
            >
              <div className="flex items-center justify-between">
                <Icon className="h-5 w-5" />
                <span className={`h-2 w-2 rounded-full ${statusDotColor(s.status)}`} />
              </div>
              <p className="mt-3 text-sm font-medium text-white">{s.building}</p>
              <p className="mt-0.5 text-xs opacity-80">{s.status}</p>
            </div>
          );
        })}
      </div>
    </div>
  );
}