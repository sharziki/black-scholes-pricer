import { useState } from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';
import type { BlackScholesInputs, BlackScholesResult, Greeks } from '../lib/blackScholes';

interface MathDetailsProps {
  inputs: BlackScholesInputs;
  result: BlackScholesResult;
  greeks: Greeks;
}

export function MathDetails({ inputs, result, greeks }: MathDetailsProps) {
  const [isOpen, setIsOpen] = useState(false);

  const { spotPrice: S, strikePrice: K, timeToExpiry: T, riskFreeRate: r, volatility: sigma } = inputs;
  const { d1, d2, callPrice, putPrice } = result;

  return (
    <div className="panel overflow-hidden">
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="w-full px-7 py-5 sm:px-9 sm:py-6 flex items-center justify-between gap-4 text-left hover:bg-[hsl(var(--secondary))]/40 transition-colors"
      >
        <span className="text-lg font-semibold tracking-tight text-[hsl(var(--foreground))]">
          Math details
        </span>
        {isOpen ? (
          <ChevronUp className="w-5 h-5 text-[hsl(var(--muted-foreground))]" />
        ) : (
          <ChevronDown className="w-5 h-5 text-[hsl(var(--muted-foreground))]" />
        )}
      </button>

      {isOpen && (
        <div className="px-7 sm:px-9 pb-8 sm:pb-10 space-y-8 sm:space-y-10 border-t border-[hsl(var(--border))]/80">
          {/* Input Parameters */}
          <div className="pt-8 sm:pt-9">
            <h3 className="text-sm font-semibold text-[hsl(var(--muted-foreground))] uppercase tracking-wider mb-4">
              Input Parameters
            </h3>
            <div className="grid grid-cols-2 md:grid-cols-5 gap-4 sm:gap-5 font-mono text-sm">
              <div className="bg-[hsl(var(--secondary))] rounded-lg p-4">
                <div className="text-[hsl(var(--muted-foreground))]">S (Spot)</div>
                <div className="text-[hsl(var(--foreground))] font-semibold">${S.toFixed(2)}</div>
              </div>
              <div className="bg-[hsl(var(--secondary))] rounded-lg p-4">
                <div className="text-[hsl(var(--muted-foreground))]">K (Strike)</div>
                <div className="text-[hsl(var(--foreground))] font-semibold">${K.toFixed(2)}</div>
              </div>
              <div className="bg-[hsl(var(--secondary))] rounded-lg p-4">
                <div className="text-[hsl(var(--muted-foreground))]">T (Time)</div>
                <div className="text-[hsl(var(--foreground))] font-semibold">{T.toFixed(4)} yrs</div>
              </div>
              <div className="bg-[hsl(var(--secondary))] rounded-lg p-4">
                <div className="text-[hsl(var(--muted-foreground))]">r (Rate)</div>
                <div className="text-[hsl(var(--foreground))] font-semibold">{(r * 100).toFixed(2)}%</div>
              </div>
              <div className="bg-[hsl(var(--secondary))] rounded-lg p-4">
                <div className="text-[hsl(var(--muted-foreground))]">σ (Vol)</div>
                <div className="text-[hsl(var(--foreground))] font-semibold">{(sigma * 100).toFixed(2)}%</div>
              </div>
            </div>
          </div>

          {/* Black-Scholes Formula */}
          <div>
            <h3 className="text-sm font-semibold text-[hsl(var(--muted-foreground))] uppercase tracking-wider mb-4">
              Black-Scholes Formula
            </h3>
            <div className="bg-[hsl(var(--secondary))] rounded-lg p-5 sm:p-6 font-mono text-sm overflow-x-auto">
              <div className="space-y-5">
                <div>
                  <div className="text-[hsl(var(--call))] mb-1">Call Price:</div>
                  <div className="text-[hsl(var(--foreground))]">
                    C = S × N(d₁) - K × e<sup>-rT</sup> × N(d₂)
                  </div>
                </div>
                <div>
                  <div className="text-[hsl(var(--put))] mb-1">Put Price:</div>
                  <div className="text-[hsl(var(--foreground))]">
                    P = K × e<sup>-rT</sup> × N(-d₂) - S × N(-d₁)
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* D1 and D2 Calculation */}
          <div>
            <h3 className="text-sm font-semibold text-[hsl(var(--muted-foreground))] uppercase tracking-wider mb-4">
              d₁ and d₂ Calculation
            </h3>
            <div className="bg-[hsl(var(--secondary))] rounded-lg p-5 sm:p-6 font-mono text-sm space-y-4">
              <div>
                <div className="text-[hsl(var(--primary))] mb-1">d₁ Formula:</div>
                <div className="text-[hsl(var(--foreground))]">
                  d₁ = [ln(S/K) + (r + σ²/2)T] / (σ√T)
                </div>
              </div>
              <div className="text-[hsl(var(--muted-foreground))]">
                d₁ = [ln({S.toFixed(2)}/{K.toFixed(2)}) + ({r.toFixed(4)} + {(sigma*sigma/2).toFixed(4)}) × {T.toFixed(4)}] / ({sigma.toFixed(4)} × √{T.toFixed(4)})
              </div>
              <div className="text-[hsl(var(--foreground))] font-semibold">
                d₁ = {d1.toFixed(6)}
              </div>

              <div className="border-t border-[hsl(var(--border))] pt-3 mt-3">
                <div className="text-[hsl(var(--primary))] mb-1">d₂ Formula:</div>
                <div className="text-[hsl(var(--foreground))]">
                  d₂ = d₁ - σ√T
                </div>
              </div>
              <div className="text-[hsl(var(--muted-foreground))]">
                d₂ = {d1.toFixed(6)} - {sigma.toFixed(4)} × √{T.toFixed(4)}
              </div>
              <div className="text-[hsl(var(--foreground))] font-semibold">
                d₂ = {d2.toFixed(6)}
              </div>
            </div>
          </div>

          {/* Final Calculations */}
          <div>
            <h3 className="text-sm font-semibold text-[hsl(var(--muted-foreground))] uppercase tracking-wider mb-4">
              Final Calculations
            </h3>
            <div className="grid md:grid-cols-2 gap-5 sm:gap-6">
              <div className="bg-[hsl(var(--call))]/10 border border-[hsl(var(--call))]/30 rounded-lg p-5 sm:p-6 font-mono text-sm">
                <div className="text-[hsl(var(--call))] font-semibold mb-2">Call Option</div>
                <div className="text-[hsl(var(--foreground))] space-y-1">
                  <div>N(d₁) = {(0.5 * (1 + erf(d1 / Math.sqrt(2)))).toFixed(6)}</div>
                  <div>N(d₂) = {(0.5 * (1 + erf(d2 / Math.sqrt(2)))).toFixed(6)}</div>
                  <div>e<sup>-rT</sup> = {Math.exp(-r * T).toFixed(6)}</div>
                  <div className="pt-2 border-t border-[hsl(var(--call))]/30 mt-2">
                    <span className="text-[hsl(var(--call))]">C = ${callPrice.toFixed(4)}</span>
                  </div>
                </div>
              </div>
              <div className="bg-[hsl(var(--put))]/10 border border-[hsl(var(--put))]/30 rounded-lg p-5 sm:p-6 font-mono text-sm">
                <div className="text-[hsl(var(--put))] font-semibold mb-2">Put Option</div>
                <div className="text-[hsl(var(--foreground))] space-y-1">
                  <div>N(-d₁) = {(0.5 * (1 + erf(-d1 / Math.sqrt(2)))).toFixed(6)}</div>
                  <div>N(-d₂) = {(0.5 * (1 + erf(-d2 / Math.sqrt(2)))).toFixed(6)}</div>
                  <div>e<sup>-rT</sup> = {Math.exp(-r * T).toFixed(6)}</div>
                  <div className="pt-2 border-t border-[hsl(var(--put))]/30 mt-2">
                    <span className="text-[hsl(var(--put))]">P = ${putPrice.toFixed(4)}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Greeks Formulas */}
          <div>
            <h3 className="text-sm font-semibold text-[hsl(var(--muted-foreground))] uppercase tracking-wider mb-4">
              Greeks Formulas
            </h3>
            <div className="bg-[hsl(var(--secondary))] rounded-lg p-5 sm:p-6 font-mono text-sm space-y-3">
              <div><span className="text-[hsl(var(--primary))]">Δ</span> Delta (Call) = N(d₁) = {greeks.delta.call.toFixed(4)}</div>
              <div><span className="text-[hsl(var(--primary))]">Δ</span> Delta (Put) = N(d₁) - 1 = {greeks.delta.put.toFixed(4)}</div>
              <div><span className="text-[hsl(var(--primary))]">Γ</span> Gamma = N'(d₁) / (S × σ × √T) = {greeks.gamma.toFixed(6)}</div>
              <div><span className="text-[hsl(var(--primary))]">Θ</span> Theta (Call, daily) = {greeks.theta.call.toFixed(4)}</div>
              <div><span className="text-[hsl(var(--primary))]">Θ</span> Theta (Put, daily) = {greeks.theta.put.toFixed(4)}</div>
              <div><span className="text-[hsl(var(--primary))]">ν</span> Vega (per 1% vol) = {greeks.vega.toFixed(4)}</div>
              <div><span className="text-[hsl(var(--primary))]">ρ</span> Rho (Call, per 1% rate) = {greeks.rho.call.toFixed(4)}</div>
              <div><span className="text-[hsl(var(--primary))]">ρ</span> Rho (Put, per 1% rate) = {greeks.rho.put.toFixed(4)}</div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// Error function approximation for display purposes
function erf(x: number): number {
  const a1 = 0.254829592;
  const a2 = -0.284496736;
  const a3 = 1.421413741;
  const a4 = -1.453152027;
  const a5 = 1.061405429;
  const p = 0.3275911;

  const sign = x < 0 ? -1 : 1;
  x = Math.abs(x);

  const t = 1.0 / (1.0 + p * x);
  const y = 1.0 - ((((a5 * t + a4) * t + a3) * t + a2) * t + a1) * t * Math.exp(-x * x);

  return sign * y;
}
