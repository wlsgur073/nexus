"use client";

import { useTheme } from "next-themes";

const CHART_COLORS = {
  light: {
    chart1: "#2563eb",
    chart2: "#16a34a",
    chart3: "#ea580c",
    chart4: "#9333ea",
    chart5: "#0891b2",
    muted: "#94a3b8",
    grid: "#e2e8f0",
    text: "#475569",
  },
  dark: {
    chart1: "#60a5fa",
    chart2: "#4ade80",
    chart3: "#fb923c",
    chart4: "#c084fc",
    chart5: "#22d3ee",
    muted: "#64748b",
    grid: "#334155",
    text: "#94a3b8",
  },
};

export type ChartColors = typeof CHART_COLORS.light;

export function useChartColors(): ChartColors {
  const { resolvedTheme } = useTheme();
  return CHART_COLORS[resolvedTheme === "dark" ? "dark" : "light"];
}
