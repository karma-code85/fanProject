// component/charts/NormalVsWasteChart.tsx
"use client";

import {
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
} from "recharts";
import { EnergyReading } from "../../data/types";

interface Props {
  readings: EnergyReading[];
}

const COLORS: Record<string, string> = {
  Normal: "#34d399",
  "High Usage": "#f59e0b",
  "Waste Alert": "#fb7185",
  "Possible Fault": "#a78bfa",
};

export default function NormalVsWasteChart({ readings }: Props) {
  const counts = readings.reduce<Record<string, number>>((acc, r) => {
    acc[r.status] = (acc[r.status] ?? 0) + 1;
    return acc;
  }, {});

  const data = Object.entries(counts).map(([status, count]) => ({
    status,
    count,
  }));

  return (
    <div className="h-72 w-full">
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={data}
            dataKey="count"
            nameKey="status"
            innerRadius={55}
            outerRadius={90}
            paddingAngle={3}
          >
            {data.map((entry) => (
              <Cell key={entry.status} fill={COLORS[entry.status] ?? "#64748b"} />
            ))}
          </Pie>
          <Tooltip
            contentStyle={{
              background: "#0f172a",
              border: "1px solid #1e293b",
              borderRadius: 8,
              fontSize: 12,
            }}
          />
          <Legend wrapperStyle={{ fontSize: 12 }} />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
}