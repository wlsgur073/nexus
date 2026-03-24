"use client";

import { useEffect, useState, useTransition } from "react";

import {
  Input,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
} from "@nexus/ui";
import { getApprovalList } from "@nexus/codex-models";
import type { Request, RequestStatus, TargetType } from "@nexus/codex-models";

import { DataTable } from "@/components/ui/data-table";
import type { Column } from "@/components/ui/data-table";
import { StatusBadge } from "@/components/ui/status-badge";
import { TargetTypeBadge } from "@/components/ui/target-type-badge";
import { Pagination } from "@/components/ui/pagination";

interface ApprovalListProps {
  onSelect: (request: Request) => void;
  selectedIds: Set<number>;
  onSelectionChange: (ids: Set<number>) => void;
  activeRequestId: number | null;
}

const COLUMNS: Column<Request>[] = [
  { key: "requestNo", label: "신청번호" },
  {
    key: "targetType",
    label: "유형",
    render: (r) => <TargetTypeBadge type={r.targetType} />,
  },
  { key: "targetName", label: "대상명" },
  {
    key: "status",
    label: "상태",
    render: (r) => <StatusBadge status={r.status} variant="request" />,
  },
  {
    key: "requestDate",
    label: "신청일",
    render: (r) => r.requestDate.toLocaleDateString("ko-KR"),
  },
];

const STATUS_LABELS: Record<string, string> = {
  ALL: "전체 상태",
  PENDING: "대기",
  REVIEW: "검토",
};

const TYPE_LABELS: Record<string, string> = {
  ALL: "전체 유형",
  WORD: "표준단어",
  DOMAIN: "표준도메인",
  TERM: "표준용어",
};

export function ApprovalList({
  onSelect,
  selectedIds,
  onSelectionChange,
  activeRequestId,
}: ApprovalListProps) {
  const [data, setData] = useState<Request[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [isPending, startTransition] = useTransition();
  const [keyword, setKeyword] = useState("");
  const [statusFilter, setStatusFilter] = useState<RequestStatus | "ALL">(
    "ALL",
  );
  const [targetTypeFilter, setTargetTypeFilter] = useState<TargetType | "ALL">(
    "ALL",
  );

  useEffect(() => {
    startTransition(async () => {
      const res = await getApprovalList({
        page,
        pageSize: 10,
        keyword: keyword || undefined,
        status: statusFilter === "ALL" ? undefined : statusFilter,
        targetType: targetTypeFilter === "ALL" ? undefined : targetTypeFilter,
      });
      setData(res.items);
      setTotal(res.totalPages);
    });
  }, [page, keyword, statusFilter, targetTypeFilter]);

  return (
    <div className="space-y-4">
      <div className="flex gap-2">
        <Input
          placeholder="신청번호 또는 대상명 검색..."
          value={keyword}
          onChange={(e) => {
            setKeyword(e.target.value);
            setPage(1);
          }}
          className="max-w-xs"
        />
        <Select
          value={statusFilter}
          onValueChange={(v) => {
            setStatusFilter((v ?? "ALL") as RequestStatus | "ALL");
            setPage(1);
          }}
        >
          <SelectTrigger className="w-32">
            <span className="flex flex-1 text-left">
              {STATUS_LABELS[statusFilter]}
            </span>
          </SelectTrigger>
          <SelectContent>
            {Object.entries(STATUS_LABELS).map(([value, label]) => (
              <SelectItem key={value} value={value}>
                {label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Select
          value={targetTypeFilter}
          onValueChange={(v) => {
            setTargetTypeFilter((v ?? "ALL") as TargetType | "ALL");
            setPage(1);
          }}
        >
          <SelectTrigger className="w-32">
            <span className="flex flex-1 text-left">
              {TYPE_LABELS[targetTypeFilter]}
            </span>
          </SelectTrigger>
          <SelectContent>
            {Object.entries(TYPE_LABELS).map(([value, label]) => (
              <SelectItem key={value} value={value}>
                {label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {selectedIds.size > 0 && (
        <p className="text-sm text-muted-foreground">
          {selectedIds.size}건 선택됨
        </p>
      )}

      <DataTable
        columns={COLUMNS}
        data={data}
        isLoading={isPending}
        selectable
        selectedIds={selectedIds}
        onSelectionChange={onSelectionChange}
        onRowClick={onSelect}
        getRowId={(r) => r.requestId}
        activeRowId={activeRequestId}
        emptyMessage="승인 대기 중인 신청이 없습니다."
      />

      {total > 1 && (
        <Pagination page={page} totalPages={total} onPageChange={setPage} />
      )}
    </div>
  );
}
