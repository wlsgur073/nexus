"use client";

import { cn } from "@nexus/ui";

interface SimilarityBarProps {
  value: number;
  className?: string;
}

export function SimilarityBar({ value, className }: SimilarityBarProps) {
  const color =
    value >= 80
      ? "bg-blue-500"
      : value >= 50
        ? "bg-orange-500"
        : "bg-gray-400";

  return (
    <div className={cn("flex items-center gap-2", className)}>
      <div className="h-2 flex-1 overflow-hidden rounded-full bg-muted">
        <div
          className={cn("h-full rounded-full transition-all", color)}
          style={{ width: `${Math.min(100, Math.max(0, value))}%` }}
        />
      </div>
      <span className="text-xs font-medium tabular-nums text-muted-foreground">
        {value}%
      </span>
    </div>
  );
}
