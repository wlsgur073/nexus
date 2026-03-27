"use client";

import { useRef, useState } from "react";
import { X } from "lucide-react";
import { useQuery } from "@tanstack/react-query";

import { Badge, cn } from "@nexus/ui";
import { getWordList } from "@nexus/codex-models";
import type { StandardWord } from "@nexus/codex-models";
import { QUERY_KEYS } from "@nexus/codex-shared";

import { useDebounce } from "@/hooks/use-debounce";

export interface SelectedWord {
  wordId: number;
  wordName: string;
  abbrName: string;
}

interface WordTagInputProps {
  selectedWords: SelectedWord[];
  onChange: (words: SelectedWord[]) => void;
  error?: string;
}

export function WordTagInput({
  selectedWords,
  onChange,
  error,
}: WordTagInputProps) {
  const [query, setQuery] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const debouncedQuery = useDebounce(query, 300);

  const { data: searchResults } = useQuery({
    queryKey: QUERY_KEYS.standards.wordList({ keyword: debouncedQuery }),
    queryFn: () => getWordList({ keyword: debouncedQuery, pageSize: 10 }),
    enabled: debouncedQuery.length >= 1,
  });

  const results = (searchResults?.items ?? []).filter(
    (word: StandardWord) =>
      !selectedWords.some((sw) => sw.wordId === word.wordId),
  );

  const handleSelect = (word: StandardWord) => {
    onChange([
      ...selectedWords,
      {
        wordId: word.wordId,
        wordName: word.wordName,
        abbrName: word.abbrName,
      },
    ]);
    setQuery("");
    setIsOpen(false);
    inputRef.current?.focus();
  };

  const handleRemove = (wordId: number) => {
    onChange(selectedWords.filter((w) => w.wordId !== wordId));
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Backspace" && query === "" && selectedWords.length > 0) {
      handleRemove(selectedWords[selectedWords.length - 1].wordId);
    }
  };

  return (
    <div className="relative" ref={containerRef}>
      <div
        className={cn(
          "flex min-h-9 flex-wrap items-center gap-1.5 rounded-md border border-input bg-background px-3 py-1.5 text-sm",
          "focus-within:ring-2 focus-within:ring-ring focus-within:ring-offset-2",
          error && "border-destructive",
        )}
        onClick={() => inputRef.current?.focus()}
        role="combobox"
        aria-expanded={isOpen}
        aria-controls="word-search-listbox"
        aria-haspopup="listbox"
      >
        {selectedWords.map((word) => (
          <Badge key={word.wordId} variant="secondary" className="gap-1 pr-1">
            {word.wordName}({word.abbrName})
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                handleRemove(word.wordId);
              }}
              className="rounded-full p-0.5 hover:bg-muted-foreground/20"
              aria-label={`${word.wordName} 제거`}
            >
              <X className="h-3 w-3" />
            </button>
          </Badge>
        ))}
        <input
          ref={inputRef}
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            setIsOpen(true);
          }}
          onFocus={() => query.length >= 1 && setIsOpen(true)}
          onBlur={(e) => {
            if (!containerRef.current?.contains(e.relatedTarget as Node)) {
              setIsOpen(false);
            }
          }}
          onKeyDown={handleKeyDown}
          placeholder={selectedWords.length === 0 ? "단어 검색..." : ""}
          className="min-w-[80px] flex-1 bg-transparent outline-none placeholder:text-muted-foreground"
          aria-label="표준단어 검색"
        />
      </div>

      {isOpen && results.length > 0 && (
        <div
          id="word-search-listbox"
          className="absolute z-50 mt-1 w-full rounded-md border bg-popover p-1 shadow-md"
          role="listbox"
        >
          {results.map((word: StandardWord) => (
            <button
              key={word.wordId}
              type="button"
              onPointerDown={(e) => e.preventDefault()}
              className="flex w-full items-center gap-3 rounded-sm px-2 py-1.5 text-sm hover:bg-accent hover:text-accent-foreground"
              onClick={() => handleSelect(word)}
              role="option"
              aria-selected={false}
            >
              <span className="font-medium">{word.wordName}</span>
              <span className="text-muted-foreground">{word.abbrName}</span>
              <Badge variant="outline" className="ml-auto text-xs">
                {word.status}
              </Badge>
            </button>
          ))}
        </div>
      )}

      {error && <p className="mt-1 text-xs text-destructive">{error}</p>}
    </div>
  );
}
