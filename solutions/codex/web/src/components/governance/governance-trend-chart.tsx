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

import type { GovernanceTrendItem } from "@nexus/codex-models";

interface GovernanceTrendChartProps {
  data: GovernanceTrendItem[];
}

export default function GovernanceTrendChart({
  data,
}: GovernanceTrendChartProps) {
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
          dataKey="newCount"
          name="신규"
          fill="#3b82f6"
          radius={[2, 2, 0, 0]}
        />
        <Bar
          dataKey="updateCount"
          name="변경"
          fill="#22c55e"
          radius={[2, 2, 0, 0]}
        />
        <Bar
          dataKey="deleteCount"
          name="삭제"
          fill="#f59e0b"
          radius={[2, 2, 0, 0]}
        />
      </BarChart>
    </ResponsiveContainer>
  );
}
