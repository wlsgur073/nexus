"use client";

import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
} from "react";

interface AIButlerContext {
  page?: string;
  targetType?: string;
  editingField?: string;
  keyword?: string;
}

interface AIButlerContextValue {
  context: AIButlerContext;
  setContext: (ctx: AIButlerContext) => void;
}

const AIButlerCtx = createContext<AIButlerContextValue>({
  context: {},
  setContext: () => {},
});

export function useAIButler() {
  return useContext(AIButlerCtx);
}

export function AIButlerProvider({ children }: { children: React.ReactNode }) {
  const [context, setContextState] = useState<AIButlerContext>({});

  const setContext = useCallback((ctx: AIButlerContext) => {
    setContextState(ctx);
  }, []);

  const value = useMemo(() => ({ context, setContext }), [context, setContext]);

  return <AIButlerCtx value={value}>{children}</AIButlerCtx>;
}
