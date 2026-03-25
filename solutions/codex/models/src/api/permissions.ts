import type { UserRole } from "../entities";
import { delay } from "./helpers";

export interface MenuPermissionItem {
  permId: number;
  role: UserRole;
  menuCode: string;
  menuName: string;
  parentCode: string | null;
  canRead: boolean;
  canCreate: boolean;
  canUpdate: boolean;
  canDelete: boolean;
}

export interface MenuTreeNode {
  menuCode: string;
  menuName: string;
  children: MenuTreeNode[];
}

export interface UpdatePermissionsInput {
  permissions: Array<{
    menuCode: string;
    canRead: boolean;
    canCreate: boolean;
    canUpdate: boolean;
    canDelete: boolean;
  }>;
}

const MENU_TREE: MenuTreeNode[] = [
  {
    menuCode: "MAIN",
    menuName: "메인",
    children: [
      { menuCode: "DASHBOARD", menuName: "대시보드", children: [] },
      { menuCode: "EXPLORER", menuName: "표준 탐색기", children: [] },
      { menuCode: "NEW_REQUEST", menuName: "신규 신청", children: [] },
    ],
  },
  {
    menuCode: "GOVERNANCE",
    menuName: "거버넌스",
    children: [
      { menuCode: "APPROVALS", menuName: "승인 워크벤치", children: [] },
      { menuCode: "GOVERNANCE", menuName: "거버넌스 포털", children: [] },
      { menuCode: "VALIDATIONS", menuName: "검증 대시보드", children: [] },
      { menuCode: "AUDIT", menuName: "감사 추적", children: [] },
    ],
  },
  {
    menuCode: "DATA",
    menuName: "데이터",
    children: [
      {
        menuCode: "COMMON_CODES_VIEW",
        menuName: "공통코드 조회",
        children: [],
      },
    ],
  },
  {
    menuCode: "ADMIN",
    menuName: "관리",
    children: [
      {
        menuCode: "ADMIN_COMMON_CODES",
        menuName: "공통코드 관리",
        children: [],
      },
      { menuCode: "ADMIN_USERS", menuName: "사용자 관리", children: [] },
      { menuCode: "ADMIN_PERMISSIONS", menuName: "권한 관리", children: [] },
      {
        menuCode: "ADMIN_SYSTEM_CODES",
        menuName: "시스템 코드 관리",
        children: [],
      },
      { menuCode: "ADMIN_DB_SETTINGS", menuName: "DB 연결 설정", children: [] },
    ],
  },
];

const MOCK_PERMISSIONS: MenuPermissionItem[] = [
  // SYSTEM_ADMIN — full access
  {
    permId: 1,
    role: "SYSTEM_ADMIN",
    menuCode: "DASHBOARD",
    menuName: "대시보드",
    parentCode: "MAIN",
    canRead: true,
    canCreate: true,
    canUpdate: true,
    canDelete: true,
  },
  {
    permId: 2,
    role: "SYSTEM_ADMIN",
    menuCode: "EXPLORER",
    menuName: "표준 탐색기",
    parentCode: "MAIN",
    canRead: true,
    canCreate: true,
    canUpdate: true,
    canDelete: true,
  },
  {
    permId: 3,
    role: "SYSTEM_ADMIN",
    menuCode: "NEW_REQUEST",
    menuName: "신규 신청",
    parentCode: "MAIN",
    canRead: true,
    canCreate: true,
    canUpdate: true,
    canDelete: true,
  },
  {
    permId: 4,
    role: "SYSTEM_ADMIN",
    menuCode: "APPROVALS",
    menuName: "승인 워크벤치",
    parentCode: "GOVERNANCE",
    canRead: true,
    canCreate: true,
    canUpdate: true,
    canDelete: true,
  },
  {
    permId: 5,
    role: "SYSTEM_ADMIN",
    menuCode: "GOVERNANCE",
    menuName: "거버넌스 포털",
    parentCode: "GOVERNANCE",
    canRead: true,
    canCreate: false,
    canUpdate: false,
    canDelete: false,
  },
  {
    permId: 6,
    role: "SYSTEM_ADMIN",
    menuCode: "VALIDATIONS",
    menuName: "검증 대시보드",
    parentCode: "GOVERNANCE",
    canRead: true,
    canCreate: true,
    canUpdate: false,
    canDelete: false,
  },
  {
    permId: 7,
    role: "SYSTEM_ADMIN",
    menuCode: "AUDIT",
    menuName: "감사 추적",
    parentCode: "GOVERNANCE",
    canRead: true,
    canCreate: false,
    canUpdate: false,
    canDelete: false,
  },
  {
    permId: 8,
    role: "SYSTEM_ADMIN",
    menuCode: "COMMON_CODES_VIEW",
    menuName: "공통코드 조회",
    parentCode: "DATA",
    canRead: true,
    canCreate: false,
    canUpdate: false,
    canDelete: false,
  },
  {
    permId: 9,
    role: "SYSTEM_ADMIN",
    menuCode: "ADMIN_COMMON_CODES",
    menuName: "공통코드 관리",
    parentCode: "ADMIN",
    canRead: true,
    canCreate: true,
    canUpdate: true,
    canDelete: true,
  },
  {
    permId: 10,
    role: "SYSTEM_ADMIN",
    menuCode: "ADMIN_USERS",
    menuName: "사용자 관리",
    parentCode: "ADMIN",
    canRead: true,
    canCreate: true,
    canUpdate: true,
    canDelete: true,
  },
  {
    permId: 11,
    role: "SYSTEM_ADMIN",
    menuCode: "ADMIN_PERMISSIONS",
    menuName: "권한 관리",
    parentCode: "ADMIN",
    canRead: true,
    canCreate: false,
    canUpdate: true,
    canDelete: false,
  },
  {
    permId: 12,
    role: "SYSTEM_ADMIN",
    menuCode: "ADMIN_SYSTEM_CODES",
    menuName: "시스템 코드 관리",
    parentCode: "ADMIN",
    canRead: true,
    canCreate: true,
    canUpdate: true,
    canDelete: true,
  },
  {
    permId: 13,
    role: "SYSTEM_ADMIN",
    menuCode: "ADMIN_DB_SETTINGS",
    menuName: "DB 연결 설정",
    parentCode: "ADMIN",
    canRead: true,
    canCreate: false,
    canUpdate: true,
    canDelete: false,
  },
  // REVIEWER_APPROVER
  {
    permId: 14,
    role: "REVIEWER_APPROVER",
    menuCode: "DASHBOARD",
    menuName: "대시보드",
    parentCode: "MAIN",
    canRead: true,
    canCreate: false,
    canUpdate: false,
    canDelete: false,
  },
  {
    permId: 15,
    role: "REVIEWER_APPROVER",
    menuCode: "EXPLORER",
    menuName: "표준 탐색기",
    parentCode: "MAIN",
    canRead: true,
    canCreate: false,
    canUpdate: false,
    canDelete: false,
  },
  {
    permId: 16,
    role: "REVIEWER_APPROVER",
    menuCode: "APPROVALS",
    menuName: "승인 워크벤치",
    parentCode: "GOVERNANCE",
    canRead: true,
    canCreate: false,
    canUpdate: true,
    canDelete: false,
  },
  {
    permId: 17,
    role: "REVIEWER_APPROVER",
    menuCode: "GOVERNANCE",
    menuName: "거버넌스 포털",
    parentCode: "GOVERNANCE",
    canRead: true,
    canCreate: false,
    canUpdate: false,
    canDelete: false,
  },
  {
    permId: 18,
    role: "REVIEWER_APPROVER",
    menuCode: "VALIDATIONS",
    menuName: "검증 대시보드",
    parentCode: "GOVERNANCE",
    canRead: true,
    canCreate: false,
    canUpdate: false,
    canDelete: false,
  },
  {
    permId: 19,
    role: "REVIEWER_APPROVER",
    menuCode: "AUDIT",
    menuName: "감사 추적",
    parentCode: "GOVERNANCE",
    canRead: true,
    canCreate: false,
    canUpdate: false,
    canDelete: false,
  },
  {
    permId: 20,
    role: "REVIEWER_APPROVER",
    menuCode: "COMMON_CODES_VIEW",
    menuName: "공통코드 조회",
    parentCode: "DATA",
    canRead: true,
    canCreate: false,
    canUpdate: false,
    canDelete: false,
  },
];

export async function getPermissionsByRole(
  role: UserRole,
): Promise<MenuPermissionItem[]> {
  await delay();
  return MOCK_PERMISSIONS.filter((p) => p.role === role);
}

export async function updatePermissions(
  role: UserRole,
  input: UpdatePermissionsInput,
): Promise<MenuPermissionItem[]> {
  await delay(400);
  for (const perm of input.permissions) {
    const existing = MOCK_PERMISSIONS.find(
      (p) => p.role === role && p.menuCode === perm.menuCode,
    );
    if (existing) {
      existing.canRead = perm.canRead;
      existing.canCreate = perm.canCreate;
      existing.canUpdate = perm.canUpdate;
      existing.canDelete = perm.canDelete;
    }
  }
  return MOCK_PERMISSIONS.filter((p) => p.role === role);
}

export async function getMenuTree(): Promise<MenuTreeNode[]> {
  await delay();
  return MENU_TREE;
}
