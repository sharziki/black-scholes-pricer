import { Plot } from '../lib/plotlyPlot';
import { SectionHeader } from './SectionHeader';
import { chartPanelClass } from './chartClasses';
import { generatePayoffData } from '../lib/blackScholes';
import type { BlackScholesInputs } from '../lib/blackScholes';

interface PayoffDiagramProps {
  inputs: BlackScholesInputs;
}

export function PayoffDiagram({ inputs }: PayoffDiagramProps) {
  const priceRange = {
    min: inputs.spotPrice * 0.5,
    max: inputs.spotPrice * 1.5,
    steps: 100,
  };

  const payoffData = generatePayoffData(inputs, priceRange);

  return (
    <div className="panel p-7 sm:p-9 lg:p-10">
      <SectionHeader
        title="Payoff diagram"
        subtitle="Intrinsic-style payoff at expiry (dashed) versus full theoretical value from Black–Scholes (solid)."
      />

      <div className={chartPanelClass}>
        <Plot
        data={[
          {
            x: payoffData.prices,
            y: payoffData.callPayoff,
            type: 'scatter',
            mode: 'lines',
            name: 'Call Payoff (Expiry)',
            line: { color: 'rgb(34, 197, 94)', width: 2, dash: 'dash' },
            hovertemplate: 'Price: $%{x:.2f}<br>Payoff: $%{y:.2f}<extra>Call Payoff</extra>',
          },
          {
            x: payoffData.prices,
            y: payoffData.callValue,
            type: 'scatter',
            mode: 'lines',
            name: 'Call Value (Now)',
            line: { color: 'rgb(34, 197, 94)', width: 3 },
            hovertemplate: 'Price: $%{x:.2f}<br>Value: $%{y:.2f}<extra>Call Value</extra>',
          },
          {
            x: payoffData.prices,
            y: payoffData.putPayoff,
            type: 'scatter',
            mode: 'lines',
            name: 'Put Payoff (Expiry)',
            line: { color: 'rgb(239, 68, 68)', width: 2, dash: 'dash' },
            hovertemplate: 'Price: $%{x:.2f}<br>Payoff: $%{y:.2f}<extra>Put Payoff</extra>',
          },
          {
            x: payoffData.prices,
            y: payoffData.putValue,
            type: 'scatter',
            mode: 'lines',
            name: 'Put Value (Now)',
            line: { color: 'rgb(239, 68, 68)', width: 3 },
            hovertemplate: 'Price: $%{x:.2f}<br>Value: $%{y:.2f}<extra>Put Value</extra>',
          },
          {
            x: [inputs.spotPrice],
            y: [0],
            type: 'scatter',
            mode: 'markers',
            name: 'Current Price',
            marker: { color: 'rgb(59, 130, 246)', size: 12, symbol: 'diamond' },
            hovertemplate: 'Current: $%{x:.2f}<extra></extra>',
          },
          {
            x: [inputs.strikePrice],
            y: [0],
            type: 'scatter',
            mode: 'markers',
            name: 'Strike Price',
            marker: { color: 'rgb(168, 85, 247)', size: 12, symbol: 'x' },
            hovertemplate: 'Strike: $%{x:.2f}<extra></extra>',
          },
        ]}
        layout={{
          autosize: true,
          height: 400,
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
            title: { text: 'Option Value / Payoff ($)', font: { color: 'rgb(156, 163, 175)' } },
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

      <div className="flex flex-wrap items-center justify-center gap-x-10 gap-y-4 mt-8 pt-2 text-xs text-[hsl(var(--muted-foreground))]">
        <div className="flex items-center gap-2">
          <div
            className="w-9 h-0.5 bg-[hsl(var(--call))]"
            style={{ borderStyle: 'dashed', borderWidth: '1px 0' }}
          />
          <span>Payoff at expiry</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-9 h-0.5 bg-[hsl(var(--call))]" />
          <span>BS value (now)</span>
        </div>
      </div>
    </div>
  );
}
