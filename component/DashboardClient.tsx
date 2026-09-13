// component/DashboardClient.tsx
"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import Sidebar from "./Sidebar";
import Header from "./Header";
import StatsGrid from "./StatsGrid";
import FiltersBar from "./FiltersBar";
import ReadingsTable from "./ReadingsTable";
import BuildingComparison from "./BuildingComparison";
import CampusOverview from "./CampusOverview";
import PredictionCard from "./PredictionCard";
import RecommendationsPanel from "./RecommendationsPanel";
import AlertsPanel from "./AlertsPanel";
import SettingsPanel from "./SettingsPanel";
import ArchitectureSection from "./ArchitectureSection";
import WeeklyConsumptionChart from "./charts/WeeklyConsumptionChart";
import ConsumptionByBuildingChart from "./charts/ConsumptionByBuildingChart";
import PowerOverTimeChart from "./charts/PowerOverTimeChart";
import OccupancyVsPowerChart from "./charts/OccupancyVsPowerChart";
import NormalVsWasteChart from "./charts/NormalVsWasteChart";
import PredictedConsumptionChart from "./charts/PredictedConsumptionChart";

import {
  DashboardSettings,
  DashboardTab,
  EnergyAlert,
  EnergyReading,
  FilterState,
  HourlyPowerPoint,
} from "../data/types";
import { BUILDINGS, DEFAULT_SETTINGS, generateAllReadings } from "../data/simulatedData";
import {
  buildAlertsFromReadings,
  buildPredictionSeries,
  buildWeeklySeries,
  exportReadingsToCSV,
  generateRecommendations,
  summarizeBuildings,
} from "../data/utils";

const DEFAULT_FILTERS: FilterState = {
  search: "",
  building: "All",
  status: "All",
  date: "All",
  alertsOnly: false,
};

const MAX_POWER_HISTORY_POINTS = 24;
const MAX_ALERTS = 60;

export default function DashboardClient() {
  const [activeTab, setActiveTab] = useState<DashboardTab>("Overview");
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const [settings, setSettings] = useState<DashboardSettings>(DEFAULT_SETTINGS);
  const [filters, setFilters] = useState<FilterState>(DEFAULT_FILTERS);

  const [readings, setReadings] = useState<EnergyReading[]>([]);
  const [alerts, setAlerts] = useState<EnergyAlert[]>([]);
  const [powerHistory, setPowerHistory] = useState<HourlyPowerPoint[]>([]);

  const [simulationRunning, setSimulationRunning] = useState(false);

  // Keep the latest settings in a ref so the interval callback always reads
  // fresh values without needing to restart the interval on every change.
  const settingsRef = useRef(settings);
  useEffect(() => {
    settingsRef.current = settings;
  }, [settings]);

  const tick = useCallback(() => {
    const currentSettings = settingsRef.current;
    const newReadings = generateAllReadings(currentSettings);
    setReadings(newReadings);

    const newAlerts = buildAlertsFromReadings(newReadings, currentSettings);
    setAlerts((prev) => [...newAlerts, ...prev].slice(0, MAX_ALERTS));

    const totalPower = newReadings.reduce((sum, r) => sum + r.power, 0);
    const label = new Date().toLocaleTimeString("en-GB", {
      hour: "2-digit",
      minute: "2-digit",
    });
    setPowerHistory((prev) =>
      [...prev, { hour: label, power: Math.round(totalPower) }].slice(
        -MAX_POWER_HISTORY_POINTS
      )
    );
  }, []);

  // Seed initial data once, on the client only (avoids SSR/CSR mismatch
  // since readings are randomly generated).
  useEffect(() => {
    tick();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Live simulation interval.
  useEffect(() => {
    if (!simulationRunning) return;
    const id = setInterval(tick, settings.simulationSpeedMs);
    return () => clearInterval(id);
  }, [simulationRunning, settings.simulationSpeedMs, tick]);

  const filteredReadings = useMemo(() => {
    return readings.filter((r) => {
      if (
        filters.search &&
        !`${r.building} ${r.room}`
          .toLowerCase()
          .includes(filters.search.toLowerCase())
      ) {
        return false;
      }
      if (filters.building !== "All" && r.building !== filters.building) {
        return false;
      }
      if (filters.status !== "All" && r.status !== filters.status) {
        return false;
      }
      if (filters.date !== "All" && r.date !== filters.date) {
        return false;
      }
      if (filters.alertsOnly && r.status === "Normal") {
        return false;
      }
      return true;
    });
  }, [readings, filters]);

  const buildingSummaries = useMemo(
    () => summarizeBuildings(filteredReadings.length ? filteredReadings : readings, BUILDINGS),
    [filteredReadings, readings]
  );

  const availableDates = useMemo(
    () => Array.from(new Set(readings.map((r) => r.date))).sort(),
    [readings]
  );

  const weeklySeries = useMemo(() => buildWeeklySeries(readings), [readings]);
  const predictionSeries = useMemo(() => buildPredictionSeries(readings), [readings]);
  const recommendations = useMemo(
    () => generateRecommendations(readings),
    [readings]
  );

  const activeAlerts = useMemo(() => alerts, [alerts]);

  function handleMarkReviewed(id: string) {
    setAlerts((prev) =>
      prev.map((a) => (a.id === id ? { ...a, reviewed: true } : a))
    );
  }

  function handleClearReviewed() {
    setAlerts((prev) => prev.filter((a) => !a.reviewed));
  }

  const unreviewedAlertCount = alerts.filter((a) => !a.reviewed).length;

  return (
    <div className="min-h-screen bg-slate-950">
      <div className="mx-auto flex min-h-screen max-w-[1600px]">
        <Sidebar
          activeTab={activeTab}
          onTabChange={setActiveTab}
          alertCount={unreviewedAlertCount}
          open={sidebarOpen}
          onClose={() => setSidebarOpen(false)}
        />

        <div className="flex min-w-0 flex-1 flex-col">
          <Header
            onMenuClick={() => setSidebarOpen(true)}
            simulationRunning={simulationRunning}
            onToggleSimulation={() => setSimulationRunning((s) => !s)}
            title="AI-Powered Smart Campus Energy"
            subtitle="Intelligent IoT Energy Management for University Campuses"
          />

          <main className="flex-1 space-y-6 px-4 py-6 sm:px-6">
            {activeTab === "Overview" && (
              <>
                <StatsGrid readings={readings} settings={settings} />
                <CampusOverview summaries={buildingSummaries} />
                <FiltersBar
                  filters={filters}
                  onChange={setFilters}
                  availableDates={availableDates}
                  onExportCSV={() => exportReadingsToCSV(filteredReadings)}
                />
                <ReadingsTable readings={filteredReadings} />
              </>
            )}

            {activeTab === "Buildings" && (
              <>
                <FiltersBar
                  filters={filters}
                  onChange={setFilters}
                  availableDates={availableDates}
                  onExportCSV={() => exportReadingsToCSV(filteredReadings)}
                />
                <BuildingComparison summaries={buildingSummaries} />
              </>
            )}

            {activeTab === "Analytics" && (
              <div className="grid grid-cols-1 gap-5 xl:grid-cols-2">
                <ChartPanel title="Weekly Energy Consumption">
                  <WeeklyConsumptionChart data={weeklySeries} />
                </ChartPanel>
                <ChartPanel title="Energy Consumption by Building">
                  <ConsumptionByBuildingChart summaries={buildingSummaries} />
                </ChartPanel>
                <ChartPanel title="Power Usage Over Time">
                  <PowerOverTimeChart data={powerHistory} />
                </ChartPanel>
                <ChartPanel title="Occupancy vs. Power Usage">
                  <OccupancyVsPowerChart readings={readings} />
                </ChartPanel>
                <ChartPanel title="Normal Usage vs. Waste Alerts">
                  <NormalVsWasteChart readings={readings} />
                </ChartPanel>
                <ChartPanel title="Predicted vs. Actual Consumption">
                  <PredictedConsumptionChart data={predictionSeries} />
                </ChartPanel>
              </div>
            )}

            {activeTab === "Alerts" && (
              <AlertsPanel
                alerts={activeAlerts}
                onMarkReviewed={handleMarkReviewed}
                onClearReviewed={handleClearReviewed}
              />
            )}

            {activeTab === "AI Insights" && (
              <div className="grid grid-cols-1 gap-5 xl:grid-cols-2">
                <PredictionCard readings={readings} />
                <RecommendationsPanel recommendations={recommendations} />
                <div className="xl:col-span-2">
                  <ArchitectureSection />
                </div>
              </div>
            )}

            {activeTab === "Settings" && (
              <SettingsPanel settings={settings} onChange={setSettings} />
            )}
          </main>
        </div>
      </div>
    </div>
  );
}

function ChartPanel({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div className="rounded-xl border border-slate-800 bg-slate-900/60 p-5">
      <h3 className="mb-2 text-sm font-semibold text-white">{title}</h3>
      {children}
    </div>
  );
}