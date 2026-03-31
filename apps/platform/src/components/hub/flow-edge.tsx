"use client";

import type { EdgeProps } from "@xyflow/react";

type FlowEdgeData = {
  status: "active" | "pending";
  dimmed?: boolean;
};

export function FlowEdge({
  id,
  sourceX,
  sourceY,
  targetX,
  targetY,
  data,
}: EdgeProps) {
  const { status, dimmed } = (data || {}) as FlowEdgeData;

  const dx = targetX - sourceX;
  const dy = targetY - sourceY;
  const dist = Math.sqrt(dx * dx + dy * dy) || 1;
  const curvature = dist * 0.2;
  const mx = (sourceX + targetX) / 2;
  const my = (sourceY + targetY) / 2;
  const nx = (-dy / dist) * curvature;
  const ny = (dx / dist) * curvature;
  const edgePath = `M ${sourceX} ${sourceY} Q ${mx + nx} ${my + ny} ${targetX} ${targetY}`;

  const isActive = status === "active";
  const edgeOpacity = dimmed ? 0.15 : isActive ? 0.7 : 0.6;

  return (
    <g>
      <path
        id={id}
        d={edgePath}
        fill="none"
        stroke={isActive ? "var(--chart-2)" : "var(--text-disabled)"}
        strokeWidth={isActive ? 2 : 1.5}
        strokeDasharray={isActive ? undefined : "4 4"}
        opacity={edgeOpacity}
        className="transition-opacity duration-200"
      />
      {isActive && !dimmed && (
        <>
          <circle r="3" fill="var(--chart-3)" opacity="0.9">
            <animateMotion
              dur={`${2 + Math.random()}s`}
              repeatCount="indefinite"
              path={edgePath}
            />
          </circle>
          <circle r="1.5" fill="var(--chart-2)" opacity="0.5">
            <animateMotion
              dur={`${2.5 + Math.random()}s`}
              repeatCount="indefinite"
              path={edgePath}
              begin="0.8s"
            />
          </circle>
        </>
      )}
    </g>
  );
}
