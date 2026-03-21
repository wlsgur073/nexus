import type { BaseEntity } from "./base";
import type {
  ResolveStatus,
  Severity,
  TargetType,
  ValidationResultStatus,
  ValidationRuleType,
} from "./enums";

/** 검증 실행 — 검증 단위 실행 및 결과 집계 */
export interface ValidationExecution extends BaseEntity {
  executionId: number;
  execDatetime: Date;
  targetScope: string;
  ruleCount: number;
  checkCount: number;
  violationCount: number;
  resultStatus: ValidationResultStatus;
  executorId: number | null;
}

/** 검증 결과 — 개별 위반 항목 */
export interface ValidationResult extends BaseEntity {
  resultId: number;
  executionId: number;
  execDatetime: Date;
  targetType: TargetType;
  targetId: number;
  targetName: string;
  ruleType: ValidationRuleType;
  violationDesc: string;
  severity: Severity;
  resolveStatus: ResolveStatus;
  executorId: number | null;
}
