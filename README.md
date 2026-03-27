# Black-Scholes Options Pricer

An interactive Black-Scholes options pricing calculator with real-time Greeks visualization, 3D surface plots, and comprehensive payoff diagrams.

![Black-Scholes Pricer](https://img.shields.io/badge/Finance-Options%20Pricing-blue)
![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue)
![React](https://img.shields.io/badge/React-18-blue)

## Features

### Core Pricing Engine
- **Black-Scholes Formula**: Implemented from scratch without external math libraries
- **Real-time Calculations**: Instant updates as you adjust parameters
- **Call & Put Pricing**: Simultaneous pricing for both option types

### Greeks Dashboard
- **Delta (Δ)**: Rate of change of option price vs spot price
- **Gamma (Γ)**: Rate of change of delta
- **Theta (Θ)**: Time decay (daily)
- **Vega (ν)**: Sensitivity to volatility changes
- **Rho (ρ)**: Sensitivity to interest rate changes

### Visualizations
- **3D Surface Plot**: Interactive option price surface across strike and volatility dimensions
- **Payoff Diagram**: Expiration payoff vs current theoretical value
- **Greek Sensitivity Charts**: See how each Greek changes as the underlying moves
- **Visual Gauges**: Intuitive display of Greek values

### Additional Features
- **Math Details Panel**: Collapsible section showing all formulas and intermediate calculations
- **CSV Export**: Download all calculations for further analysis
- **Responsive Design**: Works on desktop and mobile
- **Dark Mode**: Professional fintech aesthetic

## Getting Started

### Prerequisites
- Node.js 18+
- npm or yarn

### Installation

```bash
# Clone the repository
git clone https://github.com/yourusername/black-scholes-pricer.git

# Navigate to project directory
cd black-scholes-pricer

# Install dependencies
npm install

# Start development server
npm run dev
```

### Build for Production

```bash
npm run build
```

## Technical Implementation

### Black-Scholes Formula

The calculator implements the standard Black-Scholes-Merton model:

```
Call Price: C = S × N(d₁) - K × e^(-rT) × N(d₂)
Put Price:  P = K × e^(-rT) × N(-d₂) - S × N(-d₁)

Where:
d₁ = [ln(S/K) + (r + σ²/2)T] / (σ√T)
d₂ = d₁ - σ√T
```

### Cumulative Normal Distribution

The CDF is calculated using the Abramowitz and Stegun approximation, providing high accuracy without external dependencies.

### Greeks Calculations

All Greeks are calculated analytically:
- Delta: ∂C/∂S = N(d₁) for calls, N(d₁) - 1 for puts
- Gamma: ∂²C/∂S² = N'(d₁) / (S × σ × √T)
- Theta: ∂C/∂t (converted to daily)
- Vega: ∂C/∂σ (per 1% change)
- Rho: ∂C/∂r (per 1% change)

## Tech Stack

- **React 18** - UI framework
- **TypeScript** - Type safety
- **Vite** - Build tool
- **Tailwind CSS** - Styling
- **Plotly.js** - 3D visualizations and charts
- **Lucide React** - Icons

## Input Parameters

| Parameter | Range | Description |
|-----------|-------|-------------|
| Spot Price | $1 - $500 | Current market price |
| Strike Price | $1 - $500 | Exercise price |
| Time to Expiry | 0.01 - 2 years | Time until expiration |
| Risk-Free Rate | 0% - 15% | Annualized rate |
| Volatility | 1% - 100% | Implied volatility |

## License

MIT License - feel free to use for educational or commercial purposes.

## Disclaimer

This tool is for educational purposes only. It should not be used as the sole basis for any trading decisions. Options trading involves significant risk and is not suitable for all investors.
