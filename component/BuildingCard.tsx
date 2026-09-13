// component/BuildingCard.tsx
import { BuildingSummary } from "../data/types";
import { scoreColor, statusColorClasses, statusDotColor } from "../data/utils";

interface BuildingCardProps {
  summary: BuildingSummary;
}

export default function BuildingCard({ summary }: BuildingCardProps) {
  const occupancyPct = summary.totalRooms
    ? Math.round((summary.occupiedRooms / summary.totalRooms) * 100)
    : 0;

  return (
    <div className="rounded-xl border border-slate-800 bg-slate-900/60 p-5 transition hover:border-slate-700">
      <div className="flex items-start justify-between gap-3">
        <div>
          <h3 className="text-sm font-semibold text-white">{summary.building}</h3>
          <p className="mt-0.5 text-xs text-slate-500">
            {summary.occupiedRooms} of {summary.totalRooms} rooms occupied
          </p>
        </div>
        <span
          className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-[11px] font-medium ${statusColorClasses(
            summary.status
          )}`}
        >
          <span className={`h-1.5 w-1.5 rounded-full ${statusDotColor(summary.status)}`} />
          {summary.status}
        </span>
      </div>

      <div className="mt-4 grid grid-cols-2 gap-3">
        <div>
          <p className="text-[11px] uppercase tracking-wide text-slate-500">
            Current Power
          </p>
          <p className="mt-1 text-lg font-semibold text-white">
            {(summary.currentPowerW / 1000).toFixed(2)} kW
          </p>
        </div>
        <div>
          <p className="text-[11px] uppercase tracking-wide text-slate-500">
            Energy Used
          </p>
          <p className="mt-1 text-lg font-semibold text-white">
            {summary.energyKWh.toFixed(1)} kWh
          </p>
        </div>
      </div>

      <div className="mt-4">
        <div className="flex items-center justify-between text-xs text-slate-400">
          <span>Occupancy</span>
          <span>{occupancyPct}%</span>
        </div>
        <div className="mt-1.5 h-1.5 w-full overflow-hidden rounded-full bg-slate-800">
          <div
            className="h-full rounded-full bg-sky-500 transition-all"
            style={{ width: `${occupancyPct}%` }}
          />
        </div>
      </div>

      <div className="mt-4 flex items-center justify-between border-t border-slate-800 pt-3">
        <span className="text-xs text-slate-500">Efficiency Score</span>
        <span className={`text-sm font-semibold ${scoreColor(summary.scoreLabel)}`}>
          {summary.efficiencyScore}/100 · {summary.scoreLabel}
        </span>
      </div>
    </div>
  );
}