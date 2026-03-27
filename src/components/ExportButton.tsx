import { Download } from 'lucide-react';
import type { BlackScholesInputs, BlackScholesResult, Greeks } from '../lib/blackScholes';

interface ExportButtonProps {
  inputs: BlackScholesInputs;
  result: BlackScholesResult;
  greeks: Greeks;
}

export function ExportButton({ inputs, result, greeks }: ExportButtonProps) {
  const handleExport = () => {
    const rows = [
      ['Black-Scholes Options Pricing Calculator Export'],
      ['Generated at', new Date().toISOString()],
      [''],
      ['Input Parameters'],
      ['Spot Price', `$${inputs.spotPrice.toFixed(2)}`],
      ['Strike Price', `$${inputs.strikePrice.toFixed(2)}`],
      ['Time to Expiry', `${inputs.timeToExpiry.toFixed(4)} years`],
      ['Risk-Free Rate', `${(inputs.riskFreeRate * 100).toFixed(2)}%`],
      ['Volatility', `${(inputs.volatility * 100).toFixed(2)}%`],
      [''],
      ['Intermediate Values'],
      ['d1', result.d1.toFixed(6)],
      ['d2', result.d2.toFixed(6)],
      [''],
      ['Option Prices'],
      ['Call Price', `$${result.callPrice.toFixed(4)}`],
      ['Put Price', `$${result.putPrice.toFixed(4)}`],
      [''],
      ['Greeks'],
      ['Delta (Call)', greeks.delta.call.toFixed(4)],
      ['Delta (Put)', greeks.delta.put.toFixed(4)],
      ['Gamma', greeks.gamma.toFixed(6)],
      ['Theta (Call, daily)', greeks.theta.call.toFixed(4)],
      ['Theta (Put, daily)', greeks.theta.put.toFixed(4)],
      ['Vega (per 1% vol)', greeks.vega.toFixed(4)],
      ['Rho (Call, per 1% rate)', greeks.rho.call.toFixed(4)],
      ['Rho (Put, per 1% rate)', greeks.rho.put.toFixed(4)],
    ];

    const csvContent = rows.map((row) => row.join(',')).join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `black-scholes-${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  return (
    <button
      type="button"
      onClick={handleExport}
      className="flex items-center gap-2.5 px-4 sm:px-5 py-2.5 sm:py-3 rounded-xl text-sm font-medium bg-[hsl(var(--primary))]/12 text-[hsl(var(--primary))] ring-1 ring-[hsl(var(--primary))]/25 hover:bg-[hsl(var(--primary))]/20 hover:ring-[hsl(var(--primary))]/40 transition-colors"
    >
      <Download className="w-4 h-4 shrink-0 opacity-90" />
      <span className="hidden min-[420px]:inline">Export CSV</span>
      <span className="min-[420px]:hidden">Export</span>
    </button>
  );
}
