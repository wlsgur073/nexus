import type { Draft, DraftStatus, TargetType } from "../entities";
import { baseFields, delay } from "./helpers";
import type { PaginatedResponse, PaginationParams } from "./helpers";

export interface DraftListParams extends PaginationParams {
  status?: DraftStatus;
  targetType?: TargetType;
}

export interface CreateDraftInput {
  targetType: TargetType;
  targetId?: number;
  title: string;
  data: Record<string, unknown>;
}

export interface UpdateDraftInput {
  data: Record<string, unknown>;
  title?: string;
}

const MOCK_DRAFTS: Draft[] = [
  {
    draftId: 1,
    targetType: "TERM",
    targetId: null,
    title: "신규 용어 초안 - 거래유형코드",
    status: "EDITING",
    authorId: 1,
    data: { termName: "거래유형코드", domainType: "코드" },
    changesSummary: null,
    requestId: null,
    collaboratorIds: [2],
    lastEditedAt: new Date(Date.now() - 1000 * 60 * 60),
    autoSavedAt: new Date(Date.now() - 1000 * 60 * 30),
    version: 3,
    ...baseFields(),
  },
  {
    draftId: 2,
    targetType: "WORD",
    targetId: 3,
    title: "거래 단어 정의 수정",
    status: "READY",
    authorId: 1,
    data: {
      definition: "금융 또는 상거래에서 발생하는 매매 행위 또는 거래 활동",
    },
    changesSummary: "정의 필드 수정",
    requestId: null,
    collaboratorIds: [],
    lastEditedAt: new Date(Date.now() - 1000 * 60 * 60 * 24),
    autoSavedAt: new Date(Date.now() - 1000 * 60 * 60 * 24),
    version: 2,
    ...baseFields(),
  },
];

export async function getDraftList(
  params: DraftListParams = {},
): Promise<PaginatedResponse<Draft>> {
  await delay();
  let filtered = [...MOCK_DRAFTS];
  if (params.status) {
    filtered = filtered.filter((d) => d.status === params.status);
  }
  if (params.targetType) {
    filtered = filtered.filter((d) => d.targetType === params.targetType);
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

export async function createDraft(input: CreateDraftInput): Promise<Draft> {
  await delay(500);
  return {
    draftId: 100,
    targetType: input.targetType,
    targetId: input.targetId ?? null,
    title: input.title,
    status: "EDITING",
    authorId: 1,
    data: input.data,
    changesSummary: null,
    requestId: null,
    collaboratorIds: [],
    lastEditedAt: new Date(),
    autoSavedAt: null,
    version: 1,
    ...baseFields(),
  };
}

export async function getDraftDetail(
  draftId: number,
): Promise<Draft | null> {
  await delay();
  return MOCK_DRAFTS.find((d) => d.draftId === draftId) ?? null;
}

export async function updateDraft(
  draftId: number,
  input: UpdateDraftInput,
): Promise<Draft> {
  await delay(300);
  const existing = MOCK_DRAFTS.find((d) => d.draftId === draftId);
  if (!existing) throw new Error("Draft not found");
  return {
    ...existing,
    data: { ...existing.data, ...input.data },
    title: input.title ?? existing.title,
    lastEditedAt: new Date(),
    autoSavedAt: new Date(),
    version: existing.version + 1,
  };
}

export async function changeDraftStatus(
  draftId: number,
  status: DraftStatus,
): Promise<Draft> {
  await delay(300);
  const existing = MOCK_DRAFTS.find((d) => d.draftId === draftId);
  if (!existing) throw new Error("Draft not found");
  return { ...existing, status };
}

export async function deleteDraft(draftId: number): Promise<void> {
  await delay(300);
  // Mock: no-op
}

export async function addCollaborator(
  draftId: number,
  userId: number,
): Promise<Draft> {
  await delay(300);
  const existing = MOCK_DRAFTS.find((d) => d.draftId === draftId);
  if (!existing) throw new Error("Draft not found");
  return {
    ...existing,
    collaboratorIds: [...existing.collaboratorIds, userId],
  };
}

export async function removeCollaborator(
  draftId: number,
  userId: number,
): Promise<Draft> {
  await delay(300);
  const existing = MOCK_DRAFTS.find((d) => d.draftId === draftId);
  if (!existing) throw new Error("Draft not found");
  return {
    ...existing,
    collaboratorIds: existing.collaboratorIds.filter((id) => id !== userId),
  };
}

export async function submitDraftAsRequest(
  draftId: number,
): Promise<{ draftId: number; requestNo: string }> {
  await delay(500);
  return {
    draftId,
    requestNo: "REQ-2026-0300",
  };
}
