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
  Input,
  ScrollArea,
  Separator,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
  cn,
} from "@nexus/ui";
import {
  getCommonCodeGroups,
  getCommonCodesByGroup,
  createCommonCodeGroup,
  updateCommonCodeGroup,
  addCommonCode,
} from "@nexus/codex-models";
import { QUERY_KEYS } from "@nexus/codex-shared";

import type { CommonCodeGroupItem } from "@nexus/codex-models";

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

  const handleAddGroup = async () => {
    const groupCode = prompt("그룹 코드를 입력하세요:");
    if (!groupCode) return;
    const groupName = prompt("그룹 이름을 입력하세요:");
    if (!groupName) return;
    try {
      await createCommonCodeGroup({ groupCode, groupName });
      await queryClient.invalidateQueries({
        queryKey: ["common-codes", "groups"],
      });
      toast.success("코드그룹이 생성되었습니다.");
    } catch {
      toast.error("코드그룹 생성에 실패했습니다.");
    }
  };

  const handleEditGroup = async (group: CommonCodeGroupItem) => {
    const newName = prompt("새 그룹 이름:", group.groupName);
    if (!newName || newName === group.groupName) return;
    try {
      await updateCommonCodeGroup(group.groupId, { groupName: newName });
      await queryClient.invalidateQueries({
        queryKey: ["common-codes", "groups"],
      });
      toast.success("코드그룹이 수정되었습니다.");
    } catch {
      toast.error("코드그룹 수정에 실패했습니다.");
    }
  };

  const handleAddCode = async () => {
    if (!selectedGroup) return;
    const code = prompt("코드를 입력하세요:");
    if (!code) return;
    const codeName = prompt("코드명을 입력하세요:");
    if (!codeName) return;
    try {
      await addCommonCode(selectedGroup.groupId, { code, codeName });
      await queryClient.invalidateQueries({
        queryKey: QUERY_KEYS.commonCodes.codes(selectedGroup.groupId),
      });
      toast.success("코드가 추가되었습니다.");
    } catch {
      toast.error("코드 추가에 실패했습니다.");
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
    <div className="flex gap-6">
      {/* Left: Group list */}
      <Card className="w-80 shrink-0">
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <CardTitle className="text-sm">코드그룹</CardTitle>
            {editable && (
              <Button variant="outline" size="sm" onClick={handleAddGroup}>
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
                      onClick={() => handleEditGroup(group)}
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
              <Button variant="outline" size="sm" onClick={handleAddCode}>
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
                            className="rounded p-1 text-muted-foreground hover:bg-accent hover:text-foreground"
                            aria-label={`${code.codeName} 수정`}
                          >
                            <Edit2 className="h-3 w-3" />
                          </button>
                          <button
                            type="button"
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
  );
}
