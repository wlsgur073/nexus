"use client";

import { useState } from "react";

import { Button, Input, Label, Textarea } from "@nexus/ui";

interface InlineEditFormProps {
  fields: { name: string; label: string; value: string; multiline?: boolean }[];
  onSave: (changes: Record<string, string>) => void;
  onCancel: () => void;
}

export function InlineEditForm({ fields, onSave, onCancel }: InlineEditFormProps) {
  const [values, setValues] = useState<Record<string, string>>(
    Object.fromEntries(fields.map((f) => [f.name, f.value])),
  );

  const handleChange = (name: string, value: string) => {
    setValues((prev) => ({ ...prev, [name]: value }));
  };

  return (
    <div className="space-y-4">
      {fields.map((field) => (
        <div key={field.name}>
          <Label>{field.label}</Label>
          {field.multiline ? (
            <Textarea
              value={values[field.name]}
              onChange={(e) => handleChange(field.name, e.target.value)}
              className="mt-1.5"
              rows={3}
            />
          ) : (
            <Input
              value={values[field.name]}
              onChange={(e) => handleChange(field.name, e.target.value)}
              className="mt-1.5"
            />
          )}
        </div>
      ))}
      <div className="flex gap-2">
        <Button onClick={() => onSave(values)}>저장</Button>
        <Button variant="outline" onClick={onCancel}>
          취소
        </Button>
      </div>
    </div>
  );
}
