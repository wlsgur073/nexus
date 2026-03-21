import type { Draft, TargetType } from "../entities";
import { baseFields, delay } from "./helpers";

export interface StartInlineEditInput {
  targetType: TargetType;
  targetId: number;
}

export interface UpdateDraftFieldInput {
  draftId: number;
  fieldName: string;
  value: unknown;
}

export interface InlineDiffItem {
  fieldName: string;
  fieldLabel: string;
  oldValue: string | null;
  newValue: string | null;
}

export async function startInlineEdit(
  input: StartInlineEditInput,
): Promise<Draft> {
  await delay(500);
  return {
    draftId: 100,
    targetType: input.targetType,
    targetId: input.targetId,
    title: `${input.targetType} #${input.targetId} 인라인 편집`,
    status: "EDITING",
    authorId: 1,
    data: {},
    changesSummary: null,
    requestId: null,
    collaboratorIds: [],
    lastEditedAt: new Date(),
    autoSavedAt: null,
    version: 1,
    ...baseFields(),
  };
}

export async function updateDraftField(
  input: UpdateDraftFieldInput,
): Promise<Draft> {
  await delay(200);
  return {
    draftId: input.draftId,
    targetType: "TERM",
    targetId: 1,
    title: "인라인 편집",
    status: "EDITING",
    authorId: 1,
    data: { [input.fieldName]: input.value },
    changesSummary: `${input.fieldName} 변경`,
    requestId: null,
    collaboratorIds: [],
    lastEditedAt: new Date(),
    autoSavedAt: new Date(),
    version: 2,
    ...baseFields(),
  };
}

export async function submitInlineDraft(
  draftId: number,
): Promise<{ draftId: number; requestNo: string }> {
  await delay(500);
  return {
    draftId,
    requestNo: "REQ-2026-0200",
  };
}

export async function getInlineDiff(
  draftId: number,
): Promise<InlineDiffItem[]> {
  await delay();
  return [
    {
      fieldName: "definition",
      fieldLabel: "정의",
      oldValue: "고객을 식별하는 번호",
      newValue: "고객을 식별하는 고유 번호",
    },
  ];
}
