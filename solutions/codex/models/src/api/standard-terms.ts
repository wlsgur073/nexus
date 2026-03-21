import type { StandardDomain, StandardStatus, StandardTerm, StandardTermWord } from "../entities";
import { baseFields, delay } from "./helpers";
import type { PaginatedResponse, PaginationParams } from "./helpers";

export interface StandardTermListParams extends PaginationParams {
  keyword?: string;
  status?: StandardStatus;
  domainType?: string;
  infoType?: string;
  sortBy?: string;
  sortOrder?: "asc" | "desc";
}

export interface TermHistoryItem {
  id: number;
  actionType: string;
  fieldName: string | null;
  oldValue: string | null;
  newValue: string | null;
  actorName: string;
  timestamp: Date;
}

const MOCK_TERMS: StandardTerm[] = [
  {
    termId: 1,
    termName: "고객번호",
    physicalName: "CUST_NO",
    domainType: "번호",
    infoType: "사용자명",
    definition: "고객을 식별하는 고유 번호",
    status: "BASELINE",
    regDate: new Date("2025-06-15"),
    modDate: null,
    regUserId: 1,
    ...baseFields(),
  },
  {
    termId: 2,
    termName: "계좌잔액",
    physicalName: "ACCT_BAL",
    domainType: "금액",
    infoType: "금액",
    definition: "계좌의 현재 잔액",
    status: "BASELINE",
    regDate: new Date("2025-07-20"),
    modDate: null,
    regUserId: 1,
    ...baseFields(),
  },
  {
    termId: 3,
    termName: "거래일자",
    physicalName: "TRNS_DT",
    domainType: "일자",
    infoType: "일자",
    definition: "거래가 발생한 날짜",
    status: "BASELINE",
    regDate: new Date("2025-08-12"),
    modDate: null,
    regUserId: 1,
    ...baseFields(),
  },
  {
    termId: 4,
    termName: "상품코드",
    physicalName: "PROD_CD",
    domainType: "코드",
    infoType: "코드",
    definition: "상품을 분류하는 코드",
    status: "APPROVED",
    regDate: new Date("2026-02-15"),
    modDate: null,
    regUserId: 2,
    ...baseFields(),
  },
  {
    termId: 5,
    termName: "고객명",
    physicalName: "CUST_NM",
    domainType: "명칭",
    infoType: "사용자명",
    definition: "고객의 이름",
    status: "BASELINE",
    regDate: new Date("2025-06-15"),
    modDate: null,
    regUserId: 1,
    ...baseFields(),
  },
];

export async function getTermList(
  params: StandardTermListParams = {},
): Promise<PaginatedResponse<StandardTerm>> {
  await delay();
  let filtered = [...MOCK_TERMS];
  if (params.keyword) {
    const kw = params.keyword.toLowerCase();
    filtered = filtered.filter(
      (t) =>
        t.termName.includes(kw) ||
        t.physicalName.toLowerCase().includes(kw),
    );
  }
  if (params.status) {
    filtered = filtered.filter((t) => t.status === params.status);
  }
  if (params.domainType) {
    filtered = filtered.filter((t) => t.domainType === params.domainType);
  }
  const page = params.page ?? 1;
  const pageSize = params.pageSize ?? 10;
  const total = filtered.length;
  return {
    items: filtered.slice((page - 1) * pageSize, page * pageSize),
    total,
    page,
    pageSize,
    totalPages: Math.ceil(total / pageSize),
  };
}

export async function getTermById(
  termId: number,
): Promise<StandardTerm | null> {
  await delay();
  return MOCK_TERMS.find((t) => t.termId === termId) ?? null;
}

export async function getTermWords(
  termId: number,
): Promise<(StandardTermWord & { wordName: string; abbrName: string })[]> {
  await delay();
  if (termId === 1) {
    return [
      { termId: 1, wordId: 1, seq: 1, wordName: "고객", abbrName: "CUST" },
      { termId: 1, wordId: 2, seq: 2, wordName: "번호", abbrName: "NO" },
    ];
  }
  if (termId === 2) {
    return [
      { termId: 2, wordId: 5, seq: 1, wordName: "계좌", abbrName: "ACCT" },
      { termId: 2, wordId: 4, seq: 2, wordName: "잔액", abbrName: "BAL" },
    ];
  }
  return [];
}

export async function getTermDomain(
  termId: number,
): Promise<StandardDomain | null> {
  await delay();
  if (termId === 1) {
    return {
      domainId: 5,
      domainName: "번호",
      domainType: "번호",
      dataType: "NUMBER",
      dataLength: "10",
      definition: "식별 또는 순서를 나타내는 번호를 저장하는 도메인",
      status: "BASELINE",
      regDate: new Date("2025-04-01"),
      modDate: null,
      regUserId: 1,
      ...baseFields(),
    };
  }
  return null;
}

export async function getTermHistory(
  termId: number,
): Promise<TermHistoryItem[]> {
  await delay();
  if (termId === 1) {
    return [
      {
        id: 1,
        actionType: "CREATE",
        fieldName: null,
        oldValue: null,
        newValue: null,
        actorName: "김관리",
        timestamp: new Date("2025-06-15"),
      },
    ];
  }
  return [];
}
