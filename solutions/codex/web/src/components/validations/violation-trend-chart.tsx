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

import { useChartColors } from "@/lib/chart-theme";

import type { ValidationTrendItem } from "@nexus/codex-models";

interface ViolationTrendChartProps {
  data: ValidationTrendItem[];
}

export default function ViolationTrendChart({
  data,
}: ViolationTrendChartProps) {
  const colors = useChartColors();

  const chartData = data.map((item) => ({
    ...item,
    month: item.month.replace(/^\d{4}-/, ""),
  }));

  return (
    <ResponsiveContainer width="100%" height={300}>
      <BarChart data={chartData}>
        <CartesianGrid strokeDasharray="3 3" stroke={colors.grid} />
        <XAxis dataKey="month" tick={{ fontSize: 12, fill: colors.text }} />
        <YAxis tick={{ fontSize: 12, fill: colors.text }} />
        <Tooltip
          contentStyle={{
            borderRadius: "8px",
            border: `1px solid ${colors.grid}`,
            backgroundColor: "var(--color-background, #ffffff)",
            color: colors.text,
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
          fill={colors.chart3}
          stackId="a"
          radius={[0, 0, 0, 0]}
        />
        <Bar
          dataKey="low"
          name="낮음"
          fill={colors.muted}
          stackId="a"
          radius={[2, 2, 0, 0]}
        />
      </BarChart>
    </ResponsiveContainer>
  );
}
