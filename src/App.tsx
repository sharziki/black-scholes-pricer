import { useState, useMemo } from 'react';
import { Activity } from 'lucide-react';
import { InputSlider } from './components/InputSlider';
import { PriceCard } from './components/PriceCard';
import { GreekGauge } from './components/GreekGauge';
import { MathDetails } from './components/MathDetails';
import { Surface3D } from './components/Surface3D';
import { PayoffDiagram } from './components/PayoffDiagram';
import { GreekSensitivity } from './components/GreekSensitivity';
import { ExportButton } from './components/ExportButton';
import { SectionHeader } from './components/SectionHeader';
import { blackScholes, calculateGreeks } from './lib/blackScholes';
import type { BlackScholesInputs } from './lib/blackScholes';

function App() {
  const [spotPrice, setSpotPrice] = useState(100);
  const [strikePrice, setStrikePrice] = useState(100);
  const [timeToExpiry, setTimeToExpiry] = useState(0.25);
  const [riskFreeRate, setRiskFreeRate] = useState(0.05);
  const [volatility, setVolatility] = useState(0.2);

  const inputs: BlackScholesInputs = useMemo(
    () => ({
      spotPrice,
      strikePrice,
      timeToExpiry,
      riskFreeRate,
      volatility,
    }),
    [spotPrice, strikePrice, timeToExpiry, riskFreeRate, volatility]
  );

  const result = useMemo(() => blackScholes(inputs), [inputs]);
  const greeks = useMemo(() => calculateGreeks(inputs), [inputs]);

  const callIntrinsic = Math.max(spotPrice - strikePrice, 0);
  const putIntrinsic = Math.max(strikePrice - spotPrice, 0);
  const callTimeValue = result.callPrice - callIntrinsic;
  const putTimeValue = result.putPrice - putIntrinsic;

  return (
    <div className="min-h-screen app-shell">
      <header className="sticky top-0 z-50 border-b border-[hsl(var(--border))]/80 bg-[hsl(var(--card))]/75 backdrop-blur-md backdrop-saturate-150">
        <div className="max-w-[90rem] mx-auto px-5 sm:px-8 lg:px-12 py-4 sm:py-5">
          <div className="flex items-center justify-between gap-5 sm:gap-8">
            <div className="flex items-center gap-6 min-w-0">
              <div className="p-5 rounded-2xl bg-[hsl(var(--primary))]/12 ring-1 ring-[hsl(var(--primary))]/20 shadow-sm shrink-0">
                <Activity className="w-5 h-5 sm:w-6 sm:h-6 text-[hsl(var(--primary))]" strokeWidth={2.25} />
              </div>
              <div className="min-w-0">
                <h1 className="text-lg sm:text-xl font-semibold tracking-tight text-[hsl(var(--foreground))]">
                  Black-Scholes Pricer
                </h1>
                <p className="text-xs sm:text-sm text-[hsl(var(--muted-foreground))] truncate sm:whitespace-normal">
                  Options pricing with Greeks visualization
                </p>
              </div>
            </div>
            <div className="flex items-center gap-6 sm:gap-6 shrink-0">
              <ExportButton inputs={inputs} result={result} greeks={greeks} />
              <a
                href="https://github.com/sharziki/black-scholes-pricer"
                target="_blank"
                rel="noopener noreferrer"
                className="p-2.5 rounded-2xl text-[hsl(var(--muted-foreground))] hover:text-[hsl(var(--foreground))] hover:bg-[hsl(var(--secondary))] transition-colors"
                aria-label="View source on GitHub"
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
                </svg>
              </a>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-[90rem] mx-auto px-5 sm:px-8 lg:px-12 py-10 sm:py-14 lg:py-16">
        <div className="grid lg:grid-cols-12 gap-10 lg:gap-12 xl:gap-14">
          <div className="lg:col-span-4 flex flex-col gap-8 lg:gap-10">
            <div className="panel p-7 sm:p-9 lg:p-10">
              <SectionHeader
                title="Parameters"
                subtitle="Adjust inputs to update prices, Greeks, and charts in real time."
              />
              <div className="space-y-9 sm:space-y-10">
                <InputSlider
                  label="Spot Price"
                  value={spotPrice}
                  onChange={setSpotPrice}
                  min={1}
                  max={500}
                  step={1}
                  unit="$"
                  tooltip="Current market price of the underlying asset"
                />
                <InputSlider
                  label="Strike Price"
                  value={strikePrice}
                  onChange={setStrikePrice}
                  min={1}
                  max={500}
                  step={1}
                  unit="$"
                  tooltip="Price at which the option can be exercised"
                />
                <InputSlider
                  label="Time to Expiry"
                  value={timeToExpiry}
                  onChange={setTimeToExpiry}
                  min={0.01}
                  max={2}
                  step={0.01}
                  unit=" yrs"
                  tooltip="Time remaining until option expiration"
                />
                <InputSlider
                  label="Risk-Free Rate"
                  value={riskFreeRate * 100}
                  onChange={(v) => setRiskFreeRate(v / 100)}
                  min={0}
                  max={15}
                  step={0.1}
                  unit="%"
                  tooltip="Annualized risk-free interest rate (e.g., Treasury rate)"
                />
                <InputSlider
                  label="Volatility"
                  value={volatility * 100}
                  onChange={(v) => setVolatility(v / 100)}
                  min={1}
                  max={100}
                  step={1}
                  unit="%"
                  tooltip="Annualized standard deviation of returns (implied volatility)"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-6 sm:gap-5">
              <PriceCard
                type="call"
                price={result.callPrice}
                intrinsicValue={callIntrinsic}
                timeValue={callTimeValue}
              />
              <PriceCard
                type="put"
                price={result.putPrice}
                intrinsicValue={putIntrinsic}
                timeValue={putTimeValue}
              />
            </div>
          </div>

          <div className="lg:col-span-8 flex flex-col gap-10 sm:gap-12 lg:gap-14">
            <div className="panel p-7 sm:p-9 lg:p-10">
              <SectionHeader
                title="Greeks"
                subtitle="Risk sensitivities for the current Black-Scholes inputs; bars are scaled per Greek’s typical range."
              />
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-2 gap-6 sm:gap-5 lg:gap-6">
                <GreekGauge
                  name="Delta"
                  symbol="Δ"
                  callValue={greeks.delta.call}
                  putValue={greeks.delta.put}
                  description="Measures the rate of change of option price with respect to the underlying asset's price. Call delta ranges from 0 to 1, put delta from -1 to 0."
                  min={-1}
                  max={1}
                />
                <GreekGauge
                  name="Gamma"
                  symbol="Γ"
                  callValue={greeks.gamma}
                  putValue={greeks.gamma}
                  description="Measures the rate of change of delta. High gamma means delta is more sensitive to price changes. Gamma is highest for at-the-money options near expiration."
                  min={0}
                  max={0.1}
                />
                <GreekGauge
                  name="Theta"
                  symbol="Θ"
                  callValue={greeks.theta.call}
                  putValue={greeks.theta.put}
                  description="Measures the rate of time decay (daily). Represents how much value the option loses each day. Usually negative for long positions."
                  min={-0.5}
                  max={0}
                />
                <GreekGauge
                  name="Vega"
                  symbol="ν"
                  callValue={greeks.vega}
                  putValue={greeks.vega}
                  description="Measures sensitivity to volatility. Shows the change in option price for a 1% change in implied volatility. Vega is highest for at-the-money options."
                  min={0}
                  max={1}
                />
                <GreekGauge
                  name="Rho"
                  symbol="ρ"
                  callValue={greeks.rho.call}
                  putValue={greeks.rho.put}
                  description="Measures sensitivity to interest rate changes. Shows the change in option price for a 1% change in the risk-free rate. Positive for calls, negative for puts."
                  min={-0.5}
                  max={0.5}
                />
              </div>
            </div>

            {/* 3D Surface */}
            <Surface3D inputs={inputs} />

            {/* Payoff Diagram */}
            <PayoffDiagram inputs={inputs} />

            {/* Greek Sensitivity */}
            <GreekSensitivity inputs={inputs} />

            {/* Math Details */}
            <MathDetails inputs={inputs} result={result} greeks={greeks} />
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-[hsl(var(--border))]/80 mt-16 sm:mt-20 bg-[hsl(var(--card))]/30">
        <div className="max-w-[90rem] mx-auto px-5 sm:px-8 lg:px-12 py-10 sm:py-12">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-5 sm:gap-8 text-sm text-[hsl(var(--muted-foreground))]">
            <p>Black-Scholes Options Pricer — Educational purposes only</p>
            <p>
              Made by{' '}
              <a 
                href="https://github.com/sharziki" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-[hsl(var(--primary))] hover:underline"
              >
                Sharvil Saxena
              </a>
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default App;
