import type { StandardStatus, TargetType } from "../entities";
import { delay } from "./helpers";
import type { PaginatedResponse, PaginationParams } from "./helpers";

export interface ExplorerItem {
  id: number;
  type: TargetType;
  name: string;
  physicalName?: string;
  abbrName?: string;
  engName?: string;
  domainType: string;
  dataType?: string;
  dataLength?: string;
  infoType?: string;
  definition: string;
  status: StandardStatus;
  regDate: Date;
}

export interface ExplorerSearchParams extends PaginationParams {
  type?: TargetType;
  keyword?: string;
  status?: StandardStatus;
  domainType?: string;
  sortBy?: string;
  sortOrder?: "asc" | "desc";
}

export interface FacetItem {
  value: string;
  label: string;
  count: number;
}

export interface ExplorerFacets {
  statuses: FacetItem[];
  domainTypes: FacetItem[];
  infoTypes: FacetItem[];
}

export interface AutocompleteItem {
  id: number;
  type: TargetType;
  name: string;
  physicalName?: string;
}

const MOCK_ITEMS: ExplorerItem[] = [
  {
    id: 1,
    type: "TERM",
    name: "고객번호",
    physicalName: "CUST_NO",
    domainType: "번호",
    infoType: "사용자명",
    definition: "고객을 식별하는 고유 번호",
    status: "BASELINE",
    regDate: new Date("2025-06-15"),
  },
  {
    id: 2,
    type: "TERM",
    name: "계좌잔액",
    physicalName: "ACCT_BAL",
    domainType: "금액",
    infoType: "금액",
    definition: "계좌의 현재 잔액",
    status: "BASELINE",
    regDate: new Date("2025-07-20"),
  },
  {
    id: 3,
    type: "WORD",
    name: "고객",
    abbrName: "CUST",
    engName: "Customer",
    domainType: "명칭",
    definition: "서비스를 이용하는 개인 또는 법인",
    status: "BASELINE",
    regDate: new Date("2025-05-10"),
  },
  {
    id: 4,
    type: "WORD",
    name: "번호",
    abbrName: "NO",
    engName: "Number",
    domainType: "번호",
    definition: "식별 또는 순서를 나타내는 숫자",
    status: "BASELINE",
    regDate: new Date("2025-05-10"),
  },
  {
    id: 5,
    type: "DOMAIN",
    name: "금액",
    domainType: "금액",
    dataType: "NUMBER",
    dataLength: "15,2",
    definition: "화폐 단위의 수치를 저장하는 도메인",
    status: "BASELINE",
    regDate: new Date("2025-04-01"),
  },
  {
    id: 6,
    type: "TERM",
    name: "거래일자",
    physicalName: "TRNS_DT",
    domainType: "일자",
    infoType: "일자",
    definition: "거래가 발생한 날짜",
    status: "BASELINE",
    regDate: new Date("2025-08-12"),
  },
  {
    id: 7,
    type: "WORD",
    name: "거래",
    abbrName: "TRNS",
    engName: "Transaction",
    domainType: "명칭",
    definition: "금융 또는 상거래에서 발생하는 매매 행위",
    status: "PENDING",
    regDate: new Date("2026-03-01"),
  },
  {
    id: 8,
    type: "DOMAIN",
    name: "코드",
    domainType: "코드",
    dataType: "VARCHAR",
    dataLength: "20",
    definition: "분류 체계의 코드값을 저장하는 도메인",
    status: "BASELINE",
    regDate: new Date("2025-04-01"),
  },
];

export async function searchExplorer(
  params: ExplorerSearchParams = {},
): Promise<PaginatedResponse<ExplorerItem>> {
  await delay(400);
  let filtered = [...MOCK_ITEMS];

  if (params.type) {
    filtered = filtered.filter((item) => item.type === params.type);
  }
  if (params.keyword) {
    const kw = params.keyword.toLowerCase();
    filtered = filtered.filter(
      (item) =>
        item.name.includes(kw) ||
        item.definition.includes(kw) ||
        item.physicalName?.toLowerCase().includes(kw),
    );
  }
  if (params.status) {
    filtered = filtered.filter((item) => item.status === params.status);
  }

  const page = params.page ?? 1;
  const pageSize = params.pageSize ?? 10;
  const total = filtered.length;
  const start = (page - 1) * pageSize;
  return {
    items: filtered.slice(start, start + pageSize),
    total,
    page,
    pageSize,
    totalPages: Math.ceil(total / pageSize),
  };
}

export async function getExplorerFacets(): Promise<ExplorerFacets> {
  await delay();
  return {
    statuses: [
      { value: "BASELINE", label: "기존", count: 6 },
      { value: "PENDING", label: "신청", count: 1 },
      { value: "APPROVED", label: "승인", count: 1 },
    ],
    domainTypes: [
      { value: "명칭", label: "명칭", count: 3 },
      { value: "금액", label: "금액", count: 2 },
      { value: "번호", label: "번호", count: 2 },
      { value: "코드", label: "코드", count: 1 },
    ],
    infoTypes: [
      { value: "사용자명", label: "사용자명", count: 1 },
      { value: "금액", label: "금액", count: 1 },
      { value: "일자", label: "일자", count: 1 },
    ],
  };
}

export async function getAutocomplete(
  query: string,
): Promise<AutocompleteItem[]> {
  await delay(200);
  const q = query.toLowerCase();
  return MOCK_ITEMS.filter(
    (item) =>
      item.name.includes(q) || item.physicalName?.toLowerCase().includes(q),
  ).map((item) => ({
    id: item.id,
    type: item.type,
    name: item.name,
    physicalName: item.physicalName,
  }));
}
