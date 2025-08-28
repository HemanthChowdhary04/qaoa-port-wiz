import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Brain, Zap, TrendingUp, Target, BarChart3, Shield, Cpu, LineChart } from "lucide-react";
import { Link } from "react-router-dom";
import qaoadHero from "@/assets/qaoa-hero.jpg";

export default function Landing() {
  const features = [
    {
      icon: Brain,
      title: "Quantum QAOA Algorithm",
      description: "Leverage quantum computing for portfolio optimization using the Quantum Approximate Optimization Algorithm"
    },
    {
      icon: Shield,
      title: "Advanced Risk Models",
      description: "Ledoit-Wolf shrinkage and Black-Litterman models for robust covariance estimation"
    },
    {
      icon: Target,
      title: "Constraint Optimization",
      description: "Sector caps, cardinality constraints, and transaction cost modeling"
    },
    {
      icon: BarChart3,
      title: "Performance Analytics",
      description: "Comprehensive Sharpe ratio analysis and method comparison"
    },
    {
      icon: Cpu,
      title: "Binary Weight Encoding",
      description: "Discrete and continuous weight optimization with quantum bit encoding"
    },
    {
      icon: LineChart,
      title: "Real-time Data",
      description: "Yahoo Finance integration for live market data and backtesting"
    }
  ];

  const algorithms = [
    {
      name: "QAOA Quantum",
      description: "Quantum Approximate Optimization Algorithm",
      performance: "Best",
      color: "primary"
    },
    {
      name: "Mean-Variance",
      description: "Classical Markowitz optimization",
      performance: "Good",
      color: "secondary"
    },
    {
      name: "Greedy Selection",
      description: "Risk-adjusted greedy baseline",
      performance: "Fast",
      color: "muted"
    }
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div 
          className="absolute inset-0 bg-cover bg-center bg-no-repeat opacity-20"
          style={{ backgroundImage: `url(${qaoadHero})` }}
        />
        <div className="absolute inset-0 bg-gradient-to-br from-background via-background/90 to-background/50" />
        
        <div className="relative container mx-auto px-4 py-20 text-center">
          <div className="max-w-4xl mx-auto space-y-8">
            <div className="flex items-center justify-center gap-2 mb-6">
              <Brain className="h-12 w-12 text-quantum-glow quantum-glow" />
              <h1 className="text-6xl font-bold bg-gradient-to-r from-primary via-quantum-glow to-success bg-clip-text text-transparent">
                QAOA Portfolio
              </h1>
            </div>
            
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
              Revolutionary quantum-enhanced portfolio optimization combining <strong>QAOA algorithms</strong>, 
              advanced risk models, and real-time market data for superior investment performance.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Link to="/optimize">
                <Button size="lg" className="quantum-glow text-lg px-8 py-3">
                  <Zap className="mr-2 h-5 w-5" />
                  Start Optimizing
                </Button>
              </Link>
              <Button variant="outline" size="lg" className="text-lg px-8 py-3">
                <BarChart3 className="mr-2 h-5 w-5" />
                View Demo
              </Button>
            </div>

            <div className="flex flex-wrap justify-center gap-3 mt-8">
              <Badge variant="secondary" className="text-sm">
                Quantum Computing
              </Badge>
              <Badge variant="secondary" className="text-sm">
                Portfolio Theory
              </Badge>
              <Badge variant="secondary" className="text-sm">
                Risk Management
              </Badge>
              <Badge variant="secondary" className="text-sm">
                Real-time Data
              </Badge>
            </div>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="py-20 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold mb-4">Advanced Features</h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Cutting-edge quantum algorithms meet sophisticated financial engineering
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((feature, index) => (
              <Card key={index} className="h-full hover:shadow-lg transition-shadow">
                <CardHeader>
                  <feature.icon className="h-8 w-8 text-primary mb-2" />
                  <CardTitle className="text-lg">{feature.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-sm leading-relaxed">
                    {feature.description}
                  </CardDescription>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Algorithm Comparison */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold mb-4">Optimization Methods</h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Compare quantum and classical portfolio optimization algorithms
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
            {algorithms.map((algo, index) => (
              <Card key={index} className={`text-center ${index === 0 ? 'ring-2 ring-primary quantum-glow' : ''}`}>
                <CardHeader>
                  <CardTitle className="flex items-center justify-center gap-2">
                    {index === 0 && <Brain className="h-5 w-5 text-quantum-glow" />}
                    {algo.name}
                  </CardTitle>
                  <CardDescription>{algo.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <Badge 
                    variant={algo.color === 'primary' ? 'default' : 'secondary'}
                    className="text-sm"
                  >
                    {algo.performance}
                  </Badge>
                  {index === 0 && (
                    <div className="mt-4">
                      <Badge variant="outline" className="text-xs">
                        <Zap className="h-3 w-3 mr-1" />
                        Quantum Enhanced
                      </Badge>
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Technical Details */}
      <section className="py-20 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-3xl font-bold mb-4">Technical Implementation</h2>
              <p className="text-lg text-muted-foreground">
                Deep dive into the quantum optimization pipeline
              </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Cpu className="h-5 w-5 text-quantum-glow" />
                    QUBO Formulation
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="text-sm text-muted-foreground space-y-2">
                    <p>• <strong>Dinkelbach Method:</strong> Converts Sharpe ratio to quadratic subproblems</p>
                    <p>• <strong>Binary Encoding:</strong> Fixed-point representation for fractional weights</p>
                    <p>• <strong>Constraint Handling:</strong> Penalty methods for cardinality and sector caps</p>
                    <p>• <strong>Transaction Costs:</strong> Hamming distance penalties for turnover</p>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Shield className="h-5 w-5 text-primary" />
                    Risk Management
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="text-sm text-muted-foreground space-y-2">
                    <p>• <strong>Ledoit-Wolf:</strong> Shrinkage covariance estimation</p>
                    <p>• <strong>Black-Litterman:</strong> Bayesian return forecasting</p>
                    <p>• <strong>Robust Optimization:</strong> Parameter uncertainty handling</p>
                    <p>• <strong>Stress Testing:</strong> Monte Carlo scenario analysis</p>
                  </div>
                </CardContent>
              </Card>
            </div>

            <div className="mt-12 text-center">
              <Link to="/optimize">
                <Button size="lg" className="quantum-glow">
                  <Brain className="mr-2 h-5 w-5" />
                  Experience Quantum Optimization
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}