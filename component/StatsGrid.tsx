// component/StatsGrid.tsx
"use client";

import {
  Zap,
  Gauge,
  Wallet,
  Building2,
  AlertTriangle,
  Leaf,
  Activity,
} from "lucide-react";
import StatCard from "./StatCard";
import { EnergyReading, DashboardSettings } from "../data/types";
import { calculateCost, calculateCO2 } from "../data/utils";

interface StatsGridProps {
  readings: EnergyReading[];
  settings: DashboardSettings;
}

export default function StatsGrid({ readings, settings }: StatsGridProps) {
  const totalEnergyKWh = readings.reduce((sum, r) => sum + r.energy, 0);
  const currentPowerW = readings.reduce((sum, r) => sum + r.power, 0);
  const estimatedCost = calculateCost(totalEnergyKWh, settings.electricityTariffRWF);
  const activeBuildings = new Set(readings.map((r) => r.building)).size;
  const wasteAlerts = readings.filter((r) => r.status === "Waste Alert").length;
  const co2 = calculateCO2(totalEnergyKWh, settings.co2FactorKgPerKWh);

  const occupiedCount = readings.filter((r) => r.occupancy === 1).length;
  const wasteRate = readings.length ? wasteAlerts / readings.length : 0;
  const occupancyRate = readings.length ? occupiedCount / readings.length : 0;
  const efficiencyScore = Math.max(
    0,
    Math.min(100, Math.round(100 - wasteRate * 70 - (1 - occupancyRate) * 10))
  );

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
      <StatCard
        label="Total Energy Consumption"
        value={`${totalEnergyKWh.toFixed(1)} kWh`}
        subtext="Across all monitored rooms"
        icon={Zap}
        accent="sky"
      />
      <StatCard
        label="Current Power Usage"
        value={`${(currentPowerW / 1000).toFixed(2)} kW`}
        subtext={`${readings.length} active readings`}
        icon={Gauge}
        accent="emerald"
      />
      <StatCard
        label="Estimated Electricity Cost"
        value={`${estimatedCost.toLocaleString()} RWF`}
        subtext={`Tariff: ${settings.electricityTariffRWF} RWF/kWh`}
        icon={Wallet}
        accent="slate"
      />
      <StatCard
        label="Active Buildings"
        value={`${activeBuildings}`}
        subtext="Currently reporting data"
        icon={Building2}
        accent="sky"
      />
      <StatCard
        label="Energy Waste Alerts"
        value={`${wasteAlerts}`}
        subtext="Empty rooms drawing high power"
        icon={AlertTriangle}
        accent={wasteAlerts > 0 ? "rose" : "emerald"}
      />
      <StatCard
        label="Energy Efficiency Score"
        value={`${efficiencyScore}/100`}
        subtext="Campus-wide average"
        icon={Activity}
        accent={efficiencyScore >= 65 ? "emerald" : "amber"}
      />
      <StatCard
        label="Estimated CO2 Emissions"
        value={`${co2.toFixed(1)} kg`}
        subtext="Demo emission factor"
        icon={Leaf}
        accent="emerald"
      />
    </div>
  );
}