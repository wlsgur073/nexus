import type { Comment, CommentTarget } from "../entities";
import { baseFields, delay } from "./helpers";

export interface CreateCommentInput {
  targetType: CommentTarget;
  targetId: number;
  content: string;
  fieldName?: string;
  parentCommentId?: number;
}

export interface UpdateCommentInput {
  content: string;
}

const MOCK_COMMENTS: Comment[] = [
  {
    commentId: 1,
    targetType: "REQUEST",
    targetId: 2,
    authorId: 1,
    content: "정의가 좀 더 구체적이면 좋겠습니다.",
    fieldName: "definition",
    parentCommentId: null,
    isResolved: false,
    resolvedBy: null,
    resolvedAt: null,
    ...baseFields(),
  },
  {
    commentId: 2,
    targetType: "REQUEST",
    targetId: 2,
    authorId: 3,
    content: "네, 수정하겠습니다.",
    fieldName: "definition",
    parentCommentId: 1,
    isResolved: false,
    resolvedBy: null,
    resolvedAt: null,
    ...baseFields("user3"),
  },
  {
    commentId: 3,
    targetType: "DRAFT",
    targetId: 1,
    authorId: 2,
    content: "도메인유형을 코드로 설정하는 것이 맞을까요?",
    fieldName: "domainType",
    parentCommentId: null,
    isResolved: false,
    resolvedBy: null,
    resolvedAt: null,
    ...baseFields("user2"),
  },
];

export async function getComments(
  targetType: CommentTarget,
  targetId: number,
): Promise<Comment[]> {
  await delay();
  return MOCK_COMMENTS.filter(
    (c) => c.targetType === targetType && c.targetId === targetId,
  );
}

export async function createComment(
  input: CreateCommentInput,
): Promise<Comment> {
  await delay(300);
  return {
    commentId: 100,
    targetType: input.targetType,
    targetId: input.targetId,
    authorId: 1,
    content: input.content,
    fieldName: input.fieldName ?? null,
    parentCommentId: input.parentCommentId ?? null,
    isResolved: false,
    resolvedBy: null,
    resolvedAt: null,
    ...baseFields(),
  };
}

export async function updateComment(
  commentId: number,
  input: UpdateCommentInput,
): Promise<Comment> {
  await delay(300);
  const existing = MOCK_COMMENTS.find((c) => c.commentId === commentId);
  if (!existing) throw new Error("Comment not found");
  return { ...existing, content: input.content, updatedAt: new Date() };
}

export async function deleteComment(commentId: number): Promise<void> {
  await delay(300);
  // Mock: no-op
}

export async function resolveComment(commentId: number): Promise<Comment> {
  await delay(300);
  const existing = MOCK_COMMENTS.find((c) => c.commentId === commentId);
  if (!existing) throw new Error("Comment not found");
  return {
    ...existing,
    isResolved: true,
    resolvedBy: 1,
    resolvedAt: new Date(),
  };
}
