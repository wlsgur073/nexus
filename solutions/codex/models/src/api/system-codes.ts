import { delay, paginate } from "./helpers";
import type { PaginatedResponse, PaginationParams } from "./helpers";

export interface SystemCodeItem {
  sysCodeId: number;
  category: string;
  code: string;
  codeName: string;
  description: string | null;
  isProtected: boolean;
  regDate: Date;
}

export interface SystemCodeListParams extends PaginationParams {
  keyword?: string;
  category?: string;
}

export interface CreateSystemCodeInput {
  category: string;
  code: string;
  codeName: string;
  description?: string;
}

export interface UpdateSystemCodeInput {
  codeName?: string;
  description?: string;
}

const MOCK_SYSTEM_CODES: SystemCodeItem[] = [
  {
    sysCodeId: 1,
    category: "STANDARD_STATUS",
    code: "UNREGISTERED",
    codeName: "미등록",
    description: "표준으로 등록되지 않은 상태",
    isProtected: true,
    regDate: new Date("2025-01-01"),
  },
  {
    sysCodeId: 2,
    category: "STANDARD_STATUS",
    code: "PENDING",
    codeName: "신청중",
    description: "거버넌스 신청이 진행중인 상태",
    isProtected: true,
    regDate: new Date("2025-01-01"),
  },
  {
    sysCodeId: 3,
    category: "STANDARD_STATUS",
    code: "APPROVED",
    codeName: "승인",
    description: "거버넌스 승인 완료",
    isProtected: true,
    regDate: new Date("2025-01-01"),
  },
  {
    sysCodeId: 4,
    category: "STANDARD_STATUS",
    code: "BASELINE",
    codeName: "표준",
    description: "원장에 등록된 표준 상태",
    isProtected: true,
    regDate: new Date("2025-01-01"),
  },
  {
    sysCodeId: 5,
    category: "REQUEST_TYPE",
    code: "CREATE",
    codeName: "신규",
    description: "신규 등록 신청",
    isProtected: true,
    regDate: new Date("2025-01-01"),
  },
  {
    sysCodeId: 6,
    category: "REQUEST_TYPE",
    code: "UPDATE",
    codeName: "변경",
    description: "기존 표준 변경 신청",
    isProtected: true,
    regDate: new Date("2025-01-01"),
  },
  {
    sysCodeId: 7,
    category: "REQUEST_TYPE",
    code: "DELETE",
    codeName: "삭제",
    description: "표준 삭제 신청",
    isProtected: true,
    regDate: new Date("2025-01-01"),
  },
  {
    sysCodeId: 8,
    category: "DATA_TYPE",
    code: "VARCHAR",
    codeName: "가변문자열",
    description: "가변 길이 문자열 타입",
    isProtected: false,
    regDate: new Date("2025-01-01"),
  },
  {
    sysCodeId: 9,
    category: "DATA_TYPE",
    code: "NUMBER",
    codeName: "숫자",
    description: "숫자 타입",
    isProtected: false,
    regDate: new Date("2025-01-01"),
  },
  {
    sysCodeId: 10,
    category: "DATA_TYPE",
    code: "DATE",
    codeName: "일자",
    description: "날짜 타입",
    isProtected: false,
    regDate: new Date("2025-01-01"),
  },
];

const SYSTEM_CODE_CATEGORIES = [
  "STANDARD_STATUS",
  "REQUEST_TYPE",
  "DATA_TYPE",
  "DOMAIN_TYPE",
  "TARGET_TYPE",
];

export async function getSystemCodeList(
  params: SystemCodeListParams = {},
): Promise<PaginatedResponse<SystemCodeItem>> {
  await delay();
  let filtered = [...MOCK_SYSTEM_CODES];
  if (params.keyword) {
    const kw = params.keyword.toLowerCase();
    filtered = filtered.filter(
      (c) =>
        c.code.toLowerCase().includes(kw) ||
        c.codeName.toLowerCase().includes(kw),
    );
  }
  if (params.category) {
    filtered = filtered.filter((c) => c.category === params.category);
  }
  return paginate(filtered, params.page, params.pageSize);
}

export async function getSystemCodeById(
  sysCodeId: number,
): Promise<SystemCodeItem | null> {
  await delay();
  return MOCK_SYSTEM_CODES.find((c) => c.sysCodeId === sysCodeId) ?? null;
}

export async function createSystemCode(
  input: CreateSystemCodeInput,
): Promise<SystemCodeItem> {
  await delay(400);
  const newCode: SystemCodeItem = {
    sysCodeId: MOCK_SYSTEM_CODES.length + 1,
    category: input.category,
    code: input.code,
    codeName: input.codeName,
    description: input.description ?? null,
    isProtected: false,
    regDate: new Date(),
  };
  MOCK_SYSTEM_CODES.push(newCode);
  return newCode;
}

export async function updateSystemCode(
  sysCodeId: number,
  input: UpdateSystemCodeInput,
): Promise<SystemCodeItem> {
  await delay(400);
  const code = MOCK_SYSTEM_CODES.find((c) => c.sysCodeId === sysCodeId);
  if (!code) throw new Error(`SystemCode ${sysCodeId} not found`);
  if (code.isProtected)
    throw new Error("Protected system codes cannot be modified");
  if (input.codeName) code.codeName = input.codeName;
  if (input.description !== undefined)
    code.description = input.description ?? null;
  return code;
}

export async function deleteSystemCode(sysCodeId: number): Promise<void> {
  await delay(400);
  const idx = MOCK_SYSTEM_CODES.findIndex((c) => c.sysCodeId === sysCodeId);
  if (idx === -1) throw new Error(`SystemCode ${sysCodeId} not found`);
  if (MOCK_SYSTEM_CODES[idx].isProtected) {
    throw new Error("Protected system codes cannot be deleted");
  }
  MOCK_SYSTEM_CODES.splice(idx, 1);
}

export async function getSystemCodeCategories(): Promise<string[]> {
  await delay();
  return SYSTEM_CODE_CATEGORIES;
}
