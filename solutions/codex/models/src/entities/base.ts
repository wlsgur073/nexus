/** 모든 엔티티의 공통 감사 필드 */
export interface BaseEntity {
  createdAt: Date;
  createdBy: string;
  updatedAt: Date;
  updatedBy: string;
}
