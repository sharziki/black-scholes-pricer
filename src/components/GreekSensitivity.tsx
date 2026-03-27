import { Plot } from '../lib/plotlyPlot';
import { useState } from 'react';
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
    <div className="bg-[hsl(var(--card))] rounded-xl border border-[hsl(var(--border))] p-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4">
        <h2 className="text-lg font-semibold text-[hsl(var(--foreground))]">
          Greek Sensitivity
        </h2>
        <div className="flex flex-wrap gap-2">
          {(Object.keys(greekInfo) as GreekType[]).map((greek) => (
            <button
              key={greek}
              onClick={() => setSelectedGreek(greek)}
              className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all ${
                selectedGreek === greek
                  ? 'bg-[hsl(var(--primary))] text-white'
                  : 'bg-[hsl(var(--secondary))] text-[hsl(var(--muted-foreground))] hover:text-[hsl(var(--foreground))]'
              }`}
            >
              {greekInfo[greek].symbol}
            </button>
          ))}
        </div>
      </div>

      <div className="mb-4 p-3 bg-[hsl(var(--secondary))] rounded-lg">
        <div className="flex items-center gap-2">
          <span className="text-xl font-bold text-[hsl(var(--primary))]">
            {greekInfo[selectedGreek].symbol}
          </span>
          <span className="text-[hsl(var(--foreground))] font-medium">
            {greekInfo[selectedGreek].name}
          </span>
          <span className="text-[hsl(var(--muted-foreground))] text-sm">
            — {greekInfo[selectedGreek].description}
          </span>
        </div>
      </div>

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
  );
}
