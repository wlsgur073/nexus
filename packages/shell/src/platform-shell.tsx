import { Header } from "./header";

export function PlatformShell({ children }: { children: React.ReactNode }) {
  return (
    <>
      <Header />
      <div
        className="h-px w-full"
        style={{
          background:
            "linear-gradient(90deg, transparent, var(--border) 15%, var(--border) 85%, transparent)",
        }}
      />
      <main className="flex-1 w-full overflow-auto">{children}</main>
    </>
  );
}
