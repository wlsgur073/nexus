"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  ArrowLeft,
  BarChart3,
  BookOpen,
  CheckSquare,
  Database,
  FileText,
  LayoutDashboard,
  Microscope,
  Plus,
  ScrollText,
  Settings,
  Shield,
  Users,
} from "lucide-react";

import {
  cn,
  ScrollArea,
  Separator,
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  Tooltip,
  TooltipTrigger,
  TooltipContent,
} from "@nexus/ui";
import { CODEX_ROUTES } from "@nexus/codex-shared";

import { useRole } from "@/hooks/use-auth";
import { useNotifications } from "@/components/providers/notification-provider";

import type { LucideIcon } from "lucide-react";

interface MenuItem {
  label: string;
  href: string;
  icon: LucideIcon;
  requiredRole?:
    | "admin"
    | "approver"
    | "requester"
    | "governance"
    | "validation"
    | "notReadOnly";
  badge?: number;
}

interface MenuSection {
  title: string;
  items: MenuItem[];
}

function buildMenuSections(unreadCount: number): MenuSection[] {
  return [
    {
      title: "",
      items: [
        {
          label: "대시보드",
          href: CODEX_ROUTES.dashboard,
          icon: LayoutDashboard,
        },
      ],
    },
    {
      title: "표준 관리",
      items: [
        {
          label: "표준 탐색기",
          href: CODEX_ROUTES.standards,
          icon: BookOpen,
        },
        {
          label: "신규 신청",
          href: CODEX_ROUTES.standardsNew,
          icon: Plus,
          requiredRole: "requester",
        },
        {
          label: "공통코드 조회",
          href: CODEX_ROUTES.commonCodes,
          icon: FileText,
        },
      ],
    },
    {
      title: "거버넌스",
      items: [
        {
          label: "승인 워크벤치",
          href: CODEX_ROUTES.approvals,
          icon: CheckSquare,
          requiredRole: "approver",
          badge: unreadCount > 0 ? unreadCount : undefined,
        },
        {
          label: "거버넌스 포털",
          href: CODEX_ROUTES.governance,
          icon: BarChart3,
          requiredRole: "governance",
        },
        {
          label: "감사 추적",
          href: CODEX_ROUTES.audit,
          icon: ScrollText,
          requiredRole: "notReadOnly",
        },
      ],
    },
    {
      title: "품질 관리",
      items: [
        {
          label: "검증 대시보드",
          href: CODEX_ROUTES.validations,
          icon: Microscope,
        },
      ],
    },
    {
      title: "관리",
      items: [
        {
          label: "공통코드 관리",
          href: CODEX_ROUTES.admin.commonCodes,
          icon: FileText,
          requiredRole: "admin",
        },
        {
          label: "사용자 관리",
          href: CODEX_ROUTES.admin.users,
          icon: Users,
          requiredRole: "admin",
        },
        {
          label: "권한 관리",
          href: CODEX_ROUTES.admin.permissions,
          icon: Shield,
          requiredRole: "admin",
        },
        {
          label: "코드 관리",
          href: CODEX_ROUTES.admin.systemCodes,
          icon: Settings,
          requiredRole: "admin",
        },
        {
          label: "DB 연결 설정",
          href: CODEX_ROUTES.admin.dbSettings,
          icon: Database,
          requiredRole: "admin",
        },
      ],
    },
  ];
}

/* ─── Desktop Sidebar ─── */

type CodexSidebarProps = {
  collapsed: boolean;
};

export function CodexSidebar({ collapsed }: CodexSidebarProps) {
  const pathname = usePathname();
  const { isAdmin, canApprove, canRequest, canViewGovernance, isReadOnly } =
    useRole();
  const { unreadCount } = useNotifications();
  const menuSections = buildMenuSections(unreadCount);

  const isVisible = (item: MenuItem) => {
    if (!item.requiredRole) return true;
    if (item.requiredRole === "admin") return isAdmin;
    if (item.requiredRole === "approver") return canApprove;
    if (item.requiredRole === "requester") return canRequest;
    if (item.requiredRole === "governance") return canViewGovernance;
    if (item.requiredRole === "notReadOnly") return !isReadOnly;
    return true;
  };

  return (
    <aside
      className={cn(
        "hidden border-r bg-sidebar text-sidebar-foreground transition-all duration-300 lg:flex lg:flex-col",
        collapsed ? "lg:w-16" : "lg:w-60",
      )}
    >
      <ScrollArea className="flex-1 py-4">
        <SidebarNav
          collapsed={collapsed}
          pathname={pathname}
          isVisible={isVisible}
          sections={menuSections}
        />
      </ScrollArea>

      <div className="border-t p-2">
        {/* Full page navigation to Platform root — <a> is intentional (cross-app) */}
        {/* eslint-disable-next-line @next/next/no-html-link-for-pages */}
        <a
          href="/"
          className={cn(
            "flex items-center gap-2 rounded-md px-3 py-2 text-sm text-muted-foreground transition-colors hover:bg-sidebar-accent hover:text-sidebar-accent-foreground",
            collapsed && "justify-center px-2",
          )}
        >
          <ArrowLeft className="h-4 w-4 shrink-0" />
          {!collapsed && <span>Nexus</span>}
        </a>
      </div>
    </aside>
  );
}

/* ─── Mobile Sidebar (Sheet) ─── */

type CodexMobileSidebarProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
};

export function CodexMobileSidebar({
  open,
  onOpenChange,
}: CodexMobileSidebarProps) {
  const pathname = usePathname();
  const { isAdmin, canApprove, canRequest, canViewGovernance, isReadOnly } =
    useRole();
  const { unreadCount } = useNotifications();
  const menuSections = buildMenuSections(unreadCount);

  const isVisible = (item: MenuItem) => {
    if (!item.requiredRole) return true;
    if (item.requiredRole === "admin") return isAdmin;
    if (item.requiredRole === "approver") return canApprove;
    if (item.requiredRole === "requester") return canRequest;
    if (item.requiredRole === "governance") return canViewGovernance;
    if (item.requiredRole === "notReadOnly") return !isReadOnly;
    return true;
  };

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="left" className="w-72 p-0">
        <SheetHeader className="border-b px-4 py-3">
          <SheetTitle className="flex items-center gap-2 text-left text-base">
            <BookOpen className="h-5 w-5 text-violet-600 dark:text-violet-400" />
            Codex
          </SheetTitle>
        </SheetHeader>
        <ScrollArea className="h-[calc(100vh-57px)]">
          <SidebarNav
            collapsed={false}
            pathname={pathname}
            isVisible={isVisible}
            onNavigate={() => onOpenChange(false)}
            sections={menuSections}
          />
          <Separator className="my-2" />
          <div className="p-2">
            {/* Full page navigation to Platform root — <a> is intentional (cross-app) */}
            {/* eslint-disable-next-line @next/next/no-html-link-for-pages */}
            <a
              href="/"
              onClick={() => onOpenChange(false)}
              className="flex items-center gap-2 rounded-md px-3 py-2 text-sm text-muted-foreground transition-colors hover:bg-accent hover:text-accent-foreground"
            >
              <ArrowLeft className="h-4 w-4" />
              <span>Nexus</span>
            </a>
          </div>
        </ScrollArea>
      </SheetContent>
    </Sheet>
  );
}

/* ─── Shared Navigation ─── */

function SidebarNav({
  collapsed,
  pathname,
  isVisible,
  onNavigate,
  sections,
}: {
  collapsed: boolean;
  pathname: string;
  isVisible: (item: MenuItem) => boolean;
  onNavigate?: () => void;
  sections: MenuSection[];
}) {
  return (
    <nav className="flex flex-col gap-1 px-2">
      {sections.map((section) => {
        const visibleItems = section.items.filter(isVisible);
        if (visibleItems.length === 0) return null;

        return (
          <div key={section.title || "main"}>
            {section.title && (
              <>
                <Separator className="my-2" />
                {!collapsed && (
                  <p className="mb-1 px-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                    {section.title}
                  </p>
                )}
              </>
            )}
            {visibleItems.map((item) => {
              const isActive = pathname === item.href;
              const Icon = item.icon;

              const link = (
                <Link
                  href={item.href}
                  onClick={onNavigate}
                  className={cn(
                    "flex items-center gap-3 rounded-md px-3 py-2 text-sm transition-colors",
                    isActive
                      ? "bg-sidebar-accent font-medium text-sidebar-accent-foreground"
                      : "text-muted-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground",
                    collapsed && "justify-center px-2",
                  )}
                >
                  <Icon className="h-4 w-4 shrink-0" />
                  {!collapsed && (
                    <span className="flex flex-1 items-center justify-between">
                      {item.label}
                      {item.badge !== undefined && (
                        <span className="flex h-5 min-w-5 items-center justify-center rounded-full bg-destructive px-1.5 text-[10px] font-bold text-white">
                          {item.badge > 99 ? "99+" : item.badge}
                        </span>
                      )}
                    </span>
                  )}
                </Link>
              );

              if (collapsed) {
                return (
                  <Tooltip key={item.href}>
                    <TooltipTrigger
                      render={
                        <Link
                          href={item.href}
                          onClick={onNavigate}
                          className={cn(
                            "flex items-center justify-center rounded-md px-2 py-2 text-sm transition-colors",
                            isActive
                              ? "bg-sidebar-accent font-medium text-sidebar-accent-foreground"
                              : "text-muted-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground",
                          )}
                        />
                      }
                    >
                      <Icon className="h-4 w-4 shrink-0" />
                    </TooltipTrigger>
                    <TooltipContent side="right">{item.label}</TooltipContent>
                  </Tooltip>
                );
              }

              return <span key={item.href}>{link}</span>;
            })}
          </div>
        );
      })}
    </nav>
  );
}
