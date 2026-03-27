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
    <div className="flex flex-col gap-2">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <label className="text-sm font-medium text-[hsl(var(--foreground))]">
            {label}
          </label>
          {tooltip && (
            <div className="group relative">
              <Info className="w-4 h-4 text-[hsl(var(--muted-foreground))] cursor-help" />
              <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-3 py-2 bg-[hsl(var(--popover))] border border-[hsl(var(--border))] rounded-lg text-xs text-[hsl(var(--popover-foreground))] opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 w-48 z-50 shadow-lg">
                {tooltip}
              </div>
            </div>
          )}
        </div>
        <div className="flex items-center gap-1">
          <input
            type="number"
            value={value}
            onChange={(e) => {
              const newValue = parseFloat(e.target.value);
              if (!isNaN(newValue) && newValue >= min && newValue <= max) {
                onChange(newValue);
              }
            }}
            className="w-20 px-2 py-1 text-sm text-right bg-[hsl(var(--input))] border border-[hsl(var(--border))] rounded-md text-[hsl(var(--foreground))] focus:outline-none focus:ring-2 focus:ring-[hsl(var(--ring))] focus:border-transparent"
            step={step}
            min={min}
            max={max}
          />
          {unit && (
            <span className="text-sm text-[hsl(var(--muted-foreground))]">{unit}</span>
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
        className="w-full h-2 bg-[hsl(var(--secondary))] rounded-full appearance-none cursor-pointer accent-[hsl(var(--primary))] [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-[hsl(var(--primary))] [&::-webkit-slider-thumb]:cursor-pointer [&::-webkit-slider-thumb]:shadow-md [&::-webkit-slider-thumb]:transition-transform [&::-webkit-slider-thumb]:hover:scale-110"
      />
      <div className="flex justify-between text-xs text-[hsl(var(--muted-foreground))]">
        <span>{min}{unit}</span>
        <span>{max}{unit}</span>
      </div>
    </div>
  );
}
