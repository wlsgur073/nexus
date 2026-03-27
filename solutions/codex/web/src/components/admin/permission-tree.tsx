"use client";

import { useCallback, useMemo, useState } from "react";
import { ChevronDown, ChevronRight } from "lucide-react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

import {
  Badge,
  Button,
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  Checkbox,
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@nexus/ui";
import {
  getPermissionsByRole,
  getMenuTree,
  updatePermissions,
} from "@nexus/codex-models";
import { QUERY_KEYS } from "@nexus/codex-shared";

import type {
  UserRole,
  MenuPermissionItem,
  MenuTreeNode,
} from "@nexus/codex-models";

type CrudField = "canRead" | "canCreate" | "canUpdate" | "canDelete";

const ROLE_TABS: Array<{ value: UserRole; label: string }> = [
  { value: "SYSTEM_ADMIN", label: "시스템관리자" },
  { value: "REVIEWER_APPROVER", label: "검토/승인자" },
  { value: "STD_MANAGER", label: "표준 관리자" },
  { value: "REQUESTER", label: "신청자" },
  { value: "READ_ONLY", label: "조회전용" },
];

const CRUD_LABELS: Array<{ field: CrudField; label: string }> = [
  { field: "canRead", label: "조회" },
  { field: "canCreate", label: "생성" },
  { field: "canUpdate", label: "수정" },
  { field: "canDelete", label: "삭제" },
];

export function PermissionTree() {
  const [activeRole, setActiveRole] = useState<UserRole>("SYSTEM_ADMIN");

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base">역할별 메뉴 권한</CardTitle>
      </CardHeader>
      <CardContent>
        <Tabs
          value={activeRole}
          onValueChange={(v) => setActiveRole(v as UserRole)}
        >
          <TabsList>
            {ROLE_TABS.map((tab) => (
              <TabsTrigger key={tab.value} value={tab.value}>
                {tab.label}
              </TabsTrigger>
            ))}
          </TabsList>
          {ROLE_TABS.map((tab) => (
            <TabsContent key={tab.value} value={tab.value}>
              <RolePermissionPanel role={tab.value} />
            </TabsContent>
          ))}
        </Tabs>
      </CardContent>
    </Card>
  );
}

function RolePermissionPanel({ role }: { role: UserRole }) {
  const queryClient = useQueryClient();
  const [editedPerms, setEditedPerms] = useState<
    Map<string, MenuPermissionItem>
  >(new Map());
  const [expandedNodes, setExpandedNodes] = useState<Set<string> | null>(null);
  const [dirty, setDirty] = useState(false);
  const [activeRowId, setActiveRowId] = useState<string | null>(null);

  const { data: permissions } = useQuery({
    queryKey: QUERY_KEYS.permissions.byRole(role),
    queryFn: () => getPermissionsByRole(role),
  });

  const { data: menuTree } = useQuery({
    queryKey: QUERY_KEYS.permissions.menuTree,
    queryFn: getMenuTree,
  });

  const basePerms = useMemo(() => {
    const map = new Map<string, MenuPermissionItem>();
    for (const p of permissions ?? []) {
      map.set(p.menuCode, p);
    }
    return map;
  }, [permissions]);

  const localPerms = useMemo(() => {
    if (!dirty) return basePerms;
    const merged = new Map(basePerms);
    for (const [k, v] of editedPerms) {
      merged.set(k, v);
    }
    return merged;
  }, [basePerms, editedPerms, dirty]);

  const resolvedExpanded = useMemo(() => {
    if (expandedNodes) return expandedNodes;
    return new Set((menuTree ?? []).map((n) => n.menuCode));
  }, [expandedNodes, menuTree]);

  const toggleExpand = (code: string) => {
    const prev = resolvedExpanded;
    const next = new Set(prev);
    if (next.has(code)) next.delete(code);
    else next.add(code);
    setExpandedNodes(next);
  };

  const toggleField = useCallback(
    (menuCode: string, field: CrudField) => {
      setEditedPerms((prev) => {
        const next = new Map(prev);
        const perm = next.get(menuCode) ?? basePerms.get(menuCode);
        if (perm) {
          next.set(menuCode, { ...perm, [field]: !perm[field] });
        }
        return next;
      });
      setDirty(true);
    },
    [basePerms],
  );

  const toggleAllChildren = useCallback(
    (node: MenuTreeNode, field: CrudField, value: boolean) => {
      setEditedPerms((prev) => {
        const next = new Map(prev);
        for (const child of node.children) {
          const perm =
            next.get(child.menuCode) ?? basePerms.get(child.menuCode);
          if (perm) {
            next.set(child.menuCode, { ...perm, [field]: value });
          }
        }
        return next;
      });
      setDirty(true);
    },
    [basePerms],
  );

  const getParentCheckState = useCallback(
    (
      node: MenuTreeNode,
      field: CrudField,
    ): "checked" | "unchecked" | "indeterminate" => {
      const states = node.children.map(
        (c) => localPerms.get(c.menuCode)?.[field] ?? false,
      );
      if (states.length === 0) return "unchecked";
      if (states.every(Boolean)) return "checked";
      if (states.some(Boolean)) return "indeterminate";
      return "unchecked";
    },
    [localPerms],
  );

  const flatRows = useMemo(() => {
    const rows: string[] = [];
    for (const parent of menuTree ?? []) {
      rows.push(parent.menuCode);
      if (resolvedExpanded.has(parent.menuCode)) {
        for (const child of parent.children) {
          rows.push(child.menuCode);
        }
      }
    }
    return rows;
  }, [menuTree, resolvedExpanded]);

  const handleTreeKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (!flatRows.length) return;
      const idx = activeRowId ? flatRows.indexOf(activeRowId) : -1;

      switch (e.key) {
        case "ArrowDown": {
          e.preventDefault();
          const next = idx < flatRows.length - 1 ? idx + 1 : 0;
          setActiveRowId(flatRows[next]);
          break;
        }
        case "ArrowUp": {
          e.preventDefault();
          const prev = idx > 0 ? idx - 1 : flatRows.length - 1;
          setActiveRowId(flatRows[prev]);
          break;
        }
        case "ArrowRight": {
          e.preventDefault();
          const parentNode = (menuTree ?? []).find(
            (n) => n.menuCode === activeRowId,
          );
          if (parentNode && !resolvedExpanded.has(parentNode.menuCode)) {
            toggleExpand(parentNode.menuCode);
          } else if (parentNode && parentNode.children.length > 0) {
            setActiveRowId(parentNode.children[0].menuCode);
          }
          break;
        }
        case "ArrowLeft": {
          e.preventDefault();
          const isParent = (menuTree ?? []).some(
            (n) => n.menuCode === activeRowId,
          );
          if (isParent && resolvedExpanded.has(activeRowId!)) {
            toggleExpand(activeRowId!);
          } else if (!isParent) {
            const parent = (menuTree ?? []).find((n) =>
              n.children.some((c) => c.menuCode === activeRowId),
            );
            if (parent) setActiveRowId(parent.menuCode);
          }
          break;
        }
        case " ": {
          e.preventDefault();
          if (activeRowId) {
            toggleField(activeRowId, "canRead");
          }
          break;
        }
      }
    },
    [
      flatRows,
      activeRowId,
      menuTree,
      resolvedExpanded,
      toggleExpand,
      toggleField,
    ],
  );

  const handleSave = async () => {
    const permsArray = Array.from(localPerms.values()).map((p) => ({
      menuCode: p.menuCode,
      canRead: p.canRead,
      canCreate: p.canCreate,
      canUpdate: p.canUpdate,
      canDelete: p.canDelete,
    }));
    try {
      await updatePermissions(role, { permissions: permsArray });
      await queryClient.invalidateQueries({
        queryKey: QUERY_KEYS.permissions.byRole(role),
      });
      setDirty(false);
      toast.success("권한이 저장되었습니다.");
    } catch {
      toast.error("권한 저장에 실패했습니다.");
    }
  };

  return (
    <div className="mt-4 space-y-4">
      <div className="overflow-x-auto rounded-md border">
        <table
          className="w-full text-sm outline-none focus-visible:ring-2 focus-visible:ring-ring"
          role="treegrid"
          aria-label="메뉴 권한 설정"
          aria-activedescendant={
            activeRowId ? `perm-row-${activeRowId}` : undefined
          }
          tabIndex={0}
          onKeyDown={handleTreeKeyDown}
        >
          <thead>
            <tr className="border-b bg-muted/50">
              <th className="px-4 py-2 text-left font-medium">메뉴</th>
              {CRUD_LABELS.map((c) => (
                <th
                  key={c.field}
                  className="w-20 px-2 py-2 text-center font-medium"
                >
                  {c.label}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {(menuTree ?? []).map((parent) => (
              <TreeCategory
                key={parent.menuCode}
                node={parent}
                expanded={resolvedExpanded.has(parent.menuCode)}
                onToggleExpand={toggleExpand}
                localPerms={localPerms}
                toggleField={toggleField}
                toggleAllChildren={toggleAllChildren}
                getParentCheckState={getParentCheckState}
                activeRowId={activeRowId}
              />
            ))}
          </tbody>
        </table>
      </div>

      <div className="flex items-center justify-between">
        {dirty && (
          <Badge
            variant="outline"
            className="text-amber-600 dark:text-amber-400"
          >
            저장되지 않은 변경사항
          </Badge>
        )}
        <div className="ml-auto">
          <Button onClick={handleSave} disabled={!dirty}>
            권한 저장
          </Button>
        </div>
      </div>
    </div>
  );
}

function TreeCategory({
  node,
  expanded,
  onToggleExpand,
  localPerms,
  toggleField,
  toggleAllChildren,
  getParentCheckState,
  activeRowId,
}: {
  node: MenuTreeNode;
  expanded: boolean;
  onToggleExpand: (code: string) => void;
  localPerms: Map<string, MenuPermissionItem>;
  toggleField: (menuCode: string, field: CrudField) => void;
  toggleAllChildren: (
    node: MenuTreeNode,
    field: CrudField,
    value: boolean,
  ) => void;
  getParentCheckState: (
    node: MenuTreeNode,
    field: CrudField,
  ) => "checked" | "unchecked" | "indeterminate";
  activeRowId: string | null;
}) {
  return (
    <>
      <tr
        id={`perm-row-${node.menuCode}`}
        role="row"
        aria-expanded={expanded}
        aria-level={1}
        className={`border-b bg-muted/25 font-medium ${activeRowId === node.menuCode ? "ring-2 ring-inset ring-ring" : ""}`}
      >
        <td className="px-4 py-2">
          <button
            type="button"
            onClick={() => onToggleExpand(node.menuCode)}
            className="flex items-center gap-1"
            aria-label={
              expanded ? `${node.menuName} 축소` : `${node.menuName} 확장`
            }
          >
            {expanded ? (
              <ChevronDown className="h-4 w-4" aria-hidden="true" />
            ) : (
              <ChevronRight className="h-4 w-4" aria-hidden="true" />
            )}
            {node.menuName}
          </button>
        </td>
        {CRUD_LABELS.map((c) => {
          const state = getParentCheckState(node, c.field);
          return (
            <td key={c.field} className="px-2 py-2 text-center">
              <Checkbox
                checked={state === "checked"}
                indeterminate={state === "indeterminate"}
                onCheckedChange={() => {
                  const newValue = state !== "checked";
                  toggleAllChildren(node, c.field, newValue);
                }}
                aria-label={`${node.menuName} ${c.label} 전체 선택`}
              />
            </td>
          );
        })}
      </tr>
      {expanded &&
        node.children.map((child) => {
          const perm = localPerms.get(child.menuCode);
          return (
            <tr
              id={`perm-row-${child.menuCode}`}
              key={child.menuCode}
              role="row"
              aria-level={2}
              className={`border-b ${activeRowId === child.menuCode ? "ring-2 ring-inset ring-ring" : ""}`}
            >
              <td className="py-2 pl-10 pr-4">{child.menuName}</td>
              {CRUD_LABELS.map((c) => (
                <td key={c.field} className="px-2 py-2 text-center">
                  <Checkbox
                    checked={perm?.[c.field] ?? false}
                    onCheckedChange={() => toggleField(child.menuCode, c.field)}
                    aria-label={`${child.menuName} ${c.label}`}
                  />
                </td>
              ))}
            </tr>
          );
        })}
    </>
  );
}
