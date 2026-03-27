"use client";

import { useState } from "react";
import dynamic from "next/dynamic";
import { toast } from "sonner";
import { useQuery, useQueryClient } from "@tanstack/react-query";

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  Skeleton,
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@nexus/ui";
import {
  executeValidation,
  getValidationHistory,
  getValidationRules,
  getValidationSummary,
  getValidationTrend,
  getViolationList,
} from "@nexus/codex-models";
import { QUERY_KEYS } from "@nexus/codex-shared";

import { useRole } from "@/hooks/use-auth";
import { ValidationStatCards } from "@/components/validations/validation-stat-cards";
import { RuleSummaryTable } from "@/components/validations/rule-summary-table";
import { ValidationHistoryTable } from "@/components/validations/validation-history-table";
import { ViolationList } from "@/components/validations/violation-list";

const ViolationTrendChart = dynamic(
  () => import("@/components/validations/violation-trend-chart"),
  { ssr: false },
);

export default function ValidationsPage() {
  const { canExecuteValidation, canManage } = useRole();
  const queryClient = useQueryClient();

  const [violationPage, setViolationPage] = useState(1);
  const [isExecuting, setIsExecuting] = useState(false);

  const { data: summary, isLoading: summaryLoading } = useQuery({
    queryKey: QUERY_KEYS.validations.summary,
    queryFn: getValidationSummary,
  });

  const { data: trend } = useQuery({
    queryKey: QUERY_KEYS.validations.trend,
    queryFn: getValidationTrend,
  });

  const { data: rules } = useQuery({
    queryKey: QUERY_KEYS.validations.rules,
    queryFn: getValidationRules,
  });

  const { data: historyData } = useQuery({
    queryKey: QUERY_KEYS.validations.history({}),
    queryFn: () => getValidationHistory({}),
  });

  const { data: violationData } = useQuery({
    queryKey: QUERY_KEYS.validations.violations({ page: violationPage }),
    queryFn: () => getViolationList({ page: violationPage }),
  });

  const handleExecute = async () => {
    setIsExecuting(true);
    try {
      await executeValidation({});
      toast.success("검증이 시작되었습니다. 완료 시 알림을 보내드립니다.");
      await queryClient.invalidateQueries({
        queryKey: QUERY_KEYS.validations.summary,
      });
      await queryClient.invalidateQueries({
        queryKey: ["validations", "history"],
      });
    } catch {
      toast.error("검증 실행에 실패했습니다.");
    } finally {
      setIsExecuting(false);
    }
  };

  if (summaryLoading) {
    return (
      <div className="space-y-6">
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <Skeleton key={i} className="h-28 w-full rounded-xl" />
          ))}
        </div>
        <Skeleton className="h-64 w-full rounded-xl" />
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold tracking-tight">검증 대시보드</h1>
        <p className="mt-1 text-muted-foreground">
          데이터 표준 검증 결과와 위반 현황을 확인하세요.
        </p>
      </div>

      {/* Stat Cards */}
      {summary && (
        <div className="mb-6">
          <ValidationStatCards data={summary} />
        </div>
      )}

      {/* Trend Chart */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="text-base">심각도별 위반 추이</CardTitle>
        </CardHeader>
        <CardContent>
          <ViolationTrendChart data={trend ?? []} />
        </CardContent>
      </Card>

      {/* Tabs: History, Violations, Rules */}
      <Tabs defaultValue="history">
        <TabsList>
          <TabsTrigger value="history">실행 이력</TabsTrigger>
          <TabsTrigger value="violations">위반 목록</TabsTrigger>
          <TabsTrigger value="rules">검증 규칙</TabsTrigger>
        </TabsList>

        <TabsContent value="history" className="mt-4">
          <Card>
            <CardContent className="pt-6">
              <ValidationHistoryTable
                data={historyData?.items ?? []}
                canExecute={canExecuteValidation}
                onExecute={handleExecute}
                isExecuting={isExecuting}
              />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="violations" className="mt-4">
          <Card>
            <CardContent className="pt-6">
              <ViolationList
                data={violationData?.items ?? []}
                page={violationPage}
                totalPages={violationData?.totalPages ?? 1}
                isLoading={!violationData}
                canCorrect={canManage}
                onPageChange={setViolationPage}
              />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="rules" className="mt-4">
          <Card>
            <CardContent className="pt-6">
              <RuleSummaryTable data={rules ?? []} />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
