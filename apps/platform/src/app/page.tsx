"use client";

import { useState } from "react";
import { AnimatePresence } from "motion/react";
import type { Solution } from "@nexus/types";
import { PageTransition } from "@/components/motion/page-transition";
import { HubCanvas } from "@/components/hub/hub-canvas";
import { SolutionDetailPanel } from "@/components/hub/solution-detail-panel";
import { SummaryBar } from "@/components/hub/summary-bar";

export default function HubPage() {
  const [selectedSolution, setSelectedSolution] = useState<Solution | null>(
    null,
  );

  return (
    <PageTransition className="flex flex-col gap-6 px-10 py-7">
      {/* Page Title */}
      <div className="text-center">
        <h1 className="font-display text-[22px] font-normal tracking-tight">
          Command Center
        </h1>
        <div className="mx-auto mt-1.5 h-px w-7 bg-foreground" />
        <p className="mt-2 text-[10px] uppercase tracking-widest text-text-muted">
          Solution Hub Overview
        </p>
      </div>

      {/* Hub Canvas + Detail Panel */}
      <div className="relative h-[520px] overflow-hidden rounded-2xl bg-canvas ring-1 ring-border">
        <HubCanvas onNodeClick={setSelectedSolution} />
        <AnimatePresence>
          {selectedSolution && (
            <SolutionDetailPanel
              key={selectedSolution.slug}
              solution={selectedSolution}
              onClose={() => setSelectedSolution(null)}
            />
          )}
        </AnimatePresence>
      </div>

      {/* Summary Bar */}
      <SummaryBar />
    </PageTransition>
  );
}
