import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Switch } from "@/components/ui/switch";
import { Slider } from "@/components/ui/slider";
import { Brain, TrendingUp, Zap, Target } from "lucide-react";

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

interface PortfolioDashboardProps {
  onOptimize: (config: PortfolioConfig) => void;
  isOptimizing: boolean;
}

export function PortfolioDashboard({ onOptimize, isOptimizing }: PortfolioDashboardProps) {
  const [config, setConfig] = useState<PortfolioConfig>({
    tickers: ["AAPL", "MSFT", "GOOGL", "TSLA", "NVDA", "META", "AMZN"],
    period: "1y",
    interval: "1d",
    riskFree: 0.02,
    K: 4,
    useDiscreteWeights: false,
    bitsPerAsset: 4,
    maxWeight: 0.5,
    shrinkLedoitWolf: true,
    transactionCost: 0.001,
    pList: [1, 2, 3],
    shots: 1024
  });

  const [tickerInput, setTickerInput] = useState("");

  const addTicker = () => {
    if (tickerInput && !config.tickers.includes(tickerInput.toUpperCase())) {
      setConfig(prev => ({
        ...prev,
        tickers: [...prev.tickers, tickerInput.toUpperCase()]
      }));
      setTickerInput("");
    }
  };

  const removeTicker = (ticker: string) => {
    setConfig(prev => ({
      ...prev,
      tickers: prev.tickers.filter(t => t !== ticker)
    }));
  };

  const updateConfig = (field: keyof PortfolioConfig, value: any) => {
    setConfig(prev => ({ ...prev, [field]: value }));
  };

  return (
    <div className="space-y-6">
      <div className="text-center space-y-4">
        <div className="flex items-center justify-center gap-2">
          <Brain className="h-8 w-8 text-quantum-glow quantum-glow" />
          <h1 className="text-4xl font-bold bg-gradient-to-r from-primary to-quantum-glow bg-clip-text text-transparent">
            QAOA Portfolio Optimizer
          </h1>
        </div>
        <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
          Quantum-enhanced portfolio optimization using QAOA (Quantum Approximate Optimization Algorithm) 
          with advanced risk models and market constraints.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Asset Selection */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Target className="h-5 w-5 text-primary" />
              Asset Universe
            </CardTitle>
            <CardDescription>
              Select stocks for quantum portfolio optimization
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex gap-2">
              <Input
                placeholder="Add ticker (e.g., AAPL)"
                value={tickerInput}
                onChange={(e) => setTickerInput(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && addTicker()}
                className="flex-1"
              />
              <Button onClick={addTicker} variant="outline">Add</Button>
            </div>
            
            <div className="flex flex-wrap gap-2">
              {config.tickers.map((ticker) => (
                <Badge
                  key={ticker}
                  variant="secondary"
                  className="cursor-pointer hover:bg-destructive/20"
                  onClick={() => removeTicker(ticker)}
                >
                  {ticker} ×
                </Badge>
              ))}
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="period">Data Period</Label>
                <select
                  id="period"
                  className="w-full mt-1 p-2 border border-border rounded-md bg-background"
                  value={config.period}
                  onChange={(e) => updateConfig('period', e.target.value)}
                >
                  <option value="6mo">6 Months</option>
                  <option value="1y">1 Year</option>
                  <option value="2y">2 Years</option>
                  <option value="5y">5 Years</option>
                </select>
              </div>
              
              <div>
                <Label htmlFor="interval">Data Interval</Label>
                <select
                  id="interval"
                  className="w-full mt-1 p-2 border border-border rounded-md bg-background"
                  value={config.interval}
                  onChange={(e) => updateConfig('interval', e.target.value)}
                >
                  <option value="1d">Daily</option>
                  <option value="1wk">Weekly</option>
                  <option value="1mo">Monthly</option>
                </select>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Quick Stats */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-success" />
              Portfolio Settings
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label>Risk-Free Rate: {(config.riskFree * 100).toFixed(1)}%</Label>
              <Slider
                value={[config.riskFree * 100]}
                onValueChange={([value]) => updateConfig('riskFree', value / 100)}
                min={0}
                max={5}
                step={0.1}
                className="mt-2"
              />
            </div>
            
            <div>
              <Label>Max Assets (K): {config.K}</Label>
              <Slider
                value={[config.K]}
                onValueChange={([value]) => updateConfig('K', value)}
                min={2}
                max={Math.min(config.tickers.length, 10)}
                step={1}
                className="mt-2"
              />
            </div>

            <div>
              <Label>Transaction Cost: {(config.transactionCost * 100).toFixed(2)}%</Label>
              <Slider
                value={[config.transactionCost * 100]}
                onValueChange={([value]) => updateConfig('transactionCost', value / 100)}
                min={0}
                max={1}
                step={0.01}
                className="mt-2"
              />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Advanced Configuration */}
      <Tabs defaultValue="quantum" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="quantum">Quantum Settings</TabsTrigger>
          <TabsTrigger value="risk">Risk Models</TabsTrigger>
          <TabsTrigger value="constraints">Constraints</TabsTrigger>
        </TabsList>
        
        <TabsContent value="quantum" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Zap className="h-5 w-5 text-quantum-glow" />
                QAOA Configuration
              </CardTitle>
              <CardDescription>
                Quantum algorithm parameters for portfolio optimization
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <div className="flex items-center space-x-2">
                    <Switch
                      checked={config.useDiscreteWeights}
                      onCheckedChange={(checked) => updateConfig('useDiscreteWeights', checked)}
                    />
                    <Label>Discrete Weight Encoding</Label>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Use binary encoding for fractional weights vs. simple asset selection
                  </p>
                </div>

                {config.useDiscreteWeights && (
                  <div>
                    <Label>Bits per Asset: {config.bitsPerAsset}</Label>
                    <Slider
                      value={[config.bitsPerAsset]}
                      onValueChange={([value]) => updateConfig('bitsPerAsset', value)}
                      min={2}
                      max={8}
                      step={1}
                      className="mt-2"
                    />
                  </div>
                )}
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>QAOA Depth (p): {config.pList.join(', ')}</Label>
                  <p className="text-sm text-muted-foreground mt-1">
                    Quantum circuit depth levels to test
                  </p>
                </div>
                
                <div>
                  <Label>Shots: {config.shots}</Label>
                  <Slider
                    value={[config.shots]}
                    onValueChange={([value]) => updateConfig('shots', value)}
                    min={512}
                    max={8192}
                    step={256}
                    className="mt-2"
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="risk" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Risk Model Enhancement</CardTitle>
              <CardDescription>
                Advanced statistical methods for robust portfolio construction
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center space-x-2">
                <Switch
                  checked={config.shrinkLedoitWolf}
                  onCheckedChange={(checked) => updateConfig('shrinkLedoitWolf', checked)}
                />
                <div>
                  <Label>Ledoit-Wolf Shrinkage</Label>
                  <p className="text-sm text-muted-foreground">
                    Robust covariance matrix estimation to reduce noise
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="constraints" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Portfolio Constraints</CardTitle>
              <CardDescription>
                Market and regulatory constraints for realistic portfolios
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {config.useDiscreteWeights && (
                <div>
                  <Label>Max Weight per Asset: {(config.maxWeight * 100).toFixed(0)}%</Label>
                  <Slider
                    value={[config.maxWeight * 100]}
                    onValueChange={([value]) => updateConfig('maxWeight', value / 100)}
                    min={10}
                    max={100}
                    step={5}
                    className="mt-2"
                  />
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Optimize Button */}
      <Card>
        <CardContent className="pt-6">
          <Button
            onClick={() => onOptimize(config)}
            disabled={isOptimizing || config.tickers.length < config.K}
            className="w-full h-12 text-lg quantum-glow"
            size="lg"
          >
            {isOptimizing ? (
              <>
                <Brain className="mr-2 h-5 w-5 animate-spin" />
                Running QAOA Optimization...
              </>
            ) : (
              <>
                <Zap className="mr-2 h-5 w-5" />
                Optimize Portfolio with QAOA
              </>
            )}
          </Button>
          {config.tickers.length < config.K && (
            <p className="text-sm text-destructive mt-2 text-center">
              Need at least {config.K} tickers for optimization
            </p>
          )}
        </CardContent>
      </Card>
    </div>
  );
}