import { Info } from 'lucide-react';

interface InputSliderProps {
  label: string;
  value: number;
  onChange: (value: number) => void;
  min: number;
  max: number;
  step: number;
  unit?: string;
  tooltip?: string;
}

export function InputSlider({
  label,
  value,
  onChange,
  min,
  max,
  step,
  unit = '',
  tooltip,
}: InputSliderProps) {
  return (
    <div className="flex flex-col gap-3.5 pb-1">
      <div className="flex items-center justify-between gap-4">
        <div className="flex items-center gap-2 min-w-0">
          <label className="text-sm font-medium text-[hsl(var(--foreground))] truncate">
            {label}
          </label>
          {tooltip && (
            <div className="group relative shrink-0">
              <Info className="w-4 h-4 text-[hsl(var(--muted-foreground))] cursor-help opacity-80 hover:opacity-100 transition-opacity" />
              <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-3 py-2.5 bg-[hsl(var(--popover))] border border-[hsl(var(--border))] rounded-lg text-xs leading-snug text-[hsl(var(--popover-foreground))] opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 w-52 z-50 shadow-xl shadow-black/30">
                {tooltip}
              </div>
            </div>
          )}
        </div>
        <div className="flex items-center gap-1.5 shrink-0">
          <input
            type="number"
            value={value}
            onChange={(e) => {
              const newValue = parseFloat(e.target.value);
              if (!isNaN(newValue) && newValue >= min && newValue <= max) {
                onChange(newValue);
              }
            }}
            className="font-tabular w-[4.75rem] px-2.5 py-1.5 text-sm text-right bg-[hsl(var(--background))]/80 border border-[hsl(var(--border))] rounded-lg text-[hsl(var(--foreground))] focus:outline-none focus:ring-2 focus:ring-[hsl(var(--ring))]/40 focus:border-[hsl(var(--ring))]/50"
            step={step}
            min={min}
            max={max}
          />
          {unit && (
            <span className="text-sm text-[hsl(var(--muted-foreground))] tabular-nums w-8 text-left">
              {unit}
            </span>
          )}
        </div>
      </div>
      <input
        type="range"
        value={value}
        onChange={(e) => onChange(parseFloat(e.target.value))}
        min={min}
        max={max}
        step={step}
        className="w-full h-1.5 bg-[hsl(var(--secondary))] rounded-full appearance-none cursor-pointer accent-[hsl(var(--primary))] shadow-inner shadow-black/20 [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-[hsl(var(--primary))] [&::-webkit-slider-thumb]:cursor-pointer [&::-webkit-slider-thumb]:shadow-md [&::-webkit-slider-thumb]:border [&::-webkit-slider-thumb]:border-white/15 [&::-webkit-slider-thumb]:transition-transform [&::-webkit-slider-thumb]:hover:scale-110"
      />
      <div className="flex justify-between items-baseline text-[11px] font-medium uppercase tracking-wide text-[hsl(var(--muted-foreground))]">
        <span className="font-tabular">
          {min}
          {unit}
        </span>
        <span className="font-tabular">
          {max}
          {unit}
        </span>
      </div>
    </div>
  );
}
