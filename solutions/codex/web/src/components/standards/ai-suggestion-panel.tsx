"use client";

import { useEffect, useState, useTransition } from "react";
import { Sparkles } from "lucide-react";

import { Card, CardContent, CardHeader, CardTitle } from "@nexus/ui";
import { getAiSuggestions } from "@nexus/codex-models";
import type { AiSuggestion, TargetType } from "@nexus/codex-models";

import { SimilarityBar } from "@/components/ui/similarity-bar";
import { StatusBadge } from "@/components/ui/status-badge";

interface AiSuggestionPanelProps {
  targetType: TargetType;
  name: string;
}

export function AiSuggestionPanel({ targetType, name }: AiSuggestionPanelProps) {
  const [suggestions, setSuggestions] = useState<AiSuggestion[]>([]);
  const [isPending, startTransition] = useTransition();

  useEffect(() => {
    startTransition(async () => {
      if (!name || name.length < 2) {
        setSuggestions([]);
        return;
      }
      const result = await getAiSuggestions(targetType, name);
      setSuggestions(result);
    });
  }, [targetType, name]);

  if (!name || name.length < 2) return null;

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-base">
          <Sparkles className="h-4 w-4 text-primary" />
          AI 유사 표준 추천
        </CardTitle>
      </CardHeader>
      <CardContent>
        {isPending ? (
          <p className="text-sm text-muted-foreground">분석 중...</p>
        ) : suggestions.length === 0 ? (
          <p className="text-sm text-muted-foreground">유사한 표준이 없습니다.</p>
        ) : (
          <div className="space-y-3">
            {suggestions.map((s) => (
              <div
                key={s.id}
                className="rounded-lg border p-3"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">{s.name}</p>
                    <p className="text-xs text-muted-foreground">
                      <code>{s.physicalName}</code>
                    </p>
                  </div>
                  <StatusBadge status={s.status as "BASELINE"} />
                </div>
                <SimilarityBar value={s.similarity} className="mt-2" />
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
