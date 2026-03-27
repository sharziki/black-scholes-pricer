import { Info } from 'lucide-react';

interface GreekGaugeProps {
  name: string;
  symbol: string;
  callValue: number;
  putValue: number;
  description: string;
  min: number;
  max: number;
  unit?: string;
}

export function GreekGauge({
  name,
  symbol,
  callValue,
  putValue,
  description,
  min,
  max,
  unit = '',
}: GreekGaugeProps) {
  const normalize = (value: number) => {
    return Math.max(0, Math.min(100, ((value - min) / (max - min)) * 100));
  };

  const formatValue = (value: number) => {
    if (Math.abs(value) < 0.0001 && value !== 0) {
      return value.toExponential(2);
    }
    return value.toFixed(4);
  };

  return (
    <div className="rounded-xl border border-[hsl(var(--border))] bg-[hsl(var(--background))]/50 p-5 sm:p-6 shadow-inner shadow-black/15 transition-colors hover:border-[hsl(var(--primary))]/35">
      <div className="flex items-start justify-between gap-3 mb-5">
        <div className="flex items-baseline gap-2 min-w-0">
          <span className="text-lg font-semibold tabular-nums text-[hsl(var(--primary))] leading-none">
            {symbol}
          </span>
          <span className="text-sm font-medium text-[hsl(var(--foreground))] truncate">{name}</span>
        </div>
        <div className="group relative shrink-0">
          <Info className="w-4 h-4 text-[hsl(var(--muted-foreground))] cursor-help opacity-80 hover:opacity-100 transition-opacity" />
          <div className="absolute bottom-full right-0 mb-2 px-3 py-2.5 bg-[hsl(var(--popover))] border border-[hsl(var(--border))] rounded-lg text-xs leading-snug text-[hsl(var(--popover-foreground))] opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 w-56 z-50 shadow-xl shadow-black/30">
            {description}
          </div>
        </div>
      </div>

      <div className="space-y-4 sm:space-y-5">
        <div>
          <div className="flex justify-between text-[11px] font-semibold uppercase tracking-wide mb-1.5">
            <span className="text-[hsl(var(--call))]">Call</span>
            <span className="font-tabular text-[hsl(var(--foreground))] normal-case font-medium tracking-normal">
              {formatValue(callValue)}
              {unit}
            </span>
          </div>
          <div className="h-2 rounded-full bg-[hsl(var(--secondary))] overflow-hidden ring-1 ring-black/15">
            <div
              className="h-full rounded-full bg-gradient-to-r from-[hsl(var(--call))]/85 to-[hsl(var(--call))] transition-[width] duration-300 ease-out shadow-sm"
              style={{ width: `${normalize(callValue)}%` }}
            />
          </div>
        </div>

        <div>
          <div className="flex justify-between text-[11px] font-semibold uppercase tracking-wide mb-1.5">
            <span className="text-[hsl(var(--put))]">Put</span>
            <span className="font-tabular text-[hsl(var(--foreground))] normal-case font-medium tracking-normal">
              {formatValue(putValue)}
              {unit}
            </span>
          </div>
          <div className="h-2 rounded-full bg-[hsl(var(--secondary))] overflow-hidden ring-1 ring-black/15">
            <div
              className="h-full rounded-full bg-gradient-to-r from-[hsl(var(--put))]/85 to-[hsl(var(--put))] transition-[width] duration-300 ease-out shadow-sm"
              style={{ width: `${normalize(Math.abs(putValue))}%` }}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
