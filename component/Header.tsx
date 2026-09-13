// component/Header.tsx
"use client";

import { useEffect, useState } from "react";
import { Menu, Circle, Play, Square } from "lucide-react";
import { formatDateTime } from "../data/utils";

interface HeaderProps {
  onMenuClick: () => void;
  simulationRunning: boolean;
  onToggleSimulation: () => void;
  title: string;
  subtitle: string;
}

export default function Header({
  onMenuClick,
  simulationRunning,
  onToggleSimulation,
  title,
  subtitle,
}: HeaderProps) {
  const [now, setNow] = useState<Date | null>(null);

  useEffect(() => {
    setNow(new Date());
    const id = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(id);
  }, []);

  return (
    <header className="sticky top-0 z-20 border-b border-slate-800 bg-slate-950/90 backdrop-blur">
      <div className="flex flex-wrap items-center justify-between gap-3 px-4 py-3 sm:px-6">
        <div className="flex min-w-0 items-center gap-3">
          <button
            className="rounded-md p-1.5 text-slate-400 hover:bg-slate-800 hover:text-white lg:hidden"
            onClick={onMenuClick}
            aria-label="Open navigation"
          >
            <Menu className="h-5 w-5" />
          </button>
          <div className="min-w-0">
            <h1 className="truncate text-base font-semibold text-white sm:text-lg">
              {title}
            </h1>
            <p className="truncate text-xs text-slate-400 sm:text-sm">
              {subtitle}
            </p>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2 sm:gap-3">
          <div className="flex items-center gap-1.5 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-3 py-1.5 text-xs font-medium text-emerald-400">
            <Circle className="h-2 w-2 fill-emerald-400 text-emerald-400 animate-pulse" />
            System Online
          </div>

          <div className="hidden rounded-full border border-slate-800 bg-slate-900 px-3 py-1.5 text-xs text-slate-300 sm:block">
            {now ? formatDateTime(now) : "--"}
          </div>

          <button
            onClick={onToggleSimulation}
            className={`flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-semibold transition ${
              simulationRunning
                ? "bg-rose-500/15 text-rose-400 hover:bg-rose-500/25"
                : "bg-emerald-500 text-white hover:bg-emerald-400"
            }`}
          >
            {simulationRunning ? (
              <>
                <Square className="h-3.5 w-3.5" /> Stop Simulation
              </>
            ) : (
              <>
                <Play className="h-3.5 w-3.5" /> Start Live Simulation
              </>
            )}
          </button>
        </div>
      </div>

      {simulationRunning && (
        <div className="flex items-center gap-2 border-t border-emerald-500/20 bg-emerald-500/5 px-4 py-1.5 text-xs text-emerald-400 sm:px-6">
          <Circle className="h-1.5 w-1.5 fill-emerald-400 text-emerald-400 animate-ping" />
          Live simulation active — readings updating automatically
        </div>
      )}
    </header>
  );
}