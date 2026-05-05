export function SectionWrapper({ children }: { children: React.ReactNode }) {
  return <div className="animate-fade-in">{children}</div>;
}

export function SectionTitle({ emoji, title, subtitle }: { emoji: string; title: string; subtitle?: string }) {
  return (
    <div className="mb-6">
      <div className="flex items-center gap-3 mb-1">
        <span className="text-3xl">{emoji}</span>
        <h2 className="text-2xl font-bold text-foreground">{title}</h2>
      </div>
      {subtitle && <p className="text-muted-foreground text-sm ml-[52px]">{subtitle}</p>}
    </div>
  );
}
