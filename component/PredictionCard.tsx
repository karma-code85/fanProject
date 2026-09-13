// component/PredictionCard.tsx
import { BrainCircuit, TrendingUp, TrendingDown, Info } from "lucide-react";
import { EnergyReading } from "../data/types";

interface PredictionCardProps {
  readings: EnergyReading[];
}

export default function PredictionCard({ readings }: PredictionCardProps) {
  const currentEnergy = readings.reduce((sum, r) => sum + r.energy, 0);
  // Simple demo projection: recent occupancy + waste rate nudges the trend.
  const wasteRate =
    readings.length > 0
      ? readings.filter((r) => r.status === "Waste Alert").length / readings.length
      : 0;
  const changePct = Math.round((0.04 + wasteRate * 0.3) * 100) / 100; // demo only
  const predictedEnergy = Math.round(currentEnergy * (1 + changePct) * 10) / 10;
  const confidence = Math.max(55, Math.min(92, Math.round(78 - wasteRate * 40)));
  const increasing = changePct >= 0;

  return (
    <div className="rounded-xl border border-slate-800 bg-gradient-to-br from-slate-900 to-slate-900/40 p-5">
      <div className="flex items-center gap-2.5">
        <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-violet-500/15 text-violet-400 ring-1 ring-violet-500/30">
          <BrainCircuit className="h-5 w-5" />
        </div>
        <div>
          <h3 className="text-sm font-semibold text-white">
            Prototype ML Prediction
          </h3>
          <p className="text-[11px] text-slate-500">
            Simulated forecast for demonstration only
          </p>
        </div>
      </div>

      <div className="mt-5 grid grid-cols-2 gap-4">
        <div>
          <p className="text-[11px] uppercase tracking-wide text-slate-500">
            Current Consumption
          </p>
          <p className="mt-1 text-xl font-semibold text-white">
            {currentEnergy.toFixed(1)} kWh
          </p>
        </div>
        <div>
          <p className="text-[11px] uppercase tracking-wide text-slate-500">
            Predicted Next Period
          </p>
          <p className="mt-1 text-xl font-semibold text-white">
            {predictedEnergy.toFixed(1)} kWh
          </p>
        </div>
      </div>

      <div className="mt-4 flex flex-wrap items-center gap-3">
        <span
          className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-medium ${
            increasing
              ? "bg-amber-500/15 text-amber-400"
              : "bg-emerald-500/15 text-emerald-400"
          }`}
        >
          {increasing ? (
            <TrendingUp className="h-3.5 w-3.5" />
          ) : (
            <TrendingDown className="h-3.5 w-3.5" />
          )}
          {increasing ? "+" : ""}
          {(changePct * 100).toFixed(0)}% expected change
        </span>
        <span className="inline-flex items-center gap-1.5 rounded-full bg-slate-800 px-3 py-1 text-xs font-medium text-slate-300">
          {confidence}% prediction confidence
        </span>
      </div>

      <div className="mt-4 flex gap-2 rounded-lg border border-slate-800 bg-slate-950/60 p-3 text-xs text-slate-400">
        <Info className="mt-0.5 h-3.5 w-3.5 flex-none text-slate-500" />
        <p>
          This projection is generated from simple rules over simulated
          readings (recent usage and waste rate), not a trained machine
          learning model. In the proposed AWS architecture, this card would
          be produced by a SageMaker forecasting model trained on historical
          campus data.
        </p>
      </div>
    </div>
  );
}