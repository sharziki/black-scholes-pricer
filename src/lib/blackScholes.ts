// Standard Normal Cumulative Distribution Function
export function normalCDF(x: number): number {
  const a1 = 0.254829592;
  const a2 = -0.284496736;
  const a3 = 1.421413741;
  const a4 = -1.453152027;
  const a5 = 1.061405429;
  const p = 0.3275911;

  const sign = x < 0 ? -1 : 1;
  x = Math.abs(x) / Math.sqrt(2);

  const t = 1.0 / (1.0 + p * x);
  const y =
    1.0 -
    ((((a5 * t + a4) * t + a3) * t + a2) * t + a1) * t * Math.exp(-x * x);

  return 0.5 * (1.0 + sign * y);
}

// Standard Normal Probability Density Function
export function normalPDF(x: number): number {
  return Math.exp(-0.5 * x * x) / Math.sqrt(2 * Math.PI);
}

export interface BlackScholesInputs {
  spotPrice: number;      // S: Current stock price
  strikePrice: number;    // K: Strike price
  timeToExpiry: number;   // T: Time to expiration (in years)
  riskFreeRate: number;   // r: Risk-free interest rate (decimal)
  volatility: number;     // σ: Volatility (decimal)
}

export interface BlackScholesResult {
  callPrice: number;
  putPrice: number;
  d1: number;
  d2: number;
}

export interface Greeks {
  delta: { call: number; put: number };
  gamma: number;
  theta: { call: number; put: number };
  vega: number;
  rho: { call: number; put: number };
}

// Calculate d1 and d2
export function calculateD1D2(inputs: BlackScholesInputs): { d1: number; d2: number } {
  const { spotPrice, strikePrice, timeToExpiry, riskFreeRate, volatility } = inputs;

  if (timeToExpiry <= 0 || volatility <= 0) {
    return { d1: 0, d2: 0 };
  }

  const d1 =
    (Math.log(spotPrice / strikePrice) +
      (riskFreeRate + (volatility * volatility) / 2) * timeToExpiry) /
    (volatility * Math.sqrt(timeToExpiry));

  const d2 = d1 - volatility * Math.sqrt(timeToExpiry);

  return { d1, d2 };
}

// Black-Scholes pricing formula
export function blackScholes(inputs: BlackScholesInputs): BlackScholesResult {
  const { spotPrice, strikePrice, timeToExpiry, riskFreeRate } = inputs;
  const { d1, d2 } = calculateD1D2(inputs);

  if (timeToExpiry <= 0) {
    // At expiration
    const callPrice = Math.max(spotPrice - strikePrice, 0);
    const putPrice = Math.max(strikePrice - spotPrice, 0);
    return { callPrice, putPrice, d1: 0, d2: 0 };
  }

  const discountFactor = Math.exp(-riskFreeRate * timeToExpiry);

  const callPrice =
    spotPrice * normalCDF(d1) - strikePrice * discountFactor * normalCDF(d2);

  const putPrice =
    strikePrice * discountFactor * normalCDF(-d2) - spotPrice * normalCDF(-d1);

  return {
    callPrice: Math.max(callPrice, 0),
    putPrice: Math.max(putPrice, 0),
    d1,
    d2,
  };
}

// Calculate Greeks
export function calculateGreeks(inputs: BlackScholesInputs): Greeks {
  const { spotPrice, strikePrice, timeToExpiry, riskFreeRate, volatility } = inputs;
  const { d1, d2 } = calculateD1D2(inputs);

  if (timeToExpiry <= 0 || volatility <= 0) {
    return {
      delta: { call: spotPrice > strikePrice ? 1 : 0, put: spotPrice < strikePrice ? -1 : 0 },
      gamma: 0,
      theta: { call: 0, put: 0 },
      vega: 0,
      rho: { call: 0, put: 0 },
    };
  }

  const sqrtT = Math.sqrt(timeToExpiry);
  const discountFactor = Math.exp(-riskFreeRate * timeToExpiry);
  const pdfD1 = normalPDF(d1);

  // Delta: Rate of change of option price with respect to spot price
  const deltaCall = normalCDF(d1);
  const deltaPut = deltaCall - 1;

  // Gamma: Rate of change of delta with respect to spot price
  const gamma = pdfD1 / (spotPrice * volatility * sqrtT);

  // Theta: Rate of change of option price with respect to time (per year)
  // Converted to daily theta by dividing by 365
  const thetaCall =
    (-(spotPrice * pdfD1 * volatility) / (2 * sqrtT) -
      riskFreeRate * strikePrice * discountFactor * normalCDF(d2)) / 365;

  const thetaPut =
    (-(spotPrice * pdfD1 * volatility) / (2 * sqrtT) +
      riskFreeRate * strikePrice * discountFactor * normalCDF(-d2)) / 365;

  // Vega: Rate of change of option price with respect to volatility
  // Expressed per 1% change in volatility
  const vega = (spotPrice * sqrtT * pdfD1) / 100;

  // Rho: Rate of change of option price with respect to interest rate
  // Expressed per 1% change in rate
  const rhoCall = (strikePrice * timeToExpiry * discountFactor * normalCDF(d2)) / 100;
  const rhoPut = (-strikePrice * timeToExpiry * discountFactor * normalCDF(-d2)) / 100;

  return {
    delta: { call: deltaCall, put: deltaPut },
    gamma,
    theta: { call: thetaCall, put: thetaPut },
    vega,
    rho: { call: rhoCall, put: rhoPut },
  };
}

// Generate data for 3D surface plot
export function generateSurfaceData(
  baseInputs: BlackScholesInputs,
  strikeRange: { min: number; max: number; steps: number },
  volRange: { min: number; max: number; steps: number },
  optionType: 'call' | 'put'
): { strikes: number[]; volatilities: number[]; prices: number[][] } {
  const strikes: number[] = [];
  const volatilities: number[] = [];
  const prices: number[][] = [];

  const strikeStep = (strikeRange.max - strikeRange.min) / (strikeRange.steps - 1);
  const volStep = (volRange.max - volRange.min) / (volRange.steps - 1);

  for (let i = 0; i < volRange.steps; i++) {
    volatilities.push(volRange.min + i * volStep);
  }

  for (let i = 0; i < strikeRange.steps; i++) {
    strikes.push(strikeRange.min + i * strikeStep);
  }

  for (let i = 0; i < strikeRange.steps; i++) {
    const row: number[] = [];
    for (let j = 0; j < volRange.steps; j++) {
      const result = blackScholes({
        ...baseInputs,
        strikePrice: strikes[i],
        volatility: volatilities[j],
      });
      row.push(optionType === 'call' ? result.callPrice : result.putPrice);
    }
    prices.push(row);
  }

  return { strikes, volatilities, prices };
}

// Generate payoff diagram data
export function generatePayoffData(
  inputs: BlackScholesInputs,
  priceRange: { min: number; max: number; steps: number }
): { prices: number[]; callPayoff: number[]; putPayoff: number[]; callValue: number[]; putValue: number[] } {
  const prices: number[] = [];
  const callPayoff: number[] = [];
  const putPayoff: number[] = [];
  const callValue: number[] = [];
  const putValue: number[] = [];

  const step = (priceRange.max - priceRange.min) / (priceRange.steps - 1);

  for (let i = 0; i < priceRange.steps; i++) {
    const price = priceRange.min + i * step;
    prices.push(price);

    // Payoff at expiration
    callPayoff.push(Math.max(price - inputs.strikePrice, 0));
    putPayoff.push(Math.max(inputs.strikePrice - price, 0));

    // Current theoretical value
    const result = blackScholes({ ...inputs, spotPrice: price });
    callValue.push(result.callPrice);
    putValue.push(result.putPrice);
  }

  return { prices, callPayoff, putPayoff, callValue, putValue };
}

// Generate Greek sensitivity data
export function generateGreekSensitivity(
  baseInputs: BlackScholesInputs,
  greek: 'delta' | 'gamma' | 'theta' | 'vega' | 'rho',
  priceRange: { min: number; max: number; steps: number }
): { prices: number[]; callValues: number[]; putValues: number[] } {
  const prices: number[] = [];
  const callValues: number[] = [];
  const putValues: number[] = [];

  const step = (priceRange.max - priceRange.min) / (priceRange.steps - 1);

  for (let i = 0; i < priceRange.steps; i++) {
    const price = priceRange.min + i * step;
    prices.push(price);

    const greeks = calculateGreeks({ ...baseInputs, spotPrice: price });

    switch (greek) {
      case 'delta':
        callValues.push(greeks.delta.call);
        putValues.push(greeks.delta.put);
        break;
      case 'gamma':
        callValues.push(greeks.gamma);
        putValues.push(greeks.gamma);
        break;
      case 'theta':
        callValues.push(greeks.theta.call);
        putValues.push(greeks.theta.put);
        break;
      case 'vega':
        callValues.push(greeks.vega);
        putValues.push(greeks.vega);
        break;
      case 'rho':
        callValues.push(greeks.rho.call);
        putValues.push(greeks.rho.put);
        break;
    }
  }

  return { prices, callValues, putValues };
}
