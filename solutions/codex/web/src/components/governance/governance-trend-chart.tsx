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

import type { GovernanceTrendItem } from "@nexus/codex-models";

interface GovernanceTrendChartProps {
  data: GovernanceTrendItem[];
}

export default function GovernanceTrendChart({
  data,
}: GovernanceTrendChartProps) {
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
          dataKey="newCount"
          name="신규"
          fill={colors.chart1}
          radius={[2, 2, 0, 0]}
        />
        <Bar
          dataKey="updateCount"
          name="변경"
          fill={colors.chart2}
          radius={[2, 2, 0, 0]}
        />
        <Bar
          dataKey="deleteCount"
          name="삭제"
          fill={colors.chart3}
          radius={[2, 2, 0, 0]}
        />
      </BarChart>
    </ResponsiveContainer>
  );
}
