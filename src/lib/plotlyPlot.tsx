import createPlotlyComponent from 'react-plotly.js/factory';
// UMD bundle; no typings published for this package
// @ts-expect-error — plotly.js-dist-min
import Plotly from 'plotly.js-dist-min';
import type { ComponentType } from 'react';
import type { PlotParams } from 'react-plotly.js';

/** Plotly React chart — factory + explicit Plotly avoids broken default interop from `react-plotly.js` in Vite production. */
export const Plot = createPlotlyComponent(Plotly) as ComponentType<PlotParams>;
