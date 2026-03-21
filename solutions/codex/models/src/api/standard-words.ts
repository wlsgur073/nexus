import type { StandardStatus, StandardWord } from "../entities";
import { baseFields, delay } from "./helpers";
import type { PaginatedResponse, PaginationParams } from "./helpers";

export interface StandardWordListParams extends PaginationParams {
  keyword?: string;
  status?: StandardStatus;
  domainType?: string;
  sortBy?: string;
  sortOrder?: "asc" | "desc";
}

export interface WordHistoryItem {
  id: number;
  actionType: string;
  fieldName: string | null;
  oldValue: string | null;
  newValue: string | null;
  actorName: string;
  timestamp: Date;
}

const MOCK_WORDS: StandardWord[] = [
  {
    wordId: 1,
    wordName: "고객",
    abbrName: "CUST",
    engName: "Customer",
    definition: "서비스를 이용하는 개인 또는 법인",
    domainType: "명칭",
    status: "BASELINE",
    regDate: new Date("2025-05-10"),
    modDate: null,
    regUserId: 1,
    ...baseFields(),
  },
  {
    wordId: 2,
    wordName: "번호",
    abbrName: "NO",
    engName: "Number",
    definition: "식별 또는 순서를 나타내는 숫자",
    domainType: "번호",
    status: "BASELINE",
    regDate: new Date("2025-05-10"),
    modDate: null,
    regUserId: 1,
    ...baseFields(),
  },
  {
    wordId: 3,
    wordName: "거래",
    abbrName: "TRNS",
    engName: "Transaction",
    definition: "금융 또는 상거래에서 발생하는 매매 행위",
    domainType: "명칭",
    status: "PENDING",
    regDate: new Date("2026-03-01"),
    modDate: null,
    regUserId: 2,
    ...baseFields(),
  },
  {
    wordId: 4,
    wordName: "잔액",
    abbrName: "BAL",
    engName: "Balance",
    definition: "계좌 또는 계정에 남아 있는 금액",
    domainType: "금액",
    status: "BASELINE",
    regDate: new Date("2025-06-01"),
    modDate: null,
    regUserId: 1,
    ...baseFields(),
  },
  {
    wordId: 5,
    wordName: "계좌",
    abbrName: "ACCT",
    engName: "Account",
    definition: "금융 거래를 기록하기 위해 개설된 단위",
    domainType: "명칭",
    status: "BASELINE",
    regDate: new Date("2025-05-15"),
    modDate: null,
    regUserId: 1,
    ...baseFields(),
  },
];

export async function getWordList(
  params: StandardWordListParams = {},
): Promise<PaginatedResponse<StandardWord>> {
  await delay();
  let filtered = [...MOCK_WORDS];
  if (params.keyword) {
    const kw = params.keyword.toLowerCase();
    filtered = filtered.filter(
      (w) =>
        w.wordName.includes(kw) ||
        w.abbrName.toLowerCase().includes(kw) ||
        w.engName.toLowerCase().includes(kw),
    );
  }
  if (params.status) {
    filtered = filtered.filter((w) => w.status === params.status);
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

export async function getWordById(
  wordId: number,
): Promise<StandardWord | null> {
  await delay();
  return MOCK_WORDS.find((w) => w.wordId === wordId) ?? null;
}

export async function getWordRelatedTerms(
  wordId: number,
): Promise<{ termId: number; termName: string; physicalName: string }[]> {
  await delay();
  if (wordId === 1) {
    return [
      { termId: 1, termName: "고객번호", physicalName: "CUST_NO" },
      { termId: 10, termName: "고객명", physicalName: "CUST_NM" },
    ];
  }
  return [];
}

export async function getWordHistory(
  wordId: number,
): Promise<WordHistoryItem[]> {
  await delay();
  if (wordId === 1) {
    return [
      {
        id: 1,
        actionType: "CREATE",
        fieldName: null,
        oldValue: null,
        newValue: null,
        actorName: "김관리",
        timestamp: new Date("2025-05-10"),
      },
    ];
  }
  return [];
}
