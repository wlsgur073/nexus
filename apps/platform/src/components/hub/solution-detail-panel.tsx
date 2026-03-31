"use client";

import { motion } from "motion/react";
import { X } from "lucide-react";
import { Button, Badge, Separator } from "@nexus/ui";
import { DynamicIcon, getConnectionsByNode } from "@nexus/config";
import type { Solution } from "@nexus/types";

type SolutionDetailPanelProps = {
  solution: Solution;
  onClose: () => void;
};

export function SolutionDetailPanel({
  solution,
  onClose,
}: SolutionDetailPanelProps) {
  const connections = getConnectionsByNode(solution.slug);

  const statusConfig = {
    active: {
      label: "Active",
      className:
        "bg-green-50 text-green-700 border-green-200 dark:bg-green-500/10 dark:text-green-400 dark:border-green-500/30",
    },
    beta: {
      label: "Beta",
      className:
        "bg-yellow-50 text-yellow-700 border-yellow-200 dark:bg-yellow-500/10 dark:text-yellow-400 dark:border-yellow-500/30",
    },
    "coming-soon": {
      label: "Coming Soon",
      className: "bg-muted text-muted-foreground border-border",
    },
  };

  const status = statusConfig[solution.status];

  return (
    <motion.div
      initial={{ x: "100%" }}
      animate={{ x: 0 }}
      exit={{ x: "100%" }}
      transition={{ duration: 0.25, ease: "easeOut" }}
      className="absolute right-0 top-0 z-10 flex h-full w-80 flex-col border-l bg-surface p-6"
    >
      <div className="mb-4 flex items-start justify-between">
        <div className="flex items-center gap-3">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-indigo-50 to-indigo-100 dark:from-indigo-500/20 dark:to-indigo-500/10">
            <DynamicIcon name={solution.icon} className="h-6 w-6" />
          </div>
          <div>
            <div className="font-display text-lg font-medium tracking-tight">
              {solution.name}
            </div>
            <div className="text-xs uppercase tracking-widest text-text-muted">
              {solution.category}
            </div>
          </div>
        </div>
        <Button
          variant="ghost"
          size="icon"
          className="h-7 w-7"
          onClick={onClose}
        >
          <X className="h-4 w-4" />
        </Button>
      </div>

      <div className="mb-4">
        <span
          className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-[10px] font-medium ${status.className}`}
        >
          {status.label}
        </span>
      </div>

      <p className="mb-4 text-sm leading-relaxed text-text-secondary">
        {solution.description}
      </p>

      <Separator className="mb-4" />

      <div className="mb-4">
        <div className="mb-2 text-[9px] uppercase tracking-widest text-text-muted">
          Connections
        </div>
        <div className="flex flex-col gap-1.5">
          {connections.length === 0 && (
            <div className="text-xs text-text-muted">연결 없음</div>
          )}
          {connections.map((conn) => {
            const target =
              conn.source === solution.slug ? conn.target : conn.source;
            const direction = conn.source === solution.slug ? "→" : "←";
            return (
              <div
                key={conn.id}
                className="flex items-center gap-2 rounded-md bg-canvas px-2.5 py-1.5"
              >
                <div className="h-1 w-1 rounded-full bg-chart-2" />
                <span className="text-[11px] text-text-secondary">
                  {direction} {target}
                </span>
                {conn.label && (
                  <span className="ml-auto text-[9px] text-text-muted">
                    {conn.label}
                  </span>
                )}
              </div>
            );
          })}
        </div>
      </div>

      <div className="mt-auto">
        {solution.status !== "coming-soon" ? (
          <Button
            className="w-full"
            onClick={() => window.open(`/launch/${solution.slug}`, "_blank")}
          >
            솔루션 열기
          </Button>
        ) : (
          <Button className="w-full" disabled variant="outline">
            준비 중
          </Button>
        )}
      </div>
    </motion.div>
  );
}
