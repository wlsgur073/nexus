import Link from "next/link";
import { cn } from "@nexus/ui";
import { DynamicIcon, getCategoryById } from "@nexus/config";
import type { Solution } from "@nexus/types";
import { AnimatedCard } from "@/components/motion/animated-card";

export function SolutionCard({ solution }: { solution: Solution }) {
  const category = getCategoryById(solution.category);
  const isComingSoon = solution.status === "coming-soon";

  const card = (
    <AnimatedCard
      className={cn(
        "relative h-full rounded-2xl p-5 ring-1 transition-shadow",
        isComingSoon
          ? "border-[1.5px] border-dashed border-border bg-canvas opacity-70 ring-transparent"
          : "bg-background ring-border hover:shadow-md",
      )}
    >
      {/* Status dot */}
      {!isComingSoon && (
        <div className="absolute right-4 top-4">
          <div
            className={cn(
              "h-1.5 w-1.5 rounded-full",
              solution.status === "active"
                ? "bg-green-500 shadow-[0_0_6px_rgba(34,197,94,0.4)]"
                : "bg-yellow-500 shadow-[0_0_6px_rgba(234,179,8,0.4)]",
            )}
          />
        </div>
      )}

      {/* Coming Soon badge */}
      {isComingSoon && (
        <div className="absolute right-4 top-4 rounded-md bg-muted px-2 py-0.5 text-[9px] text-text-muted">
          Coming Soon
        </div>
      )}

      {/* Icon */}
      <div
        className={cn(
          "mb-3.5 flex h-10 w-10 items-center justify-center rounded-xl",
          isComingSoon
            ? "bg-muted grayscale"
            : "bg-gradient-to-br from-indigo-50 to-indigo-100 dark:from-indigo-500/20 dark:to-indigo-500/10",
        )}
      >
        <DynamicIcon name={solution.icon} className="h-[18px] w-[18px]" />
      </div>

      {/* Content */}
      <div className="text-sm font-semibold text-foreground">
        {solution.name}
      </div>
      {category && (
        <div className="mt-0.5 text-[10px] uppercase tracking-wider text-text-muted">
          {category.name}
        </div>
      )}
      <p className="mt-2 text-xs leading-relaxed text-text-secondary">
        {solution.description}
      </p>

      {/* Hover accent bar */}
      {!isComingSoon && (
        <div className="absolute bottom-0 left-5 right-5 h-0.5 rounded-full bg-gradient-to-r from-indigo-400 to-indigo-200 opacity-0 transition-opacity duration-200 group-hover:opacity-100 dark:from-indigo-400 dark:to-indigo-600" />
      )}
    </AnimatedCard>
  );

  if (isComingSoon) {
    return <div className="group">{card}</div>;
  }

  return (
    <Link href={solution.route} className="group">
      {card}
    </Link>
  );
}
