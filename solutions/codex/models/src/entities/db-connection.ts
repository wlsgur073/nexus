import type { BaseEntity } from "./base";
import type { DbType, SshAuthType } from "./enums";

/** DB연결 — 표준관리 DB 접속 정보 및 SSH 터널링 설정 */
export interface DatabaseConnection extends BaseEntity {
  connectionId: number;
  dbType: DbType;
  host: string;
  port: number;
  databaseName: string;
  username: string;
  password: string;
  schema: string | null;
  charset: string;
  sshEnabled: boolean;
  sshHost: string | null;
  sshPort: number | null;
  sshUsername: string | null;
  sshAuthType: SshAuthType | null;
  sshPassword: string | null;
  sshKeyPath: string | null;
  isActive: boolean;
}
