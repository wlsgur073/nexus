"use client";

import {
  Bar,
  BarChart,
  CartesianGrid,
  Legend,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

import type { ValidationTrendItem } from "@nexus/codex-models";

interface ViolationTrendChartProps {
  data: ValidationTrendItem[];
}

export default function ViolationTrendChart({
  data,
}: ViolationTrendChartProps) {
  const chartData = data.map((item) => ({
    ...item,
    month: item.month.replace(/^\d{4}-/, ""),
  }));

  return (
    <ResponsiveContainer width="100%" height={300}>
      <BarChart data={chartData}>
        <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
        <XAxis
          dataKey="month"
          tick={{ fontSize: 12 }}
          className="fill-muted-foreground"
        />
        <YAxis tick={{ fontSize: 12 }} className="fill-muted-foreground" />
        <Tooltip
          contentStyle={{
            borderRadius: "8px",
            border: "1px solid #e5e7eb",
            backgroundColor: "#ffffff",
            color: "#1f2937",
            fontSize: "13px",
          }}
        />
        <Legend />
        <Bar
          dataKey="high"
          name="높음"
          fill="#ef4444"
          stackId="a"
          radius={[0, 0, 0, 0]}
        />
        <Bar
          dataKey="medium"
          name="중간"
          fill="#f59e0b"
          stackId="a"
          radius={[0, 0, 0, 0]}
        />
        <Bar
          dataKey="low"
          name="낮음"
          fill="#6b7280"
          stackId="a"
          radius={[2, 2, 0, 0]}
        />
      </BarChart>
    </ResponsiveContainer>
  );
}
