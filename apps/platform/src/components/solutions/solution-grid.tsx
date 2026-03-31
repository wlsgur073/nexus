"use client";

import type { Solution } from "@nexus/types";
import { SolutionCard } from "./solution-card";
import {
  StaggerContainer,
  StaggerItem,
} from "@/components/motion/stagger-container";

export function SolutionGrid({ solutions }: { solutions: Solution[] }) {
  if (solutions.length === 0) {
    return (
      <div className="flex min-h-[200px] items-center justify-center rounded-2xl ring-1 ring-dashed ring-border">
        <p className="text-sm text-text-muted">
          조건에 맞는 솔루션이 없습니다.
        </p>
      </div>
    );
  }

  return (
    <StaggerContainer className="grid gap-3.5 sm:grid-cols-2 lg:grid-cols-3">
      {solutions.map((solution) => (
        <StaggerItem key={solution.id}>
          <SolutionCard solution={solution} />
        </StaggerItem>
      ))}
    </StaggerContainer>
  );
}
