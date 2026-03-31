"use client";

import { solutions, getActiveConnections } from "@nexus/config";
import { MetricCard } from "./metric-card";
import {
  StaggerContainer,
  StaggerItem,
} from "@/components/motion/stagger-container";

export function SummaryBar() {
  const activeConnections = getActiveConnections();
  const activeSolutions = solutions.filter(
    (s) => s.status === "active" || s.status === "beta",
  );

  return (
    <StaggerContainer className="grid grid-cols-3 gap-3" delay={0.3}>
      <StaggerItem>
        <MetricCard
          title="Active Connections"
          value={activeConnections.length}
        />
      </StaggerItem>
      <StaggerItem>
        <MetricCard
          title="Solutions"
          value={
            <>
              {activeSolutions.length}{" "}
              <span className="font-sans text-sm text-text-muted">
                / {solutions.length}
              </span>
            </>
          }
        />
      </StaggerItem>
      <StaggerItem>
        <MetricCard
          title="System Status"
          value={
            <span className="flex items-center gap-2">
              <span className="h-1.5 w-1.5 rounded-full bg-green-500 shadow-[0_0_6px_rgba(34,197,94,0.4)]" />
              <span className="text-sm font-medium">Operational</span>
            </span>
          }
        />
      </StaggerItem>
    </StaggerContainer>
  );
}
