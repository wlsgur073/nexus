"use client";

import { useState } from "react";
import { toast } from "sonner";

import { Badge, Button } from "@nexus/ui";
import { batchCorrectViolations } from "@nexus/codex-models";

import { DataTable } from "@/components/ui/data-table";
import { TargetTypeBadge } from "@/components/ui/target-type-badge";
import { Pagination } from "@/components/ui/pagination";

import type { Column } from "@/components/ui/data-table";
import type { ViolationItem } from "@nexus/codex-models";

const SEVERITY_COLORS: Record<string, string> = {
  HIGH: "border-red-500 text-red-600 dark:text-red-400",
  MEDIUM: "border-orange-500 text-orange-600 dark:text-orange-400",
  LOW: "border-gray-400 text-gray-500 dark:text-gray-400",
};

const RESOLVE_COLORS: Record<string, string> = {
  UNRESOLVED: "border-gray-400 text-gray-500",
  IN_PROGRESS: "border-blue-500 text-blue-600",
  RESOLVED: "border-green-500 text-green-600",
};

const SEVERITY_LABELS: Record<string, string> = {
  HIGH: "높음",
  MEDIUM: "중간",
  LOW: "낮음",
};

const RESOLVE_LABELS: Record<string, string> = {
  UNRESOLVED: "미처리",
  IN_PROGRESS: "시정 중",
  RESOLVED: "해결",
};

interface ViolationListProps {
  data: ViolationItem[];
  total?: number;
  page: number;
  totalPages: number;
  isLoading: boolean;
  canCorrect: boolean;
  onPageChange: (page: number) => void;
  onCorrected?: () => void;
}

export function ViolationList({
  data,
  page,
  totalPages,
  isLoading,
  canCorrect,
  onPageChange,
  onCorrected,
}: ViolationListProps) {
  const [selectedIds, setSelectedIds] = useState<Set<number>>(new Set());
  const [isCorrecting, setIsCorrecting] = useState(false);

  const handleBatchCorrect = async () => {
    if (selectedIds.size === 0) return;
    setIsCorrecting(true);
    try {
      await batchCorrectViolations({ resultIds: [...selectedIds] });
      toast.success(`${selectedIds.size}건의 시정 신청이 생성되었습니다.`);
      setSelectedIds(new Set());
      onCorrected?.();
    } catch {
      toast.error("일괄 시정에 실패했습니다.");
    } finally {
      setIsCorrecting(false);
    }
  };

  const columns: Column<ViolationItem>[] = [
    {
      key: "targetType",
      label: "대상",
      render: (item) => <TargetTypeBadge type={item.targetType} />,
    },
    {
      key: "itemName",
      label: "항목명",
      render: (item) => <span className="font-medium">{item.itemName}</span>,
    },
    { key: "ruleName", label: "위반 규칙" },
    {
      key: "violationDesc",
      label: "위반 내용",
      className: "max-w-xs truncate",
    },
    {
      key: "severity",
      label: "심각도",
      render: (item) => (
        <Badge variant="outline" className={SEVERITY_COLORS[item.severity]}>
          {SEVERITY_LABELS[item.severity]}
        </Badge>
      ),
    },
    {
      key: "resolveStatus",
      label: "상태",
      render: (item) => (
        <Badge variant="outline" className={RESOLVE_COLORS[item.resolveStatus]}>
          {RESOLVE_LABELS[item.resolveStatus]}
        </Badge>
      ),
    },
  ];

  return (
    <div>
      {canCorrect && selectedIds.size > 0 && (
        <div className="mb-4 flex items-center gap-3">
          <span className="text-sm text-muted-foreground">
            {selectedIds.size}건 선택
          </span>
          <Button
            size="sm"
            onClick={handleBatchCorrect}
            disabled={isCorrecting}
          >
            {isCorrecting ? "시정 처리 중..." : "일괄 시정 신청"}
          </Button>
        </div>
      )}
      <DataTable
        columns={columns}
        data={data}
        isLoading={isLoading}
        selectable={canCorrect}
        selectedIds={selectedIds}
        onSelectionChange={setSelectedIds}
        getRowId={(item) => item.resultId}
        emptyMessage="위반 항목이 없습니다."
      />
      {totalPages > 1 && (
        <div className="mt-4">
          <Pagination
            page={page}
            totalPages={totalPages}
            onPageChange={onPageChange}
          />
        </div>
      )}
    </div>
  );
}
