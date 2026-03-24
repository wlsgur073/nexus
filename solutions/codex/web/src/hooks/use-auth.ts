"use client";

import { createContext, useContext } from "react";

import type { Session } from "@nexus/codex-models";

interface AuthContextValue {
  session: Session | null;
  isLoading: boolean;
  isAuthenticated: boolean;
}

export const AuthContext = createContext<AuthContextValue>({
  session: null,
  isLoading: true,
  isAuthenticated: false,
});

export function useAuth() {
  return useContext(AuthContext);
}

export function useRole() {
  const { session } = useAuth();
  const role = session?.user.role ?? "READ_ONLY";
  return {
    role,
    isAdmin: role === "SYSTEM_ADMIN",
    canApprove: role === "SYSTEM_ADMIN" || role === "REVIEWER_APPROVER",
    canRequest:
      role === "SYSTEM_ADMIN" || role === "STD_MANAGER" || role === "REQUESTER",
    canManage: role === "SYSTEM_ADMIN",
    canManageCommonCodes: role === "SYSTEM_ADMIN" || role === "STD_MANAGER",
    canViewGovernance:
      role === "SYSTEM_ADMIN" ||
      role === "REVIEWER_APPROVER" ||
      role === "STD_MANAGER",
    canExecuteValidation: role === "SYSTEM_ADMIN" || role === "STD_MANAGER",
    isReadOnly: role === "READ_ONLY",
    isApproverView: role === "SYSTEM_ADMIN" || role === "REVIEWER_APPROVER",
  };
}
