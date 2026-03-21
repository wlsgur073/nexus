"use client";

import { useEffect, useMemo, useState } from "react";

import { getSession } from "@nexus/codex-models";
import type { Session } from "@nexus/codex-models";

import { AuthContext } from "@/hooks/use-auth";

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [session, setSession] = useState<Session | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    getSession()
      .then(setSession)
      .finally(() => setIsLoading(false));
  }, []);

  const value = useMemo(
    () => ({
      session,
      isLoading,
      isAuthenticated: !!session,
    }),
    [session, isLoading],
  );

  return <AuthContext value={value}>{children}</AuthContext>;
}
