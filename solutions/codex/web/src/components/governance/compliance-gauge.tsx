"use client";

import { cn } from "@nexus/ui";

import type { ComplianceByType } from "@nexus/codex-models";

const TYPE_LABELS: Record<string, string> = {
  WORD: "표준단어",
  DOMAIN: "표준도메인",
  TERM: "표준용어",
};

interface ComplianceGaugeProps {
  data: ComplianceByType[];
}

function GaugeCircle({
  rate,
  label,
  total,
  compliant,
}: {
  rate: number;
  label: string;
  total: number;
  compliant: number;
}) {
  const radius = 54;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (rate / 100) * circumference;

  const color =
    rate >= 90
      ? "text-green-500 stroke-green-500"
      : rate >= 80
        ? "text-blue-500 stroke-blue-500"
        : rate >= 70
          ? "text-orange-500 stroke-orange-500"
          : "text-red-500 stroke-red-500";

  return (
    <div className="flex flex-col items-center gap-2">
      <div className="relative h-32 w-32">
        <svg className="h-full w-full -rotate-90" viewBox="0 0 120 120">
          <circle
            cx="60"
            cy="60"
            r={radius}
            fill="none"
            strokeWidth="8"
            className="stroke-muted"
          />
          <circle
            cx="60"
            cy="60"
            r={radius}
            fill="none"
            strokeWidth="8"
            strokeLinecap="round"
            strokeDasharray={circumference}
            strokeDashoffset={offset}
            className={cn("transition-all duration-1000", color)}
          />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className={cn("text-2xl font-bold", color.split(" ")[0])}>
            {rate.toFixed(1)}%
          </span>
        </div>
      </div>
      <div className="text-center">
        <p className="text-sm font-medium">{label}</p>
        <p className="text-xs text-muted-foreground">
          {compliant.toLocaleString()} / {total.toLocaleString()}
        </p>
      </div>
    </div>
  );
}

export default function ComplianceGauge({ data }: ComplianceGaugeProps) {
  return (
    <div className="flex flex-wrap items-center justify-center gap-8">
      {data.map((item) => (
        <GaugeCircle
          key={item.type}
          rate={item.rate}
          label={TYPE_LABELS[item.type] ?? item.type}
          total={item.total}
          compliant={item.compliant}
        />
      ))}
    </div>
  );
}
