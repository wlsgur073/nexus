"use client";

import { useRouter } from "next/navigation";

import { CODEX_ROUTES } from "@nexus/codex-shared";

import { NewStandardForm } from "@/components/standards/new-standard-form";

export default function NewStandardPage() {
  const router = useRouter();

  const handleSubmitted = () => {
    router.push(CODEX_ROUTES.standards);
  };

  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold tracking-tight">신규 표준 신청</h1>
        <p className="mt-1 text-muted-foreground">
          표준단어, 표준도메인, 표준용어를 신규로 신청합니다.
        </p>
      </div>

      <NewStandardForm onSubmitted={handleSubmitted} />
    </div>
  );
}
