// data/simulatedData.ts
// SIMULATED DATA ONLY.
// This file generates realistic-looking IoT energy readings for demo
// purposes. No real sensors, AWS services, or APIs are used anywhere here.

import { BuildingName, DashboardSettings, EnergyReading, ReadingStatus } from "./types";
import { computeStatus, generateId, randomBetween } from "./utils";

export const BUILDINGS: BuildingName[] = [
  "Computer Lab",
  "Lecture Hall",
  "Library",
  "Hostel",
  "Administration Office",
];

export const ROOMS_BY_BUILDING: Record<BuildingName, string[]> = {
  "Computer Lab": ["Lab 1", "Lab 2", "Lab 3"],
  "Lecture Hall": ["Hall A", "Hall B", "Hall C"],
  Library: ["Reading Room", "Reference Section", "Study Pods"],
  Hostel: ["Block A", "Block B", "Block C"],
  "Administration Office": ["Registrar Office", "Finance Office", "HR Office"],
};

export const DEFAULT_SETTINGS: DashboardSettings = {
  electricityTariffRWF: 210, // RWF per kWh (example tariff)
  alertPowerThresholdW: 500,
  occupancyAlertEnabled: true,
  simulationSpeedMs: 3000,
  darkMode: true,
  co2FactorKgPerKWh: 0.62, // example/demo emission factor, not certified
};

/** Baseline expected power range per building type (watts), occupied vs empty. */
const POWER_PROFILE: Record<BuildingName, { occupied: [number, number]; empty: [number, number] }> = {
  "Computer Lab": { occupied: [520, 850], empty: [80, 220] },
  "Lecture Hall": { occupied: [350, 620], empty: [40, 140] },
  Library: { occupied: [260, 460], empty: [60, 160] },
  Hostel: { occupied: [180, 340], empty: [90, 200] },
  "Administration Office": { occupied: [220, 420], empty: [50, 130] },
};

/** Rough current-hour occupancy probability per building (demo heuristic). */
function occupancyProbability(building: BuildingName): number {
  const hour = new Date().getHours();
  switch (building) {
    case "Computer Lab":
      return hour >= 8 && hour < 20 ? 0.75 : 0.08;
    case "Lecture Hall":
      return hour >= 8 && hour < 17 ? 0.8 : 0.05;
    case "Library":
      return hour >= 8 && hour < 21 ? 0.6 : 0.1;
    case "Hostel":
      return hour >= 18 || hour < 7 ? 0.85 : 0.3;
    case "Administration Office":
      return hour >= 8 && hour < 17 ? 0.7 : 0.04;
  }
}

function pad(n: number): string {
  return n.toString().padStart(2, "0");
}

function nowParts() {
  const now = new Date();
  const date = `${now.getFullYear()}-${pad(now.getMonth() + 1)}-${pad(now.getDate())}`;
  const time = `${pad(now.getHours())}:${pad(now.getMinutes())}`;
  return { date, time };
}

/**
 * Generate one simulated reading for a specific building/room, using the
 * current alert threshold from settings to compute its status.
 */
export function generateReading(
  building: BuildingName,
  room: string,
  settings: DashboardSettings
): EnergyReading {
  const { date, time } = nowParts();
  const profile = POWER_PROFILE[building];
  const occupied = Math.random() < occupancyProbability(building);

  // Occasionally inject a "waste" case: empty room, unusually high power.
  const spontaneousWaste = !occupied && Math.random() < 0.14;
  // Occasionally inject a "possible fault" case: power spikes far above normal.
  const spontaneousFault = Math.random() < 0.02;

  let power: number;
  if (spontaneousFault) {
    power = randomBetween(950, 1150);
  } else if (spontaneousWaste) {
    power = randomBetween(profile.occupied[0] * 0.7, profile.occupied[1] * 0.85);
  } else if (occupied) {
    power = randomBetween(profile.occupied[0], profile.occupied[1]);
  } else {
    power = randomBetween(profile.empty[0], profile.empty[1]);
  }

  const voltage = randomBetween(215, 235);
  const current = Math.round((power / voltage) * 100) / 100;
  const energy = Math.round((power / 1000) * 100) / 100; // approx kWh for this interval
  const temperature = randomBetween(19, spontaneousFault ? 33 : 27);
  const occupancy = occupied || spontaneousWaste ? (occupied ? 1 : 0) : 0;

  const status: ReadingStatus = computeStatus(power, occupancy, settings);

  return {
    id: generateId("reading"),
    building,
    room,
    date,
    time,
    voltage,
    current,
    power: Math.round(power),
    energy,
    occupancy,
    temperature: Math.round(temperature * 10) / 10,
    status,
  };
}

/** Generate one reading for every room in every building (a full "tick"). */
export function generateAllReadings(settings: DashboardSettings): EnergyReading[] {
  const readings: EnergyReading[] = [];
  BUILDINGS.forEach((building) => {
    ROOMS_BY_BUILDING[building].forEach((room) => {
      readings.push(generateReading(building, room, settings));
    });
  });
  return readings;
}

/** Convenience list of unique room+building combinations, for filter dropdowns. */
export function getAllRoomOptions(): { building: BuildingName; room: string }[] {
  const options: { building: BuildingName; room: string }[] = [];
  BUILDINGS.forEach((building) => {
    ROOMS_BY_BUILDING[building].forEach((room) => options.push({ building, room }));
  });
  return options;
}