"use client";

import { Handle, Position } from "@xyflow/react";
import type { NodeProps } from "@xyflow/react";
import { Waypoints } from "lucide-react";

export function NexusHubNode({ data }: NodeProps) {
  return (
    <div className="relative flex h-16 w-16 flex-col items-center justify-center rounded-full bg-background shadow-[0_4px_24px_rgba(0,0,0,0.06),0_0_0_8px_rgba(241,245,249,0.5)] ring-1 ring-border dark:shadow-[0_4px_24px_rgba(0,0,0,0.3),0_0_0_8px_rgba(30,30,50,0.5)]">
      <Waypoints className="h-4 w-4 text-foreground" />
      <span className="mt-0.5 font-display text-[7px] font-semibold uppercase tracking-widest text-foreground">
        Nexus
      </span>
      <Handle
        type="source"
        position={Position.Top}
        className="!invisible"
        style={{ top: "50%", left: "50%", transform: "translate(-50%, -50%)" }}
      />
      <Handle
        type="target"
        position={Position.Bottom}
        className="!invisible"
        style={{ top: "50%", left: "50%", transform: "translate(-50%, -50%)" }}
      />
    </div>
  );
}
