"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import {
  BookOpen,
  Clock,
  FileText,
  Microscope,
  Plus,
  ScrollText,
  Search,
} from "lucide-react";

import {
  CommandDialog,
  CommandInput,
  CommandList,
  CommandEmpty,
  CommandGroup,
  CommandItem,
  CommandSeparator,
} from "@nexus/ui";
import { CODEX_ROUTES } from "@nexus/codex-shared";

interface CommandAction {
  label: string;
  href: string;
  icon: React.ReactNode;
  keywords?: string[];
}

const QUICK_NAV: CommandAction[] = [
  {
    label: "대시보드",
    href: CODEX_ROUTES.dashboard,
    icon: <Search className="h-4 w-4" />,
    keywords: ["home", "홈"],
  },
  {
    label: "표준 탐색기",
    href: CODEX_ROUTES.standards,
    icon: <BookOpen className="h-4 w-4" />,
    keywords: ["standard", "표준", "탐색"],
  },
  {
    label: "거버넌스 포털",
    href: CODEX_ROUTES.governance,
    icon: <FileText className="h-4 w-4" />,
    keywords: ["governance", "준수율"],
  },
  {
    label: "검증 대시보드",
    href: CODEX_ROUTES.validations,
    icon: <Microscope className="h-4 w-4" />,
    keywords: ["validation", "검증", "위반"],
  },
  {
    label: "감사 추적",
    href: CODEX_ROUTES.audit,
    icon: <ScrollText className="h-4 w-4" />,
    keywords: ["audit", "감사", "이력"],
  },
  {
    label: "공통코드 조회",
    href: CODEX_ROUTES.commonCodes,
    icon: <FileText className="h-4 w-4" />,
    keywords: ["code", "공통코드"],
  },
];

const QUICK_ACTIONS: CommandAction[] = [
  {
    label: "신규 표준 신청",
    href: CODEX_ROUTES.standardsNew,
    icon: <Plus className="h-4 w-4" />,
    keywords: ["new", "신규", "신청", "create"],
  },
  {
    label: "승인 워크벤치",
    href: CODEX_ROUTES.approvals,
    icon: <FileText className="h-4 w-4" />,
    keywords: ["approve", "승인"],
  },
];

interface RecentItem {
  label: string;
  href: string;
}

const RECENT_KEY = "codex-command-recent";
const MAX_RECENT = 5;

function getRecent(): RecentItem[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(RECENT_KEY);
    return raw ? (JSON.parse(raw) as RecentItem[]) : [];
  } catch {
    return [];
  }
}

function saveRecent(item: RecentItem) {
  try {
    const prev = getRecent().filter((a) => a.href !== item.href);
    const next = [item, ...prev].slice(0, MAX_RECENT);
    localStorage.setItem(RECENT_KEY, JSON.stringify(next));
  } catch {
    // localStorage full or unavailable
  }
}

export default function CommandPalette() {
  const [open, setOpen] = useState(false);
  const [recentKey, setRecentKey] = useState(0);
  const router = useRouter();

  const recent = useMemo(() => (open ? getRecent() : []), [open, recentKey]);

  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        setOpen((prev) => !prev);
      }
    }

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, []);

  const handleSelect = useCallback(
    (href: string, label: string) => {
      saveRecent({ label, href });
      setRecentKey((k) => k + 1);
      setOpen(false);
      router.push(href);
    },
    [router],
  );

  return (
    <CommandDialog open={open} onOpenChange={setOpen}>
      <CommandInput placeholder="메뉴, 표준, 액션 검색..." />
      <CommandList>
        <CommandEmpty>검색 결과가 없습니다.</CommandEmpty>
        {recent.length > 0 && (
          <>
            <CommandGroup heading="최근 방문">
              {recent.map((item) => (
                <CommandItem
                  key={`recent-${item.href}`}
                  onSelect={() => handleSelect(item.href, item.label)}
                >
                  <Clock className="h-4 w-4" />
                  <span>{item.label}</span>
                </CommandItem>
              ))}
            </CommandGroup>
            <CommandSeparator />
          </>
        )}
        <CommandGroup heading="빠른 이동">
          {QUICK_NAV.map((item) => (
            <CommandItem
              key={item.href}
              onSelect={() => handleSelect(item.href, item.label)}
              keywords={item.keywords}
            >
              {item.icon}
              <span>{item.label}</span>
            </CommandItem>
          ))}
        </CommandGroup>
        <CommandSeparator />
        <CommandGroup heading="빠른 액션">
          {QUICK_ACTIONS.map((item) => (
            <CommandItem
              key={item.href}
              onSelect={() => handleSelect(item.href, item.label)}
              keywords={item.keywords}
            >
              {item.icon}
              <span>{item.label}</span>
            </CommandItem>
          ))}
        </CommandGroup>
      </CommandList>
    </CommandDialog>
  );
}
