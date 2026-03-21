"use client";

import { useCallback, useEffect, useRef } from "react";

import { updateDraftField } from "@nexus/codex-models";

export function useDraftAutosave(draftId: number | null) {
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const save = useCallback(
    (fieldName: string, value: unknown) => {
      if (!draftId) return;

      if (timerRef.current) clearTimeout(timerRef.current);

      timerRef.current = setTimeout(() => {
        updateDraftField({ draftId, fieldName, value });
      }, 300);
    },
    [draftId],
  );

  const saveImmediately = useCallback(
    (fieldName: string, value: unknown) => {
      if (!draftId) return;
      if (timerRef.current) clearTimeout(timerRef.current);
      updateDraftField({ draftId, fieldName, value });
    },
    [draftId],
  );

  useEffect(() => {
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, []);

  return { save, saveImmediately };
}
