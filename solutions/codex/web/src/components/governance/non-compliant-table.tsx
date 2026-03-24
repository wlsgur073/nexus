"use client";

import { useState } from "react";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@nexus/ui";

import { TargetTypeBadge } from "@/components/ui/target-type-badge";

import type { NonCompliantItem } from "@nexus/codex-models";

interface NonCompliantTableProps {
  data: NonCompliantItem[];
}

export function NonCompliantTable({ data }: NonCompliantTableProps) {
  const [now] = useState(() => Date.now());

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead className="w-12">순위</TableHead>
          <TableHead>항목명</TableHead>
          <TableHead>유형</TableHead>
          <TableHead>위반 사유</TableHead>
          <TableHead className="text-right">미준수 기간</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {data.length === 0 ? (
          <TableRow>
            <TableCell
              colSpan={5}
              className="h-24 text-center text-muted-foreground"
            >
              미준수 항목이 없습니다.
            </TableCell>
          </TableRow>
        ) : (
          data.map((item, i) => {
            const daysAgo = Math.floor(
              (now - new Date(item.registeredDate).getTime()) /
                (1000 * 60 * 60 * 24),
            );
            return (
              <TableRow key={`${item.itemName}-${i}`}>
                <TableCell className="font-medium">{i + 1}</TableCell>
                <TableCell className="font-medium">{item.itemName}</TableCell>
                <TableCell>
                  <TargetTypeBadge type={item.itemType} />
                </TableCell>
                <TableCell className="text-muted-foreground">
                  {item.violationReason}
                </TableCell>
                <TableCell className="text-right font-mono text-xs">
                  {daysAgo}일
                </TableCell>
              </TableRow>
            );
          })
        )}
      </TableBody>
    </Table>
  );
}
