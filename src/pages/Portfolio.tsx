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

  // Simulate the QAOA optimization process
  const simulateOptimization = async (config: PortfolioConfig): Promise<PortfolioResult[]> => {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 3000));

    // Generate simulated results based on the config
    const selectedAssets = config.tickers.slice(0, config.K);
    
    // Generate realistic-looking results
    const qaoaResult: PortfolioResult = {
      method: "QAOA (Quantum)",
      selectedAssets,
      weights: generateWeights(selectedAssets, config.useDiscreteWeights),
      sharpeRatio: 0.75 + Math.random() * 0.3,
      expectedReturn: 0.12 + Math.random() * 0.08,
      volatility: 0.15 + Math.random() * 0.05,
      iterations: Math.floor(Math.random() * 20) + 10,
      convergence: Math.random() > 0.3
    };

    const greedyResult: PortfolioResult = {
      method: "Greedy Baseline",
      selectedAssets,
      weights: generateEqualWeights(selectedAssets),
      sharpeRatio: qaoaResult.sharpeRatio - 0.05 - Math.random() * 0.1,
      expectedReturn: 0.10 + Math.random() * 0.06,
      volatility: 0.16 + Math.random() * 0.04,
      iterations: 1,
      convergence: true
    };

    const tangencyResult: PortfolioResult = {
      method: "Mean-Variance (Tangency)",
      selectedAssets: config.tickers.slice(0, Math.min(6, config.tickers.length)),
      weights: generateWeights(config.tickers.slice(0, Math.min(6, config.tickers.length)), false),
      sharpeRatio: qaoaResult.sharpeRatio - 0.02 - Math.random() * 0.08,
      expectedReturn: 0.11 + Math.random() * 0.07,
      volatility: 0.14 + Math.random() * 0.06,
      iterations: 1,
      convergence: true
    };

    return [qaoaResult, greedyResult, tangencyResult];
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