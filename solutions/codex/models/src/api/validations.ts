import type {
  ResolveStatus,
  Severity,
  TargetType,
  ValidationRuleType,
} from "../entities";
import { delay } from "./helpers";
import type { PaginatedResponse, PaginationParams } from "./helpers";

export interface ValidationRule {
  ruleId: number;
  name: string;
  description: string;
  severity: Severity;
  ruleType: ValidationRuleType;
  isActive: boolean;
}

export interface ValidationSummary {
  totalViolations: number;
  resolvedRate: number;
  lastExecutionDate: Date | null;
  severityCounts: {
    HIGH: number;
    MEDIUM: number;
    LOW: number;
  };
}

export interface ValidationTrendItem {
  month: string;
  high: number;
  medium: number;
  low: number;
}

export interface ValidationHistoryItem {
  executionId: number;
  executedAt: Date;
  executedBy: string;
  totalViolations: number;
  status: "CLEAN" | "VIOLATION_FOUND" | "PARTIAL_VIOLATION";
}

export interface ExecuteValidationInput {
  targetScope?: "ALL" | "WORD" | "DOMAIN" | "TERM";
  ruleTypes?: ValidationRuleType[];
}

export interface ExecuteValidationResponse {
  executionId: number;
  status: "RUNNING";
  estimatedDuration: number;
}

export interface ViolationItem {
  resultId: number;
  itemName: string;
  targetType: TargetType;
  ruleName: string;
  severity: Severity;
  resolveStatus: ResolveStatus;
  violationDesc: string;
}

export interface ViolationListParams extends PaginationParams {
  executionId?: string;
  ruleType?: ValidationRuleType;
  targetType?: TargetType;
  severity?: Severity;
  resolveStatus?: ResolveStatus;
  keyword?: string;
}

export interface BatchCorrectInput {
  resultIds: number[];
  reason?: string;
}

export interface BatchCorrectResponse {
  processed: number;
  requestIds: number[];
}

const MOCK_VIOLATIONS: ViolationItem[] = [
  {
    resultId: 1,
    itemName: "고객ID",
    targetType: "TERM",
    ruleName: "영문약어 필수",
    severity: "HIGH",
    resolveStatus: "UNRESOLVED",
    violationDesc: "영문약어(abbrName)가 입력되지 않았습니다.",
  },
  {
    resultId: 2,
    itemName: "거래코드",
    targetType: "TERM",
    ruleName: "정의 최소 길이",
    severity: "MEDIUM",
    resolveStatus: "UNRESOLVED",
    violationDesc: "정의가 50자 미만입니다.",
  },
  {
    resultId: 3,
    itemName: "계좌번호",
    targetType: "TERM",
    ruleName: "물리명 생성 규칙",
    severity: "HIGH",
    resolveStatus: "IN_PROGRESS",
    violationDesc: "물리명이 생성되지 않았습니다.",
  },
  {
    resultId: 4,
    itemName: "잔액",
    targetType: "WORD",
    ruleName: "영문명 필수",
    severity: "MEDIUM",
    resolveStatus: "RESOLVED",
    violationDesc: "영문명(engName)이 입력되지 않았습니다.",
  },
  {
    resultId: 5,
    itemName: "이자율",
    targetType: "TERM",
    ruleName: "구성 단어 연결 필수",
    severity: "HIGH",
    resolveStatus: "UNRESOLVED",
    violationDesc: "구성 단어가 연결되지 않았습니다.",
  },
];

export async function getValidationSummary(): Promise<ValidationSummary> {
  await delay();
  return {
    totalViolations: 656,
    resolvedRate: 32.4,
    lastExecutionDate: new Date("2026-03-20T14:30:00"),
    severityCounts: { HIGH: 287, MEDIUM: 241, LOW: 128 },
  };
}

export async function getValidationTrend(): Promise<ValidationTrendItem[]> {
  await delay();
  return [
    { month: "2025-10", high: 52, medium: 38, low: 24 },
    { month: "2025-11", high: 47, medium: 41, low: 19 },
    { month: "2025-12", high: 63, medium: 35, low: 28 },
    { month: "2026-01", high: 58, medium: 44, low: 22 },
    { month: "2026-02", high: 45, medium: 39, low: 18 },
    { month: "2026-03", high: 22, medium: 44, low: 17 },
  ];
}

export async function getValidationRules(): Promise<ValidationRule[]> {
  await delay();
  return [
    {
      ruleId: 1,
      name: "영문약어 필수",
      description:
        "표준단어/용어에 영문약어(abbrName)가 반드시 입력되어야 합니다.",
      severity: "HIGH",
      ruleType: "REQUIRED_FIELD",
      isActive: true,
    },
    {
      ruleId: 2,
      name: "정의 최소 길이",
      description: "정의(definition)는 최소 50자 이상이어야 합니다.",
      severity: "MEDIUM",
      ruleType: "LENGTH_LIMIT",
      isActive: true,
    },
    {
      ruleId: 3,
      name: "물리명 생성 규칙",
      description: "표준용어에는 물리명(physicalName)이 생성되어야 합니다.",
      severity: "HIGH",
      ruleType: "NAMING_RULE",
      isActive: true,
    },
    {
      ruleId: 4,
      name: "영문명 필수",
      description: "모든 표준 항목에 영문명(engName)이 입력되어야 합니다.",
      severity: "MEDIUM",
      ruleType: "REQUIRED_FIELD",
      isActive: true,
    },
    {
      ruleId: 5,
      name: "중복 금지",
      description: "동일한 한글명을 가진 항목이 중복 등록될 수 없습니다.",
      severity: "HIGH",
      ruleType: "DUPLICATE",
      isActive: true,
    },
    {
      ruleId: 6,
      name: "금지어 포함 금지",
      description: "특수문자, 금지된 약어가 포함될 수 없습니다.",
      severity: "LOW",
      ruleType: "FORBIDDEN_WORD",
      isActive: true,
    },
  ];
}

export async function getValidationHistory(
  params: PaginationParams = {},
): Promise<PaginatedResponse<ValidationHistoryItem>> {
  await delay();
  const items: ValidationHistoryItem[] = [
    {
      executionId: 10,
      executedAt: new Date("2026-03-20T14:30:00"),
      executedBy: "김관리",
      totalViolations: 656,
      status: "VIOLATION_FOUND",
    },
    {
      executionId: 9,
      executedAt: new Date("2026-03-13T10:00:00"),
      executedBy: "김관리",
      totalViolations: 698,
      status: "VIOLATION_FOUND",
    },
    {
      executionId: 8,
      executedAt: new Date("2026-03-06T09:15:00"),
      executedBy: "이표준",
      totalViolations: 721,
      status: "VIOLATION_FOUND",
    },
    {
      executionId: 7,
      executedAt: new Date("2026-02-27T14:00:00"),
      executedBy: "김관리",
      totalViolations: 745,
      status: "VIOLATION_FOUND",
    },
    {
      executionId: 6,
      executedAt: new Date("2026-02-20T11:30:00"),
      executedBy: "이표준",
      totalViolations: 0,
      status: "CLEAN",
    },
  ];
  const page = params.page ?? 1;
  const pageSize = params.pageSize ?? 10;
  return {
    items: items.slice((page - 1) * pageSize, page * pageSize),
    total: items.length,
    page,
    pageSize,
    totalPages: Math.ceil(items.length / pageSize),
  };
}

export async function executeValidation(
  input: ExecuteValidationInput = {},
): Promise<ExecuteValidationResponse> {
  await delay(500);
  void input;
  return {
    executionId: 11,
    status: "RUNNING",
    estimatedDuration: 30,
  };
}

export async function getViolationList(
  params: ViolationListParams = {},
): Promise<PaginatedResponse<ViolationItem>> {
  await delay();
  let filtered = [...MOCK_VIOLATIONS];
  if (params.severity) {
    filtered = filtered.filter((v) => v.severity === params.severity);
  }
  if (params.targetType) {
    filtered = filtered.filter((v) => v.targetType === params.targetType);
  }
  if (params.resolveStatus) {
    filtered = filtered.filter((v) => v.resolveStatus === params.resolveStatus);
  }
  if (params.keyword) {
    const kw = params.keyword.toLowerCase();
    filtered = filtered.filter((v) => v.itemName.toLowerCase().includes(kw));
  }
  const page = params.page ?? 1;
  const pageSize = params.pageSize ?? 10;
  return {
    items: filtered.slice((page - 1) * pageSize, page * pageSize),
    total: filtered.length,
    page,
    pageSize,
    totalPages: Math.ceil(filtered.length / pageSize),
  };
}

export async function batchCorrectViolations(
  input: BatchCorrectInput,
): Promise<BatchCorrectResponse> {
  await delay(800);
  return {
    processed: input.resultIds.length,
    requestIds: input.resultIds.map((id) => id + 1000),
  };
}
