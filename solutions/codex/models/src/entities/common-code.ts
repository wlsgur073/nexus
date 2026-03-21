import type { BaseEntity } from "./base";
import type { StandardStatus } from "./enums";

/** 공통코드그룹 — 공통코드를 논리적으로 그룹화 */
export interface CommonCodeGroup extends BaseEntity {
  groupId: number;
  groupCode: string;
  groupName: string;
  codeCount: number;
  status: StandardStatus;
  regDate: Date;
}

/** 공통코드 — 공통코드그룹에 소속된 개별 코드값 */
export interface CommonCode extends BaseEntity {
  codeId: number;
  groupId: number;
  code: string;
  codeName: string;
  description: string | null;
  useYn: "Y" | "N";
  status: StandardStatus;
  regDate: Date;
}
