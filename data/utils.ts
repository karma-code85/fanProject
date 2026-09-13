// data/utils.ts
// Pure helper functions used across the dashboard. No external calls -
// everything here operates on simulated, in-memory data only.

import {
  EnergyReading,
  EnergyAlert,
  BuildingSummary,
  BuildingName,
  ReadingStatus,
  ScoreLabel,
  DashboardSettings,
  WeeklyConsumptionPoint,
  PredictedConsumptionPoint,
} from "./types";

/** Simple random helper for simulated data generation. */
export function randomBetween(min: number, max: number): number {
  return Math.round((min + Math.random() * (max - min)) * 100) / 100;
}

export function generateId(prefix: string): string {
  return `${prefix}-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
}

/**
 * Determine a reading's status from its power and occupancy, given the
 * current settings from the Settings tab. This is intentionally simple and
 * rule-based (not a trained model) - see the "AI Insights" tab for the
 * clearly-labelled prototype ML prediction section.
 */
export function computeStatus(
  power: number,
  occupancy: number,
  settings: Pick<DashboardSettings, "alertPowerThresholdW" | "occupancyAlertEnabled">
): ReadingStatus {
  if (power >= 950) return "Possible Fault";
  if (
    settings.occupancyAlertEnabled &&
    occupancy === 0 &&
    power > settings.alertPowerThresholdW
  ) {
    return "Waste Alert";
  }
  if (power > settings.alertPowerThresholdW * 0.75) return "High Usage";
  return "Normal";
}

/** True if a reading currently qualifies as an energy-waste case. */
export function isWasteReading(
  reading: EnergyReading,
  settings: DashboardSettings
): boolean {
  return (
    settings.occupancyAlertEnabled &&
    reading.occupancy === 0 &&
    reading.power > settings.alertPowerThresholdW
  );
}

/**
 * Energy efficiency score from 0-100 for a single reading or an aggregate.
 * Lower power with normal occupancy scores higher; an empty room drawing
 * high power (waste) scores much lower.
 */
export function calculateEfficiencyScore(
  avgPower: number,
  occupancyRate: number,
  wasteRate: number
): number {
  let score = 100;

  // Penalize high average power usage.
  score -= Math.min(45, (avgPower / 1000) * 45);

  // Reward buildings that are actually occupied when drawing power.
  score += (occupancyRate - 0.5) * 20;

  // Heavily penalize waste (empty rooms with high draw).
  score -= wasteRate * 60;

  return Math.max(0, Math.min(100, Math.round(score)));
}

export function scoreLabel(score: number): ScoreLabel {
  if (score >= 85) return "Excellent";
  if (score >= 65) return "Good";
  if (score >= 40) return "Needs Attention";
  return "Poor";
}

export function scoreColor(label: ScoreLabel): string {
  switch (label) {
    case "Excellent":
      return "text-emerald-500";
    case "Good":
      return "text-sky-500";
    case "Needs Attention":
      return "text-amber-500";
    case "Poor":
      return "text-rose-500";
  }
}

/** Estimated electricity cost in RWF: energy (kWh) x tariff (RWF/kWh). */
export function calculateCost(energyKWh: number, tariffRWF: number): number {
  return Math.round(energyKWh * tariffRWF);
}

/**
 * Estimated CO2 emissions in kilograms, based on a demo/example emission
 * factor (kg CO2 per kWh). This is illustrative only, not a certified value.
 */
export function calculateCO2(energyKWh: number, factorKgPerKWh: number): number {
  return Math.round(energyKWh * factorKgPerKWh * 100) / 100;
}

export function statusColorClasses(status: ReadingStatus): string {
  switch (status) {
    case "Normal":
      return "bg-emerald-500/15 text-emerald-400 border-emerald-500/30";
    case "High Usage":
      return "bg-amber-500/15 text-amber-400 border-amber-500/30";
    case "Waste Alert":
      return "bg-rose-500/15 text-rose-400 border-rose-500/30";
    case "Possible Fault":
      return "bg-purple-500/15 text-purple-400 border-purple-500/30";
  }
}

export function statusDotColor(status: ReadingStatus): string {
  switch (status) {
    case "Normal":
      return "bg-emerald-500";
    case "High Usage":
      return "bg-amber-500";
    case "Waste Alert":
      return "bg-rose-500";
    case "Possible Fault":
      return "bg-purple-500";
  }
}

export function severityColorClasses(
  severity: "Low" | "Medium" | "High"
): string {
  switch (severity) {
    case "Low":
      return "bg-sky-500/15 text-sky-400 border-sky-500/30";
    case "Medium":
      return "bg-amber-500/15 text-amber-400 border-amber-500/30";
    case "High":
      return "bg-rose-500/15 text-rose-400 border-rose-500/30";
  }
}

/** Build a human-readable waste/anomaly alert list from current readings. */
export function buildAlertsFromReadings(
  readings: EnergyReading[],
  settings: DashboardSettings
): EnergyAlert[] {
  const alerts: EnergyAlert[] = [];

  readings.forEach((r) => {
    if (r.status === "Normal") return;

    let severity: "Low" | "Medium" | "High" = "Low";
    let message = "";
    let action = "";

    if (r.status === "Waste Alert") {
      severity = "High";
      message = `Energy waste detected in ${r.room}, ${r.building}. The room is empty but power usage is high (${Math.round(
        r.power
      )} W).`;
      action = "Turn off equipment and lighting remotely or schedule an inspection.";
    } else if (r.status === "Possible Fault") {
      severity = "High";
      message = `Unusual power draw in ${r.room}, ${r.building} (${Math.round(
        r.power
      )} W). This may indicate a faulty device or circuit.`;
      action = "Send a maintenance technician to inspect wiring and connected equipment.";
    } else if (r.status === "High Usage") {
      severity = "Medium";
      message = `${r.room}, ${r.building} is drawing above-normal power (${Math.round(
        r.power
      )} W) while occupied.`;
      action = "Check air-conditioning settings and the number of active devices.";
    }

    alerts.push({
      id: generateId("alert"),
      readingId: r.id,
      building: r.building,
      room: r.room,
      power: r.power,
      occupancy: r.occupancy,
      status: r.status,
      severity,
      message,
      recommendedAction: action,
      timestamp: `${r.date}T${r.time}:00`,
      reviewed: false,
    });
  });

  return alerts.sort((a, b) => (a.timestamp < b.timestamp ? 1 : -1));
}

/** Aggregate raw readings into one summary card per building. */
export function summarizeBuildings(
  readings: EnergyReading[],
  buildings: BuildingName[]
): BuildingSummary[] {
  return buildings.map((building) => {
    const rows = readings.filter((r) => r.building === building);
    const totalRooms = rows.length || 1;
    const occupiedRooms = rows.filter((r) => r.occupancy === 1).length;
    const currentPowerW = rows.reduce((sum, r) => sum + r.power, 0);
    const energyKWh = rows.reduce((sum, r) => sum + r.energy, 0);
    const wasteRows = rows.filter((r) => r.status === "Waste Alert").length;

    const avgPower = currentPowerW / totalRooms;
    const occupancyRate = occupiedRooms / totalRooms;
    const wasteRate = wasteRows / totalRooms;

    const efficiencyScore = calculateEfficiencyScore(
      avgPower,
      occupancyRate,
      wasteRate
    );

    // Building-level status reflects its worst room.
    const severityOrder: ReadingStatus[] = [
      "Possible Fault",
      "Waste Alert",
      "High Usage",
      "Normal",
    ];
    const worstStatus =
      severityOrder.find((s) => rows.some((r) => r.status === s)) ?? "Normal";

    return {
      building,
      currentPowerW: Math.round(currentPowerW),
      energyKWh: Math.round(energyKWh * 100) / 100,
      occupiedRooms,
      totalRooms: rows.length,
      efficiencyScore,
      scoreLabel: scoreLabel(efficiencyScore),
      status: worstStatus,
    };
  });
}

/** Generate simple smart recommendations derived from current readings. */
export function generateRecommendations(readings: EnergyReading[]): string[] {
  const recs = new Set<string>();

  const wasteRooms = readings.filter((r) => r.status === "Waste Alert");
  const faultRooms = readings.filter((r) => r.status === "Possible Fault");
  const highUsageRooms = readings.filter((r) => r.status === "High Usage");
  const hotRooms = readings.filter((r) => r.temperature >= 28);

  if (wasteRooms.length > 0) {
    recs.add(
      `Turn off lights and equipment in ${wasteRooms.length} empty room(s) currently drawing power, including ${wasteRooms[0].room}.`
    );
  }
  if (faultRooms.length > 0) {
    recs.add(
      `Inspect ${faultRooms[0].room} in ${faultRooms[0].building} for a possible circuit or equipment fault.`
    );
  }
  if (highUsageRooms.length > 0) {
    recs.add(
      "Reduce air-conditioning or heavy-equipment usage in rooms showing sustained high power draw."
    );
  }
  if (hotRooms.length > 0) {
    recs.add(
      `Check overloaded circuits or cooling in ${hotRooms[0].room}, where sensor temperature is elevated.`
    );
  }
  recs.add(
    "Schedule high-energy activities (labs, equipment-heavy classes) during off-peak tariff hours where possible."
  );

  return Array.from(recs).slice(0, 6);
}

/** Build a 7-day weekly consumption series from current readings (demo). */
export function buildWeeklySeries(readings: EnergyReading[]): WeeklyConsumptionPoint[] {
  const days = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
  const totalEnergy = readings.reduce((sum, r) => sum + r.energy, 0) || 40;

  return days.map((day, i) => {
    const weekdayFactor = i < 5 ? 1 : 0.55; // lower usage on weekends
    const noise = 0.85 + Math.random() * 0.3;
    return {
      day,
      kWh: Math.round(totalEnergy * weekdayFactor * noise * 3) / 3,
    };
  });
}

/** Build a simple 7-day predicted-vs-actual series (demo only). */
export function buildPredictionSeries(
  readings: EnergyReading[]
): PredictedConsumptionPoint[] {
  const baseline = readings.reduce((sum, r) => sum + r.energy, 0) || 30;

  return Array.from({ length: 7 }, (_, i) => {
    const day = `Day ${i + 1}`;
    const predicted = Math.round(baseline * (0.95 + i * 0.02) * 10) / 10;
    const actual =
      i < 5 ? Math.round(predicted * (0.9 + Math.random() * 0.2) * 10) / 10 : NaN;
    return { day, predicted, actual };
  });
}

/** Export the given readings as a downloadable CSV file (browser-only). */
export function exportReadingsToCSV(readings: EnergyReading[], filename = "energy-report.csv") {
  const headers = [
    "Building",
    "Room",
    "Date",
    "Time",
    "Power (W)",
    "Energy (kWh)",
    "Occupancy",
    "Temperature (C)",
    "Status",
  ];

  const rows = readings.map((r) => [
    r.building,
    r.room,
    r.date,
    r.time,
    r.power.toString(),
    r.energy.toString(),
    r.occupancy === 1 ? "Occupied" : "Empty",
    r.temperature.toString(),
    r.status,
  ]);

  const csvContent = [headers, ...rows]
    .map((row) => row.map((cell) => `"${String(cell).replace(/"/g, '""')}"`).join(","))
    .join("\n");

  const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.setAttribute("download", filename);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

export function formatDateTime(date: Date): string {
  return date.toLocaleString("en-GB", {
    weekday: "short",
    year: "numeric",
    month: "short",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
  });
}