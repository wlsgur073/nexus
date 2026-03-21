import type { Request, RequestChange, RequestStatus, TargetType } from "../entities";
import type { AuditLog } from "../entities";
import { baseFields, delay } from "./helpers";
import type { PaginatedResponse, PaginationParams } from "./helpers";

export interface ApprovalListParams extends PaginationParams {
  status?: RequestStatus;
  targetType?: TargetType;
  keyword?: string;
  sortBy?: string;
  sortOrder?: "asc" | "desc";
}

export interface ApprovalStats {
  pendingCount: number;
  reviewCount: number;
  processedToday: number;
  avgProcessDays: number;
}

export interface ProcessApprovalInput {
  action: "APPROVE" | "REJECT" | "FEEDBACK";
  comment: string;
}

export interface ProcessApprovalResponse {
  requestId: number;
  newStatus: RequestStatus;
  processDate: Date;
}

export interface BatchApproveInput {
  requestIds: number[];
  comment: string;
}

const MOCK_PENDING_REQUESTS: Request[] = [
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
];

export async function getApprovalList(
  params: ApprovalListParams = {},
): Promise<PaginatedResponse<Request>> {
  await delay();
  let filtered = [...MOCK_PENDING_REQUESTS];
  if (params.status) {
    filtered = filtered.filter((r) => r.status === params.status);
  }
  if (params.targetType) {
    filtered = filtered.filter((r) => r.targetType === params.targetType);
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
  return {
    items: filtered.slice((page - 1) * pageSize, page * pageSize),
    total: filtered.length,
    page,
    pageSize,
    totalPages: Math.ceil(filtered.length / pageSize),
  };
}

export async function getApprovalStats(): Promise<ApprovalStats> {
  await delay();
  return {
    pendingCount: 12,
    reviewCount: 5,
    processedToday: 3,
    avgProcessDays: 2.1,
  };
}

export async function getApprovalDetail(
  requestId: number,
): Promise<Request | null> {
  await delay();
  return (
    MOCK_PENDING_REQUESTS.find((r) => r.requestId === requestId) ?? null
  );
}

export async function getApprovalChanges(
  requestId: number,
): Promise<RequestChange[]> {
  await delay();
  if (requestId === 2) {
    return [
      {
        changeId: 1,
        requestId: 2,
        fieldName: "definition",
        oldValue: "고객을 식별하는 번호",
        newValue: "고객을 식별하는 고유 번호",
        ...baseFields("user3"),
      },
    ];
  }
  return [];
}

export async function getApprovalHistory(
  requestId: number,
): Promise<AuditLog[]> {
  await delay();
  return [
    {
      logId: 1,
      logDatetime: new Date("2026-03-05"),
      targetType: "TERM",
      targetName: "고객번호",
      targetId: 1,
      actionType: "REQUEST",
      stateFrom: null,
      stateTo: "PENDING",
      actorId: 3,
      actorRole: "REQUESTER",
      comment: "정의 보완 필요",
      requestId,
    },
  ];
}

export async function processApproval(
  requestId: number,
  input: ProcessApprovalInput,
): Promise<ProcessApprovalResponse> {
  await delay(500);
  const statusMap: Record<string, RequestStatus> = {
    APPROVE: "APPROVED",
    REJECT: "REJECTED",
    FEEDBACK: "FEEDBACK",
  };
  return {
    requestId,
    newStatus: statusMap[input.action] ?? "PENDING",
    processDate: new Date(),
  };
}

export async function batchApprove(
  input: BatchApproveInput,
): Promise<ProcessApprovalResponse[]> {
  await delay(800);
  return input.requestIds.map((id) => ({
    requestId: id,
    newStatus: "APPROVED" as RequestStatus,
    processDate: new Date(),
  }));
}
