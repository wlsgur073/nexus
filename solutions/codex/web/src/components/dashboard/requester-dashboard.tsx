"use client";

import { useEffect, useState } from "react";
import { BookOpen, FileText, GitPullRequest } from "lucide-react";

import {
  getDashboardStats,
  getMySummary,
  getRecentActivity,
} from "@nexus/codex-models";
import type {
  DashboardStats,
  MySummary,
  RecentActivity,
} from "@nexus/codex-models";

import { StatCard } from "./stat-card";
import { ActivityTimeline } from "./activity-timeline";

export function RequesterDashboard() {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [summary, setSummary] = useState<MySummary | null>(null);
  const [activities, setActivities] = useState<RecentActivity[]>([]);

  useEffect(() => {
    getDashboardStats().then(setStats);
    getMySummary().then(setSummary);
    getRecentActivity().then(setActivities);
  }, []);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">대시보드</h1>
        <p className="mt-1 text-muted-foreground">
          표준 현황과 나의 활동을 한눈에 확인하세요.
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <StatCard
          title="표준단어"
          value={stats?.totalWords ?? "-"}
          icon={<BookOpen className="h-5 w-5" />}
        />
        <StatCard
          title="표준도메인"
          value={stats?.totalDomains ?? "-"}
          icon={<FileText className="h-5 w-5" />}
        />
        <StatCard
          title="표준용어"
          value={stats?.totalTerms ?? "-"}
          icon={<GitPullRequest className="h-5 w-5" />}
        />
        <StatCard
          title="내 신청 건"
          value={summary?.myRequests ?? "-"}
          icon={<FileText className="h-5 w-5" />}
        />
      </div>

      {summary && (
        <div className="grid gap-4 md:grid-cols-4">
          <StatCard title="대기 중" value={summary.myPending} />
          <StatCard title="승인됨" value={summary.myApproved} />
          <StatCard title="반려됨" value={summary.myRejected} />
          <StatCard title="초안" value={summary.myDrafts} />
        </div>
      )}

      <ActivityTimeline activities={activities} />
    </div>
  );
}
