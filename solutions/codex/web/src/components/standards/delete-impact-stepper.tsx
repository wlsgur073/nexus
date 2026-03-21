"use client";

import { useState } from "react";

import {
  Button,
  Checkbox,
  Label,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
  Textarea,
} from "@nexus/ui";
import type { TargetType } from "@nexus/codex-models";

import { Stepper } from "@/components/ui/stepper";

interface DeleteImpactStepperProps {
  targetType: TargetType;
  targetId: number;
  draftId: number;
  onComplete: (data: DeleteImpactFormData) => Promise<void>;
  onCancel: () => void;
}

interface DeleteImpactFormData {
  affectedSystems: string[];
  affectedOther: string;
  impactLevel: "HIGH" | "MEDIUM" | "LOW";
  impactDesc: string;
  altStandard: string;
  migrationPlan: string;
  deleteReason: string;
}

const SYSTEMS = [
  "운영DB",
  "DW",
  "보고서/대시보드",
  "API/인터페이스",
  "외부연동",
  "기타",
];

const STEPS = ["영향 시스템", "영향도 평가", "대안 제시", "최종 확인"];

export function DeleteImpactStepper({
  onComplete,
  onCancel,
}: DeleteImpactStepperProps) {
  const [step, setStep] = useState(1);
  const [form, setForm] = useState<DeleteImpactFormData>({
    affectedSystems: [],
    affectedOther: "",
    impactLevel: "LOW",
    impactDesc: "",
    altStandard: "",
    migrationPlan: "",
    deleteReason: "",
  });

  const updateField = <K extends keyof DeleteImpactFormData>(
    key: K,
    value: DeleteImpactFormData[K],
  ) => setForm((prev) => ({ ...prev, [key]: value }));

  const handleSystemToggle = (system: string) => {
    updateField(
      "affectedSystems",
      form.affectedSystems.includes(system)
        ? form.affectedSystems.filter((s) => s !== system)
        : [...form.affectedSystems, system],
    );
  };

  return (
    <div className="space-y-6">
      <Stepper steps={STEPS} currentStep={step} />

      {step === 1 && (
        <div className="space-y-4">
          <Label>영향받는 시스템을 선택하세요</Label>
          <div className="space-y-2">
            {SYSTEMS.map((system) => (
              <label key={system} className="flex items-center gap-2">
                <Checkbox
                  checked={form.affectedSystems.includes(system)}
                  onCheckedChange={() => handleSystemToggle(system)}
                />
                <span className="text-sm">{system}</span>
              </label>
            ))}
          </div>
          <div>
            <Label>기타 영향 영역</Label>
            <Textarea
              value={form.affectedOther}
              onChange={(e) => updateField("affectedOther", e.target.value)}
              className="mt-1.5"
              rows={2}
            />
          </div>
        </div>
      )}

      {step === 2 && (
        <div className="space-y-4">
          <div>
            <Label>영향도 수준</Label>
            <Select
              value={form.impactLevel}
              onValueChange={(v) =>
                updateField("impactLevel", (v ?? "LOW") as "HIGH" | "MEDIUM" | "LOW")
              }
            >
              <SelectTrigger className="mt-1.5">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="HIGH">높음</SelectItem>
                <SelectItem value="MEDIUM">보통</SelectItem>
                <SelectItem value="LOW">낮음</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label>영향도 설명</Label>
            <Textarea
              value={form.impactDesc}
              onChange={(e) => updateField("impactDesc", e.target.value)}
              className="mt-1.5"
              rows={3}
              placeholder="삭제 시 예상되는 영향을 설명하세요."
            />
          </div>
        </div>
      )}

      {step === 3 && (
        <div className="space-y-4">
          <div>
            <Label>대체 표준 제안</Label>
            <Textarea
              value={form.altStandard}
              onChange={(e) => updateField("altStandard", e.target.value)}
              className="mt-1.5"
              rows={2}
              placeholder="대체할 수 있는 표준이 있다면 기재하세요."
            />
          </div>
          <div>
            <Label>마이그레이션 계획</Label>
            <Textarea
              value={form.migrationPlan}
              onChange={(e) => updateField("migrationPlan", e.target.value)}
              className="mt-1.5"
              rows={2}
              placeholder="삭제 후 이행 계획을 기재하세요."
            />
          </div>
        </div>
      )}

      {step === 4 && (
        <div className="space-y-4">
          <div>
            <Label>삭제 사유</Label>
            <Textarea
              value={form.deleteReason}
              onChange={(e) => updateField("deleteReason", e.target.value)}
              className="mt-1.5"
              rows={3}
              placeholder="삭제 사유를 최종 확인하세요."
            />
          </div>
        </div>
      )}

      <div className="flex justify-between">
        <Button variant="outline" onClick={step === 1 ? onCancel : () => setStep(step - 1)}>
          {step === 1 ? "취소" : "이전"}
        </Button>
        <Button
          onClick={
            step === STEPS.length
              ? () => onComplete(form)
              : () => setStep(step + 1)
          }
        >
          {step === STEPS.length ? "제출" : "다음"}
        </Button>
      </div>
    </div>
  );
}
