import type { ActionType, TargetType } from "../entities";
import { delay } from "./helpers";

export interface DashboardStats {
  totalWords: number;
  totalDomains: number;
  totalTerms: number;
  totalRequests: number;
  pendingRequests: number;
  approvedThisMonth: number;
}

export interface PendingCount {
  total: number;
  words: number;
  domains: number;
  terms: number;
}

export interface RecentActivity {
  id: number;
  targetType: TargetType;
  targetName: string;
  actionType: ActionType;
  actorName: string;
  timestamp: Date;
}

export interface TrendItem {
  month: string;
  words: number;
  domains: number;
  terms: number;
}

export interface MySummary {
  myRequests: number;
  myPending: number;
  myApproved: number;
  myRejected: number;
  myDrafts: number;
}

export interface RoleKpi {
  avgProcessDays: number;
  approvalRate: number;
  totalProcessed: number;
  feedbackRate: number;
}

export async function getDashboardStats(): Promise<DashboardStats> {
  await delay();
  return {
    totalWords: 1247,
    totalDomains: 89,
    totalTerms: 3562,
    totalRequests: 456,
    pendingRequests: 23,
    approvedThisMonth: 47,
  };
}

export async function getPendingCount(): Promise<PendingCount> {
  await delay();
  return { total: 23, words: 8, domains: 3, terms: 12 };
}

export async function getRecentActivity(): Promise<RecentActivity[]> {
  await delay();
  return [
    {
      id: 1,
      targetType: "TERM",
      targetName: "고객번호",
      actionType: "APPROVE",
      actorName: "이승인",
      timestamp: new Date(Date.now() - 1000 * 60 * 30),
    },
    {
      id: 2,
      targetType: "WORD",
      targetName: "거래",
      actionType: "REQUEST",
      actorName: "박신청",
      timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2),
    },
    {
      id: 3,
      targetType: "DOMAIN",
      targetName: "금액",
      actionType: "UPDATE",
      actorName: "김관리",
      timestamp: new Date(Date.now() - 1000 * 60 * 60 * 5),
    },
    {
      id: 4,
      targetType: "TERM",
      targetName: "계좌잔액",
      actionType: "CREATE",
      actorName: "최데이터",
      timestamp: new Date(Date.now() - 1000 * 60 * 60 * 8),
    },
    {
      id: 5,
      targetType: "WORD",
      targetName: "잔액",
      actionType: "REJECT",
      actorName: "이승인",
      timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24),
    },
  ];
}

export async function getTrend(): Promise<TrendItem[]> {
  await delay();
  return [
    { month: "2025-10", words: 42, domains: 5, terms: 128 },
    { month: "2025-11", words: 38, domains: 7, terms: 115 },
    { month: "2025-12", words: 55, domains: 3, terms: 142 },
    { month: "2026-01", words: 61, domains: 8, terms: 156 },
    { month: "2026-02", words: 47, domains: 6, terms: 134 },
    { month: "2026-03", words: 33, domains: 4, terms: 98 },
  ];
}

export async function getMySummary(): Promise<MySummary> {
  await delay();
  return {
    myRequests: 15,
    myPending: 3,
    myApproved: 10,
    myRejected: 2,
    myDrafts: 4,
  };
}

export async function getRoleKpi(): Promise<RoleKpi> {
  await delay();
  return {
    avgProcessDays: 2.3,
    approvalRate: 87.5,
    totalProcessed: 142,
    feedbackRate: 8.2,
  };
}
