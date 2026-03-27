import { TrendingUp, TrendingDown } from 'lucide-react';

interface PriceCardProps {
  type: 'call' | 'put';
  price: number;
  intrinsicValue: number;
  timeValue: number;
}

export function PriceCard({ type, price, intrinsicValue, timeValue }: PriceCardProps) {
  const isCall = type === 'call';
  const Icon = isCall ? TrendingUp : TrendingDown;
  const colorClass = isCall ? 'text-[hsl(var(--call))]' : 'text-[hsl(var(--put))]';
  const bgClass = isCall
    ? 'bg-[hsl(var(--call))]/10 border-[hsl(var(--call))]/30'
    : 'bg-[hsl(var(--put))]/10 border-[hsl(var(--put))]/30';

  return (
    <div
      className={`relative overflow-hidden rounded-2xl border p-6 sm:p-7 lg:p-8 ${bgClass} transition-shadow duration-300 hover:shadow-lg hover:shadow-black/20 ring-1 ring-white/[0.04]`}
    >
      <div className="flex items-center justify-between gap-2 mb-3">
        <div className="flex items-center gap-2 min-w-0">
          <Icon className={`w-5 h-5 shrink-0 ${colorClass}`} strokeWidth={2.25} />
          <span className={`text-sm font-semibold uppercase tracking-wide ${colorClass}`}>
            {type}
          </span>
        </div>
        <span className="text-[10px] text-[hsl(var(--muted-foreground))] uppercase tracking-widest whitespace-nowrap">
          Mark
        </span>
      </div>

      <div className={`text-3xl sm:text-4xl font-bold font-tabular tracking-tight ${colorClass} mb-5`}>
        ${price.toFixed(2)}
      </div>

      <div className="space-y-3 text-sm pt-4 border-t border-[hsl(var(--border))]/60">
        <div className="flex justify-between items-center gap-2">
          <span className="text-[hsl(var(--muted-foreground))]">Intrinsic</span>
          <span className="font-tabular text-[hsl(var(--foreground))] font-medium">
            ${intrinsicValue.toFixed(2)}
          </span>
        </div>
        <div className="flex justify-between items-center gap-2">
          <span className="text-[hsl(var(--muted-foreground))]">Time value</span>
          <span className="font-tabular text-[hsl(var(--foreground))] font-medium">
            ${timeValue.toFixed(2)}
          </span>
        </div>
      </div>

      <div
        className={`absolute -bottom-10 -right-10 w-36 h-36 rounded-full opacity-[0.18] ${
          isCall ? 'bg-[hsl(var(--call))]' : 'bg-[hsl(var(--put))]'
        } blur-3xl pointer-events-none`}
      />
    </div>
  );
}
