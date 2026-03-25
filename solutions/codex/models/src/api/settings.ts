import type { DbType, SshAuthType } from "../entities";
import { delay } from "./helpers";

export interface DbConnectionInfo {
  connectionId: number;
  dbType: DbType;
  host: string;
  port: number;
  databaseName: string;
  username: string;
  schema: string | null;
  charset: string;
  isActive: boolean;
}

export interface UpdateDbConnectionInput {
  dbType: DbType;
  host: string;
  port: number;
  databaseName: string;
  username: string;
  password: string;
  schema?: string;
  charset?: string;
}

export interface DbTestResult {
  success: boolean;
  message: string;
  responseTime: number;
  serverVersion: string | null;
}

export interface SshSettingsInfo {
  sshEnabled: boolean;
  sshHost: string | null;
  sshPort: number | null;
  sshUsername: string | null;
  sshAuthType: SshAuthType | null;
}

export interface UpdateSshSettingsInput {
  sshEnabled: boolean;
  sshHost?: string;
  sshPort?: number;
  sshUsername?: string;
  sshAuthType?: SshAuthType;
  sshPassword?: string;
  sshKeyPath?: string;
}

export interface SshTestResult {
  success: boolean;
  message: string;
  responseTime: number;
}

const MOCK_DB_CONNECTION: DbConnectionInfo = {
  connectionId: 1,
  dbType: "POSTGRESQL",
  host: "localhost",
  port: 5432,
  databaseName: "nexus_codex",
  username: "codex_admin",
  schema: "public",
  charset: "UTF-8",
  isActive: true,
};

const MOCK_SSH_SETTINGS: SshSettingsInfo = {
  sshEnabled: false,
  sshHost: null,
  sshPort: null,
  sshUsername: null,
  sshAuthType: null,
};

export async function getDbConnection(): Promise<DbConnectionInfo> {
  await delay();
  return { ...MOCK_DB_CONNECTION };
}

export async function updateDbConnection(
  input: UpdateDbConnectionInput,
): Promise<DbConnectionInfo> {
  await delay(400);
  MOCK_DB_CONNECTION.dbType = input.dbType;
  MOCK_DB_CONNECTION.host = input.host;
  MOCK_DB_CONNECTION.port = input.port;
  MOCK_DB_CONNECTION.databaseName = input.databaseName;
  MOCK_DB_CONNECTION.username = input.username;
  MOCK_DB_CONNECTION.schema = input.schema ?? null;
  MOCK_DB_CONNECTION.charset = input.charset ?? "UTF-8";
  return { ...MOCK_DB_CONNECTION };
}

export async function testDbConnection(): Promise<DbTestResult> {
  await delay(800);
  return {
    success: true,
    message: "Connection successful",
    responseTime: 45,
    serverVersion: "PostgreSQL 16.2",
  };
}

export async function getSshSettings(): Promise<SshSettingsInfo> {
  await delay();
  return { ...MOCK_SSH_SETTINGS };
}

export async function updateSshSettings(
  input: UpdateSshSettingsInput,
): Promise<SshSettingsInfo> {
  await delay(400);
  MOCK_SSH_SETTINGS.sshEnabled = input.sshEnabled;
  MOCK_SSH_SETTINGS.sshHost = input.sshHost ?? null;
  MOCK_SSH_SETTINGS.sshPort = input.sshPort ?? null;
  MOCK_SSH_SETTINGS.sshUsername = input.sshUsername ?? null;
  MOCK_SSH_SETTINGS.sshAuthType = input.sshAuthType ?? null;
  return { ...MOCK_SSH_SETTINGS };
}

export async function testSshConnection(): Promise<SshTestResult> {
  await delay(800);
  if (!MOCK_SSH_SETTINGS.sshEnabled) {
    return {
      success: false,
      message: "SSH tunnel is not enabled",
      responseTime: 0,
    };
  }
  return {
    success: true,
    message: "SSH tunnel established",
    responseTime: 120,
  };
}
