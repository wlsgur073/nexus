import type { BaseEntity } from "./base";
import type { DataType, StandardStatus } from "./enums";

/** 표준단어 — 데이터 명칭의 최소 단위 */
export interface StandardWord extends BaseEntity {
  wordId: number;
  wordName: string;
  abbrName: string;
  engName: string;
  definition: string;
  domainType: string | null;
  status: StandardStatus;
  regDate: Date;
  modDate: Date | null;
  regUserId: number;
}

/** 표준도메인 — 데이터 타입과 길이를 정의하는 단위 */
export interface StandardDomain extends BaseEntity {
  domainId: number;
  domainName: string;
  domainType: string;
  dataType: DataType;
  dataLength: string | null;
  definition: string;
  status: StandardStatus;
  regDate: Date;
  modDate: Date | null;
  regUserId: number;
}

/** 표준용어 — 단어 + 도메인 조합 비즈니스 용어 */
export interface StandardTerm extends BaseEntity {
  termId: number;
  termName: string;
  physicalName: string;
  domainType: string;
  infoType: string;
  definition: string;
  status: StandardStatus;
  regDate: Date;
  modDate: Date | null;
  regUserId: number;
}

/** 용어-단어 관계 — 표준용어를 구성하는 표준단어의 순서 정보 */
export interface StandardTermWord {
  termId: number;
  wordId: number;
  seq: number;
}
