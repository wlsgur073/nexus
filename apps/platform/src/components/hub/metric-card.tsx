type MetricCardProps = {
  title: string;
  value: React.ReactNode;
  subtitle?: string;
};

export function MetricCard({ title, value, subtitle }: MetricCardProps) {
  return (
    <div className="rounded-xl bg-surface p-4 ring-1 ring-border">
      <div className="mb-1 text-[9px] uppercase tracking-widest text-text-muted">
        {title}
      </div>
      <div className="font-display text-xl text-foreground">{value}</div>
      {subtitle && (
        <div className="mt-0.5 text-xs text-text-muted">{subtitle}</div>
      )}
    </div>
  );
}
