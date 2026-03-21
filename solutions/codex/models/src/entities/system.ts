import type { BaseEntity } from "./base";
import type {
  ActionType,
  NotificationPriority,
  NotificationType,
  TargetType,
  UserRole,
  UserStatus,
} from "./enums";

/** 사용자 — 시스템 사용자 계정 (RBAC) */
export interface User extends BaseEntity {
  userId: number;
  loginId: string;
  userName: string;
  password: string;
  role: UserRole;
  department: string | null;
  email: string | null;
  lastLogin: Date | null;
  status: UserStatus;
}

/** 메뉴권한 — 역할별 메뉴 CRUD 권한 */
export interface MenuPermission extends BaseEntity {
  permId: number;
  role: UserRole;
  menuCode: string;
  canRead: boolean;
  canCreate: boolean;
  canUpdate: boolean;
  canDelete: boolean;
}

/** 시스템코드 — 도메인유형, 표준상태코드 등 시스템 기준값 */
export interface SystemCode extends BaseEntity {
  sysCodeId: number;
  category: string;
  code: string;
  codeName: string;
  description: string | null;
  isProtected: boolean;
  regDate: Date;
}

/** 알림 — 실시간 알림 (신청 상태 변경, 코멘트 등) */
export interface Notification extends BaseEntity {
  notificationId: number;
  recipientId: number;
  type: NotificationType;
  title: string;
  message: string;
  referenceType: string | null;
  referenceId: number | null;
  isRead: boolean;
  readAt: Date | null;
  priority: NotificationPriority;
}

/** 감사이력 — 모든 상태 전환의 불변 로그 */
export interface AuditLog {
  logId: number;
  logDatetime: Date;
  targetType: TargetType;
  targetName: string;
  targetId: number | null;
  actionType: ActionType;
  stateFrom: string | null;
  stateTo: string | null;
  actorId: number;
  actorRole: string | null;
  comment: string | null;
  requestId: number | null;
}
