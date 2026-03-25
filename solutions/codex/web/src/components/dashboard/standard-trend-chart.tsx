"use client";

import {
  Area,
  AreaChart,
  CartesianGrid,
  Legend,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

import { useChartColors } from "@/lib/chart-theme";

import type { TrendItem } from "@nexus/codex-models";

interface StandardTrendChartProps {
  data: TrendItem[];
}

export default function StandardTrendChart({ data }: StandardTrendChartProps) {
  const colors = useChartColors();

  const chartData = data.map((item) => ({
    ...item,
    month: item.month.replace(/^\d{4}-/, ""),
  }));

  return (
    <ResponsiveContainer width="100%" height={300}>
      <AreaChart data={chartData}>
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
        <Area
          type="monotone"
          dataKey="terms"
          name="표준용어"
          stroke={colors.chart1}
          fill={colors.chart1}
          fillOpacity={0.15}
          strokeWidth={2}
        />
        <Area
          type="monotone"
          dataKey="words"
          name="표준단어"
          stroke={colors.chart2}
          fill={colors.chart2}
          fillOpacity={0.15}
          strokeWidth={2}
        />
        <Area
          type="monotone"
          dataKey="domains"
          name="표준도메인"
          stroke={colors.chart3}
          fill={colors.chart3}
          fillOpacity={0.15}
          strokeWidth={2}
        />
      </AreaChart>
    </ResponsiveContainer>
  );
}
