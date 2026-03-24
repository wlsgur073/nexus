import type { StandardStatus } from "../entities";
import { delay } from "./helpers";
import type { PaginatedResponse, PaginationParams } from "./helpers";

export interface CommonCodeGroupItem {
  groupId: number;
  groupCode: string;
  groupName: string;
  description: string | null;
  codeCount: number;
  status: StandardStatus;
  regDate: Date;
}

export interface CommonCodeItem {
  codeId: number;
  groupId: number;
  code: string;
  codeName: string;
  description: string | null;
  useYn: "Y" | "N";
  sortOrder: number;
}

export interface CommonCodeSearchResult {
  codeId: number;
  code: string;
  codeName: string;
  groupCode: string;
  groupName: string;
}

export interface CommonCodeGroupListParams extends PaginationParams {
  keyword?: string;
  status?: StandardStatus;
}

export interface CreateCommonCodeGroupInput {
  groupCode: string;
  groupName: string;
  description?: string;
}

export interface UpdateCommonCodeGroupInput {
  groupName?: string;
  description?: string;
  status?: StandardStatus;
}

export interface CreateCommonCodeInput {
  code: string;
  codeName: string;
  description?: string;
  useYn?: "Y" | "N";
  sortOrder?: number;
}

const MOCK_GROUPS: CommonCodeGroupItem[] = [
  {
    groupId: 1,
    groupCode: "DOMAIN_TYPE",
    groupName: "도메인유형",
    description: "표준 도메인 유형 코드",
    codeCount: 5,
    status: "BASELINE",
    regDate: new Date("2025-01-01"),
  },
  {
    groupId: 2,
    groupCode: "STD_STATUS",
    groupName: "표준상태",
    description: "표준 항목의 처리 상태",
    codeCount: 4,
    status: "BASELINE",
    regDate: new Date("2025-01-01"),
  },
  {
    groupId: 3,
    groupCode: "REQUEST_TYPE",
    groupName: "신청유형",
    description: "신청 유형 코드",
    codeCount: 3,
    status: "BASELINE",
    regDate: new Date("2025-01-01"),
  },
  {
    groupId: 4,
    groupCode: "TARGET_TYPE",
    groupName: "대상유형",
    description: "신청/감사 대상 유형",
    codeCount: 4,
    status: "BASELINE",
    regDate: new Date("2025-01-01"),
  },
  {
    groupId: 5,
    groupCode: "DEPT_CODE",
    groupName: "부서코드",
    description: "조직 부서 코드",
    codeCount: 4,
    status: "PENDING",
    regDate: new Date("2026-03-01"),
  },
];

const MOCK_CODES: Record<number, CommonCodeItem[]> = {
  1: [
    {
      codeId: 101,
      groupId: 1,
      code: "NM",
      codeName: "명칭",
      description: "이름, 명칭 관련 도메인",
      useYn: "Y",
      sortOrder: 1,
    },
    {
      codeId: 102,
      groupId: 1,
      code: "CD",
      codeName: "코드",
      description: "분류 코드 도메인",
      useYn: "Y",
      sortOrder: 2,
    },
    {
      codeId: 103,
      groupId: 1,
      code: "AMT",
      codeName: "금액",
      description: "금액, 화폐 도메인",
      useYn: "Y",
      sortOrder: 3,
    },
    {
      codeId: 104,
      groupId: 1,
      code: "NO",
      codeName: "번호",
      description: "식별 번호 도메인",
      useYn: "Y",
      sortOrder: 4,
    },
    {
      codeId: 105,
      groupId: 1,
      code: "DT",
      codeName: "일자",
      description: "날짜, 일시 도메인",
      useYn: "Y",
      sortOrder: 5,
    },
  ],
  2: [
    {
      codeId: 201,
      groupId: 2,
      code: "UNREGISTERED",
      codeName: "미등록",
      description: null,
      useYn: "Y",
      sortOrder: 1,
    },
    {
      codeId: 202,
      groupId: 2,
      code: "PENDING",
      codeName: "신청중",
      description: null,
      useYn: "Y",
      sortOrder: 2,
    },
    {
      codeId: 203,
      groupId: 2,
      code: "APPROVED",
      codeName: "승인",
      description: null,
      useYn: "Y",
      sortOrder: 3,
    },
    {
      codeId: 204,
      groupId: 2,
      code: "BASELINE",
      codeName: "표준",
      description: null,
      useYn: "Y",
      sortOrder: 4,
    },
  ],
  3: [
    {
      codeId: 301,
      groupId: 3,
      code: "NEW",
      codeName: "신규",
      description: null,
      useYn: "Y",
      sortOrder: 1,
    },
    {
      codeId: 302,
      groupId: 3,
      code: "UPDATE",
      codeName: "변경",
      description: null,
      useYn: "Y",
      sortOrder: 2,
    },
    {
      codeId: 303,
      groupId: 3,
      code: "DELETE",
      codeName: "삭제",
      description: null,
      useYn: "Y",
      sortOrder: 3,
    },
  ],
  4: [
    {
      codeId: 401,
      groupId: 4,
      code: "WORD",
      codeName: "표준단어",
      description: null,
      useYn: "Y",
      sortOrder: 1,
    },
    {
      codeId: 402,
      groupId: 4,
      code: "DOMAIN",
      codeName: "표준도메인",
      description: null,
      useYn: "Y",
      sortOrder: 2,
    },
    {
      codeId: 403,
      groupId: 4,
      code: "TERM",
      codeName: "표준용어",
      description: null,
      useYn: "Y",
      sortOrder: 3,
    },
    {
      codeId: 404,
      groupId: 4,
      code: "COMMON_CODE",
      codeName: "공통코드",
      description: null,
      useYn: "Y",
      sortOrder: 4,
    },
  ],
  5: [
    {
      codeId: 501,
      groupId: 5,
      code: "IT_PLAN",
      codeName: "IT기획팀",
      description: null,
      useYn: "Y",
      sortOrder: 1,
    },
    {
      codeId: 502,
      groupId: 5,
      code: "DATA_ANAL",
      codeName: "데이터분석팀",
      description: null,
      useYn: "Y",
      sortOrder: 2,
    },
    {
      codeId: 503,
      groupId: 5,
      code: "DEV1",
      codeName: "개발1팀",
      description: null,
      useYn: "Y",
      sortOrder: 3,
    },
    {
      codeId: 504,
      groupId: 5,
      code: "DEV2",
      codeName: "개발2팀",
      description: null,
      useYn: "Y",
      sortOrder: 4,
    },
  ],
};

export async function getCommonCodeGroups(
  params: CommonCodeGroupListParams = {},
): Promise<PaginatedResponse<CommonCodeGroupItem>> {
  await delay();
  let filtered = [...MOCK_GROUPS];
  if (params.keyword) {
    const kw = params.keyword.toLowerCase();
    filtered = filtered.filter(
      (g) =>
        g.groupCode.toLowerCase().includes(kw) ||
        g.groupName.toLowerCase().includes(kw),
    );
  }
  if (params.status) {
    filtered = filtered.filter((g) => g.status === params.status);
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

export async function getCommonCodeGroupDetail(
  groupId: number,
): Promise<CommonCodeGroupItem | null> {
  await delay();
  return MOCK_GROUPS.find((g) => g.groupId === groupId) ?? null;
}

export async function getCommonCodesByGroup(
  groupId: number,
): Promise<CommonCodeItem[]> {
  await delay();
  return MOCK_CODES[groupId] ?? [];
}

export async function createCommonCodeGroup(
  input: CreateCommonCodeGroupInput,
): Promise<CommonCodeGroupItem> {
  await delay(400);
  const newGroup: CommonCodeGroupItem = {
    groupId: MOCK_GROUPS.length + 1,
    groupCode: input.groupCode,
    groupName: input.groupName,
    description: input.description ?? null,
    codeCount: 0,
    status: "PENDING",
    regDate: new Date(),
  };
  MOCK_GROUPS.push(newGroup);
  return newGroup;
}

export async function updateCommonCodeGroup(
  groupId: number,
  input: UpdateCommonCodeGroupInput,
): Promise<CommonCodeGroupItem> {
  await delay(400);
  const group = MOCK_GROUPS.find((g) => g.groupId === groupId);
  if (!group) throw new Error(`Group ${groupId} not found`);
  if (input.groupName) group.groupName = input.groupName;
  if (input.description !== undefined)
    group.description = input.description ?? null;
  if (input.status) group.status = input.status;
  return group;
}

export async function addCommonCode(
  groupId: number,
  input: CreateCommonCodeInput,
): Promise<CommonCodeItem> {
  await delay(400);
  const codes = MOCK_CODES[groupId] ?? [];
  const newCode: CommonCodeItem = {
    codeId: Date.now(),
    groupId,
    code: input.code,
    codeName: input.codeName,
    description: input.description ?? null,
    useYn: input.useYn ?? "Y",
    sortOrder: input.sortOrder ?? codes.length + 1,
  };
  if (!MOCK_CODES[groupId]) MOCK_CODES[groupId] = [];
  MOCK_CODES[groupId].push(newCode);
  const group = MOCK_GROUPS.find((g) => g.groupId === groupId);
  if (group) group.codeCount += 1;
  return newCode;
}

export async function searchCommonCodes(
  keyword: string,
): Promise<CommonCodeSearchResult[]> {
  await delay();
  const results: CommonCodeSearchResult[] = [];
  const kw = keyword.toLowerCase();
  for (const group of MOCK_GROUPS) {
    const codes = MOCK_CODES[group.groupId] ?? [];
    for (const code of codes) {
      if (
        code.code.toLowerCase().includes(kw) ||
        code.codeName.toLowerCase().includes(kw)
      ) {
        results.push({
          codeId: code.codeId,
          code: code.code,
          codeName: code.codeName,
          groupCode: group.groupCode,
          groupName: group.groupName,
        });
      }
    }
  }
  return results;
}
