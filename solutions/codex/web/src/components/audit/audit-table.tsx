"use client";

import { Fragment, useState } from "react";

import {
  Badge,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
  Skeleton,
} from "@nexus/ui";
import { getAuditTimeline } from "@nexus/codex-models";

import { TargetTypeBadge } from "@/components/ui/target-type-badge";
import { Pagination } from "@/components/ui/pagination";
import { AuditTimelinePanel } from "./audit-timeline-panel";

import type { AuditLogItem, AuditTimelineItem } from "@nexus/codex-models";

const ACTION_LABELS: Record<string, string> = {
  REQUEST: "신청",
  REVIEW: "검토",
  APPROVE: "승인",
  REJECT: "반려",
  CANCEL: "취소",
  FEEDBACK: "피드백",
  CREATE: "생성",
  UPDATE: "수정",
  DELETE: "삭제",
};

const ACTION_BADGE_COLORS: Record<string, string> = {
  APPROVE: "border-green-500 text-green-600 dark:text-green-400",
  REJECT: "border-red-500 text-red-600 dark:text-red-400",
  REQUEST: "border-blue-500 text-blue-600 dark:text-blue-400",
  CREATE: "border-green-400 text-green-500 dark:text-green-400",
  UPDATE: "border-blue-400 text-blue-500 dark:text-blue-400",
  DELETE: "border-red-400 text-red-500 dark:text-red-400",
};

interface AuditTableProps {
  data: AuditLogItem[];
  total?: number;
  page: number;
  totalPages: number;
  isLoading: boolean;
  onPageChange: (page: number) => void;
}

export function AuditTable({
  data,
  page,
  totalPages,
  isLoading,
  onPageChange,
}: AuditTableProps) {
  const [expandedId, setExpandedId] = useState<number | null>(null);
  const [timeline, setTimeline] = useState<AuditTimelineItem[]>([]);
  const [timelineName, setTimelineName] = useState("");

  const handleRowClick = async (item: AuditLogItem) => {
    if (expandedId === item.logId) {
      setExpandedId(null);
      return;
    }
    setExpandedId(item.logId);
    if (item.targetId) {
      const res = await getAuditTimeline(item.targetType, item.targetId);
      setTimeline(res.timeline);
      setTimelineName(res.targetName);
    }
  };

  if (isLoading) {
    return (
      <div className="space-y-3">
        <Skeleton className="h-10 w-full" />
        {Array.from({ length: 5 }).map((_, i) => (
          <Skeleton key={i} className="h-12 w-full" />
        ))}
      </div>
    );
  }

  return (
    <div>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>일시</TableHead>
            <TableHead>대상</TableHead>
            <TableHead>작업</TableHead>
            <TableHead>상태 변경</TableHead>
            <TableHead>처리자</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {data.length === 0 ? (
            <TableRow>
              <TableCell
                colSpan={5}
                className="h-24 text-center text-muted-foreground"
              >
                조건에 맞는 감사 이력이 없습니다.
              </TableCell>
            </TableRow>
          ) : (
            data.map((item) => (
              <Fragment key={item.logId}>
                <TableRow
                  className="cursor-pointer hover:bg-accent"
                  onClick={() => handleRowClick(item)}
                >
                  <TableCell className="whitespace-nowrap font-mono text-xs">
                    {new Date(item.logDatetime).toLocaleString("ko-KR")}
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <span className="font-medium">{item.targetName}</span>
                      <TargetTypeBadge type={item.targetType} />
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge
                      variant="outline"
                      className={ACTION_BADGE_COLORS[item.actionType] ?? ""}
                    >
                      {ACTION_LABELS[item.actionType] ?? item.actionType}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-xs text-muted-foreground">
                    {item.stateFrom ?? "—"} → {item.stateTo ?? "—"}
                  </TableCell>
                  <TableCell>
                    <span className="text-sm">{item.actorName}</span>
                  </TableCell>
                </TableRow>
                {expandedId === item.logId && (
                  <TableRow key={`timeline-${item.logId}`}>
                    <TableCell colSpan={5} className="bg-muted/50 p-4">
                      <AuditTimelinePanel
                        targetName={timelineName}
                        timeline={timeline}
                      />
                    </TableCell>
                  </TableRow>
                )}
              </Fragment>
            ))
          )}
        </TableBody>
      </Table>
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
