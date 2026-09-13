// component/SettingsPanel.tsx
"use client";

import { DashboardSettings } from "../data/types";
import { Settings as SettingsIcon, Moon, Sun } from "lucide-react";

interface SettingsPanelProps {
  settings: DashboardSettings;
  onChange: (settings: DashboardSettings) => void;
}

export default function SettingsPanel({ settings, onChange }: SettingsPanelProps) {
  function update<K extends keyof DashboardSettings>(
    key: K,
    value: DashboardSettings[K]
  ) {
    onChange({ ...settings, [key]: value });
  }

  return (
    <div className="max-w-2xl rounded-xl border border-slate-800 bg-slate-900/60 p-5">
      <div className="flex items-center gap-2.5">
        <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-sky-500/15 text-sky-400 ring-1 ring-sky-500/30">
          <SettingsIcon className="h-5 w-5" />
        </div>
        <div>
          <h3 className="text-sm font-semibold text-white">Dashboard Settings</h3>
          <p className="text-[11px] text-slate-500">
            Changes apply instantly to the simulation
          </p>
        </div>
      </div>

      <div className="mt-5 space-y-5">
        <div>
          <label className="text-xs font-medium text-slate-300">
            Electricity Tariff (RWF per kWh)
          </label>
          <input
            type="number"
            min={0}
            value={settings.electricityTariffRWF}
            onChange={(e) =>
              update("electricityTariffRWF", Number(e.target.value) || 0)
            }
            className="mt-1.5 w-full rounded-lg border border-slate-800 bg-slate-950 px-3 py-2 text-sm text-white focus:border-emerald-500 focus:outline-none"
          />
        </div>

        <div>
          <label className="text-xs font-medium text-slate-300">
            Alert Power Threshold (W)
          </label>
          <input
            type="number"
            min={0}
            value={settings.alertPowerThresholdW}
            onChange={(e) =>
              update("alertPowerThresholdW", Number(e.target.value) || 0)
            }
            className="mt-1.5 w-full rounded-lg border border-slate-800 bg-slate-950 px-3 py-2 text-sm text-white focus:border-emerald-500 focus:outline-none"
          />
          <p className="mt-1 text-[11px] text-slate-500">
            A room is flagged as a waste alert when it&apos;s empty and drawing
            more than this amount of power.
          </p>
        </div>

        <div className="flex items-center justify-between rounded-lg border border-slate-800 bg-slate-950/50 px-4 py-3">
          <div>
            <p className="text-sm text-slate-200">Occupancy-based alerts</p>
            <p className="text-[11px] text-slate-500">
              Enable waste detection based on occupancy sensors
            </p>
          </div>
          <button
            onClick={() =>
              update("occupancyAlertEnabled", !settings.occupancyAlertEnabled)
            }
            className={`h-6 w-11 rounded-full transition ${
              settings.occupancyAlertEnabled ? "bg-emerald-500" : "bg-slate-700"
            }`}
          >
            <span
              className={`block h-5 w-5 translate-x-0.5 rounded-full bg-white transition ${
                settings.occupancyAlertEnabled ? "translate-x-5" : ""
              }`}
            />
          </button>
        </div>

        <div>
          <label className="text-xs font-medium text-slate-300">
            Simulation Speed
          </label>
          <select
            value={settings.simulationSpeedMs}
            onChange={(e) => update("simulationSpeedMs", Number(e.target.value))}
            className="mt-1.5 w-full rounded-lg border border-slate-800 bg-slate-950 px-3 py-2 text-sm text-white focus:border-emerald-500 focus:outline-none"
          >
            <option value={1500}>Fast (1.5s)</option>
            <option value={3000}>Normal (3s)</option>
            <option value={6000}>Slow (6s)</option>
          </select>
        </div>

        <div className="flex items-center justify-between rounded-lg border border-slate-800 bg-slate-950/50 px-4 py-3">
          <div className="flex items-center gap-2">
            {settings.darkMode ? (
              <Moon className="h-4 w-4 text-slate-400" />
            ) : (
              <Sun className="h-4 w-4 text-amber-400" />
            )}
            <div>
              <p className="text-sm text-slate-200">Dark mode</p>
              <p className="text-[11px] text-slate-500">
                This prototype is designed dark-first
              </p>
            </div>
          </div>
          <button
            onClick={() => update("darkMode", !settings.darkMode)}
            className={`h-6 w-11 rounded-full transition ${
              settings.darkMode ? "bg-emerald-500" : "bg-slate-700"
            }`}
          >
            <span
              className={`block h-5 w-5 translate-x-0.5 rounded-full bg-white transition ${
                settings.darkMode ? "translate-x-5" : ""
              }`}
            />
          </button>
        </div>
      </div>
    </div>
  );
}