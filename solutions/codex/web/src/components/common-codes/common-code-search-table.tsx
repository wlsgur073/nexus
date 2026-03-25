"use client";

import { useState } from "react";
import { Edit2, Plus, Search, Trash2 } from "lucide-react";
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
  ScrollArea,
  Separator,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
  Switch,
  Textarea,
  cn,
} from "@nexus/ui";
import {
  getCommonCodeGroups,
  getCommonCodesByGroup,
  createCommonCodeGroup,
  updateCommonCodeGroup,
  addCommonCode,
  updateCommonCode,
  deleteCommonCode,
} from "@nexus/codex-models";
import { QUERY_KEYS } from "@nexus/codex-shared";

import type { CommonCodeGroupItem, CommonCodeItem } from "@nexus/codex-models";

interface CommonCodeSearchTableProps {
  editable?: boolean;
}

export function CommonCodeSearchTable({
  editable = false,
}: CommonCodeSearchTableProps) {
  const queryClient = useQueryClient();
  const [selectedGroup, setSelectedGroup] =
    useState<CommonCodeGroupItem | null>(null);
  const [keyword, setKeyword] = useState("");

  // Dialog states
  const [groupDialog, setGroupDialog] = useState<{
    open: boolean;
    mode: "add" | "edit";
    group?: CommonCodeGroupItem;
  }>({ open: false, mode: "add" });
  const [codeDialog, setCodeDialog] = useState<{
    open: boolean;
    mode: "add" | "edit";
    code?: CommonCodeItem;
  }>({ open: false, mode: "add" });
  const [deleteDialog, setDeleteDialog] = useState<{
    open: boolean;
    code: CommonCodeItem | null;
  }>({ open: false, code: null });

  // Group form fields
  const [groupCode, setGroupCode] = useState("");
  const [groupName, setGroupName] = useState("");
  // Code form fields
  const [codeValue, setCodeValue] = useState("");
  const [codeName, setCodeName] = useState("");
  const [codeDescription, setCodeDescription] = useState("");
  const [codeUseYn, setCodeUseYn] = useState<"Y" | "N">("Y");

  const { data: groupsData, isLoading: groupsLoading } = useQuery({
    queryKey: QUERY_KEYS.commonCodes.groups({ pageSize: 100 }),
    queryFn: () => getCommonCodeGroups({ pageSize: 100 }),
  });

  const groups = groupsData?.items ?? [];

  const { data: codesData } = useQuery({
    queryKey: QUERY_KEYS.commonCodes.codes(selectedGroup?.groupId ?? 0),
    queryFn: () => getCommonCodesByGroup(selectedGroup!.groupId),
    enabled: !!selectedGroup,
  });

  const codes = codesData ?? [];

  const handleGroupSelect = (group: CommonCodeGroupItem) => {
    setSelectedGroup(group);
  };

  // ── Group CRUD ──
  const openAddGroup = () => {
    setGroupCode("");
    setGroupName("");
    setGroupDialog({ open: true, mode: "add" });
  };

  const openEditGroup = (group: CommonCodeGroupItem) => {
    setGroupCode(group.groupCode);
    setGroupName(group.groupName);
    setGroupDialog({ open: true, mode: "edit", group });
  };

  const handleGroupSubmit = async () => {
    if (!groupName.trim()) return;
    try {
      if (groupDialog.mode === "add") {
        if (!groupCode.trim()) return;
        await createCommonCodeGroup({ groupCode, groupName });
        toast.success("코드그룹이 생성되었습니다.");
      } else if (groupDialog.group) {
        await updateCommonCodeGroup(groupDialog.group.groupId, { groupName });
        toast.success("코드그룹이 수정되었습니다.");
      }
      await queryClient.invalidateQueries({
        queryKey: ["common-codes", "groups"],
      });
      setGroupDialog({ open: false, mode: "add" });
    } catch {
      toast.error("코드그룹 저장에 실패했습니다.");
    }
  };

  // ── Code CRUD ──
  const openAddCode = () => {
    setCodeValue("");
    setCodeName("");
    setCodeDescription("");
    setCodeUseYn("Y");
    setCodeDialog({ open: true, mode: "add" });
  };

  const openEditCode = (code: CommonCodeItem) => {
    setCodeValue(code.code);
    setCodeName(code.codeName);
    setCodeDescription(code.description ?? "");
    setCodeUseYn(code.useYn);
    setCodeDialog({ open: true, mode: "edit", code });
  };

  const handleCodeSubmit = async () => {
    if (!selectedGroup || !codeValue.trim() || !codeName.trim()) return;
    try {
      if (codeDialog.mode === "add") {
        await addCommonCode(selectedGroup.groupId, {
          code: codeValue,
          codeName,
          description: codeDescription || undefined,
          useYn: codeUseYn,
        });
        toast.success("코드가 추가되었습니다.");
      } else if (codeDialog.code) {
        await updateCommonCode(codeDialog.code.codeId, {
          codeName,
          description: codeDescription || undefined,
          useYn: codeUseYn,
        });
        toast.success("코드가 수정되었습니다.");
      }
      await queryClient.invalidateQueries({
        queryKey: QUERY_KEYS.commonCodes.codes(selectedGroup.groupId),
      });
      setCodeDialog({ open: false, mode: "add" });
    } catch {
      toast.error("코드 저장에 실패했습니다.");
    }
  };

  const openDeleteCode = (code: CommonCodeItem) => {
    setDeleteDialog({ open: true, code });
  };

  const handleDeleteCode = async () => {
    if (!deleteDialog.code || !selectedGroup) return;
    try {
      await deleteCommonCode(selectedGroup.groupId, deleteDialog.code.codeId);
      toast.success(`"${deleteDialog.code.codeName}" 코드가 삭제되었습니다.`);
      await queryClient.invalidateQueries({
        queryKey: QUERY_KEYS.commonCodes.codes(selectedGroup.groupId),
      });
      await queryClient.invalidateQueries({
        queryKey: ["common-codes", "groups"],
      });
      setDeleteDialog({ open: false, code: null });
    } catch {
      toast.error("코드 삭제에 실패했습니다.");
    }
  };

  const filteredGroups = keyword
    ? groups.filter(
        (g) =>
          g.groupName.includes(keyword) ||
          g.groupCode.toLowerCase().includes(keyword.toLowerCase()),
      )
    : groups;

  if (groups.length === 0 && groupsLoading) {
    return (
      <div className="flex h-40 items-center justify-center text-sm text-muted-foreground">
        로딩 중...
      </div>
    );
  }

  return (
    <>
      <div className="flex gap-6">
        {/* Left: Group list */}
        <Card className="w-80 shrink-0">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-sm">코드그룹</CardTitle>
              {editable && (
                <Button variant="outline" size="sm" onClick={openAddGroup}>
                  <Plus className="mr-1 h-3 w-3" />
                  <span className="sr-only sm:not-sr-only">추가</span>
                </Button>
              )}
            </div>
            <div className="relative mt-2">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                value={keyword}
                onChange={(e) => setKeyword(e.target.value)}
                placeholder="그룹명, 그룹코드 검색..."
                className="pl-9"
              />
            </div>
          </CardHeader>
          <Separator />
          <ScrollArea className="h-[500px]">
            <div className="p-2">
              {filteredGroups.length === 0 ? (
                <p className="py-4 text-center text-sm text-muted-foreground">
                  코드그룹이 없습니다.
                </p>
              ) : (
                filteredGroups.map((group) => (
                  <div
                    key={group.groupId}
                    className={cn(
                      "group flex items-center justify-between rounded-md px-3 py-2 text-sm transition-colors hover:bg-accent",
                      selectedGroup?.groupId === group.groupId &&
                        "bg-accent font-medium",
                    )}
                  >
                    <button
                      type="button"
                      onClick={() => handleGroupSelect(group)}
                      className="flex flex-1 items-center justify-between text-left"
                    >
                      <div>
                        <p className="font-medium">{group.groupName}</p>
                        <p className="font-mono text-xs text-muted-foreground">
                          {group.groupCode}
                        </p>
                      </div>
                      <Badge variant="outline" className="text-xs">
                        {group.codeCount}
                      </Badge>
                    </button>
                    {editable && (
                      <button
                        type="button"
                        onClick={() => openEditGroup(group)}
                        className="ml-2 hidden rounded p-1 text-muted-foreground hover:bg-background hover:text-foreground group-hover:inline-flex"
                        aria-label={`${group.groupName} 수정`}
                      >
                        <Edit2 className="h-3 w-3" />
                      </button>
                    )}
                  </div>
                ))
              )}
            </div>
          </ScrollArea>
        </Card>

        {/* Right: Code detail */}
        <Card className="flex-1">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="text-sm">
                {selectedGroup
                  ? `${selectedGroup.groupName} (${selectedGroup.groupCode})`
                  : "코드그룹을 선택하세요"}
              </CardTitle>
              {editable && selectedGroup && (
                <Button variant="outline" size="sm" onClick={openAddCode}>
                  <Plus className="mr-1 h-3 w-3" />
                  코드 추가
                </Button>
              )}
            </div>
          </CardHeader>
          <CardContent>
            {!selectedGroup ? (
              <p className="py-12 text-center text-sm text-muted-foreground">
                좌측에서 코드그룹을 선택하세요
              </p>
            ) : codes.length === 0 ? (
              <p className="py-12 text-center text-sm text-muted-foreground">
                등록된 코드가 없습니다.
              </p>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-12">No</TableHead>
                    <TableHead>코드</TableHead>
                    <TableHead>코드명</TableHead>
                    <TableHead>설명</TableHead>
                    <TableHead>사용</TableHead>
                    {editable && <TableHead className="w-16">작업</TableHead>}
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {codes.map((code, i) => (
                    <TableRow key={code.codeId}>
                      <TableCell className="text-muted-foreground">
                        {i + 1}
                      </TableCell>
                      <TableCell className="font-mono text-xs">
                        {code.code}
                      </TableCell>
                      <TableCell className="font-medium">
                        {code.codeName}
                      </TableCell>
                      <TableCell className="max-w-xs truncate text-muted-foreground">
                        {code.description ?? "—"}
                      </TableCell>
                      <TableCell>
                        <Badge
                          variant="outline"
                          className={
                            code.useYn === "Y"
                              ? "border-green-500 text-green-600"
                              : "border-gray-400 text-gray-500"
                          }
                        >
                          {code.useYn === "Y" ? "사용" : "미사용"}
                        </Badge>
                      </TableCell>
                      {editable && (
                        <TableCell>
                          <div className="flex gap-1">
                            <button
                              type="button"
                              onClick={() => openEditCode(code)}
                              className="rounded p-1 text-muted-foreground hover:bg-accent hover:text-foreground"
                              aria-label={`${code.codeName} 수정`}
                            >
                              <Edit2 className="h-3 w-3" />
                            </button>
                            <button
                              type="button"
                              onClick={() => openDeleteCode(code)}
                              className="rounded p-1 text-muted-foreground hover:bg-destructive/10 hover:text-destructive"
                              aria-label={`${code.codeName} 삭제`}
                            >
                              <Trash2 className="h-3 w-3" />
                            </button>
                          </div>
                        </TableCell>
                      )}
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Group Add/Edit Dialog */}
      <Dialog
        open={groupDialog.open}
        onOpenChange={(open) => {
          if (!open) setGroupDialog({ open: false, mode: "add" });
        }}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {groupDialog.mode === "add" ? "코드그룹 추가" : "코드그룹 수정"}
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            {groupDialog.mode === "add" && (
              <div className="space-y-2">
                <Label htmlFor="group-code">그룹 코드</Label>
                <Input
                  id="group-code"
                  value={groupCode}
                  onChange={(e) => setGroupCode(e.target.value)}
                  placeholder="UPPER_SNAKE_CASE"
                />
              </div>
            )}
            <div className="space-y-2">
              <Label htmlFor="group-name">그룹 이름</Label>
              <Input
                id="group-name"
                value={groupName}
                onChange={(e) => setGroupName(e.target.value)}
                placeholder="그룹 이름을 입력하세요"
              />
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setGroupDialog({ open: false, mode: "add" })}
            >
              취소
            </Button>
            <Button onClick={handleGroupSubmit}>
              {groupDialog.mode === "add" ? "추가" : "저장"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Code Add/Edit Dialog */}
      <Dialog
        open={codeDialog.open}
        onOpenChange={(open) => {
          if (!open) setCodeDialog({ open: false, mode: "add" });
        }}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {codeDialog.mode === "add" ? "코드 추가" : "코드 수정"}
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="code-value">코드</Label>
              <Input
                id="code-value"
                value={codeValue}
                onChange={(e) => setCodeValue(e.target.value)}
                placeholder="코드 값"
                disabled={codeDialog.mode === "edit"}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="code-name">코드명</Label>
              <Input
                id="code-name"
                value={codeName}
                onChange={(e) => setCodeName(e.target.value)}
                placeholder="코드명을 입력하세요"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="code-desc">설명</Label>
              <Textarea
                id="code-desc"
                value={codeDescription}
                onChange={(e) => setCodeDescription(e.target.value)}
                placeholder="코드에 대한 설명을 입력하세요 (선택)"
                rows={2}
              />
            </div>
            <div className="flex items-center gap-3">
              <Switch
                checked={codeUseYn === "Y"}
                onCheckedChange={(checked) => setCodeUseYn(checked ? "Y" : "N")}
              />
              <Label>사용 여부</Label>
              <span className="text-xs text-muted-foreground">
                {codeUseYn === "Y" ? "사용" : "미사용"}
              </span>
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setCodeDialog({ open: false, mode: "add" })}
            >
              취소
            </Button>
            <Button onClick={handleCodeSubmit}>
              {codeDialog.mode === "add" ? "추가" : "저장"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog
        open={deleteDialog.open}
        onOpenChange={(open) => {
          if (!open) setDeleteDialog({ open: false, code: null });
        }}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>코드 삭제</DialogTitle>
            <DialogDescription>
              <strong>&quot;{deleteDialog.code?.codeName}&quot;</strong> (
              {deleteDialog.code?.code}) 코드를 삭제하시겠습니까? 이 작업은
              되돌릴 수 없습니다.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setDeleteDialog({ open: false, code: null })}
            >
              취소
            </Button>
            <Button variant="destructive" onClick={handleDeleteCode}>
              삭제
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
