"use client";

import { useEffect, useState } from "react";
import { DynamicIcon } from "@nexus/config";

type SolutionSplashProps = {
  name: string;
  icon: string;
  route: string;
};

export function SolutionSplash({ name, icon, route }: SolutionSplashProps) {
  const [progress, setProgress] = useState(0);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    // fade-in 트리거
    const fadeIn = requestAnimationFrame(() => setVisible(true));

    // 프로그레스 바 시작 (다음 프레임에서 100%로 전환 → CSS transition이 애니메이션)
    const progressTimer = setTimeout(() => setProgress(100), 100);

    // 1.5초 후 솔루션 앱으로 이동
    const redirectTimer = setTimeout(() => {
      window.location.replace(route);
    }, 1500);

    return () => {
      cancelAnimationFrame(fadeIn);
      clearTimeout(progressTimer);
      clearTimeout(redirectTimer);
    };
  }, [route]);

  return (
    <div
      className={`fixed inset-0 z-[100] flex flex-col items-center justify-center gap-6 bg-background transition-opacity duration-500 ${
        visible ? "opacity-100" : "opacity-0"
      }`}
    >
      <div className="flex h-20 w-20 items-center justify-center rounded-2xl bg-primary/10">
        <DynamicIcon name={icon} className="h-10 w-10 text-primary" />
      </div>

      <h1 className="text-2xl font-bold tracking-tight text-foreground">
        {name}
      </h1>

      <div className="h-1.5 w-64 overflow-hidden rounded-full bg-muted">
        <div
          className="h-full bg-primary transition-all duration-[1400ms] ease-linear"
          style={{ width: `${progress}%` }}
        />
      </div>
    </div>
  );
}
