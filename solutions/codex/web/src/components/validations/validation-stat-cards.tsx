"use client";

import { AlertTriangle, CheckCircle, Clock, TrendingDown } from "lucide-react";

import { StatCard } from "@/components/dashboard/stat-card";

import type { ValidationSummary } from "@nexus/codex-models";

interface ValidationStatCardsProps {
  data: ValidationSummary;
}

export function ValidationStatCards({ data }: ValidationStatCardsProps) {
  const lastExec = data.lastExecutionDate
    ? new Date(data.lastExecutionDate).toLocaleDateString("ko-KR")
    : "미실행";

  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
      <StatCard
        title="총 위반"
        value={`${data.totalViolations.toLocaleString()}건`}
        icon={<AlertTriangle className="h-5 w-5" />}
      />
      <StatCard
        title="해결률"
        value={`${data.resolvedRate.toFixed(1)}%`}
        icon={<CheckCircle className="h-5 w-5" />}
      />
      <StatCard
        title="마지막 실행"
        value={lastExec}
        icon={<Clock className="h-5 w-5" />}
      />
      <StatCard
        title="심각도별"
        value={`H:${data.severityCounts.HIGH} M:${data.severityCounts.MEDIUM} L:${data.severityCounts.LOW}`}
        icon={<TrendingDown className="h-5 w-5" />}
      />
    </div>
  );
}
