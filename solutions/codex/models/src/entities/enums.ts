// ── 표준 상태 ──
export type StandardStatus =
  | "UNREGISTERED"
  | "PENDING"
  | "REVIEW"
  | "APPROVED"
  | "REJECTED"
  | "FEEDBACK"
  | "CANCELLED"
  | "BASELINE"
  | "DELETED";

// ── 신청 상태 ──
export type RequestStatus =
  | "PENDING"
  | "REVIEW"
  | "APPROVED"
  | "REJECTED"
  | "FEEDBACK"
  | "CANCELLED"
  | "FEEDBACK_RESOLVED";

// ── 초안 상태 ──
export type DraftStatus =
  | "EDITING"
  | "READY"
  | "SUBMITTED"
  | "DISCARDED"
  | "EXPIRED";

// ── 신청 유형 ──
export type RequestType = "CREATE" | "UPDATE" | "DELETE";

// ── 대상 유형 ──
export type TargetType = "WORD" | "DOMAIN" | "TERM" | "COMMON_CODE";

// ── 사용자 역할 ──
export type UserRole =
  | "SYSTEM_ADMIN"
  | "REVIEWER_APPROVER"
  | "STD_MANAGER"
  | "REQUESTER"
  | "READ_ONLY";

// ── 사용자 상태 ──
export type UserStatus = "ACTIVE" | "INACTIVE";

// ── 데이터 타입 ──
export type DataType = "VARCHAR" | "CHAR" | "NUMBER" | "DATE" | "CLOB" | "BLOB";

// ── 영향도 수준 ──
export type ImpactLevel = "HIGH" | "MEDIUM" | "LOW";

// ── 코멘트 대상 ──
export type CommentTarget = "DRAFT" | "REQUEST";

// ── 검증 결과 상태 ──
export type ValidationResultStatus = "CLEAN" | "VIOLATION_FOUND" | "PARTIAL_VIOLATION";

// ── 검증 규칙 유형 ──
export type ValidationRuleType =
  | "NAMING_RULE"
  | "FORBIDDEN_WORD"
  | "DUPLICATE"
  | "REQUIRED_FIELD"
  | "LENGTH_LIMIT";

// ── 심각도 ──
export type Severity = "HIGH" | "MEDIUM" | "LOW";

// ── 처리 상태 ──
export type ResolveStatus = "UNRESOLVED" | "IN_PROGRESS" | "RESOLVED";

// ── 감사 작업 유형 ──
export type ActionType =
  | "REQUEST"
  | "REVIEW"
  | "APPROVE"
  | "REJECT"
  | "CANCEL"
  | "FEEDBACK"
  | "CREATE"
  | "UPDATE"
  | "DELETE";

// ── 알림 유형 ──
export type NotificationType =
  | "REQUEST_STATUS_CHANGED"
  | "APPROVAL_REQUIRED"
  | "FEEDBACK_RECEIVED"
  | "COMMENT_ADDED"
  | "DRAFT_SHARED"
  | "VALIDATION_COMPLETED"
  | "SYSTEM_ANNOUNCEMENT";

// ── 알림 우선순위 ──
export type NotificationPriority = "HIGH" | "NORMAL" | "LOW";

// ── DB 유형 ──
export type DbType = "ORACLE" | "POSTGRESQL" | "MYSQL" | "MSSQL";

// ── SSH 인증 방식 ──
export type SshAuthType = "PASSWORD" | "SSH_KEY";
