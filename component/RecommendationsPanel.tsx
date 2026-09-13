// component/RecommendationsPanel.tsx
import { Lightbulb, CheckCircle2 } from "lucide-react";

interface RecommendationsPanelProps {
  recommendations: string[];
}

export default function RecommendationsPanel({
  recommendations,
}: RecommendationsPanelProps) {
  return (
    <div className="rounded-xl border border-slate-800 bg-slate-900/60 p-5">
      <div className="flex items-center gap-2.5">
        <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-amber-500/15 text-amber-400 ring-1 ring-amber-500/30">
          <Lightbulb className="h-5 w-5" />
        </div>
        <div>
          <h3 className="text-sm font-semibold text-white">
            Smart Recommendations
          </h3>
          <p className="text-[11px] text-slate-500">
            Generated from current simulated readings
          </p>
        </div>
      </div>

      <ul className="mt-4 space-y-2.5">
        {recommendations.map((rec, i) => (
          <li
            key={i}
            className="flex items-start gap-2.5 rounded-lg border border-slate-800 bg-slate-950/50 p-3 text-sm text-slate-300"
          >
            <CheckCircle2 className="mt-0.5 h-4 w-4 flex-none text-emerald-500" />
            {rec}
          </li>
        ))}
      </ul>
    </div>
  );
}