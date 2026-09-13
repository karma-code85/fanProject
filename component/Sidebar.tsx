// component/Sidebar.tsx
"use client";

import {
  LayoutDashboard,
  Building2,
  BarChart3,
  BellRing,
  BrainCircuit,
  Settings as SettingsIcon,
  Zap,
  X,
} from "lucide-react";
import { DashboardTab } from "../data/types";

interface SidebarProps {
  activeTab: DashboardTab;
  onTabChange: (tab: DashboardTab) => void;
  alertCount: number;
  open: boolean;
  onClose: () => void;
}

const NAV_ITEMS: { tab: DashboardTab; icon: typeof LayoutDashboard }[] = [
  { tab: "Overview", icon: LayoutDashboard },
  { tab: "Buildings", icon: Building2 },
  { tab: "Analytics", icon: BarChart3 },
  { tab: "Alerts", icon: BellRing },
  { tab: "AI Insights", icon: BrainCircuit },
  { tab: "Settings", icon: SettingsIcon },
];

export default function Sidebar({
  activeTab,
  onTabChange,
  alertCount,
  open,
  onClose,
}: SidebarProps) {
  return (
    <>
      {/* Mobile overlay */}
      {open && (
        <div
          className="fixed inset-0 z-30 bg-black/60 lg:hidden"
          onClick={onClose}
          aria-hidden="true"
        />
      )}

      <aside
        className={`fixed inset-y-0 left-0 z-40 flex w-72 flex-col border-r border-slate-800 bg-slate-950 transition-transform duration-200 lg:sticky lg:top-0 lg:h-screen lg:translate-x-0 ${
          open ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="flex items-center justify-between px-5 py-5">
          <div className="flex items-center gap-2.5">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-gradient-to-br from-emerald-500 to-sky-600">
              <Zap className="h-5 w-5 text-white" />
            </div>
            <div>
              <p className="text-sm font-semibold leading-tight text-white">
                Smart Campus
              </p>
              <p className="text-[11px] leading-tight text-slate-400">
                Energy Management
              </p>
            </div>
          </div>
          <button
            className="rounded-md p-1.5 text-slate-400 hover:bg-slate-800 hover:text-white lg:hidden"
            onClick={onClose}
            aria-label="Close navigation"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <nav className="flex-1 space-y-1 px-3 py-2">
          {NAV_ITEMS.map(({ tab, icon: Icon }) => {
            const active = activeTab === tab;
            return (
              <button
                key={tab}
                onClick={() => {
                  onTabChange(tab);
                  onClose();
                }}
                className={`flex w-full items-center justify-between rounded-lg px-3 py-2.5 text-sm font-medium transition ${
                  active
                    ? "bg-emerald-500/10 text-emerald-400"
                    : "text-slate-400 hover:bg-slate-800/70 hover:text-white"
                }`}
              >
                <span className="flex items-center gap-3">
                  <Icon className="h-[18px] w-[18px]" />
                  {tab}
                </span>
                {tab === "Alerts" && alertCount > 0 && (
                  <span className="rounded-full bg-rose-500/20 px-2 py-0.5 text-xs font-semibold text-rose-400">
                    {alertCount}
                  </span>
                )}
              </button>
            );
          })}
        </nav>

        <div className="border-t border-slate-800 px-5 py-4">
          <p className="text-[11px] leading-relaxed text-slate-500">
            AI-Powered Smart Campus Energy — university prototype. All data
            shown is simulated for demonstration purposes.
          </p>
        </div>
      </aside>
    </>
  );
}