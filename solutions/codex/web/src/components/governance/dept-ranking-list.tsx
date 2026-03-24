"use client";

import { cn } from "@nexus/ui";

import type { DeptRankingItem } from "@nexus/codex-models";

interface DeptRankingListProps {
  data: DeptRankingItem[];
}

export function DeptRankingList({ data }: DeptRankingListProps) {
  return (
    <div className="space-y-3">
      {data.map((dept) => {
        const color =
          dept.complianceRate >= 90
            ? "bg-green-500"
            : dept.complianceRate >= 80
              ? "bg-blue-500"
              : dept.complianceRate >= 70
                ? "bg-orange-500"
                : "bg-red-500";

        return (
          <div key={dept.deptName} className="space-y-1">
            <div className="flex items-center justify-between text-sm">
              <span className="font-medium">{dept.deptName}</span>
              <span
                className={cn(
                  "text-xs font-semibold tabular-nums",
                  dept.complianceRate >= 90
                    ? "text-green-600"
                    : dept.complianceRate >= 80
                      ? "text-blue-600"
                      : dept.complianceRate >= 70
                        ? "text-orange-600"
                        : "text-red-600",
                )}
              >
                {dept.complianceRate.toFixed(1)}%
              </span>
            </div>
            <div className="h-2 overflow-hidden rounded-full bg-muted">
              <div
                className={cn("h-full rounded-full transition-all", color)}
                style={{ width: `${dept.complianceRate}%` }}
              />
            </div>
            <p className="text-[11px] text-muted-foreground">
              총 {dept.totalCount.toLocaleString()}건
            </p>
          </div>
        );
      })}
    </div>
  );
}
