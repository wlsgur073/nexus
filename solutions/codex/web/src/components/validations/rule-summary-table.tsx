"use client";

import {
  Badge,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@nexus/ui";

import type { ValidationRule } from "@nexus/codex-models";

const SEVERITY_COLORS: Record<string, string> = {
  HIGH: "border-red-500 text-red-600 dark:text-red-400",
  MEDIUM: "border-orange-500 text-orange-600 dark:text-orange-400",
  LOW: "border-gray-400 text-gray-500 dark:text-gray-400",
};

const SEVERITY_LABELS: Record<string, string> = {
  HIGH: "높음",
  MEDIUM: "중간",
  LOW: "낮음",
};

interface RuleSummaryTableProps {
  data: ValidationRule[];
}

export function RuleSummaryTable({ data }: RuleSummaryTableProps) {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>규칙명</TableHead>
          <TableHead>설명</TableHead>
          <TableHead>심각도</TableHead>
          <TableHead>상태</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {data.length === 0 ? (
          <TableRow>
            <TableCell
              colSpan={4}
              className="h-24 text-center text-muted-foreground"
            >
              등록된 검증 규칙이 없습니다.
            </TableCell>
          </TableRow>
        ) : (
          data.map((rule) => (
            <TableRow key={rule.ruleId}>
              <TableCell className="font-medium">{rule.name}</TableCell>
              <TableCell className="max-w-xs truncate text-muted-foreground">
                {rule.description}
              </TableCell>
              <TableCell>
                <Badge
                  variant="outline"
                  className={SEVERITY_COLORS[rule.severity]}
                >
                  {SEVERITY_LABELS[rule.severity]}
                </Badge>
              </TableCell>
              <TableCell>
                <Badge variant={rule.isActive ? "default" : "outline"}>
                  {rule.isActive ? "활성" : "비활성"}
                </Badge>
              </TableCell>
            </TableRow>
          ))
        )}
      </TableBody>
    </Table>
  );
}
