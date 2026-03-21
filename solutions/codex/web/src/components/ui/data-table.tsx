"use client";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
  Skeleton,
  Checkbox,
} from "@nexus/ui";

export interface Column<T> {
  key: string;
  label: string;
  render?: (item: T) => React.ReactNode;
  className?: string;
}

interface DataTableProps<T> {
  columns: Column<T>[];
  data: T[];
  isLoading?: boolean;
  selectable?: boolean;
  selectedIds?: Set<number>;
  onSelectionChange?: (ids: Set<number>) => void;
  onRowClick?: (item: T) => void;
  getRowId?: (item: T) => number;
  activeRowId?: number | null;
  emptyMessage?: string;
}

export function DataTable<T>({
  columns,
  data,
  isLoading = false,
  selectable = false,
  selectedIds,
  onSelectionChange,
  onRowClick,
  getRowId,
  activeRowId,
  emptyMessage = "데이터가 없습니다.",
}: DataTableProps<T>) {
  if (isLoading) {
    return (
      <Table>
        <TableHeader>
          <TableRow>
            {selectable && <TableHead className="w-12" />}
            {columns.map((col) => (
              <TableHead key={col.key} className={col.className}>
                {col.label}
              </TableHead>
            ))}
          </TableRow>
        </TableHeader>
        <TableBody>
          {Array.from({ length: 5 }).map((_, i) => (
            <TableRow key={i}>
              {selectable && (
                <TableCell>
                  <Skeleton className="h-4 w-4" />
                </TableCell>
              )}
              {columns.map((col) => (
                <TableCell key={col.key}>
                  <Skeleton className="h-4 w-full" />
                </TableCell>
              ))}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    );
  }

  if (data.length === 0) {
    return (
      <div className="flex h-40 items-center justify-center text-sm text-muted-foreground">
        {emptyMessage}
      </div>
    );
  }

  const handleSelectAll = () => {
    if (!onSelectionChange || !getRowId) return;
    const allIds = new Set(data.map(getRowId));
    const allSelected = selectedIds && data.every((item) => selectedIds.has(getRowId(item)));
    onSelectionChange(allSelected ? new Set() : allIds);
  };

  const handleSelectRow = (id: number) => {
    if (!onSelectionChange || !selectedIds) return;
    const next = new Set(selectedIds);
    if (next.has(id)) next.delete(id);
    else next.add(id);
    onSelectionChange(next);
  };

  return (
    <Table>
      <TableHeader>
        <TableRow>
          {selectable && (
            <TableHead className="w-12">
              <Checkbox
                checked={
                  data.length > 0 &&
                  selectedIds !== undefined &&
                  getRowId !== undefined &&
                  data.every((item) => selectedIds.has(getRowId(item)))
                }
                onCheckedChange={handleSelectAll}
              />
            </TableHead>
          )}
          {columns.map((col) => (
            <TableHead key={col.key} className={col.className}>
              {col.label}
            </TableHead>
          ))}
        </TableRow>
      </TableHeader>
      <TableBody>
        {data.map((item, i) => {
          const rowId = getRowId?.(item) ?? i;
          return (
            <TableRow
              key={rowId}
              className={`${onRowClick ? "cursor-pointer" : ""} ${
                activeRowId === rowId ? "bg-accent" : ""
              }`}
              onClick={() => onRowClick?.(item)}
            >
              {selectable && (
                <TableCell onClick={(e) => e.stopPropagation()}>
                  <Checkbox
                    checked={selectedIds?.has(rowId) ?? false}
                    onCheckedChange={() => handleSelectRow(rowId)}
                  />
                </TableCell>
              )}
              {columns.map((col) => (
                <TableCell key={col.key} className={col.className}>
                  {col.render
                    ? col.render(item)
                    : String((item as Record<string, unknown>)[col.key] ?? "")}
                </TableCell>
              ))}
            </TableRow>
          );
        })}
      </TableBody>
    </Table>
  );
}
