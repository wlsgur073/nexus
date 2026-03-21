"use client";

import { useState } from "react";
import { CodexHeader } from "./codex-header";
import { CodexSidebar, CodexMobileSidebar } from "./codex-sidebar";

export function CodexLayout({ children }: { children: React.ReactNode }) {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  function handleToggleSidebar() {
    if (window.innerWidth < 1024) {
      setMobileOpen(true);
    } else {
      setSidebarCollapsed((prev) => !prev);
    }
  }

  return (
    <>
      <CodexHeader onToggleSidebar={handleToggleSidebar} />
      <div className="flex flex-1">
        <CodexSidebar collapsed={sidebarCollapsed} />
        <CodexMobileSidebar open={mobileOpen} onOpenChange={setMobileOpen} />
        <main className="flex-1 overflow-auto">
          {children}
        </main>
      </div>
    </>
  );
}
