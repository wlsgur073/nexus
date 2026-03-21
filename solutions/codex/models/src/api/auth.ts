import type { User } from "../entities";
import { baseFields, delay } from "./helpers";

export interface LoginRequest {
  loginId: string;
  password: string;
}

export interface Session {
  user: Omit<User, "password">;
  token: string;
  expiresAt: Date;
}

const MOCK_USER: User = {
  userId: 1,
  loginId: "admin",
  userName: "김관리",
  password: "",
  role: "SYSTEM_ADMIN",
  department: "데이터관리팀",
  email: "admin@nexus.io",
  lastLogin: new Date(),
  status: "ACTIVE",
  ...baseFields(),
};

export async function loginApi(req: LoginRequest): Promise<Session> {
  await delay(500);
  const { password, ...userWithoutPassword } = MOCK_USER;
  return {
    user: { ...userWithoutPassword, loginId: req.loginId },
    token: "mock-jwt-token-" + Date.now(),
    expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000),
  };
}

export async function logoutApi(): Promise<void> {
  await delay(200);
}

export async function getSession(): Promise<Session | null> {
  await delay(200);
  const { password, ...userWithoutPassword } = MOCK_USER;
  return {
    user: userWithoutPassword,
    token: "mock-jwt-token",
    expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000),
  };
}
