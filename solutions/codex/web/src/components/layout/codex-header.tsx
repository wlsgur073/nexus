"use client";

import { useTheme } from "next-themes";
import { BookOpen, Menu, Moon, Sun, User } from "lucide-react";
import { Button } from "@nexus/ui";

import { useAuth } from "@/hooks/use-auth";

type CodexHeaderProps = {
  onToggleSidebar: () => void;
};

export function CodexHeader({ onToggleSidebar }: CodexHeaderProps) {
  const { resolvedTheme, setTheme } = useTheme();
  const { session } = useAuth();

  return (
    <header className="sticky top-0 z-50 flex h-14 items-center gap-4 border-b bg-background px-4">
      <Button
        variant="ghost"
        size="icon"
        onClick={onToggleSidebar}
        className="shrink-0"
      >
        <Menu className="h-5 w-5" />
        <span className="sr-only">사이드바 토글</span>
      </Button>

      <div className="flex items-center gap-2">
        <BookOpen className="h-6 w-6 text-violet-600 dark:text-violet-400" />
        <span className="hidden text-lg font-semibold sm:inline-block">
          Codex
        </span>
      </div>

      <div className="ml-auto flex items-center gap-2">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setTheme(resolvedTheme === "dark" ? "light" : "dark")}
        >
          <Sun className="h-5 w-5 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
          <Moon className="absolute h-5 w-5 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
          <span className="sr-only">테마 전환</span>
        </Button>

        <Button variant="ghost" size="icon">
          <User className="h-5 w-5" />
          <span className="sr-only">사용자 메뉴</span>
        </Button>
        {session && (
          <span className="hidden text-sm text-muted-foreground lg:inline-block">
            {session.user.userName}
          </span>
        )}
      </div>
    </header>
  );
}
