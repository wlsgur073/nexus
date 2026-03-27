"use client";

import { useState } from "react";
import { Edit2, Plus, Trash2 } from "lucide-react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

import {
  Badge,
  Button,
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  Input,
  Label,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  Skeleton,
  Switch,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@nexus/ui";
import {
  getSystemCodeList,
  getSystemCodeCategories,
  createSystemCode,
  updateSystemCode,
  deleteSystemCode,
  toggleSystemCodeProtection,
} from "@nexus/codex-models";
import { QUERY_KEYS } from "@nexus/codex-shared";

import type { SystemCodeItem } from "@nexus/codex-models";

export function SystemCodeTable() {
  const queryClient = useQueryClient();
  const [keyword, setKeyword] = useState("");
  const [categoryFilter, setCategoryFilter] = useState<string>("all");

  // Dialog states
  const [formDialog, setFormDialog] = useState<{
    open: boolean;
    mode: "add" | "edit";
    item?: SystemCodeItem;
  }>({ open: false, mode: "add" });
  const [deleteDialog, setDeleteDialog] = useState<{
    open: boolean;
    item: SystemCodeItem | null;
  }>({ open: false, item: null });

  // Form fields
  const [formCategory, setFormCategory] = useState("");
  const [formCode, setFormCode] = useState("");
  const [formCodeName, setFormCodeName] = useState("");
  const [formDescription, setFormDescription] = useState("");
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});

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

  const openAddDialog = () => {
    setFormCategory("");
    setFormCode("");
    setFormCodeName("");
    setFormDescription("");
    setFormErrors({});
    setFormDialog({ open: true, mode: "add" });
  };

  const openEditDialog = (item: SystemCodeItem) => {
    setFormCategory(item.category);
    setFormCode(item.code);
    setFormCodeName(item.codeName);
    setFormDescription(item.description ?? "");
    setFormErrors({});
    setFormDialog({ open: true, mode: "edit", item });
  };

  const handleFormSubmit = async () => {
    const errors: Record<string, string> = {};
    if (formDialog.mode === "add") {
      if (!formCategory.trim()) errors.category = "카테고리를 입력해주세요.";
      if (!formCode.trim()) errors.code = "코드를 입력해주세요.";
    }
    if (!formCodeName.trim()) errors.codeName = "코드명을 입력해주세요.";
    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      return;
    }
    setFormErrors({});
    try {
      if (formDialog.mode === "add") {
        await createSystemCode({
          category: formCategory,
          code: formCode,
          codeName: formCodeName,
          description: formDescription || undefined,
        });
        toast.success("시스템 코드가 생성되었습니다.");
      } else if (formDialog.item) {
        await updateSystemCode(formDialog.item.sysCodeId, {
          codeName: formCodeName,
          description: formDescription || undefined,
        });
        toast.success("시스템 코드가 수정되었습니다.");
      }
      await queryClient.invalidateQueries({ queryKey: ["system-codes"] });
      setFormDialog({ open: false, mode: "add" });
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "저장에 실패했습니다.");
    }
  };

  const handleToggleProtection = async (item: SystemCodeItem) => {
    try {
      await toggleSystemCodeProtection(item.sysCodeId);
      await queryClient.invalidateQueries({ queryKey: ["system-codes"] });
      toast.success(
        item.isProtected
          ? `"${item.codeName}" 보호가 해제되었습니다.`
          : `"${item.codeName}" 보호가 설정되었습니다.`,
      );
    } catch (e) {
      toast.error(
        e instanceof Error ? e.message : "보호 상태 변경에 실패했습니다.",
      );
    }
  };

  const handleDelete = async () => {
    if (!deleteDialog.item) return;
    try {
      await deleteSystemCode(deleteDialog.item.sysCodeId);
      await queryClient.invalidateQueries({ queryKey: ["system-codes"] });
      toast.success("시스템 코드가 삭제되었습니다.");
      setDeleteDialog({ open: false, item: null });
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "삭제에 실패했습니다.");
    }
  };

  return (
    <>
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="text-base">시스템 코드</CardTitle>
            <Button variant="outline" size="sm" onClick={openAddDialog}>
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
              onValueChange={(v) => setCategoryFilter((v ?? "all") as string)}
            >
              <SelectTrigger className="w-48">
                <span className="flex flex-1 text-left">
                  {categoryFilter === "all" ? "전체 카테고리" : categoryFilter}
                </span>
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
            <div className="space-y-3">
              <Skeleton className="h-10 w-full" />
              {Array.from({ length: 5 }).map((_, i) => (
                <Skeleton key={i} className="h-12 w-full" />
              ))}
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
                  <TableHead className="w-20">작업</TableHead>
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
                    <TableCell className="font-medium">
                      {code.codeName}
                    </TableCell>
                    <TableCell className="max-w-xs truncate text-muted-foreground">
                      {code.description ?? "—"}
                    </TableCell>
                    <TableCell>
                      <Switch
                        checked={code.isProtected}
                        onCheckedChange={() => handleToggleProtection(code)}
                        aria-label={`${code.codeName} 보호 설정`}
                      />
                    </TableCell>
                    <TableCell>
                      {!code.isProtected && (
                        <div className="flex gap-1">
                          <button
                            type="button"
                            onClick={() => openEditDialog(code)}
                            className="rounded p-1 text-muted-foreground hover:bg-accent hover:text-foreground"
                            aria-label={`${code.codeName} 수정`}
                          >
                            <Edit2 className="h-4 w-4" />
                          </button>
                          <button
                            type="button"
                            onClick={() =>
                              setDeleteDialog({ open: true, item: code })
                            }
                            className="rounded p-1 text-muted-foreground hover:bg-destructive/10 hover:text-destructive"
                            aria-label={`${code.codeName} 삭제`}
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>
                      )}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      {/* Add/Edit Dialog */}
      <Dialog
        open={formDialog.open}
        onOpenChange={(open) => {
          if (!open) setFormDialog({ open: false, mode: "add" });
        }}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {formDialog.mode === "add"
                ? "시스템 코드 추가"
                : "시스템 코드 수정"}
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="sys-category">카테고리</Label>
              <Input
                id="sys-category"
                value={formCategory}
                onChange={(e) => {
                  setFormCategory(e.target.value);
                  setFormErrors((p) => ({ ...p, category: "" }));
                }}
                placeholder="UPPER_SNAKE_CASE (예: DATA_TYPE)"
                disabled={formDialog.mode === "edit"}
              />
              {formErrors.category && (
                <p className="text-xs text-destructive">
                  {formErrors.category}
                </p>
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="sys-code">코드</Label>
              <Input
                id="sys-code"
                value={formCode}
                onChange={(e) => {
                  setFormCode(e.target.value);
                  setFormErrors((p) => ({ ...p, code: "" }));
                }}
                placeholder="코드 값"
                disabled={formDialog.mode === "edit"}
              />
              {formErrors.code && (
                <p className="text-xs text-destructive">{formErrors.code}</p>
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="sys-code-name">코드명</Label>
              <Input
                id="sys-code-name"
                value={formCodeName}
                onChange={(e) => {
                  setFormCodeName(e.target.value);
                  setFormErrors((p) => ({ ...p, codeName: "" }));
                }}
                placeholder="코드명을 입력하세요"
              />
              {formErrors.codeName && (
                <p className="text-xs text-destructive">
                  {formErrors.codeName}
                </p>
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="sys-desc">설명</Label>
              <Input
                id="sys-desc"
                value={formDescription}
                onChange={(e) => setFormDescription(e.target.value)}
                placeholder="설명 (선택)"
              />
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setFormDialog({ open: false, mode: "add" })}
            >
              취소
            </Button>
            <Button onClick={handleFormSubmit}>
              {formDialog.mode === "add" ? "추가" : "저장"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog
        open={deleteDialog.open}
        onOpenChange={(open) => {
          if (!open) setDeleteDialog({ open: false, item: null });
        }}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>시스템 코드 삭제</DialogTitle>
            <DialogDescription>
              <strong>&quot;{deleteDialog.item?.codeName}&quot;</strong> (
              {deleteDialog.item?.code}) 코드를 삭제하시겠습니까? 이 작업은
              되돌릴 수 없습니다.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setDeleteDialog({ open: false, item: null })}
            >
              취소
            </Button>
            <Button variant="destructive" onClick={handleDelete}>
              삭제
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
