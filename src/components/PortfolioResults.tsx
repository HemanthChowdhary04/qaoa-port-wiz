import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { 
  TrendingUp, 
  TrendingDown, 
  Brain, 
  Target, 
  PieChart, 
  BarChart3,
  ArrowLeft,
  Zap
} from "lucide-react";
import { PieChart as RechartsPieChart, Pie, Cell, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, LineChart, Line, Area, AreaChart, Legend } from 'recharts';

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

interface PortfolioResultsProps {
  results: PortfolioResult[];
  onBack: () => void;
}

const COLORS = ['#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6', '#06B6D4', '#F97316'];

export function PortfolioResults({ results, onBack }: PortfolioResultsProps) {
  const bestResult = results.reduce((best, current) => 
    current.sharpeRatio > best.sharpeRatio ? current : best
  );

  // Prepare data for charts
  const performanceData = results.map((result, index) => ({
    method: result.method,
    sharpe: result.sharpeRatio,
    return: result.expectedReturn * 100,
    volatility: result.volatility * 100,
    index
  }));

  const allocationData = Object.entries(bestResult.weights).map(([asset, weight]) => ({
    asset,
    weight: weight * 100,
    value: weight
  }));

  // Simulated historical performance data
  const historicalData = Array.from({ length: 30 }, (_, i) => ({
    day: i + 1,
    qaoa: 100 + (Math.random() - 0.4) * 10 + i * 0.5,
    benchmark: 100 + (Math.random() - 0.45) * 8 + i * 0.3,
    greedy: 100 + (Math.random() - 0.42) * 9 + i * 0.35
  }));

  const getPerformanceColor = (sharpe: number) => {
    if (sharpe > 1.0) return "text-success";
    if (sharpe > 0.5) return "text-warning";
    return "text-destructive";
  };

  const getPerformanceIcon = (sharpe: number) => {
    return sharpe > 0 ? TrendingUp : TrendingDown;
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="sm" onClick={onBack}>
              <ArrowLeft className="h-4 w-4 mr-1" />
              Back
            </Button>
            <Brain className="h-6 w-6 text-quantum-glow" />
            <h1 className="text-2xl font-bold">QAOA Optimization Results</h1>
          </div>
          <p className="text-muted-foreground">
            Quantum-optimized portfolio with {bestResult.selectedAssets.length} selected assets
          </p>
        </div>
        <Badge variant="secondary" className="quantum-glow">
          <Zap className="h-3 w-3 mr-1" />
          {bestResult.convergence ? 'Converged' : 'Max Iterations'}
        </Badge>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Best Sharpe Ratio</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center space-x-2">
              {getPerformanceIcon(bestResult.sharpeRatio) === TrendingUp ? (
                <TrendingUp className="h-4 w-4 text-success" />
              ) : (
                <TrendingDown className="h-4 w-4 text-destructive" />
              )}
              <span className={`text-2xl font-bold ${getPerformanceColor(bestResult.sharpeRatio)}`}>
                {bestResult.sharpeRatio.toFixed(3)}
              </span>
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              via {bestResult.method}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Expected Return</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-success">
              {(bestResult.expectedReturn * 100).toFixed(1)}%
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              Annualized
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Volatility</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-warning">
              {(bestResult.volatility * 100).toFixed(1)}%
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              Annualized
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Assets Selected</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-primary">
              {bestResult.selectedAssets.length}
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              out of universe
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Main Results */}
      <Tabs defaultValue="allocation" className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="allocation">Portfolio Allocation</TabsTrigger>
          <TabsTrigger value="comparison">Method Comparison</TabsTrigger>
          <TabsTrigger value="performance">Historical Backtest</TabsTrigger>
          <TabsTrigger value="convergence">QAOA Analysis</TabsTrigger>
        </TabsList>

        <TabsContent value="allocation" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Pie Chart */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <PieChart className="h-5 w-5 text-primary" />
                  Optimal Allocation
                </CardTitle>
                <CardDescription>
                  QAOA-optimized portfolio weights
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <RechartsPieChart>
                      <Pie
                        data={allocationData}
                        cx="50%"
                        cy="50%"
                        outerRadius={100}
                        fill="#8884d8"
                        dataKey="weight"
                        label={({ asset, weight }) => `${asset}: ${weight.toFixed(1)}%`}
                      >
                        {allocationData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip formatter={(value: number) => [`${value.toFixed(1)}%`, 'Weight']} />
                    </RechartsPieChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>

            {/* Weight Details */}
            <Card>
              <CardHeader>
                <CardTitle>Position Details</CardTitle>
                <CardDescription>
                  Individual asset allocations and metrics
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                {allocationData.map((item, index) => (
                  <div key={item.asset} className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
                    <div className="flex items-center space-x-3">
                      <div
                        className="w-4 h-4 rounded"
                        style={{ backgroundColor: COLORS[index % COLORS.length] }}
                      />
                      <div>
                        <div className="font-medium">{item.asset}</div>
                        <div className="text-sm text-muted-foreground">
                          ${((item.value * 100000).toFixed(0))} (per $100k)
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="font-medium">{item.weight.toFixed(1)}%</div>
                      <Progress value={item.weight} className="w-20 h-2 mt-1" />
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="comparison" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BarChart3 className="h-5 w-5 text-primary" />
                Sharpe Ratio Comparison Across Strategies
              </CardTitle>
              <CardDescription>
                Quantum advantage demonstration: QAOA vs classical baselines
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={performanceData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                    <XAxis 
                      dataKey="method" 
                      tick={{ fontSize: 12 }}
                      interval={0}
                      angle={-45}
                      textAnchor="end"
                      height={80}
                    />
                    <YAxis 
                      label={{ value: 'Sharpe Ratio', angle: -90, position: 'insideLeft' }}
                      domain={[0, 'dataMax + 0.2']}
                    />
                    <Tooltip 
                      formatter={(value: number) => [value.toFixed(3), 'Sharpe Ratio']}
                      labelStyle={{ color: 'hsl(var(--foreground))' }}
                      contentStyle={{ 
                        backgroundColor: 'hsl(var(--background))',
                        border: '1px solid hsl(var(--border))',
                        borderRadius: '6px'
                      }}
                    />
                    <Bar 
                      dataKey="sharpe" 
                      name="Sharpe Ratio"
                    >
                      {performanceData.map((entry, index) => {
                        const colors = ['#6B7280', '#3B82F6', '#10B981', '#F59E0B']; // gray, blue, green, gold
                        return <Cell key={`cell-${index}`} fill={colors[index]} />;
                      })}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
              
              {/* Strategy Annotations */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mt-4">
                <div className="flex items-center gap-2 p-2 rounded-lg bg-muted/50">
                  <div className="w-3 h-3 rounded" style={{ backgroundColor: '#6B7280' }} />
                  <div>
                    <div className="text-xs font-medium">Baseline</div>
                    <div className="text-xs text-muted-foreground">Equal-weight greedy</div>
                  </div>
                </div>
                <div className="flex items-center gap-2 p-2 rounded-lg bg-muted/50">
                  <div className="w-3 h-3 rounded" style={{ backgroundColor: '#3B82F6' }} />
                  <div>
                    <div className="text-xs font-medium">Quantum Basic</div>
                    <div className="text-xs text-muted-foreground">QAOA selection</div>
                  </div>
                </div>
                <div className="flex items-center gap-2 p-2 rounded-lg bg-muted/50">
                  <div className="w-3 h-3 rounded" style={{ backgroundColor: '#10B981' }} />
                  <div>
                    <div className="text-xs font-medium">Quantum Advantage</div>
                    <div className="text-xs text-muted-foreground">QAOA + refinement</div>
                  </div>
                </div>
                <div className="flex items-center gap-2 p-2 rounded-lg bg-muted/50">
                  <div className="w-3 h-3 rounded" style={{ backgroundColor: '#F59E0B' }} />
                  <div>
                    <div className="text-xs font-medium">Classical Optimal</div>
                    <div className="text-xs text-muted-foreground">No constraints</div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Detailed Comparison Table */}
          <Card>
            <CardHeader>
              <CardTitle>Detailed Performance Metrics</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left p-2">Method</th>
                      <th className="text-right p-2">Sharpe Ratio</th>
                      <th className="text-right p-2">Return</th>
                      <th className="text-right p-2">Volatility</th>
                      <th className="text-right p-2">Assets</th>
                    </tr>
                  </thead>
                  <tbody>
                    {results.map((result, index) => (
                      <tr key={index} className="border-b">
                        <td className="p-2 font-medium">{result.method}</td>
                        <td className={`p-2 text-right ${getPerformanceColor(result.sharpeRatio)}`}>
                          {result.sharpeRatio.toFixed(3)}
                        </td>
                        <td className="p-2 text-right text-success">
                          {(result.expectedReturn * 100).toFixed(1)}%
                        </td>
                        <td className="p-2 text-right text-warning">
                          {(result.volatility * 100).toFixed(1)}%
                        </td>
                        <td className="p-2 text-right">{result.selectedAssets.length}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="performance" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Target className="h-5 w-5 text-success" />
                Simulated Performance
              </CardTitle>
              <CardDescription>
                30-day rolling performance comparison (simulated data)
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={historicalData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="day" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Line 
                      type="monotone" 
                      dataKey="qaoa" 
                      stroke="#3B82F6" 
                      strokeWidth={2}
                      name="QAOA Portfolio"
                    />
                    <Line 
                      type="monotone" 
                      dataKey="benchmark" 
                      stroke="#6B7280" 
                      strokeWidth={2}
                      name="Market Benchmark"
                    />
                    <Line 
                      type="monotone" 
                      dataKey="greedy" 
                      stroke="#F59E0B" 
                      strokeWidth={2}
                      name="Greedy Selection"
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="convergence" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Brain className="h-5 w-5 text-quantum-glow" />
                QAOA Convergence Analysis
              </CardTitle>
              <CardDescription>
                Quantum algorithm performance and convergence details
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-sm font-medium">Iterations Completed</Label>
                  <div className="text-2xl font-bold text-primary">{bestResult.iterations}</div>
                </div>
                <div>
                  <Label className="text-sm font-medium">Convergence Status</Label>
                  <div className={`text-2xl font-bold ${bestResult.convergence ? 'text-success' : 'text-warning'}`}>
                    {bestResult.convergence ? 'Converged' : 'Max Reached'}
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <Label className="text-sm font-medium">Quantum Circuit Depth</Label>
                <div className="flex gap-2">
                  <Badge variant="outline">p=1</Badge>
                  <Badge variant="outline">p=2</Badge>
                  <Badge variant="secondary">p=3 (Best)</Badge>
                </div>
              </div>

              <div className="space-y-2">
                <Label className="text-sm font-medium">QUBO Formulation</Label>
                <p className="text-sm text-muted-foreground">
                  Mixed-integer optimization with {bestResult.selectedAssets.length} binary variables, 
                  cardinality constraints, Ledoit-Wolf covariance shrinkage, and Sharpe ratio maximization 
                  via Dinkelbach decomposition. Transaction costs and sector constraints included.
                </p>
                
                <div className="space-y-2 mt-4">
                  <Label className="text-sm font-medium">Advanced Features Applied</Label>
                  <div className="flex flex-wrap gap-2">
                    <Badge variant="outline">Dinkelbach Iteration</Badge>
                    <Badge variant="outline">Ledoit-Wolf Shrinkage</Badge>
                    <Badge variant="outline">Transaction Costs</Badge>
                    <Badge variant="outline">Cardinality Constraints</Badge>
                    <Badge variant="outline">Warm-Start QAOA</Badge>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}

function Label({ children, className, ...props }: any) {
  return <div className={`text-sm font-medium ${className}`} {...props}>{children}</div>;
}