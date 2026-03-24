"use client";

import { useState } from "react";
import { MessageCircle, Send } from "lucide-react";

import {
  Button,
  Popover,
  PopoverContent,
  PopoverTrigger,
  Input,
  cn,
} from "@nexus/ui";

interface InlineCommentProps {
  fieldName: string;
  comments?: { author: string; text: string; createdAt: string }[];
  onSubmit?: (text: string) => void;
  className?: string;
}

export function InlineComment({
  fieldName,
  comments = [],
  onSubmit,
  className,
}: InlineCommentProps) {
  const [text, setText] = useState("");

  const handleSubmit = () => {
    if (!text.trim() || !onSubmit) return;
    onSubmit(text.trim());
    setText("");
  };

  return (
    <Popover>
      <PopoverTrigger
        render={
          <Button
            variant="ghost"
            size="icon"
            className={cn("h-6 w-6 text-muted-foreground", className)}
          />
        }
        nativeButton={false}
      >
        <MessageCircle className="h-3.5 w-3.5" />
        {comments.length > 0 && (
          <span className="absolute -right-1 -top-1 flex h-3.5 w-3.5 items-center justify-center rounded-full bg-primary text-[9px] text-primary-foreground">
            {comments.length}
          </span>
        )}
      </PopoverTrigger>
      <PopoverContent align="start" className="w-72">
        <p className="mb-2 text-xs font-medium text-muted-foreground">
          {fieldName} 코멘트
        </p>
        {comments.length > 0 && (
          <div className="mb-3 max-h-40 space-y-2 overflow-y-auto">
            {comments.map((c, i) => (
              <div key={i} className="rounded-md bg-muted p-2 text-xs">
                <span className="font-medium">{c.author}</span>
                <span className="ml-2 text-muted-foreground">
                  {c.createdAt}
                </span>
                <p className="mt-1">{c.text}</p>
              </div>
            ))}
          </div>
        )}
        {onSubmit && (
          <div className="flex gap-1">
            <Input
              value={text}
              onChange={(e) => setText(e.target.value)}
              placeholder="코멘트 입력..."
              className="h-8 text-xs"
              onKeyDown={(e) => {
                if (e.key === "Enter") handleSubmit();
              }}
            />
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 shrink-0"
              onClick={handleSubmit}
              disabled={!text.trim()}
            >
              <Send className="h-3.5 w-3.5" />
            </Button>
          </div>
        )}
      </PopoverContent>
    </Popover>
  );
}
