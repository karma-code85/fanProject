// component/AlertsPanel.tsx
"use client";

import { useState } from "react";
import { AlertTriangle, CheckCheck, Trash2, ShieldCheck } from "lucide-react";
import { AlertSeverity, EnergyAlert } from "../data/types";
import { severityColorClasses } from "../data/utils";

interface AlertsPanelProps {
  alerts: EnergyAlert[];
  onMarkReviewed: (id: string) => void;
  onClearReviewed: () => void;
}

const SEVERITIES: (AlertSeverity | "All")[] = ["All", "High", "Medium", "Low"];

export default function AlertsPanel({
  alerts,
  onMarkReviewed,
  onClearReviewed,
}: AlertsPanelProps) {
  const [severityFilter, setSeverityFilter] = useState<AlertSeverity | "All">(
    "All"
  );

  const visibleAlerts = alerts.filter(
    (a) => severityFilter === "All" || a.severity === severityFilter
  );
  const unreviewedCount = alerts.filter((a) => !a.reviewed).length;
  const reviewedCount = alerts.filter((a) => a.reviewed).length;

  return (
    <div className="rounded-xl border border-slate-800 bg-slate-900/60 p-5">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2.5">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-rose-500/15 text-rose-400 ring-1 ring-rose-500/30">
            <AlertTriangle className="h-5 w-5" />
          </div>
          <div>
            <h3 className="text-sm font-semibold text-white">Energy Alerts</h3>
            <p className="text-[11px] text-slate-500">
              {unreviewedCount} unreviewed · {reviewedCount} reviewed
            </p>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {SEVERITIES.map((sev) => (
            <button
              key={sev}
              onClick={() => setSeverityFilter(sev)}
              className={`rounded-full px-3 py-1.5 text-xs font-medium transition ${
                severityFilter === sev
                  ? "bg-slate-700 text-white"
                  : "bg-slate-950 text-slate-400 hover:text-white"
              }`}
            >
              {sev}
            </button>
          ))}
          <button
            onClick={onClearReviewed}
            className="flex items-center gap-1.5 rounded-full border border-slate-800 px-3 py-1.5 text-xs font-medium text-slate-400 hover:border-slate-700 hover:text-white"
          >
            <Trash2 className="h-3.5 w-3.5" />
            Clear reviewed
          </button>
        </div>
      </div>

      <div className="mt-4 space-y-3">
        {visibleAlerts.length === 0 && (
          <div className="flex flex-col items-center gap-2 rounded-lg border border-dashed border-slate-800 py-10 text-center">
            <ShieldCheck className="h-7 w-7 text-slate-600" />
            <p className="text-sm text-slate-400">No alerts to show</p>
          </div>
        )}

        {visibleAlerts.map((alert) => (
          <div
            key={alert.id}
            className={`rounded-lg border p-4 transition ${
              alert.reviewed
                ? "border-slate-800 bg-slate-950/40 opacity-60"
                : "border-slate-800 bg-slate-950/60"
            }`}
          >
            <div className="flex flex-wrap items-start justify-between gap-2">
              <div className="flex items-center gap-2">
                <span
                  className={`rounded-full border px-2.5 py-0.5 text-[11px] font-medium ${severityColorClasses(
                    alert.severity
                  )}`}
                >
                  {alert.severity} severity
                </span>
                <span className="text-xs text-slate-500">
                  {alert.building} · {alert.room}
                </span>
              </div>
              <span className="text-[11px] text-slate-500">
                {new Date(alert.timestamp).toLocaleTimeString()}
              </span>
            </div>

            <p className="mt-2 text-sm text-slate-200">{alert.message}</p>
            <p className="mt-1.5 text-xs text-slate-500">
              Recommended action: {alert.recommendedAction}
            </p>

            {!alert.reviewed && (
              <button
                onClick={() => onMarkReviewed(alert.id)}
                className="mt-3 flex items-center gap-1.5 rounded-lg bg-slate-800 px-3 py-1.5 text-xs font-medium text-slate-200 hover:bg-slate-700"
              >
                <CheckCheck className="h-3.5 w-3.5" />
                Mark as reviewed
              </button>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}