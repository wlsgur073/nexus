"use client";

import { cn } from "@nexus/ui";
import { DynamicIcon, categories } from "@nexus/config";

type CategoryFilterProps = {
  selected: string | null;
  onSelect: (categoryId: string | null) => void;
};

export function CategoryFilter({ selected, onSelect }: CategoryFilterProps) {
  return (
    <div className="flex flex-wrap gap-1.5">
      <button
        onClick={() => onSelect(null)}
        className={cn(
          "rounded-full px-3.5 py-1.5 text-[11px] font-medium transition-colors duration-200",
          selected === null
            ? "bg-foreground text-background"
            : "bg-surface text-text-secondary ring-1 ring-border hover:text-foreground",
        )}
      >
        All
      </button>
      {categories.map((category) => (
        <button
          key={category.id}
          onClick={() => onSelect(category.id)}
          className={cn(
            "flex items-center gap-1.5 rounded-full px-3.5 py-1.5 text-[11px] font-medium transition-colors duration-200",
            selected === category.id
              ? "bg-foreground text-background"
              : "bg-surface text-text-secondary ring-1 ring-border hover:text-foreground",
          )}
        >
          <DynamicIcon name={category.icon} className="h-3 w-3" />
          {category.name}
        </button>
      ))}
    </div>
  );
}
