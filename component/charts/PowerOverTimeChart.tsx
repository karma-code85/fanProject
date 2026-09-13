// component/charts/PowerOverTimeChart.tsx
"use client";

import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
} from "recharts";
import { HourlyPowerPoint } from "../../data/types";

interface Props {
  data: HourlyPowerPoint[];
}

export default function PowerOverTimeChart({ data }: Props) {
  return (
    <div className="h-72 w-full">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={data} margin={{ top: 8, right: 12, left: 0, bottom: 0 }}>
          <defs>
            <linearGradient id="powerFill" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#38bdf8" stopOpacity={0.4} />
              <stop offset="95%" stopColor="#38bdf8" stopOpacity={0} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
          <XAxis dataKey="hour" stroke="#64748b" fontSize={11.5} />
          <YAxis stroke="#64748b" fontSize={12} unit=" W" />
          <Tooltip
            contentStyle={{
              background: "#0f172a",
              border: "1px solid #1e293b",
              borderRadius: 8,
              fontSize: 12,
            }}
            labelStyle={{ color: "#e2e8f0" }}
          />
          <Area
            type="monotone"
            dataKey="power"
            name="Total Power (W)"
            stroke="#38bdf8"
            strokeWidth={2}
            fill="url(#powerFill)"
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}