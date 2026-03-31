"use client";

import React, { useState, useMemo } from "react";
import { Search } from "lucide-react";
import { Input } from "@nexus/ui";
import { solutions } from "@nexus/config";
import { PageTransition } from "@/components/motion/page-transition";
import { SolutionGrid } from "@/components/solutions/solution-grid";
import { CategoryFilter } from "@/components/solutions/category-filter";

export default function SolutionsPage() {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");

  const filtered = useMemo(() => {
    const statusOrder: Record<string, number> = {
      active: 0,
      beta: 1,
      "coming-soon": 2,
    };
    return solutions
      .filter((s) => {
        const matchesCategory =
          !selectedCategory || s.category === selectedCategory;
        const matchesSearch =
          !searchQuery ||
          s.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          s.description.toLowerCase().includes(searchQuery.toLowerCase());
        return matchesCategory && matchesSearch;
      })
      .sort(
        (a, b) => (statusOrder[a.status] ?? 2) - (statusOrder[b.status] ?? 2),
      );
  }, [selectedCategory, searchQuery]);

  return (
    <PageTransition className="px-10 py-7">
      {/* Title + Search */}
      <div className="mb-6 flex items-end justify-between">
        <div>
          <h1 className="font-display text-[22px] font-normal tracking-tight">
            Solutions
          </h1>
          <div className="mt-1.5 h-px w-7 bg-foreground" />
        </div>
        <div className="relative w-60">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-text-muted" />
          <Input
            type="search"
            placeholder="Search solutions..."
            value={searchQuery}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
              setSearchQuery(e.target.value)
            }
            className="pl-8"
          />
        </div>
      </div>

      {/* Category Filter */}
      <div className="mb-6">
        <CategoryFilter
          selected={selectedCategory}
          onSelect={setSelectedCategory}
        />
      </div>

      {/* Grid */}
      <SolutionGrid solutions={filtered} />
    </PageTransition>
  );
}
