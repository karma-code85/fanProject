// component/charts/ConsumptionByBuildingChart.tsx
"use client";

import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from "recharts";
import { BuildingSummary } from "../../data/types";

interface Props {
  summaries: BuildingSummary[];
}

export default function ConsumptionByBuildingChart({ summaries }: Props) {
  const data = summaries.map((s) => ({
    building: s.building,
    kWh: s.energyKWh,
  }));

  return (
    <div className="h-72 w-full">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart
          data={data}
          layout="vertical"
          margin={{ top: 8, right: 20, left: 20, bottom: 0 }}
        >
          <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
          <XAxis type="number" stroke="#64748b" fontSize={12} unit=" kWh" />
          <YAxis
            type="category"
            dataKey="building"
            stroke="#64748b"
            fontSize={11.5}
            width={130}
          />
          <Tooltip
            contentStyle={{
              background: "#0f172a",
              border: "1px solid #1e293b",
              borderRadius: 8,
              fontSize: 12,
            }}
            labelStyle={{ color: "#e2e8f0" }}
          />
          <Legend wrapperStyle={{ fontSize: 12 }} />
          <Bar
            dataKey="kWh"
            name="Energy Consumption (kWh)"
            fill="#38bdf8"
            radius={[0, 4, 4, 0]}
          />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}