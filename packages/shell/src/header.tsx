"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Waypoints, User } from "lucide-react";
import { cn, Button } from "@nexus/ui";
import { ThemeToggle } from "./theme-toggle";

const navItems = [
  { href: "/", label: "Hub" },
  { href: "/solutions", label: "Solutions" },
  { href: "/settings", label: "Settings" },
];

export function Header() {
  const pathname = usePathname();

  return (
    <header className="sticky top-0 z-50 flex h-12 items-center px-6 bg-background">
      <Link
        href="/"
        className="flex items-center gap-2 hover:opacity-80 transition-opacity"
      >
        <Waypoints className="h-5 w-5 text-foreground" />
        <span className="font-display text-[15px] font-medium tracking-tight">
          Nexus
        </span>
      </Link>

      <nav className="flex-1 flex justify-center gap-7">
        {navItems.map((item) => {
          const isActive =
            item.href === "/"
              ? pathname === "/"
              : pathname.startsWith(item.href);

          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "relative text-sm transition-colors py-1",
                isActive
                  ? "text-foreground font-medium"
                  : "text-muted-foreground hover:text-foreground",
              )}
            >
              {item.label}
              {isActive && (
                <span className="absolute -bottom-[7px] left-0 right-0 h-[1.5px] bg-foreground" />
              )}
            </Link>
          );
        })}
      </nav>

      <div className="flex items-center gap-3">
        <ThemeToggle />
        <Button variant="ghost" size="icon" className="h-8 w-8">
          <User className="h-4 w-4" />
          <span className="sr-only">사용자 메뉴</span>
        </Button>
      </div>
    </header>
  );
}
