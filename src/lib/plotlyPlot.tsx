import * as FactoryModule from 'react-plotly.js/factory';
// @ts-expect-error plotly.js dist subpath has no DefinitelyTyped entry
import * as PlotlyModule from 'plotly.js/dist/plotly.js';
import type { ComponentType } from 'react';
import type { PlotParams } from 'react-plotly.js';

/** Rollup/Vite sometimes nests `.default` more than once for CJS/UMD interop. */
function unwrapDefault<T>(mod: unknown): T {
  let x: unknown = mod;
  for (let i = 0; i < 4; i += 1) {
    if (
      x !== null &&
      typeof x === 'object' &&
      'default' in x &&
      (x as { default: unknown }).default !== undefined
    ) {
      const next = (x as { default: unknown }).default;
      if (next === x) break;
      x = next;
    } else {
      break;
    }
  }
  return x as T;
}

const createPlotlyComponent = unwrapDefault<(plotly: object) => ComponentType<PlotParams>>(
  FactoryModule
);
const plotly = unwrapDefault<object>(PlotlyModule);

export const Plot = createPlotlyComponent(plotly) as ComponentType<PlotParams>;
