"use client";

import { useState } from "react";
import { ChevronDown } from "lucide-react";

import { cn, TableCell, TableRow } from "@nexus/ui";

interface CollapsibleRowProps {
  cells: React.ReactNode[];
  expandedContent: React.ReactNode;
  colSpan: number;
  className?: string;
}

export function CollapsibleRow({
  cells,
  expandedContent,
  colSpan,
  className,
}: CollapsibleRowProps) {
  const [expanded, setExpanded] = useState(false);

  return (
    <>
      <TableRow
        className={cn("cursor-pointer hover:bg-accent", className)}
        onClick={() => setExpanded(!expanded)}
      >
        {cells.map((cell, i) => (
          <TableCell key={i}>{cell}</TableCell>
        ))}
        <TableCell className="w-10">
          <ChevronDown
            className={cn(
              "h-4 w-4 text-muted-foreground transition-transform",
              expanded && "rotate-180",
            )}
          />
        </TableCell>
      </TableRow>
      {expanded && (
        <TableRow>
          <TableCell colSpan={colSpan} className="bg-muted/50 p-4">
            {expandedContent}
          </TableCell>
        </TableRow>
      )}
    </>
  );
}
