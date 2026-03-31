"use client";

import { useCallback, useMemo, useState } from "react";
import {
  ReactFlow,
  Background,
  Controls,
  useNodesState,
  useEdgesState,
} from "@xyflow/react";
import type { Node, Edge } from "@xyflow/react";
import "@xyflow/react/dist/style.css";

import { solutions, hubConnections, getConnectionsByNode } from "@nexus/config";
import type { Solution } from "@nexus/types";

import { NexusHubNode } from "./nexus-hub-node";
import { SolutionNode } from "./solution-node";
import { FlowEdge } from "./flow-edge";

const nodeTypes = {
  nexusHub: NexusHubNode,
  solution: SolutionNode,
};

const edgeTypes = {
  flow: FlowEdge,
};

const STATUS_ORDER: Record<string, number> = {
  active: 0,
  beta: 1,
  "coming-soon": 2,
};

function buildInitialNodes(): Node[] {
  const centerX = 400;
  const centerY = 250;
  const radius = 180;

  const hubNode: Node = {
    id: "nexus-hub",
    type: "nexusHub",
    position: { x: centerX - 32, y: centerY - 32 },
    data: {},
    draggable: false,
  };

  // Active/Beta를 상단에 배치하도록 status 순 정렬
  const sorted = [...solutions].sort(
    (a, b) => (STATUS_ORDER[a.status] ?? 2) - (STATUS_ORDER[b.status] ?? 2),
  );

  const solutionNodes: Node[] = sorted.map((solution, index) => {
    const angle = (index / sorted.length) * 2 * Math.PI - Math.PI / 2;
    const x = centerX + radius * Math.cos(angle) - 60;
    const y = centerY + radius * Math.sin(angle) - 20;

    return {
      id: solution.slug,
      type: "solution",
      position: { x, y },
      data: { solution, dimmed: false },
    };
  });

  return [hubNode, ...solutionNodes];
}

function buildInitialEdges(): Edge[] {
  return hubConnections.map((conn) => ({
    id: conn.id,
    source: conn.source,
    target: conn.target,
    type: "flow",
    data: { status: conn.status, dimmed: false },
  }));
}

type HubCanvasProps = {
  onNodeClick: (solution: Solution) => void;
};

export function HubCanvas({ onNodeClick }: HubCanvasProps) {
  const [nodes, setNodes, onNodesChange] = useNodesState(buildInitialNodes());
  const [edges, setEdges, onEdgesChange] = useEdgesState(buildInitialEdges());
  const [hoveredNode, setHoveredNode] = useState<string | null>(null);

  const connectedIds = useMemo(() => {
    if (!hoveredNode) return null;
    const conns = getConnectionsByNode(hoveredNode);
    const ids = new Set<string>([hoveredNode]);
    conns.forEach((c) => {
      ids.add(c.source);
      ids.add(c.target);
    });
    return ids;
  }, [hoveredNode]);

  const displayNodes = useMemo(() => {
    if (!connectedIds) return nodes;
    return nodes.map((node) => ({
      ...node,
      data: { ...node.data, dimmed: !connectedIds.has(node.id) },
    }));
  }, [nodes, connectedIds]);

  const displayEdges = useMemo(() => {
    if (!connectedIds) return edges;
    return edges.map((edge) => ({
      ...edge,
      data: {
        ...edge.data,
        dimmed:
          !connectedIds.has(edge.source) || !connectedIds.has(edge.target),
      },
    }));
  }, [edges, connectedIds]);

  const handleNodeClick = useCallback(
    (_: React.MouseEvent, node: Node) => {
      if (node.type === "nexusHub") return;
      const solution = solutions.find((s) => s.slug === node.id);
      if (solution && solution.status !== "coming-soon") {
        onNodeClick(solution);
      }
    },
    [onNodeClick],
  );

  const handleNodeMouseEnter = useCallback(
    (_: React.MouseEvent, node: Node) => {
      setHoveredNode(node.id);
    },
    [],
  );

  const handleNodeMouseLeave = useCallback(() => {
    setHoveredNode(null);
  }, []);

  return (
    <div className="h-full w-full">
      <ReactFlow
        nodes={displayNodes}
        edges={displayEdges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onNodeClick={handleNodeClick}
        onNodeMouseEnter={handleNodeMouseEnter}
        onNodeMouseLeave={handleNodeMouseLeave}
        nodeTypes={nodeTypes}
        edgeTypes={edgeTypes}
        fitView
        minZoom={0.5}
        maxZoom={1.5}
        proOptions={{ hideAttribution: true }}
        className="!bg-transparent"
      >
        <Background
          variant={"dots" as any}
          gap={20}
          size={1}
          color="var(--border)"
          style={{ opacity: 0.35 }}
        />
        <Controls
          showInteractive={false}
          position="bottom-right"
          className="!rounded-lg !border !border-border !bg-background !shadow-sm [&>button]:!border-border [&>button]:!bg-background [&>button]:!fill-foreground"
        />
        <div className="absolute bottom-3 left-3 z-10 flex gap-3 text-[9px] text-text-muted">
          <span className="flex items-center gap-1.5">
            <span className="h-1.5 w-1.5 rounded-full bg-green-500" />
            Active
          </span>
          <span className="flex items-center gap-1.5">
            <span className="h-1.5 w-1.5 rounded-full bg-yellow-500" />
            Beta
          </span>
          <span className="flex items-center gap-1.5">
            <span className="w-3 border-t border-dashed border-border" />
            Coming Soon
          </span>
        </div>
      </ReactFlow>
    </div>
  );
}
