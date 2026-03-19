"use client";

import { useState, useMemo } from "react";
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { SolutionGrid } from "@/components/solutions/solution-grid";
import { CategoryFilter } from "@/components/solutions/category-filter";
import { solutions } from "@/config/solutions";

export default function SolutionsPage() {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");

  const filtered = useMemo(() => {
    return solutions.filter((s) => {
      const matchesCategory =
        !selectedCategory || s.category === selectedCategory;
      const matchesSearch =
        !searchQuery ||
        s.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        s.description.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesCategory && matchesSearch;
    });
  }, [selectedCategory, searchQuery]);

  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold tracking-tight">솔루션 카탈로그</h1>
        <p className="mt-1 text-muted-foreground">
          플랫폼에서 제공하는 솔루션을 탐색하세요.
        </p>
      </div>

      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <CategoryFilter
          selected={selectedCategory}
          onSelect={setSelectedCategory}
        />
        <div className="relative w-full sm:w-64">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder="검색..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-8"
          />
        </div>
      </div>

      <SolutionGrid solutions={filtered} />
    </div>
  );
}
