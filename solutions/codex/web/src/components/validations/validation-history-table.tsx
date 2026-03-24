"use client";

import Link from "next/link";
import { ExternalLink, Play } from "lucide-react";

import {
  Badge,
  Button,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@nexus/ui";
import { CODEX_ROUTES } from "@nexus/codex-shared";

import type { ValidationHistoryItem } from "@nexus/codex-models";

const STATUS_MAP: Record<string, { label: string; color: string }> = {
  CLEAN: {
    label: "정상",
    color: "border-green-500 text-green-600 dark:text-green-400",
  },
  VIOLATION_FOUND: {
    label: "위반",
    color: "border-red-500 text-red-600 dark:text-red-400",
  },
  PARTIAL_VIOLATION: {
    label: "일부 위반",
    color: "border-orange-500 text-orange-600 dark:text-orange-400",
  },
};

interface ValidationHistoryTableProps {
  data: ValidationHistoryItem[];
  canExecute: boolean;
  onExecute?: () => void;
  isExecuting?: boolean;
}

export function ValidationHistoryTable({
  data,
  canExecute,
  onExecute,
  isExecuting,
}: ValidationHistoryTableProps) {
  return (
    <div>
      {canExecute && (
        <div className="mb-4 flex justify-end">
          <Button onClick={onExecute} disabled={isExecuting}>
            <Play className="mr-2 h-4 w-4" />
            {isExecuting ? "검증 실행 중..." : "전체 검증 실행"}
          </Button>
        </div>
      )}
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>실행일시</TableHead>
            <TableHead>실행자</TableHead>
            <TableHead className="text-right">위반 건수</TableHead>
            <TableHead>결과</TableHead>
            <TableHead className="w-16" />
          </TableRow>
        </TableHeader>
        <TableBody>
          {data.length === 0 ? (
            <TableRow>
              <TableCell
                colSpan={5}
                className="h-24 text-center text-muted-foreground"
              >
                아직 검증을 실행하지 않았습니다.
              </TableCell>
            </TableRow>
          ) : (
            data.map((item) => {
              const status = STATUS_MAP[item.status];
              return (
                <TableRow key={item.executionId}>
                  <TableCell className="font-mono text-xs">
                    {new Date(item.executedAt).toLocaleString("ko-KR")}
                  </TableCell>
                  <TableCell>{item.executedBy}</TableCell>
                  <TableCell className="text-right font-mono">
                    {item.totalViolations.toLocaleString()}
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline" className={status?.color}>
                      {status?.label ?? item.status}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-7 w-7"
                      render={
                        <Link
                          href={CODEX_ROUTES.validationDetail(item.executionId)}
                        />
                      }
                      nativeButton={false}
                    >
                      <ExternalLink className="h-3.5 w-3.5" />
                    </Button>
                  </TableCell>
                </TableRow>
              );
            })
          )}
        </TableBody>
      </Table>
    </div>
  );
}
