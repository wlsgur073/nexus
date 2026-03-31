"use client";

import { Handle, Position } from "@xyflow/react";
import type { NodeProps } from "@xyflow/react";
import { cn } from "@nexus/ui";
import { DynamicIcon, getCategoryById } from "@nexus/config";
import type { Solution } from "@nexus/types";

type SolutionNodeData = {
  solution: Solution;
  dimmed?: boolean;
};

const statusStyles = {
  active: {
    container: "bg-surface border-indigo-200 dark:border-indigo-500/30",
    icon: "bg-gradient-to-br from-indigo-50 to-indigo-100 dark:from-indigo-500/20 dark:to-indigo-500/10",
    dot: "bg-green-500 shadow-[0_0_6px_rgba(34,197,94,0.4)]",
  },
  beta: {
    container: "bg-surface border-green-200 dark:border-green-500/30",
    icon: "bg-gradient-to-br from-green-50 to-green-100 dark:from-green-500/20 dark:to-green-500/10",
    dot: "bg-yellow-500 shadow-[0_0_6px_rgba(234,179,8,0.4)]",
  },
  "coming-soon": {
    container: "bg-canvas border-dashed border-border opacity-60",
    icon: "bg-muted grayscale",
    dot: "",
  },
};

export function SolutionNode({ data }: NodeProps) {
  const { solution, dimmed } = data as SolutionNodeData;
  const styles = statusStyles[solution.status];

  return (
    <div
      className={cn(
        "flex items-center gap-2 rounded-xl border-[1.5px] px-3 py-2.5 transition-all duration-200",
        styles.container,
        dimmed && "!opacity-30",
        !dimmed &&
          solution.status !== "coming-soon" &&
          "cursor-grab hover:shadow-[0_0_0_4px_rgba(99,102,241,0.1)] dark:hover:shadow-[0_0_0_4px_rgba(99,102,241,0.15)]",
      )}
    >
      <div
        className={cn(
          "flex h-7 w-7 items-center justify-center rounded-lg",
          styles.icon,
        )}
      >
        <DynamicIcon name={solution.icon} className="h-3.5 w-3.5" />
      </div>
      <div>
        <div className="text-[11px] font-semibold text-foreground">
          {solution.name}
        </div>
        <div className="text-[9px] text-text-muted">
          {getCategoryById(solution.category)?.name ?? solution.category}
        </div>
      </div>
      {styles.dot && (
        <div className={cn("ml-1 h-1.5 w-1.5 rounded-full", styles.dot)} />
      )}
      <Handle
        type="source"
        position={Position.Right}
        className="!invisible"
        style={{ top: "50%", left: "50%", transform: "translate(-50%, -50%)" }}
      />
      <Handle
        type="target"
        position={Position.Left}
        className="!invisible"
        style={{ top: "50%", left: "50%", transform: "translate(-50%, -50%)" }}
      />
    </div>
  );
}
