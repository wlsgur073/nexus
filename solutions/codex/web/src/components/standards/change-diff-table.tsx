"use client";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@nexus/ui";

import type { RequestChange } from "@nexus/codex-models";

interface ChangeDiffTableProps {
  changes: RequestChange[];
}

export function ChangeDiffTable({ changes }: ChangeDiffTableProps) {
  if (changes.length === 0) {
    return (
      <p className="text-sm text-muted-foreground">변경 내역이 없습니다.</p>
    );
  }

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>필드</TableHead>
          <TableHead>현재값</TableHead>
          <TableHead>변경요청값</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {changes.map((change) => (
          <TableRow key={change.changeId}>
            <TableCell className="font-medium">{change.fieldName}</TableCell>
            <TableCell className="text-muted-foreground">
              {change.oldValue ?? "-"}
            </TableCell>
            <TableCell className="text-primary">
              {change.newValue ?? "-"}
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
