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
    <div className="bg-[hsl(var(--card))] rounded-xl border border-[hsl(var(--border))] p-4 hover:border-[hsl(var(--primary))]/50 transition-colors">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <span className="text-xl font-bold text-[hsl(var(--primary))]">{symbol}</span>
          <span className="text-sm font-medium text-[hsl(var(--foreground))]">{name}</span>
        </div>
        <div className="group relative">
          <Info className="w-4 h-4 text-[hsl(var(--muted-foreground))] cursor-help" />
          <div className="absolute bottom-full right-0 mb-2 px-3 py-2 bg-[hsl(var(--popover))] border border-[hsl(var(--border))] rounded-lg text-xs text-[hsl(var(--popover-foreground))] opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 w-56 z-50 shadow-lg">
            {description}
          </div>
        </div>
      </div>

      <div className="space-y-3">
        {/* Call gauge */}
        <div>
          <div className="flex justify-between text-xs mb-1">
            <span className="text-[hsl(var(--call))]">Call</span>
            <span className="text-[hsl(var(--foreground))] font-mono">
              {formatValue(callValue)}{unit}
            </span>
          </div>
          <div className="h-2 bg-[hsl(var(--secondary))] rounded-full overflow-hidden">
            <div
              className="h-full bg-[hsl(var(--call))] rounded-full transition-all duration-300"
              style={{ width: `${normalize(callValue)}%` }}
            />
          </div>
        </div>

        {/* Put gauge */}
        <div>
          <div className="flex justify-between text-xs mb-1">
            <span className="text-[hsl(var(--put))]">Put</span>
            <span className="text-[hsl(var(--foreground))] font-mono">
              {formatValue(putValue)}{unit}
            </span>
          </div>
          <div className="h-2 bg-[hsl(var(--secondary))] rounded-full overflow-hidden">
            <div
              className="h-full bg-[hsl(var(--put))] rounded-full transition-all duration-300"
              style={{ width: `${normalize(Math.abs(putValue))}%` }}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
