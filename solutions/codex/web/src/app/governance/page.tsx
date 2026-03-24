"use client";

import { useState } from "react";
import dynamic from "next/dynamic";
import { Download, ShieldCheck } from "lucide-react";
import { toast } from "sonner";
import { useQuery } from "@tanstack/react-query";

import { Button, Card, CardContent, CardHeader, CardTitle } from "@nexus/ui";
import {
  getGovernanceCompliance,
  getGovernanceDeptRanking,
  getGovernanceKpi,
  getGovernanceNonCompliant,
  getGovernanceTrend,
  downloadGovernanceReportPdf,
} from "@nexus/codex-models";
import { QUERY_KEYS } from "@nexus/codex-shared";

import { StatCard } from "@/components/dashboard/stat-card";
import { DeptRankingList } from "@/components/governance/dept-ranking-list";
import { NonCompliantTable } from "@/components/governance/non-compliant-table";

const ComplianceGauge = dynamic(
  () => import("@/components/governance/compliance-gauge"),
  { ssr: false },
);

const GovernanceTrendChart = dynamic(
  () => import("@/components/governance/governance-trend-chart"),
  { ssr: false },
);

export default function GovernancePage() {
  const [isExporting, setIsExporting] = useState(false);

  const { data: compliance, isLoading: complianceLoading } = useQuery({
    queryKey: QUERY_KEYS.governance.compliance,
    queryFn: getGovernanceCompliance,
  });

  const { data: kpi, isLoading: kpiLoading } = useQuery({
    queryKey: QUERY_KEYS.governance.kpi,
    queryFn: getGovernanceKpi,
  });

  const { data: trend, isLoading: trendLoading } = useQuery({
    queryKey: QUERY_KEYS.governance.trend,
    queryFn: getGovernanceTrend,
  });

  const { data: ranking, isLoading: rankingLoading } = useQuery({
    queryKey: QUERY_KEYS.governance.deptRanking,
    queryFn: getGovernanceDeptRanking,
  });

  const { data: nonCompliant, isLoading: nonCompliantLoading } = useQuery({
    queryKey: QUERY_KEYS.governance.nonCompliant,
    queryFn: getGovernanceNonCompliant,
  });

  const isLoading =
    complianceLoading ||
    kpiLoading ||
    trendLoading ||
    rankingLoading ||
    nonCompliantLoading;

  const handleExportPdf = async () => {
    setIsExporting(true);
    try {
      const blob = await downloadGovernanceReportPdf();
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `governance-report-${new Date().toISOString().slice(0, 10)}.pdf`;
      a.click();
      URL.revokeObjectURL(url);
      toast.success("보고서가 다운로드되었습니다.");
    } catch {
      toast.error("보고서 다운로드에 실패했습니다.");
    } finally {
      setIsExporting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex h-64 items-center justify-center text-sm text-muted-foreground">
        로딩 중...
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">거버넌스 포털</h1>
          <p className="mt-1 text-muted-foreground">
            데이터 표준화 준수율과 거버넌스 현황을 확인하세요.
          </p>
        </div>
        <Button
          variant="outline"
          onClick={handleExportPdf}
          disabled={isExporting}
        >
          <Download className="mr-2 h-4 w-4" />
          {isExporting ? "내보내는 중..." : "PDF 보고서"}
        </Button>
      </div>

      {/* KPI Cards */}
      {kpi && (
        <div className="mb-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <StatCard
            title="처리율"
            value={`${kpi.processingRate}%`}
            change={kpi.monthOverMonth.processingRate}
            icon={<ShieldCheck className="h-5 w-5" />}
          />
          <StatCard
            title="평균 승인 소요일"
            value={`${kpi.avgApprovalDays}일`}
            change={kpi.monthOverMonth.avgApprovalDays}
          />
          <StatCard
            title="반려율"
            value={`${kpi.rejectionRate}%`}
            change={kpi.monthOverMonth.rejectionRate}
          />
          <StatCard
            title="위반 건수"
            value={`${kpi.violationCount.toLocaleString()}건`}
            change={kpi.monthOverMonth.violationCount}
          />
        </div>
      )}

      {/* Compliance Gauges */}
      {compliance && (
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="text-base">
              전체 준수율: {compliance.overall.toFixed(1)}%
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ComplianceGauge data={compliance.byType} />
          </CardContent>
        </Card>
      )}

      {/* Trend + Ranking Row */}
      <div className="mb-6 grid gap-6 lg:grid-cols-[2fr,1fr]">
        <Card>
          <CardHeader>
            <CardTitle className="text-base">월별 변동 추이</CardTitle>
          </CardHeader>
          <CardContent>
            <GovernanceTrendChart data={trend ?? []} />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-base">부서별 준수율</CardTitle>
          </CardHeader>
          <CardContent>
            <DeptRankingList data={ranking ?? []} />
          </CardContent>
        </Card>
      </div>

      {/* Non-Compliant Items */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">주요 미준수 항목 (Top 10)</CardTitle>
        </CardHeader>
        <CardContent>
          <NonCompliantTable data={nonCompliant ?? []} />
        </CardContent>
      </Card>
    </div>
  );
}
