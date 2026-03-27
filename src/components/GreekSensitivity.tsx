import { Plot } from '../lib/plotlyPlot';
import { useState } from 'react';
import { SectionHeader } from './SectionHeader';
import { chartPanelClass } from './chartClasses';
import { generateGreekSensitivity } from '../lib/blackScholes';
import type { BlackScholesInputs } from '../lib/blackScholes';

interface GreekSensitivityProps {
  inputs: BlackScholesInputs;
}

type GreekType = 'delta' | 'gamma' | 'theta' | 'vega' | 'rho';

const greekInfo: Record<GreekType, { name: string; symbol: string; description: string }> = {
  delta: { name: 'Delta', symbol: 'Δ', description: 'Rate of change vs spot price' },
  gamma: { name: 'Gamma', symbol: 'Γ', description: 'Rate of change of delta' },
  theta: { name: 'Theta', symbol: 'Θ', description: 'Time decay (daily)' },
  vega: { name: 'Vega', symbol: 'ν', description: 'Sensitivity to volatility' },
  rho: { name: 'Rho', symbol: 'ρ', description: 'Sensitivity to interest rate' },
};

export function GreekSensitivity({ inputs }: GreekSensitivityProps) {
  const [selectedGreek, setSelectedGreek] = useState<GreekType>('delta');

  const priceRange = {
    min: inputs.spotPrice * 0.5,
    max: inputs.spotPrice * 1.5,
    steps: 100,
  };

  const data = generateGreekSensitivity(inputs, selectedGreek, priceRange);

  return (
    <div className="panel p-7 sm:p-9 lg:p-10">
      <SectionHeader
        title="Greek sensitivity"
        subtitle="How each Greek moves as spot changes, holding other inputs fixed."
        actions={
          <div className="segmented justify-center sm:justify-end max-w-full" role="tablist" aria-label="Select Greek">
            {(Object.keys(greekInfo) as GreekType[]).map((greek) => (
              <button
                key={greek}
                type="button"
                role="tab"
                aria-selected={selectedGreek === greek}
                onClick={() => setSelectedGreek(greek)}
                className={`min-w-[2.5rem] px-3 py-2.5 text-sm font-semibold transition-colors rounded-[0.5rem] ${
                  selectedGreek === greek
                    ? 'bg-[hsl(var(--primary))] text-[hsl(var(--primary-foreground))] shadow-sm shadow-black/20'
                    : 'text-[hsl(var(--muted-foreground))] hover:text-[hsl(var(--foreground))] hover:bg-[hsl(var(--background))]/40'
                }`}
              >
                {greekInfo[greek].symbol}
              </button>
            ))}
          </div>
        }
      />

      <div className="mb-8 rounded-xl border border-[hsl(var(--border))] bg-[hsl(var(--background))]/45 px-5 py-4 sm:px-6 sm:py-5 shadow-inner shadow-black/10">
        <div className="flex flex-col sm:flex-row sm:items-baseline gap-2 sm:gap-4">
          <div className="flex items-baseline gap-2 shrink-0">
            <span className="text-lg font-semibold tabular-nums text-[hsl(var(--primary))]">
              {greekInfo[selectedGreek].symbol}
            </span>
            <span className="text-sm font-medium text-[hsl(var(--foreground))]">
              {greekInfo[selectedGreek].name}
            </span>
          </div>
          <span className="text-sm text-[hsl(var(--muted-foreground))] leading-snug">
            {greekInfo[selectedGreek].description}
          </span>
        </div>
      </div>

      <div className={chartPanelClass}>
        <Plot
        data={[
          {
            x: data.prices,
            y: data.callValues,
            type: 'scatter',
            mode: 'lines',
            name: `Call ${greekInfo[selectedGreek].name}`,
            line: { color: 'rgb(34, 197, 94)', width: 2 },
            hovertemplate: `Price: $%{x:.2f}<br>${greekInfo[selectedGreek].name}: %{y:.4f}<extra>Call</extra>`,
          },
          {
            x: data.prices,
            y: data.putValues,
            type: 'scatter',
            mode: 'lines',
            name: `Put ${greekInfo[selectedGreek].name}`,
            line: { color: 'rgb(239, 68, 68)', width: 2 },
            hovertemplate: `Price: $%{x:.2f}<br>${greekInfo[selectedGreek].name}: %{y:.4f}<extra>Put</extra>`,
          },
          {
            x: [inputs.spotPrice],
            y: [data.callValues[Math.floor(data.prices.length / 2)]],
            type: 'scatter',
            mode: 'markers',
            name: 'Current (Call)',
            marker: { color: 'rgb(34, 197, 94)', size: 10, symbol: 'circle' },
            showlegend: false,
          },
          {
            x: [inputs.spotPrice],
            y: [data.putValues[Math.floor(data.prices.length / 2)]],
            type: 'scatter',
            mode: 'markers',
            name: 'Current (Put)',
            marker: { color: 'rgb(239, 68, 68)', size: 10, symbol: 'circle' },
            showlegend: false,
          },
        ]}
        layout={{
          autosize: true,
          height: 350,
          paper_bgcolor: 'transparent',
          plot_bgcolor: 'transparent',
          margin: { l: 60, r: 20, t: 20, b: 60 },
          xaxis: {
            title: { text: 'Underlying Price ($)', font: { color: 'rgb(156, 163, 175)' } },
            gridcolor: 'rgb(55, 65, 81)',
            zerolinecolor: 'rgb(107, 114, 128)',
            tickfont: { color: 'rgb(156, 163, 175)' },
          },
          yaxis: {
            title: { text: greekInfo[selectedGreek].name, font: { color: 'rgb(156, 163, 175)' } },
            gridcolor: 'rgb(55, 65, 81)',
            zerolinecolor: 'rgb(107, 114, 128)',
            tickfont: { color: 'rgb(156, 163, 175)' },
          },
          legend: {
            x: 0.02,
            y: 0.98,
            bgcolor: 'rgba(22, 23, 29, 0.8)',
            font: { color: 'rgb(156, 163, 175)', size: 10 },
          },
          shapes: [
            {
              type: 'line',
              x0: inputs.strikePrice,
              x1: inputs.strikePrice,
              y0: 0,
              y1: 1,
              yref: 'paper',
              line: { color: 'rgb(168, 85, 247)', width: 1, dash: 'dot' },
            },
          ],
        }}
        config={{
          displayModeBar: false,
        }}
        style={{ width: '100%' }}
        />
      </div>
    </div>
  );
}
