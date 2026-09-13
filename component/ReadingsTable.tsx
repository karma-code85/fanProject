// component/ReadingsTable.tsx
"use client";

import { EnergyReading } from "../data/types";
import { statusColorClasses, statusDotColor } from "../data/utils";
import { Inbox } from "lucide-react";

interface ReadingsTableProps {
  readings: EnergyReading[];
}

export default function ReadingsTable({ readings }: ReadingsTableProps) {
  if (readings.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center gap-2 rounded-xl border border-dashed border-slate-800 bg-slate-900/40 py-16 text-center">
        <Inbox className="h-8 w-8 text-slate-600" />
        <p className="text-sm font-medium text-slate-300">
          No readings match your filters
        </p>
        <p className="text-xs text-slate-500">
          Try clearing filters or waiting for the next simulation tick.
        </p>
      </div>
    );
  }

  return (
    <div className="overflow-hidden rounded-xl border border-slate-800 bg-slate-900/60">
      <div className="max-w-full overflow-x-auto">
        <table className="w-full min-w-[820px] text-left text-sm">
          <thead>
            <tr className="border-b border-slate-800 text-xs uppercase tracking-wide text-slate-400">
              <th className="px-4 py-3 font-medium">Building</th>
              <th className="px-4 py-3 font-medium">Room</th>
              <th className="px-4 py-3 font-medium">Time</th>
              <th className="px-4 py-3 font-medium">Power</th>
              <th className="px-4 py-3 font-medium">Energy</th>
              <th className="px-4 py-3 font-medium">Occupancy</th>
              <th className="px-4 py-3 font-medium">Temp.</th>
              <th className="px-4 py-3 font-medium">Status</th>
            </tr>
          </thead>
          <tbody>
            {readings.map((r) => (
              <tr
                key={r.id}
                className="border-b border-slate-800/60 last:border-0 hover:bg-slate-800/30"
              >
                <td className="px-4 py-3 font-medium text-white">{r.building}</td>
                <td className="px-4 py-3 text-slate-300">{r.room}</td>
                <td className="px-4 py-3 text-slate-400">
                  {r.date} · {r.time}
                </td>
                <td className="px-4 py-3 text-slate-200">{r.power} W</td>
                <td className="px-4 py-3 text-slate-200">{r.energy} kWh</td>
                <td className="px-4 py-3">
                  <span
                    className={`inline-flex items-center gap-1.5 text-xs ${
                      r.occupancy === 1 ? "text-emerald-400" : "text-slate-500"
                    }`}
                  >
                    <span
                      className={`h-1.5 w-1.5 rounded-full ${
                        r.occupancy === 1 ? "bg-emerald-400" : "bg-slate-600"
                      }`}
                    />
                    {r.occupancy === 1 ? "Occupied" : "Empty"}
                  </span>
                </td>
                <td className="px-4 py-3 text-slate-400">{r.temperature}°C</td>
                <td className="px-4 py-3">
                  <span
                    className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-xs font-medium ${statusColorClasses(
                      r.status
                    )}`}
                  >
                    <span className={`h-1.5 w-1.5 rounded-full ${statusDotColor(r.status)}`} />
                    {r.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}