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
      className={`relative overflow-hidden rounded-xl border p-6 ${bgClass} transition-all duration-300 hover:scale-[1.02]`}
    >
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Icon className={`w-5 h-5 ${colorClass}`} />
          <span className={`text-lg font-semibold uppercase ${colorClass}`}>
            {type}
          </span>
        </div>
        <span className="text-xs text-[hsl(var(--muted-foreground))] uppercase tracking-wider">
          Option Price
        </span>
      </div>

      <div className={`text-4xl font-bold ${colorClass} mb-4`}>
        ${price.toFixed(2)}
      </div>

      <div className="space-y-2 text-sm">
        <div className="flex justify-between">
          <span className="text-[hsl(var(--muted-foreground))]">Intrinsic Value</span>
          <span className="text-[hsl(var(--foreground))] font-medium">
            ${intrinsicValue.toFixed(2)}
          </span>
        </div>
        <div className="flex justify-between">
          <span className="text-[hsl(var(--muted-foreground))]">Time Value</span>
          <span className="text-[hsl(var(--foreground))] font-medium">
            ${timeValue.toFixed(2)}
          </span>
        </div>
      </div>

      {/* Decorative gradient */}
      <div
        className={`absolute -bottom-8 -right-8 w-32 h-32 rounded-full opacity-20 ${
          isCall ? 'bg-[hsl(var(--call))]' : 'bg-[hsl(var(--put))]'
        } blur-2xl`}
      />
    </div>
  );
}
