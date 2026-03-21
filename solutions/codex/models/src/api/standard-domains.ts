import type { StandardDomain, StandardStatus } from "../entities";
import { baseFields, delay } from "./helpers";
import type { PaginatedResponse, PaginationParams } from "./helpers";

export interface StandardDomainListParams extends PaginationParams {
  keyword?: string;
  status?: StandardStatus;
  domainType?: string;
  dataType?: string;
  sortBy?: string;
  sortOrder?: "asc" | "desc";
}

export interface DomainHistoryItem {
  id: number;
  actionType: string;
  fieldName: string | null;
  oldValue: string | null;
  newValue: string | null;
  actorName: string;
  timestamp: Date;
}

const MOCK_DOMAINS: StandardDomain[] = [
  {
    domainId: 1,
    domainName: "금액",
    domainType: "금액",
    dataType: "NUMBER",
    dataLength: "15,2",
    definition: "화폐 단위의 수치를 저장하는 도메인",
    status: "BASELINE",
    regDate: new Date("2025-04-01"),
    modDate: null,
    regUserId: 1,
    ...baseFields(),
  },
  {
    domainId: 2,
    domainName: "코드",
    domainType: "코드",
    dataType: "VARCHAR",
    dataLength: "20",
    definition: "분류 체계의 코드값을 저장하는 도메인",
    status: "BASELINE",
    regDate: new Date("2025-04-01"),
    modDate: null,
    regUserId: 1,
    ...baseFields(),
  },
  {
    domainId: 3,
    domainName: "명칭",
    domainType: "명칭",
    dataType: "VARCHAR",
    dataLength: "100",
    definition: "이름이나 명칭을 저장하는 도메인",
    status: "BASELINE",
    regDate: new Date("2025-04-01"),
    modDate: null,
    regUserId: 1,
    ...baseFields(),
  },
  {
    domainId: 4,
    domainName: "일자",
    domainType: "일자",
    dataType: "DATE",
    dataLength: null,
    definition: "날짜를 저장하는 도메인",
    status: "BASELINE",
    regDate: new Date("2025-04-01"),
    modDate: null,
    regUserId: 1,
    ...baseFields(),
  },
  {
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
  },
];

export async function getDomainList(
  params: StandardDomainListParams = {},
): Promise<PaginatedResponse<StandardDomain>> {
  await delay();
  let filtered = [...MOCK_DOMAINS];
  if (params.keyword) {
    const kw = params.keyword.toLowerCase();
    filtered = filtered.filter(
      (d) =>
        d.domainName.includes(kw) || d.definition.includes(kw),
    );
  }
  if (params.status) {
    filtered = filtered.filter((d) => d.status === params.status);
  }
  if (params.dataType) {
    filtered = filtered.filter((d) => d.dataType === params.dataType);
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

export async function getDomainById(
  domainId: number,
): Promise<StandardDomain | null> {
  await delay();
  return MOCK_DOMAINS.find((d) => d.domainId === domainId) ?? null;
}

export async function getDomainRelatedTerms(
  domainId: number,
): Promise<{ termId: number; termName: string; physicalName: string }[]> {
  await delay();
  if (domainId === 1) {
    return [
      { termId: 2, termName: "계좌잔액", physicalName: "ACCT_BAL" },
      { termId: 11, termName: "거래금액", physicalName: "TRNS_AMT" },
    ];
  }
  return [];
}

export async function getDomainHistory(
  domainId: number,
): Promise<DomainHistoryItem[]> {
  await delay();
  if (domainId === 1) {
    return [
      {
        id: 1,
        actionType: "CREATE",
        fieldName: null,
        oldValue: null,
        newValue: null,
        actorName: "김관리",
        timestamp: new Date("2025-04-01"),
      },
    ];
  }
  return [];
}
