"use client";

import { useState } from "react";
import { Lock, Plus, Trash2 } from "lucide-react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

import {
  Badge,
  Button,
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  Input,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@nexus/ui";
import {
  getSystemCodeList,
  getSystemCodeCategories,
  createSystemCode,
  deleteSystemCode,
} from "@nexus/codex-models";
import { QUERY_KEYS } from "@nexus/codex-shared";

export function SystemCodeTable() {
  const queryClient = useQueryClient();
  const [keyword, setKeyword] = useState("");
  const [categoryFilter, setCategoryFilter] = useState<string>("all");

  const { data, isLoading } = useQuery({
    queryKey: QUERY_KEYS.systemCodes.list({
      keyword,
      category: categoryFilter,
    }),
    queryFn: () =>
      getSystemCodeList({
        keyword: keyword || undefined,
        category: categoryFilter !== "all" ? categoryFilter : undefined,
        pageSize: 50,
      }),
  });

  const { data: categories } = useQuery({
    queryKey: QUERY_KEYS.systemCodes.categories,
    queryFn: getSystemCodeCategories,
  });

  const codes = data?.items ?? [];

  const handleAddCode = async () => {
    const category = prompt("카테고리를 입력하세요 (예: DATA_TYPE):");
    if (!category) return;
    const code = prompt("코드를 입력하세요:");
    if (!code) return;
    const codeName = prompt("코드명을 입력하세요:");
    if (!codeName) return;
    try {
      await createSystemCode({ category, code, codeName });
      await queryClient.invalidateQueries({ queryKey: ["system-codes"] });
      toast.success("시스템 코드가 생성되었습니다.");
    } catch {
      toast.error("코드 생성에 실패했습니다.");
    }
  };

  const handleDeleteCode = async (sysCodeId: number, codeName: string) => {
    if (!confirm(`"${codeName}" 코드를 삭제하시겠습니까?`)) return;
    try {
      await deleteSystemCode(sysCodeId);
      await queryClient.invalidateQueries({ queryKey: ["system-codes"] });
      toast.success("시스템 코드가 삭제되었습니다.");
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "코드 삭제에 실패했습니다.");
    }
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-base">시스템 코드</CardTitle>
          <Button variant="outline" size="sm" onClick={handleAddCode}>
            <Plus className="mr-1 h-3 w-3" />
            코드 추가
          </Button>
        </div>
        <div className="mt-4 flex gap-3">
          <Input
            placeholder="코드, 코드명 검색..."
            value={keyword}
            onChange={(e) => setKeyword(e.target.value)}
            className="max-w-sm"
          />
          <Select
            value={categoryFilter}
            onValueChange={(v) => setCategoryFilter(v ?? "all")}
          >
            <SelectTrigger className="w-48">
              <SelectValue placeholder="카테고리 필터" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">전체 카테고리</SelectItem>
              {(categories ?? []).map((cat) => (
                <SelectItem key={cat} value={cat}>
                  {cat}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="flex h-40 items-center justify-center text-sm text-muted-foreground">
            로딩 중...
          </div>
        ) : codes.length === 0 ? (
          <div className="flex h-40 items-center justify-center text-sm text-muted-foreground">
            검색 결과가 없습니다.
          </div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>카테고리</TableHead>
                <TableHead>코드</TableHead>
                <TableHead>코드명</TableHead>
                <TableHead>설명</TableHead>
                <TableHead>보호</TableHead>
                <TableHead className="w-16">작업</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {codes.map((code) => (
                <TableRow key={code.sysCodeId}>
                  <TableCell>
                    <Badge variant="outline" className="font-mono text-xs">
                      {code.category}
                    </Badge>
                  </TableCell>
                  <TableCell className="font-mono text-sm">
                    {code.code}
                  </TableCell>
                  <TableCell className="font-medium">{code.codeName}</TableCell>
                  <TableCell className="max-w-xs truncate text-muted-foreground">
                    {code.description ?? "—"}
                  </TableCell>
                  <TableCell>
                    {code.isProtected ? (
                      <Tooltip>
                        <TooltipTrigger>
                          <Lock className="h-4 w-4 text-amber-500" />
                        </TooltipTrigger>
                        <TooltipContent>
                          보호 코드 — 수정/삭제 불가
                        </TooltipContent>
                      </Tooltip>
                    ) : (
                      <span className="text-xs text-muted-foreground">—</span>
                    )}
                  </TableCell>
                  <TableCell>
                    {!code.isProtected && (
                      <button
                        type="button"
                        onClick={() =>
                          handleDeleteCode(code.sysCodeId, code.codeName)
                        }
                        className="rounded p-1 text-muted-foreground hover:bg-destructive/10 hover:text-destructive"
                        aria-label={`${code.codeName} 삭제`}
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    )}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </CardContent>
    </Card>
  );
}
