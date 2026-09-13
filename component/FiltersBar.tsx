// component/FiltersBar.tsx
"use client";

import { Search, XCircle, Download } from "lucide-react";
import { BuildingName, FilterState, ReadingStatus } from "../data/types";
import { BUILDINGS } from "../data/simulatedData";

interface FiltersBarProps {
  filters: FilterState;
  onChange: (filters: FilterState) => void;
  availableDates: string[];
  onExportCSV: () => void;
}

const STATUS_OPTIONS: (ReadingStatus | "All")[] = [
  "All",
  "Normal",
  "High Usage",
  "Waste Alert",
  "Possible Fault",
];

export default function FiltersBar({
  filters,
  onChange,
  availableDates,
  onExportCSV,
}: FiltersBarProps) {
  function update<K extends keyof FilterState>(key: K, value: FilterState[K]) {
    onChange({ ...filters, [key]: value });
  }

  function clearFilters() {
    onChange({
      search: "",
      building: "All",
      status: "All",
      date: "All",
      alertsOnly: false,
    });
  }

  return (
    <div className="rounded-xl border border-slate-800 bg-slate-900/60 p-4">
      <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
        <div className="relative w-full lg:max-w-xs">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500" />
          <input
            type="text"
            value={filters.search}
            onChange={(e) => update("search", e.target.value)}
            placeholder="Search building or room..."
            className="w-full rounded-lg border border-slate-800 bg-slate-950 py-2 pl-9 pr-3 text-sm text-white placeholder:text-slate-500 focus:border-emerald-500 focus:outline-none"
          />
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <select
            value={filters.building}
            onChange={(e) => update("building", e.target.value as BuildingName | "All")}
            className="rounded-lg border border-slate-800 bg-slate-950 px-3 py-2 text-sm text-white focus:border-emerald-500 focus:outline-none"
          >
            <option value="All">All Buildings</option>
            {BUILDINGS.map((b) => (
              <option key={b} value={b}>
                {b}
              </option>
            ))}
          </select>

          <select
            value={filters.status}
            onChange={(e) => update("status", e.target.value as ReadingStatus | "All")}
            className="rounded-lg border border-slate-800 bg-slate-950 px-3 py-2 text-sm text-white focus:border-emerald-500 focus:outline-none"
          >
            {STATUS_OPTIONS.map((s) => (
              <option key={s} value={s}>
                {s === "All" ? "All Statuses" : s}
              </option>
            ))}
          </select>

          <select
            value={filters.date}
            onChange={(e) => update("date", e.target.value)}
            className="rounded-lg border border-slate-800 bg-slate-950 px-3 py-2 text-sm text-white focus:border-emerald-500 focus:outline-none"
          >
            <option value="All">All Dates</option>
            {availableDates.map((d) => (
              <option key={d} value={d}>
                {d}
              </option>
            ))}
          </select>

          <label className="flex items-center gap-2 rounded-lg border border-slate-800 bg-slate-950 px-3 py-2 text-sm text-slate-300">
            <input
              type="checkbox"
              checked={filters.alertsOnly}
              onChange={(e) => update("alertsOnly", e.target.checked)}
              className="h-3.5 w-3.5 accent-emerald-500"
            />
            Alerts only
          </label>

          <button
            onClick={clearFilters}
            className="flex items-center gap-1.5 rounded-lg border border-slate-800 px-3 py-2 text-sm text-slate-400 hover:border-slate-700 hover:text-white"
          >
            <XCircle className="h-4 w-4" />
            Clear
          </button>

          <button
            onClick={onExportCSV}
            className="flex items-center gap-1.5 rounded-lg bg-sky-600 px-3 py-2 text-sm font-medium text-white hover:bg-sky-500"
          >
            <Download className="h-4 w-4" />
            Export CSV Report
          </button>
        </div>
      </div>
    </div>
  );
}