"use client";

import { useEffect, useState } from "react";
import { BookOpen, CheckSquare, Clock, FileText } from "lucide-react";

import {
  getDashboardStats,
  getPendingCount,
  getRecentActivity,
  getRoleKpi,
} from "@nexus/codex-models";
import type {
  DashboardStats,
  PendingCount,
  RecentActivity,
  RoleKpi,
} from "@nexus/codex-models";

import { StatCard } from "./stat-card";
import { ActivityTimeline } from "./activity-timeline";
import { ApprovalKpiPanel } from "./approval-kpi-panel";

export function ApproverDashboard() {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [pending, setPending] = useState<PendingCount | null>(null);
  const [kpi, setKpi] = useState<RoleKpi | null>(null);
  const [activities, setActivities] = useState<RecentActivity[]>([]);

  useEffect(() => {
    getDashboardStats().then(setStats);
    getPendingCount().then(setPending);
    getRoleKpi().then(setKpi);
    getRecentActivity().then(setActivities);
  }, []);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">대시보드</h1>
        <p className="mt-1 text-muted-foreground">
          승인 대기 건과 처리 현황을 확인하세요.
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <StatCard
          title="승인 대기"
          value={pending?.total ?? "-"}
          icon={<CheckSquare className="h-5 w-5" />}
        />
        <StatCard
          title="이번 달 승인"
          value={stats?.approvedThisMonth ?? "-"}
          icon={<Clock className="h-5 w-5" />}
        />
        <StatCard
          title="표준용어"
          value={stats?.totalTerms ?? "-"}
          icon={<BookOpen className="h-5 w-5" />}
        />
        <StatCard
          title="전체 신청"
          value={stats?.totalRequests ?? "-"}
          icon={<FileText className="h-5 w-5" />}
        />
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        {kpi && <ApprovalKpiPanel kpi={kpi} />}
        <ActivityTimeline activities={activities} />
      </div>
    </div>
  );
}
