"use client";

import { useState } from "react";
import { useQuery } from "@tanstack/react-query";

import { Card, CardContent, CardHeader, CardTitle } from "@nexus/ui";
import { getAuditList } from "@nexus/codex-models";
import { QUERY_KEYS } from "@nexus/codex-shared";

import { AuditFilterBar } from "@/components/audit/audit-filter-bar";
import { AuditTable } from "@/components/audit/audit-table";

import type { ActionType, TargetType } from "@nexus/codex-models";

interface AuditFilters {
  targetType: string;
  keyword: string;
  actionType: string;
  actor: string;
}

const DEFAULT_FILTERS: AuditFilters = {
  targetType: "",
  keyword: "",
  actionType: "",
  actor: "",
};

export default function AuditPage() {
  const [filters, setFilters] = useState<AuditFilters>(DEFAULT_FILTERS);
  const [page, setPage] = useState(1);

  const queryParams = {
    page,
    targetType: (filters.targetType || undefined) as TargetType | undefined,
    keyword: filters.keyword || undefined,
    actionType: (filters.actionType || undefined) as ActionType | undefined,
    actor: filters.actor || undefined,
  };

  const { data, isLoading } = useQuery({
    queryKey: QUERY_KEYS.audit.list(queryParams),
    queryFn: () => getAuditList(queryParams),
  });

  const handleFilterChange = (newFilters: AuditFilters) => {
    setFilters(newFilters);
    setPage(1);
  };

  const handleReset = () => {
    setFilters(DEFAULT_FILTERS);
    setPage(1);
  };

  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold tracking-tight">감사 추적</h1>
        <p className="mt-1 text-muted-foreground">
          모든 표준 데이터의 변경 이력을 추적하고 감사하세요.
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">감사 로그</CardTitle>
          <div className="mt-3">
            <AuditFilterBar
              filters={filters}
              onChange={handleFilterChange}
              onReset={handleReset}
            />
          </div>
        </CardHeader>
        <CardContent>
          <AuditTable
            data={data?.items ?? []}
            page={page}
            totalPages={data?.totalPages ?? 1}
            isLoading={isLoading}
            onPageChange={setPage}
          />
        </CardContent>
      </Card>
    </div>
  );
}
