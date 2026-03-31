import { Settings, Palette, UserCircle, Bell } from "lucide-react";
import { PageTransition } from "@/components/motion/page-transition";

const placeholderSections = [
  { icon: Palette, label: "Theme", desc: "테마 및 표시 설정" },
  { icon: UserCircle, label: "Profile", desc: "프로필 및 계정 관리" },
  { icon: Bell, label: "Notifications", desc: "알림 환경 설정" },
];

export default function SettingsPage() {
  return (
    <PageTransition className="px-10 py-7">
      <div className="mb-8">
        <h1 className="font-display text-[22px] font-normal tracking-tight">
          Settings
        </h1>
        <div className="mt-1.5 h-px w-7 bg-foreground" />
      </div>

      {/* Main empty state */}
      <div className="mb-8 flex flex-col items-center justify-center rounded-2xl py-20 ring-1 ring-dashed ring-border">
        <Settings
          className="mb-4 h-12 w-12 text-text-disabled"
          strokeWidth={1}
        />
        <h2 className="font-display text-lg text-foreground">준비 중입니다</h2>
        <p className="mt-1 text-sm text-text-muted">
          설정 기능은 추후 제공될 예정입니다.
        </p>
      </div>

      {/* Placeholder section cards */}
      <div className="grid gap-3 sm:grid-cols-3">
        {placeholderSections.map((section) => (
          <div
            key={section.label}
            className="flex items-center gap-3 rounded-xl bg-surface p-4 ring-1 ring-border opacity-50"
          >
            <section.icon className="h-5 w-5 text-text-muted" />
            <div>
              <div className="text-sm font-medium text-foreground">
                {section.label}
              </div>
              <div className="text-xs text-text-muted">{section.desc}</div>
            </div>
          </div>
        ))}
      </div>
    </PageTransition>
  );
}
