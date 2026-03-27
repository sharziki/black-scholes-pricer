import type { ReactNode } from 'react';

interface SectionHeaderProps {
  title: string;
  subtitle?: string;
  actions?: ReactNode;
}

export function SectionHeader({ title, subtitle, actions }: SectionHeaderProps) {
  return (
    <div className="flex flex-col gap-5 sm:flex-row sm:items-start sm:justify-between mb-8 sm:mb-10">
      <div className="min-w-0 space-y-2.5 pr-2 sm:pr-6">
        <h2 className="text-lg sm:text-xl font-semibold tracking-tight text-[hsl(var(--foreground))]">
          {title}
        </h2>
        {subtitle ? (
          <p className="text-sm sm:text-[0.9375rem] leading-relaxed text-[hsl(var(--muted-foreground))] max-w-2xl">
            {subtitle}
          </p>
        ) : null}
      </div>
      {actions ? (
        <div className="shrink-0 flex flex-wrap items-center gap-3 pt-1 sm:pt-0">{actions}</div>
      ) : null}
    </div>
  );
}
