// component/charts/OccupancyVsPowerChart.tsx
"use client";

import {
  ResponsiveContainer,
  ScatterChart,
  Scatter,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ZAxis,
  Legend,
} from "recharts";
import { EnergyReading } from "../../data/types";

interface Props {
  readings: EnergyReading[];
}

export default function OccupancyVsPowerChart({ readings }: Props) {
  const occupied = readings
    .filter((r) => r.occupancy === 1)
    .map((r) => ({ x: 1, y: r.power, room: `${r.room}, ${r.building}` }));
  const empty = readings
    .filter((r) => r.occupancy === 0)
    .map((r) => ({ x: 0, y: r.power, room: `${r.room}, ${r.building}` }));

  return (
    <div className="h-72 w-full">
      <ResponsiveContainer width="100%" height="100%">
        <ScatterChart margin={{ top: 8, right: 20, left: 0, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
          <XAxis
            type="number"
            dataKey="x"
            name="Occupancy"
            domain={[-0.5, 1.5]}
            ticks={[0, 1]}
            tickFormatter={(v) => (v === 1 ? "Occupied" : "Empty")}
            stroke="#64748b"
            fontSize={12}
          />
          <YAxis type="number" dataKey="y" name="Power" unit=" W" stroke="#64748b" fontSize={12} />
          <ZAxis range={[80, 80]} />
          <Tooltip
            cursor={{ strokeDasharray: "3 3" }}
            contentStyle={{
              background: "#0f172a",
              border: "1px solid #1e293b",
              borderRadius: 8,
              fontSize: 12,
            }}
            labelStyle={{ color: "#e2e8f0" }}
            formatter={(value) => [`${value} W`, "Power"]}
            labelFormatter={() => ""}
          />
          <Legend wrapperStyle={{ fontSize: 12 }} />
          <Scatter name="Occupied Rooms" data={occupied} fill="#34d399" />
          <Scatter name="Empty Rooms" data={empty} fill="#fb7185" />
        </ScatterChart>
      </ResponsiveContainer>
    </div>
  );
}