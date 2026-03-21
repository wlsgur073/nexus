import type { BaseEntity } from "./base";
import type {
  CommentTarget,
  DraftStatus,
  ImpactLevel,
  RequestStatus,
  RequestType,
  TargetType,
} from "./enums";

/** 신청 — 모든 표준 변경의 거버넌스 진입점 */
export interface Request extends BaseEntity {
  requestId: number;
  requestNo: string;
  targetType: TargetType;
  targetId: number | null;
  targetName: string;
  requestType: RequestType;
  status: RequestStatus;
  requesterId: number;
  requestDate: Date;
  processDate: Date | null;
  requestReason: string | null;
  parentRequestId: number | null;
}

/** 신청변경이력 — 필드별 현재값/변경요청값 기록 */
export interface RequestChange extends BaseEntity {
  changeId: number;
  requestId: number;
  fieldName: string;
  oldValue: string | null;
  newValue: string | null;
}

/** 삭제영향도 — 삭제 신청 시 영향도 평가서 */
export interface DeleteImpact extends BaseEntity {
  impactId: number;
  requestId: number;
  targetType: TargetType;
  targetId: number;
  affectedSystems: string | null;
  affectedOther: string | null;
  impactLevel: ImpactLevel;
  impactDesc: string;
  altStandard: string | null;
  migrationPlan: string | null;
  deleteReason: string;
}

/** 초안 — 인라인 거버넌스 편집 중인 초안 */
export interface Draft extends BaseEntity {
  draftId: number;
  targetType: TargetType;
  targetId: number | null;
  title: string;
  status: DraftStatus;
  authorId: number;
  data: Record<string, unknown>;
  changesSummary: string | null;
  requestId: number | null;
  collaboratorIds: number[];
  lastEditedAt: Date;
  autoSavedAt: Date | null;
  version: number;
}

/** 코멘트 — 초안/신청에 대한 협업 코멘트 */
export interface Comment extends BaseEntity {
  commentId: number;
  targetType: CommentTarget;
  targetId: number;
  authorId: number;
  content: string;
  fieldName: string | null;
  parentCommentId: number | null;
  isResolved: boolean;
  resolvedBy: number | null;
  resolvedAt: Date | null;
}
