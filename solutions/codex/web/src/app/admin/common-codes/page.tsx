import { CommonCodeSearchTable } from "@/components/common-codes/common-code-search-table";

export default function AdminCommonCodesPage() {
  return (
    <div className="space-y-6 p-6">
      <div>
        <h1 className="text-2xl font-bold">공통코드 관리</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          공통코드 그룹과 코드를 생성, 수정, 삭제할 수 있습니다.
        </p>
      </div>
      <CommonCodeSearchTable editable />
    </div>
  );
}
