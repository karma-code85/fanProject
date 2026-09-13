// data/types.ts
// Shared TypeScript types for the AI-Powered Smart Campus Energy dashboard.
// All data in this project is simulated for prototype/demo purposes.

export type BuildingName =
  | "Computer Lab"
  | "Lecture Hall"
  | "Library"
  | "Hostel"
  | "Administration Office";

export type ReadingStatus =
  | "Normal"
  | "High Usage"
  | "Waste Alert"
  | "Possible Fault";

export type AlertSeverity = "Low" | "Medium" | "High";

export type ScoreLabel = "Excellent" | "Good" | "Needs Attention" | "Poor";

/** A single simulated IoT-style energy reading for one room. */
export interface EnergyReading {
  id: string;
  building: BuildingName;
  room: string;
  date: string; // ISO date string, e.g. "2026-09-12"
  time: string; // "HH:mm"
  voltage: number; // volts
  current: number; // amps
  power: number; // watts
  energy: number; // kWh (energy used in the current interval)
  occupancy: number; // 0 = empty, 1 = occupied
  temperature: number; // Celsius
  status: ReadingStatus;
}

/** A derived waste/anomaly alert built from one or more readings. */
export interface EnergyAlert {
  id: string;
  readingId: string;
  building: BuildingName;
  room: string;
  power: number;
  occupancy: number;
  status: ReadingStatus;
  severity: AlertSeverity;
  message: string;
  recommendedAction: string;
  timestamp: string; // ISO datetime string
  reviewed: boolean;
}

/** One point of aggregated weekly consumption, per building or campus-wide. */
export interface WeeklyConsumptionPoint {
  day: string; // "Mon", "Tue", ...
  kWh: number;
}

/** One point of hourly power trend, per building or campus-wide. */
export interface HourlyPowerPoint {
  hour: string; // "00:00", "01:00", ...
  power: number; // watts
}

/** One point comparing predicted vs. actual daily consumption. */
export interface PredictedConsumptionPoint {
  day: string; // "Day 1", "Day 2", ...
  predicted: number; // kWh
  actual: number; // kWh
}

/** Aggregated per-building summary used by building cards and comparisons. */
export interface BuildingSummary {
  building: BuildingName;
  currentPowerW: number;
  energyKWh: number;
  occupiedRooms: number;
  totalRooms: number;
  efficiencyScore: number; // 0-100
  scoreLabel: ScoreLabel;
  status: ReadingStatus;
}

/** User-configurable settings that affect thresholds and calculations. */
export interface DashboardSettings {
  electricityTariffRWF: number; // RWF per kWh
  alertPowerThresholdW: number; // watts
  occupancyAlertEnabled: boolean;
  simulationSpeedMs: number; // interval length in ms
  darkMode: boolean;
  co2FactorKgPerKWh: number; // demo/example emission factor
}

export interface FilterState {
  search: string;
  building: BuildingName | "All";
  status: ReadingStatus | "All";
  date: string | "All";
  alertsOnly: boolean;
}

export type DashboardTab =
  | "Overview"
  | "Buildings"
  | "Analytics"
  | "Alerts"
  | "AI Insights"
  | "Settings";