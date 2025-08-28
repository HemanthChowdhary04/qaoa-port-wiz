import { useState } from "react";
import { PortfolioDashboard } from "@/components/PortfolioDashboard";
import { PortfolioResults } from "@/components/PortfolioResults";

interface PortfolioConfig {
  tickers: string[];
  period: string;
  interval: string;
  riskFree: number;
  K: number;
  useDiscreteWeights: boolean;
  bitsPerAsset: number;
  maxWeight: number;
  shrinkLedoitWolf: boolean;
  transactionCost: number;
  pList: number[];
  shots: number;
}

interface PortfolioResult {
  method: string;
  selectedAssets: string[];
  weights: { [key: string]: number };
  sharpeRatio: number;
  expectedReturn: number;
  volatility: number;
  iterations: number;
  convergence: boolean;
}

export default function Portfolio() {
  const [currentView, setCurrentView] = useState<'dashboard' | 'results'>('dashboard');
  const [isOptimizing, setIsOptimizing] = useState(false);
  const [results, setResults] = useState<PortfolioResult[]>([]);

  // Advanced QAOA portfolio optimization simulation
  const simulateOptimization = async (config: PortfolioConfig): Promise<PortfolioResult[]> => {
    // Simulate API delay for realistic feel
    await new Promise(resolve => setTimeout(resolve, 3000));

    // Generate simulated results that match the PDF's Sharpe comparison chart
    const selectedAssets = config.tickers.slice(0, config.K);
    
    // Base Sharpe ratio influenced by configuration
    const baseSharpe = 0.85 + (config.K / 10) * 0.1 + (config.useDiscreteWeights ? 0.05 : 0);
    
    // 1. Greedy Baseline (lowest Sharpe)
    const greedyResult: PortfolioResult = {
      method: "Greedy (eq-w)",
      selectedAssets,
      weights: generateEqualWeights(selectedAssets),
      sharpeRatio: baseSharpe - 0.15 + Math.random() * 0.1, // ~1.00
      expectedReturn: 0.08 + Math.random() * 0.04,
      volatility: 0.18 + Math.random() * 0.03,
      iterations: 1,
      convergence: true
    };

    // 2. QAOA Equal-Weight (modest improvement)
    const qaoaEqualResult: PortfolioResult = {
      method: "QAOA (eq-w)",
      selectedAssets,
      weights: generateWeights(selectedAssets, config.useDiscreteWeights),
      sharpeRatio: baseSharpe + 0.10 + Math.random() * 0.15, // ~1.25
      expectedReturn: 0.10 + Math.random() * 0.05,
      volatility: 0.16 + Math.random() * 0.03,
      iterations: Math.floor(Math.random() * 15) + 8,
      convergence: Math.random() > 0.2
    };

    // 3. QAOA + Refinement (significant improvement)
    const qaoaRefinedResult: PortfolioResult = {
      method: "QAOA + Refine",
      selectedAssets,
      weights: generateOptimalWeights(selectedAssets, config.useDiscreteWeights),
      sharpeRatio: baseSharpe + 0.50 + Math.random() * 0.20, // ~1.65
      expectedReturn: 0.13 + Math.random() * 0.06,
      volatility: 0.14 + Math.random() * 0.02,
      iterations: Math.floor(Math.random() * 20) + 12,
      convergence: Math.random() > 0.1
    };

    // 4. Tangency Portfolio (theoretical optimal, no cardinality constraint)
    const tangencyResult: PortfolioResult = {
      method: "Tangency (no card)",
      selectedAssets: config.tickers, // Uses all assets
      weights: generateTangencyWeights(config.tickers),
      sharpeRatio: baseSharpe + 0.85 + Math.random() * 0.25, // ~2.00
      expectedReturn: 0.15 + Math.random() * 0.07,
      volatility: 0.12 + Math.random() * 0.02,
      iterations: 1,
      convergence: true
    };

    return [greedyResult, qaoaEqualResult, qaoaRefinedResult, tangencyResult];
  };

  const generateWeights = (assets: string[], discrete: boolean): { [key: string]: number } => {
    const weights: { [key: string]: number } = {};
    let remainingWeight = 1.0;
    
    assets.forEach((asset, index) => {
      if (index === assets.length - 1) {
        weights[asset] = remainingWeight;
      } else {
        const weight = discrete 
          ? Math.floor(Math.random() * 40 + 10) / 100  // 10-50% in discrete mode
          : Math.random() * 0.4 + 0.1;  // 10-50% in continuous mode
        const actualWeight = Math.min(weight, remainingWeight - (assets.length - index - 1) * 0.05);
        weights[asset] = Math.max(0.05, actualWeight);
        remainingWeight -= weights[asset];
      }
    });

    // Normalize to sum to 1
    const total = Object.values(weights).reduce((sum, w) => sum + w, 0);
    Object.keys(weights).forEach(asset => {
      weights[asset] = weights[asset] / total;
    });

    return weights;
  };

  const generateEqualWeights = (assets: string[]): { [key: string]: number } => {
    const weights: { [key: string]: number } = {};
    const equalWeight = 1.0 / assets.length;
    assets.forEach(asset => {
      weights[asset] = equalWeight;
    });
    return weights;
  };

  const generateOptimalWeights = (assets: string[], discrete: boolean): { [key: string]: number } => {
    const weights: { [key: string]: number } = {};
    let remainingWeight = 1.0;
    
    // Generate more optimal allocation (simulate QAOA + refinement)
    assets.forEach((asset, index) => {
      if (index === assets.length - 1) {
        weights[asset] = remainingWeight;
      } else {
        // More concentrated allocation for better Sharpe
        const weight = discrete 
          ? Math.floor(Math.random() * 50 + 20) / 100  // 20-70% in discrete mode
          : Math.random() * 0.5 + 0.2;  // 20-70% in continuous mode
        const actualWeight = Math.min(weight, remainingWeight - (assets.length - index - 1) * 0.05);
        weights[asset] = Math.max(0.05, actualWeight);
        remainingWeight -= weights[asset];
      }
    });

    // Normalize to sum to 1
    const total = Object.values(weights).reduce((sum, w) => sum + w, 0);
    Object.keys(weights).forEach(asset => {
      weights[asset] = weights[asset] / total;
    });

    return weights;
  };

  const generateTangencyWeights = (assets: string[]): { [key: string]: number } => {
    const weights: { [key: string]: number } = {};
    
    // Simulate unconstrained tangency portfolio (can use all assets)
    const randomWeights = assets.map(() => Math.random());
    const total = randomWeights.reduce((sum, w) => sum + w, 0);
    
    assets.forEach((asset, index) => {
      weights[asset] = randomWeights[index] / total;
    });

    return weights;
  };

  const handleOptimize = async (config: PortfolioConfig) => {
    setIsOptimizing(true);
    try {
      const optimizationResults = await simulateOptimization(config);
      setResults(optimizationResults);
      setCurrentView('results');
    } catch (error) {
      console.error('Optimization failed:', error);
    } finally {
      setIsOptimizing(false);
    }
  };

  const handleBack = () => {
    setCurrentView('dashboard');
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        {currentView === 'dashboard' ? (
          <PortfolioDashboard onOptimize={handleOptimize} isOptimizing={isOptimizing} />
        ) : (
          <PortfolioResults results={results} onBack={handleBack} />
        )}
      </div>
    </div>
  );
}