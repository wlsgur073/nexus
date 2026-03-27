"use client";

import { ExternalLink } from "lucide-react";
import { Button } from "@nexus/ui";
import type { SolutionStatus } from "@nexus/types";

type SolutionLaunchButtonProps = {
  slug: string;
  status: SolutionStatus;
};

const buttonConfig: Record<
  SolutionStatus,
  {
    label: string;
    variant: "default" | "secondary" | "outline";
    disabled: boolean;
  }
> = {
  active: { label: "솔루션 열기", variant: "default", disabled: false },
  beta: { label: "솔루션 열기 (베타)", variant: "secondary", disabled: false },
  "coming-soon": { label: "준비 중", variant: "outline", disabled: true },
};

export function SolutionLaunchButton({
  slug,
  status,
}: SolutionLaunchButtonProps) {
  const config = buttonConfig[status];

  function handleClick() {
    window.open(`/launch/${slug}`, "_blank");
  }

  return (
    <Button
      variant={config.variant}
      size="sm"
      disabled={config.disabled}
      onClick={handleClick}
    >
      {config.label}
      {!config.disabled && <ExternalLink className="ml-1.5 h-3.5 w-3.5" />}
    </Button>
  );
}
