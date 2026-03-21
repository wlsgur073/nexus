import type { Request, RequestStatus, RequestType, TargetType } from "../entities";
import { baseFields, delay } from "./helpers";
import type { PaginatedResponse, PaginationParams } from "./helpers";

export interface CreateWordRequestInput {
  wordName: string;
  abbrName: string;
  engName: string;
  definition: string;
  domainType?: string;
  requestReason?: string;
}

export interface CreateDomainRequestInput {
  domainName: string;
  domainType: string;
  dataType: string;
  dataLength?: string;
  definition: string;
  requestReason?: string;
}

export interface CreateTermRequestInput {
  termName: string;
  wordIds: number[];
  domainId: number;
  infoType: string;
  definition: string;
  requestReason?: string;
}

export interface CreateCommonCodeRequestInput {
  groupCode: string;
  groupName: string;
  codes: { code: string; codeName: string; description?: string }[];
  requestReason?: string;
}

export interface CreateDeleteRequestInput {
  targetType: TargetType;
  targetId: number;
  deleteReason: string;
  affectedSystems?: string[];
  impactLevel: "HIGH" | "MEDIUM" | "LOW";
  impactDesc: string;
  altStandard?: string;
  migrationPlan?: string;
}

export interface RequestListParams extends PaginationParams {
  status?: RequestStatus;
  targetType?: TargetType;
  requestType?: RequestType;
  keyword?: string;
  sortBy?: string;
  sortOrder?: "asc" | "desc";
}

export interface RequestStats {
  total: number;
  pending: number;
  review: number;
  approved: number;
  rejected: number;
  feedback: number;
}

const MOCK_REQUESTS: Request[] = [
  {
    requestId: 1,
    requestNo: "REQ-2026-0001",
    targetType: "WORD",
    targetId: null,
    targetName: "거래",
    requestType: "CREATE",
    status: "PENDING",
    requesterId: 2,
    requestDate: new Date("2026-03-01"),
    processDate: null,
    requestReason: "금융 거래 관련 표준단어 등록 필요",
    parentRequestId: null,
    ...baseFields("user2"),
  },
  {
    requestId: 2,
    requestNo: "REQ-2026-0002",
    targetType: "TERM",
    targetId: 1,
    targetName: "고객번호",
    requestType: "UPDATE",
    status: "REVIEW",
    requesterId: 3,
    requestDate: new Date("2026-03-05"),
    processDate: null,
    requestReason: "정의 보완 필요",
    parentRequestId: null,
    ...baseFields("user3"),
  },
  {
    requestId: 3,
    requestNo: "REQ-2026-0003",
    targetType: "DOMAIN",
    targetId: null,
    targetName: "율",
    requestType: "CREATE",
    status: "APPROVED",
    requesterId: 2,
    requestDate: new Date("2026-02-20"),
    processDate: new Date("2026-02-25"),
    requestReason: "비율 도메인 신규 등록",
    parentRequestId: null,
    ...baseFields("user2"),
  },
  {
    requestId: 4,
    requestNo: "REQ-2026-0004",
    targetType: "WORD",
    targetId: 4,
    targetName: "잔액",
    requestType: "DELETE",
    status: "FEEDBACK",
    requesterId: 3,
    requestDate: new Date("2026-03-10"),
    processDate: null,
    requestReason: "중복 단어 삭제 요청",
    parentRequestId: null,
    ...baseFields("user3"),
  },
  {
    requestId: 5,
    requestNo: "REQ-2026-0005",
    targetType: "TERM",
    targetId: null,
    targetName: "상품코드",
    requestType: "CREATE",
    status: "APPROVED",
    requesterId: 2,
    requestDate: new Date("2026-02-15"),
    processDate: new Date("2026-02-18"),
    requestReason: "상품 분류 용어 등록",
    parentRequestId: null,
    ...baseFields("user2"),
  },
];

export async function createWordRequest(
  input: CreateWordRequestInput,
): Promise<Request> {
  await delay(500);
  return {
    requestId: 100,
    requestNo: "REQ-2026-0100",
    targetType: "WORD",
    targetId: null,
    targetName: input.wordName,
    requestType: "CREATE",
    status: "PENDING",
    requesterId: 1,
    requestDate: new Date(),
    processDate: null,
    requestReason: input.requestReason ?? null,
    parentRequestId: null,
    ...baseFields(),
  };
}

export async function createDomainRequest(
  input: CreateDomainRequestInput,
): Promise<Request> {
  await delay(500);
  return {
    requestId: 101,
    requestNo: "REQ-2026-0101",
    targetType: "DOMAIN",
    targetId: null,
    targetName: input.domainName,
    requestType: "CREATE",
    status: "PENDING",
    requesterId: 1,
    requestDate: new Date(),
    processDate: null,
    requestReason: input.requestReason ?? null,
    parentRequestId: null,
    ...baseFields(),
  };
}

export async function createTermRequest(
  input: CreateTermRequestInput,
): Promise<Request> {
  await delay(500);
  return {
    requestId: 102,
    requestNo: "REQ-2026-0102",
    targetType: "TERM",
    targetId: null,
    targetName: input.termName,
    requestType: "CREATE",
    status: "PENDING",
    requesterId: 1,
    requestDate: new Date(),
    processDate: null,
    requestReason: input.requestReason ?? null,
    parentRequestId: null,
    ...baseFields(),
  };
}

export async function createCommonCodeRequest(
  input: CreateCommonCodeRequestInput,
): Promise<Request> {
  await delay(500);
  return {
    requestId: 103,
    requestNo: "REQ-2026-0103",
    targetType: "COMMON_CODE",
    targetId: null,
    targetName: input.groupName,
    requestType: "CREATE",
    status: "PENDING",
    requesterId: 1,
    requestDate: new Date(),
    processDate: null,
    requestReason: input.requestReason ?? null,
    parentRequestId: null,
    ...baseFields(),
  };
}

export async function createDeleteRequest(
  input: CreateDeleteRequestInput,
): Promise<Request> {
  await delay(500);
  return {
    requestId: 104,
    requestNo: "REQ-2026-0104",
    targetType: input.targetType,
    targetId: input.targetId,
    targetName: "삭제 대상",
    requestType: "DELETE",
    status: "PENDING",
    requesterId: 1,
    requestDate: new Date(),
    processDate: null,
    requestReason: input.deleteReason,
    parentRequestId: null,
    ...baseFields(),
  };
}

export async function getRequestList(
  params: RequestListParams = {},
): Promise<PaginatedResponse<Request>> {
  await delay();
  let filtered = [...MOCK_REQUESTS];
  if (params.status) {
    filtered = filtered.filter((r) => r.status === params.status);
  }
  if (params.targetType) {
    filtered = filtered.filter((r) => r.targetType === params.targetType);
  }
  if (params.requestType) {
    filtered = filtered.filter((r) => r.requestType === params.requestType);
  }
  if (params.keyword) {
    const kw = params.keyword.toLowerCase();
    filtered = filtered.filter(
      (r) =>
        r.targetName.includes(kw) ||
        r.requestNo.toLowerCase().includes(kw),
    );
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

export async function getMyRequests(
  params: RequestListParams = {},
): Promise<PaginatedResponse<Request>> {
  await delay();
  const myRequests = MOCK_REQUESTS.filter((r) => r.requesterId === 1);
  const page = params.page ?? 1;
  const pageSize = params.pageSize ?? 10;
  return {
    items: myRequests.slice((page - 1) * pageSize, page * pageSize),
    total: myRequests.length,
    page,
    pageSize,
    totalPages: Math.ceil(myRequests.length / pageSize),
  };
}

export async function getMyRequestStats(): Promise<RequestStats> {
  await delay();
  return {
    total: 15,
    pending: 3,
    review: 2,
    approved: 8,
    rejected: 1,
    feedback: 1,
  };
}

export async function getRequestDetail(
  requestId: number,
): Promise<Request | null> {
  await delay();
  return MOCK_REQUESTS.find((r) => r.requestId === requestId) ?? null;
}

export async function getRequestFeedback(
  requestId: number,
): Promise<{ comment: string; actorName: string; timestamp: Date } | null> {
  await delay();
  if (requestId === 4) {
    return {
      comment: "삭제 사유가 불충분합니다. 영향도 분석을 추가해 주세요.",
      actorName: "이승인",
      timestamp: new Date("2026-03-12"),
    };
  }
  return null;
}

export async function cancelRequest(requestId: number): Promise<Request> {
  await delay(500);
  const req = MOCK_REQUESTS.find((r) => r.requestId === requestId);
  if (!req) throw new Error("Request not found");
  return { ...req, status: "CANCELLED" };
}
