// component/BuildingComparison.tsx
import { BuildingSummary } from "../data/types";
import BuildingCard from "./BuildingCard";

interface BuildingComparisonProps {
  summaries: BuildingSummary[];
}

export default function BuildingComparison({ summaries }: BuildingComparisonProps) {
  const sorted = [...summaries].sort((a, b) => b.efficiencyScore - a.efficiencyScore);
  const best = sorted[0];
  const worst = sorted[sorted.length - 1];

  return (
    <div className="space-y-4">
      {best && worst && best.building !== worst.building && (
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          <div className="rounded-xl border border-emerald-500/25 bg-emerald-500/5 p-4">
            <p className="text-xs font-medium uppercase tracking-wide text-emerald-400">
              Most efficient building
            </p>
            <p className="mt-1 text-lg font-semibold text-white">{best.building}</p>
            <p className="text-xs text-slate-400">
              Score {best.efficiencyScore}/100 · {best.scoreLabel}
            </p>
          </div>
          <div className="rounded-xl border border-rose-500/25 bg-rose-500/5 p-4">
            <p className="text-xs font-medium uppercase tracking-wide text-rose-400">
              Needs the most attention
            </p>
            <p className="mt-1 text-lg font-semibold text-white">{worst.building}</p>
            <p className="text-xs text-slate-400">
              Score {worst.efficiencyScore}/100 · {worst.scoreLabel}
            </p>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {summaries.map((s) => (
          <BuildingCard key={s.building} summary={s} />
        ))}
      </div>
    </div>
  );
}