import type { UserRole, UserStatus } from "../entities";
import { baseFields, delay, paginate } from "./helpers";
import type { PaginatedResponse, PaginationParams } from "./helpers";

export interface UserItem {
  userId: number;
  loginId: string;
  userName: string;
  role: UserRole;
  department: string | null;
  email: string | null;
  lastLogin: Date | null;
  status: UserStatus;
  createdAt: Date;
}

export interface UserListParams extends PaginationParams {
  keyword?: string;
  role?: UserRole;
  status?: UserStatus;
}

export interface CreateUserInput {
  loginId: string;
  userName: string;
  password: string;
  role: UserRole;
  department?: string;
  email?: string;
}

export interface UpdateUserInput {
  userName?: string;
  role?: UserRole;
  department?: string;
  email?: string;
}

const MOCK_USERS: UserItem[] = [
  {
    userId: 1,
    loginId: "admin",
    userName: "시스템관리자",
    role: "SYSTEM_ADMIN",
    department: "IT기획팀",
    email: "admin@nexus.io",
    lastLogin: new Date("2026-03-25T09:00:00"),
    status: "ACTIVE",
    createdAt: new Date("2025-01-01"),
  },
  {
    userId: 2,
    loginId: "reviewer01",
    userName: "김검토",
    role: "REVIEWER_APPROVER",
    department: "데이터분석팀",
    email: "reviewer01@nexus.io",
    lastLogin: new Date("2026-03-24T14:30:00"),
    status: "ACTIVE",
    createdAt: new Date("2025-03-01"),
  },
  {
    userId: 3,
    loginId: "std_mgr01",
    userName: "이표준",
    role: "STD_MANAGER",
    department: "IT기획팀",
    email: "std_mgr01@nexus.io",
    lastLogin: new Date("2026-03-25T08:00:00"),
    status: "ACTIVE",
    createdAt: new Date("2025-03-15"),
  },
  {
    userId: 4,
    loginId: "requester01",
    userName: "박신청",
    role: "REQUESTER",
    department: "개발1팀",
    email: "requester01@nexus.io",
    lastLogin: new Date("2026-03-23T17:00:00"),
    status: "ACTIVE",
    createdAt: new Date("2025-06-01"),
  },
  {
    userId: 5,
    loginId: "viewer01",
    userName: "최조회",
    role: "READ_ONLY",
    department: "개발2팀",
    email: "viewer01@nexus.io",
    lastLogin: null,
    status: "INACTIVE",
    createdAt: new Date("2025-08-01"),
  },
];

export async function getUserList(
  params: UserListParams = {},
): Promise<PaginatedResponse<UserItem>> {
  await delay();
  let filtered = [...MOCK_USERS];
  if (params.keyword) {
    const kw = params.keyword.toLowerCase();
    filtered = filtered.filter(
      (u) =>
        u.loginId.toLowerCase().includes(kw) ||
        u.userName.toLowerCase().includes(kw) ||
        u.email?.toLowerCase().includes(kw),
    );
  }
  if (params.role) {
    filtered = filtered.filter((u) => u.role === params.role);
  }
  if (params.status) {
    filtered = filtered.filter((u) => u.status === params.status);
  }
  return paginate(filtered, params.page, params.pageSize);
}

export async function getUserById(userId: number): Promise<UserItem | null> {
  await delay();
  return MOCK_USERS.find((u) => u.userId === userId) ?? null;
}

export async function createUser(input: CreateUserInput): Promise<UserItem> {
  await delay(400);
  const newUser: UserItem = {
    userId: MOCK_USERS.length + 1,
    loginId: input.loginId,
    userName: input.userName,
    role: input.role,
    department: input.department ?? null,
    email: input.email ?? null,
    lastLogin: null,
    status: "ACTIVE",
    createdAt: new Date(),
  };
  MOCK_USERS.push(newUser);
  return newUser;
}

export async function updateUser(
  userId: number,
  input: UpdateUserInput,
): Promise<UserItem> {
  await delay(400);
  const user = MOCK_USERS.find((u) => u.userId === userId);
  if (!user) throw new Error(`User ${userId} not found`);
  if (input.userName) user.userName = input.userName;
  if (input.role) user.role = input.role;
  if (input.department !== undefined)
    user.department = input.department ?? null;
  if (input.email !== undefined) user.email = input.email ?? null;
  return user;
}

export async function toggleUserStatus(userId: number): Promise<UserItem> {
  await delay(400);
  const user = MOCK_USERS.find((u) => u.userId === userId);
  if (!user) throw new Error(`User ${userId} not found`);
  user.status = user.status === "ACTIVE" ? "INACTIVE" : "ACTIVE";
  return user;
}

export async function deleteUser(userId: number): Promise<void> {
  await delay(400);
  const idx = MOCK_USERS.findIndex((u) => u.userId === userId);
  if (idx === -1) throw new Error(`User ${userId} not found`);
  MOCK_USERS.splice(idx, 1);
}
