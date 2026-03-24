import type { ActionType, TargetType } from "../entities";
import { delay } from "./helpers";
import type { PaginatedResponse, PaginationParams } from "./helpers";

export interface AuditListParams extends PaginationParams {
  targetType?: TargetType;
  keyword?: string;
  from?: string;
  to?: string;
  actionType?: ActionType;
  actor?: string;
}

export interface AuditLogItem {
  logId: number;
  logDatetime: Date;
  targetType: TargetType;
  targetName: string;
  targetId: number | null;
  actionType: ActionType;
  stateFrom: string | null;
  stateTo: string | null;
  actorId: number;
  actorName: string;
  actorRole: string | null;
  comment: string | null;
  requestId: number | null;
}

export interface AuditTimelineItem {
  logId: number;
  logDatetime: string;
  actionType: ActionType;
  stateFrom: string | null;
  stateTo: string | null;
  actorName: string;
  actorRole: string | null;
  comment: string | null;
  requestNo: string | null;
}

export interface AuditTimelineResponse {
  targetType: TargetType;
  targetId: number;
  targetName: string;
  timeline: AuditTimelineItem[];
}

const MOCK_AUDIT_LOGS: AuditLogItem[] = [
  {
    logId: 1,
    logDatetime: new Date("2026-03-20T15:30:00"),
    targetType: "TERM",
    targetName: "고객번호",
    targetId: 1,
    actionType: "APPROVE",
    stateFrom: "REVIEW",
    stateTo: "APPROVED",
    actorId: 2,
    actorName: "이승인",
    actorRole: "REVIEWER_APPROVER",
    comment: "검토 완료, 승인 처리",
    requestId: 5,
  },
  {
    logId: 2,
    logDatetime: new Date("2026-03-20T14:00:00"),
    targetType: "WORD",
    targetName: "거래",
    targetId: 12,
    actionType: "REQUEST",
    stateFrom: null,
    stateTo: "PENDING",
    actorId: 3,
    actorName: "박신청",
    actorRole: "REQUESTER",
    comment: "금융 거래 표준단어 신청",
    requestId: 6,
  },
  {
    logId: 3,
    logDatetime: new Date("2026-03-19T11:00:00"),
    targetType: "DOMAIN",
    targetName: "금액",
    targetId: 5,
    actionType: "UPDATE",
    stateFrom: "BASELINE",
    stateTo: "BASELINE",
    actorId: 4,
    actorName: "김관리",
    actorRole: "STD_MANAGER",
    comment: null,
    requestId: null,
  },
  {
    logId: 4,
    logDatetime: new Date("2026-03-18T09:30:00"),
    targetType: "TERM",
    targetName: "계좌잔액",
    targetId: 8,
    actionType: "CREATE",
    stateFrom: null,
    stateTo: "BASELINE",
    actorId: 4,
    actorName: "김관리",
    actorRole: "STD_MANAGER",
    comment: "신규 표준용어 직접 등록",
    requestId: null,
  },
  {
    logId: 5,
    logDatetime: new Date("2026-03-17T16:00:00"),
    targetType: "WORD",
    targetName: "잔액",
    targetId: 15,
    actionType: "REJECT",
    stateFrom: "REVIEW",
    stateTo: "REJECTED",
    actorId: 2,
    actorName: "이승인",
    actorRole: "REVIEWER_APPROVER",
    comment: "영문약어 규칙 미준수",
    requestId: 4,
  },
];

export async function getAuditList(
  params: AuditListParams = {},
): Promise<PaginatedResponse<AuditLogItem>> {
  await delay();
  let filtered = [...MOCK_AUDIT_LOGS];
  if (params.targetType) {
    filtered = filtered.filter((l) => l.targetType === params.targetType);
  }
  if (params.actionType) {
    filtered = filtered.filter((l) => l.actionType === params.actionType);
  }
  if (params.keyword) {
    const kw = params.keyword.toLowerCase();
    filtered = filtered.filter(
      (l) =>
        l.targetName.toLowerCase().includes(kw) ||
        l.actorName.toLowerCase().includes(kw),
    );
  }
  if (params.actor) {
    const actor = params.actor.toLowerCase();
    filtered = filtered.filter((l) =>
      l.actorName.toLowerCase().includes(actor),
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

export async function getAuditTimeline(
  targetType: TargetType,
  targetId: number,
): Promise<AuditTimelineResponse> {
  await delay();
  return {
    targetType,
    targetId,
    targetName: "고객번호",
    timeline: [
      {
        logId: 10,
        logDatetime: "2026-03-20T15:30:00Z",
        actionType: "APPROVE",
        stateFrom: "REVIEW",
        stateTo: "APPROVED",
        actorName: "이승인",
        actorRole: "REVIEWER_APPROVER",
        comment: "검토 완료, 승인 처리",
        requestNo: "REQ-2026-0010",
      },
      {
        logId: 9,
        logDatetime: "2026-03-18T10:00:00Z",
        actionType: "REVIEW",
        stateFrom: "PENDING",
        stateTo: "REVIEW",
        actorName: "이승인",
        actorRole: "REVIEWER_APPROVER",
        comment: null,
        requestNo: "REQ-2026-0010",
      },
      {
        logId: 8,
        logDatetime: "2026-03-15T14:30:00Z",
        actionType: "REQUEST",
        stateFrom: null,
        stateTo: "PENDING",
        actorName: "박신청",
        actorRole: "REQUESTER",
        comment: "정의 보완 필요",
        requestNo: "REQ-2026-0010",
      },
    ],
  };
}
