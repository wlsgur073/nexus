"use client";

import { getBezierPath } from "@xyflow/react";
import type { EdgeProps } from "@xyflow/react";

type FlowEdgeData = {
  status: "active" | "pending";
  label?: string;
  dimmed?: boolean;
};

export function FlowEdge({
  id,
  sourceX,
  sourceY,
  targetX,
  targetY,
  sourcePosition,
  targetPosition,
  data,
}: EdgeProps) {
  const { status, label, dimmed } = (data || {}) as FlowEdgeData;

  const [edgePath, labelX, labelY] = getBezierPath({
    sourceX,
    sourceY,
    targetX,
    targetY,
    sourcePosition,
    targetPosition,
  });

  const isActive = status === "active";
  const edgeOpacity = dimmed ? 0.15 : isActive ? 0.7 : 0.4;

  return (
    <g>
      <path
        id={id}
        d={edgePath}
        fill="none"
        stroke={isActive ? "var(--chart-2)" : "var(--border)"}
        strokeWidth={isActive ? 2 : 1}
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
      {label && !dimmed && (
        <text
          x={labelX}
          y={labelY - 8}
          textAnchor="middle"
          fontSize="9"
          fill="var(--text-muted)"
          className="pointer-events-none select-none"
        >
          {label}
        </text>
      )}
    </g>
  );
}
