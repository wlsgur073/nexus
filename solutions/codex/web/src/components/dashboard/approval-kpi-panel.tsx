"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@nexus/ui";

import type { RoleKpi } from "@nexus/codex-models";

interface ApprovalKpiPanelProps {
  kpi: RoleKpi;
}

export function ApprovalKpiPanel({ kpi }: ApprovalKpiPanelProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base">승인 KPI</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <p className="text-sm text-muted-foreground">평균 처리일</p>
            <p className="text-xl font-bold">{kpi.avgProcessDays}일</p>
          </div>
          <div>
            <p className="text-sm text-muted-foreground">승인율</p>
            <p className="text-xl font-bold">{kpi.approvalRate}%</p>
          </div>
          <div>
            <p className="text-sm text-muted-foreground">총 처리 건수</p>
            <p className="text-xl font-bold">{kpi.totalProcessed}</p>
          </div>
          <div>
            <p className="text-sm text-muted-foreground">피드백율</p>
            <p className="text-xl font-bold">{kpi.feedbackRate}%</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
