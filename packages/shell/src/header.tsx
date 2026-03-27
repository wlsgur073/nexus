"use client";

import Link from "next/link";
import { Waypoints, Menu, Search, User } from "lucide-react";
import { Button, Input } from "@nexus/ui";
import { ThemeToggle } from "./theme-toggle";

type HeaderProps = {
  onToggleSidebar: () => void;
};

export function Header({ onToggleSidebar }: HeaderProps) {
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

      <Link
        href="/"
        className="flex items-center gap-2 hover:opacity-80 transition-opacity"
      >
        <Waypoints className="h-6 w-6 text-primary" />
        <span className="hidden text-lg font-semibold sm:inline-block">
          Nexus
        </span>
      </Link>

      <div className="ml-auto flex items-center gap-4">
        <div className="relative hidden md:block">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder="솔루션 검색..."
            className="w-64 pl-8"
          />
        </div>

        <ThemeToggle />

        <Button variant="ghost" size="icon">
          <User className="h-5 w-5" />
          <span className="sr-only">사용자 메뉴</span>
        </Button>
      </div>
    </header>
  );
}
