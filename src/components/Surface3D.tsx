import { Plot } from '../lib/plotlyPlot';
import { useState } from 'react';
import { SectionHeader } from './SectionHeader';
import { chartPanelClass } from './chartClasses';
import { generateSurfaceData } from '../lib/blackScholes';
import type { BlackScholesInputs } from '../lib/blackScholes';

interface Surface3DProps {
  inputs: BlackScholesInputs;
}

export function Surface3D({ inputs }: Surface3DProps) {
  const [optionType, setOptionType] = useState<'call' | 'put'>('call');

  const strikeRange = {
    min: inputs.spotPrice * 0.7,
    max: inputs.spotPrice * 1.3,
    steps: 30,
  };

  const volRange = {
    min: 0.05,
    max: 0.8,
    steps: 30,
  };

  const surfaceData = generateSurfaceData(inputs, strikeRange, volRange, optionType);

  const colorscale: [number, string][] = optionType === 'call'
    ? [
        [0, 'rgb(20, 30, 48)'],
        [0.25, 'rgb(30, 80, 80)'],
        [0.5, 'rgb(34, 197, 94)'],
        [0.75, 'rgb(74, 222, 128)'],
        [1, 'rgb(134, 239, 172)'],
      ]
    : [
        [0, 'rgb(20, 30, 48)'],
        [0.25, 'rgb(80, 30, 30)'],
        [0.5, 'rgb(239, 68, 68)'],
        [0.75, 'rgb(248, 113, 113)'],
        [1, 'rgb(252, 165, 165)'],
      ];

  const toggleBtn = (active: boolean, variant: 'call' | 'put') =>
    active
      ? variant === 'call'
        ? 'bg-[hsl(var(--call))] text-white shadow-sm shadow-black/25'
        : 'bg-[hsl(var(--put))] text-white shadow-sm shadow-black/25'
      : 'text-[hsl(var(--muted-foreground))] hover:text-[hsl(var(--foreground))] hover:bg-[hsl(var(--background))]/40';

  return (
    <div className="panel p-7 sm:p-9 lg:p-10">
      <SectionHeader
        title="Option price surface"
        subtitle="Theory value over strike and implied volatility; the marker shows your current inputs."
        actions={
          <div className="segmented" role="group" aria-label="Option type">
            <button
              type="button"
              onClick={() => setOptionType('call')}
              className={`px-4 py-2.5 rounded-[0.5rem] text-sm font-medium transition-colors ${toggleBtn(optionType === 'call', 'call')}`}
            >
              Call
            </button>
            <button
              type="button"
              onClick={() => setOptionType('put')}
              className={`px-4 py-2.5 rounded-[0.5rem] text-sm font-medium transition-colors ${toggleBtn(optionType === 'put', 'put')}`}
            >
              Put
            </button>
          </div>
        }
      />

      <div className={chartPanelClass}>
        <Plot
        data={[
          {
            type: 'surface',
            x: surfaceData.volatilities.map((v) => v * 100),
            y: surfaceData.strikes,
            z: surfaceData.prices,
            colorscale: colorscale,
            showscale: true,
            colorbar: {
              title: {
                text: 'Price ($)',
                font: { color: 'rgb(156, 163, 175)' },
              },
              tickfont: { color: 'rgb(156, 163, 175)' },
            },
            hovertemplate:
              'Strike: $%{y:.2f}<br>Volatility: %{x:.1f}%<br>Price: $%{z:.2f}<extra></extra>',
          },
          {
            type: 'scatter3d',
            x: [inputs.volatility * 100],
            y: [inputs.strikePrice],
            z: [optionType === 'call'
              ? surfaceData.prices[Math.floor(surfaceData.strikes.length / 2)][Math.floor(surfaceData.volatilities.length / 2)]
              : surfaceData.prices[Math.floor(surfaceData.strikes.length / 2)][Math.floor(surfaceData.volatilities.length / 2)]
            ],
            mode: 'markers',
            marker: {
              size: 8,
              color: 'rgb(59, 130, 246)',
              symbol: 'diamond',
            },
            name: 'Current',
            hovertemplate: 'Current Position<extra></extra>',
          },
        ]}
        layout={{
          autosize: true,
          height: 500,
          paper_bgcolor: 'transparent',
          plot_bgcolor: 'transparent',
          margin: { l: 0, r: 0, t: 0, b: 0 },
          scene: {
            xaxis: {
              title: { text: 'Volatility (%)', font: { color: 'rgb(156, 163, 175)' } },
              gridcolor: 'rgb(55, 65, 81)',
              zerolinecolor: 'rgb(55, 65, 81)',
              tickfont: { color: 'rgb(156, 163, 175)' },
            },
            yaxis: {
              title: { text: 'Strike ($)', font: { color: 'rgb(156, 163, 175)' } },
              gridcolor: 'rgb(55, 65, 81)',
              zerolinecolor: 'rgb(55, 65, 81)',
              tickfont: { color: 'rgb(156, 163, 175)' },
            },
            zaxis: {
              title: { text: 'Option Price ($)', font: { color: 'rgb(156, 163, 175)' } },
              gridcolor: 'rgb(55, 65, 81)',
              zerolinecolor: 'rgb(55, 65, 81)',
              tickfont: { color: 'rgb(156, 163, 175)' },
            },
            bgcolor: 'transparent',
            camera: {
              eye: { x: 1.5, y: 1.5, z: 1.2 },
            },
          },
        }}
        config={{
          displayModeBar: true,
          displaylogo: false,
          modeBarButtonsToRemove: ['toImage', 'sendDataToCloud'],
        }}
        style={{ width: '100%' }}
        />
      </div>

      <p className="text-xs text-[hsl(var(--muted-foreground))] mt-8 text-center leading-relaxed max-w-lg mx-auto">
        Drag to rotate · Scroll to zoom · Diamond marks the current strike / vol
      </p>
    </div>
  );
}
