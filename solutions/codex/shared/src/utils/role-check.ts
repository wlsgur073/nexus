import type { UserRole } from "@nexus/codex-models";
import { ROLE_MENU_ACCESS } from "../constants/menu";
import type { MenuCode } from "../constants/menu";

/** 역할이 특정 메뉴에 접근 가능한지 확인 */
export function hasPermission(role: UserRole, menuCode: MenuCode): boolean {
  const allowed = ROLE_MENU_ACCESS[role];
  return allowed?.includes(menuCode) ?? false;
}

/** 역할이 신청 권한을 가지는지 확인 */
export function canRequest(role: UserRole): boolean {
  return hasPermission(role, "NEW_REQUEST");
}

/** 역할이 승인 권한을 가지는지 확인 */
export function canApprove(role: UserRole): boolean {
  return hasPermission(role, "APPROVALS");
}

/** 역할이 관리자 메뉴에 접근 가능한지 확인 */
export function isAdmin(role: UserRole): boolean {
  return role === "SYSTEM_ADMIN";
}

/** 역할별 접근 가능한 메뉴 코드 목록 반환 */
export function getAccessibleMenus(role: UserRole): readonly MenuCode[] {
  return ROLE_MENU_ACCESS[role] ?? [];
}
