'use client';

import { WasmLoader } from './performance';

interface FinancialWasmModule {
  compound_interest(principal: number, rate: number, compounds: number, years: number): number;
  present_value(futureValue: number, rate: number, periods: number): number;
  future_value(presentValue: number, rate: number, periods: number): number;
  annuity_payment(presentValue: number, rate: number, periods: number): number;
  loan_payment(principal: number, monthlyRate: number, months: number): number;
  investment_growth(initial: number, monthlyContribution: number, annualRate: number, years: number): number;
  portfolio_volatility(dataOffset: number, count: number, mean: number): number;
  sharpe_ratio(portfolioReturn: number, riskFreeRate: number, volatility: number): number;
  beta_calculation(covariance: number, marketVariance: number): number;
  mortgage_payment(principal: number, annualRate: number, years: number, pmiRate: number, propertyTaxRate: number, homeValue: number): number;
}

interface WasmMemory {
  buffer: ArrayBuffer;
}

class FinancialCalculator {
  private wasmModule: FinancialWasmModule | null = null;
  private memory: WasmMemory | null = null;
  private isLoaded = false;
  private isLoading = false;

  async initialize(): Promise<void> {
    if (this.isLoaded || this.isLoading) return;
    
    this.isLoading = true;
    
    try {
      // Check if WebAssembly is supported
      if (typeof WebAssembly === 'undefined') {
        throw new Error('WebAssembly not supported');
      }

      // Create memory for WASM module
      this.memory = new WebAssembly.Memory({ 
        initial: 256,  // 256 * 64KB = 16MB
        maximum: 512   // 512 * 64KB = 32MB
      });

      // Math functions to import
      const mathImports = {
        log: Math.log,
        pow: Math.pow,
        sqrt: Math.sqrt,
        sin: Math.sin,
        cos: Math.cos,
        tan: Math.tan,
        abs: Math.abs,
        floor: Math.floor,
        ceil: Math.ceil,
        round: (x: number) => Math.round(x)
      };

      const imports = {
        env: {
          memory: this.memory,
          ...mathImports
        }
      };

      // For development, we'll use a compiled WASM binary
      // In production, you would compile the .wat file to .wasm
      const wasmBytes = await this.getOrCreateWasmBytes();
      const wasmModule = await WebAssembly.compile(wasmBytes);
      const instance = await WebAssembly.instantiate(wasmModule, imports);

      this.wasmModule = instance.exports as any;
      this.isLoaded = true;
      
      console.log('Financial WASM module loaded successfully');
    } catch (error) {
      console.warn('Failed to load WASM module, falling back to JavaScript:', error);
      // Fallback to JavaScript implementations
      this.initializeFallback();
    } finally {
      this.isLoading = false;
    }
  }

  private async getOrCreateWasmBytes(): Promise<Uint8Array> {
    // For development, create a minimal WASM binary
    // In production, you would fetch the compiled .wasm file
    try {
      const response = await fetch('/wasm/financial-calculations.wasm');
      if (response.ok) {
        return new Uint8Array(await response.arrayBuffer());
      }
    } catch (error) {
      console.log('WASM file not found, creating minimal binary');
    }

    // Create a minimal WASM binary for fallback
    return this.createMinimalWasmBinary();
  }

  private createMinimalWasmBinary(): Uint8Array {
    // This is a minimal WASM binary that exports functions but uses JS fallbacks
    const wasmBinary = new Uint8Array([
      0x00, 0x61, 0x73, 0x6d, // WASM magic number
      0x01, 0x00, 0x00, 0x00, // WASM version
      // Minimal sections would go here
      // For now, we'll use JavaScript fallbacks
    ]);
    
    throw new Error('Minimal WASM binary not implemented - using JS fallback');
  }

  private initializeFallback(): void {
    // JavaScript fallback implementations
    this.wasmModule = {
      compound_interest: (principal: number, rate: number, compounds: number, years: number): number => {
        return principal * Math.pow(1 + rate / compounds, compounds * years);
      },

      present_value: (futureValue: number, rate: number, periods: number): number => {
        return futureValue / Math.pow(1 + rate, periods);
      },

      future_value: (presentValue: number, rate: number, periods: number): number => {
        return presentValue * Math.pow(1 + rate, periods);
      },

      annuity_payment: (presentValue: number, rate: number, periods: number): number => {
        if (rate === 0) return presentValue / periods;
        const factor = Math.pow(1 + rate, periods);
        return presentValue * (rate * factor) / (factor - 1);
      },

      loan_payment: (principal: number, monthlyRate: number, months: number): number => {
        return this.wasmModule!.annuity_payment(principal, monthlyRate, months);
      },

      investment_growth: (initial: number, monthlyContribution: number, annualRate: number, years: number): number => {
        const monthlyRate = annualRate / 12;
        const months = years * 12;
        
        // Future value of initial investment
        const futureInitial = initial * Math.pow(1 + monthlyRate, months);
        
        // Future value of annuity
        const annuityFactor = monthlyRate === 0 ? months : (Math.pow(1 + monthlyRate, months) - 1) / monthlyRate;
        const futureAnnuity = monthlyContribution * annuityFactor;
        
        return futureInitial + futureAnnuity;
      },

      portfolio_volatility: (dataOffset: number, count: number, mean: number): number => {
        // This would normally read from WASM memory
        // For fallback, we'll return a placeholder
        return 0.15; // 15% volatility placeholder
      },

      sharpe_ratio: (portfolioReturn: number, riskFreeRate: number, volatility: number): number => {
        return (portfolioReturn - riskFreeRate) / volatility;
      },

      beta_calculation: (covariance: number, marketVariance: number): number => {
        return covariance / marketVariance;
      },

      mortgage_payment: (principal: number, annualRate: number, years: number, pmiRate: number, propertyTaxRate: number, homeValue: number): number => {
        const monthlyRate = annualRate / 12;
        const months = years * 12;
        
        // Base mortgage payment
        const basePayment = this.wasmModule!.loan_payment(principal, monthlyRate, months);
        
        // PMI (monthly)
        const pmiPayment = (principal * pmiRate) / 12;
        
        // Property tax (monthly)
        const taxPayment = (homeValue * propertyTaxRate) / 12;
        
        return basePayment + pmiPayment + taxPayment;
      }
    };

    this.isLoaded = true;
  }

  // High-level calculation methods
  async calculateCompoundInterest(principal: number, annualRate: number, compoundsPerYear: number = 12, years: number): Promise<number> {
    await this.initialize();
    return this.wasmModule!.compound_interest(principal, annualRate, compoundsPerYear, years);
  }

  async calculateLoanPayment(principal: number, annualRate: number, years: number): Promise<number> {
    await this.initialize();
    const monthlyRate = annualRate / 12;
    const months = years * 12;
    return this.wasmModule!.loan_payment(principal, monthlyRate, months);
  }

  async calculateInvestmentGrowth(
    initialInvestment: number,
    monthlyContribution: number,
    annualReturnRate: number,
    years: number
  ): Promise<number> {
    await this.initialize();
    return this.wasmModule!.investment_growth(initialInvestment, monthlyContribution, annualReturnRate, years);
  }

  async calculateMortgagePayment(
    principal: number,
    annualRate: number,
    years: number,
    options: {
      pmiRate?: number;
      propertyTaxRate?: number;
      homeValue?: number;
    } = {}
  ): Promise<number> {
    await this.initialize();
    
    const {
      pmiRate = 0.005,  // 0.5% default PMI
      propertyTaxRate = 0.012,  // 1.2% default property tax
      homeValue = principal * 1.2  // Assume 20% down payment
    } = options;

    return this.wasmModule!.mortgage_payment(
      principal,
      annualRate,
      years,
      pmiRate,
      propertyTaxRate,
      homeValue
    );
  }

  async calculatePortfolioMetrics(
    returns: number[],
    marketReturns: number[],
    riskFreeRate: number = 0.02
  ): Promise<{
    volatility: number;
    sharpeRatio: number;
    beta: number;
    averageReturn: number;
  }> {
    await this.initialize();

    const averageReturn = returns.reduce((sum, ret) => sum + ret, 0) / returns.length;
    const marketAverage = marketReturns.reduce((sum, ret) => sum + ret, 0) / marketReturns.length;

    // Calculate volatility (standard deviation)
    const variance = returns.reduce((sum, ret) => sum + Math.pow(ret - averageReturn, 2), 0) / (returns.length - 1);
    const volatility = Math.sqrt(variance);

    // Calculate Sharpe ratio
    const sharpeRatio = this.wasmModule!.sharpe_ratio(averageReturn, riskFreeRate, volatility);

    // Calculate beta (covariance / market variance)
    const covariance = returns.reduce((sum, ret, i) => 
      sum + (ret - averageReturn) * (marketReturns[i] - marketAverage), 0
    ) / (returns.length - 1);
    
    const marketVariance = marketReturns.reduce((sum, ret) => 
      sum + Math.pow(ret - marketAverage, 2), 0
    ) / (marketReturns.length - 1);
    
    const beta = this.wasmModule!.beta_calculation(covariance, marketVariance);

    return {
      volatility,
      sharpeRatio,
      beta,
      averageReturn
    };
  }

  // Performance comparison
  async benchmarkCalculations(iterations: number = 10000): Promise<{
    wasmTime: number;
    jsTime: number;
    speedup: number;
  }> {
    await this.initialize();

    const testData = {
      principal: 100000,
      rate: 0.07,
      years: 30
    };

    // WASM benchmark
    const wasmStart = performance.now();
    for (let i = 0; i < iterations; i++) {
      this.wasmModule!.compound_interest(testData.principal, testData.rate, 12, testData.years);
    }
    const wasmTime = performance.now() - wasmStart;

    // JavaScript benchmark
    const jsStart = performance.now();
    for (let i = 0; i < iterations; i++) {
      testData.principal * Math.pow(1 + testData.rate / 12, 12 * testData.years);
    }
    const jsTime = performance.now() - jsStart;

    return {
      wasmTime,
      jsTime,
      speedup: jsTime / wasmTime
    };
  }

  isReady(): boolean {
    return this.isLoaded;
  }
}

// Singleton instance
export const financialCalculator = new FinancialCalculator();

// Convenience functions
export async function calculateCompoundInterest(
  principal: number,
  annualRate: number,
  years: number,
  compoundsPerYear: number = 12
): Promise<number> {
  return financialCalculator.calculateCompoundInterest(principal, annualRate, compoundsPerYear, years);
}

export async function calculateLoanPayment(
  principal: number,
  annualRate: number,
  years: number
): Promise<number> {
  return financialCalculator.calculateLoanPayment(principal, annualRate, years);
}

export async function calculateInvestmentGrowth(
  initialInvestment: number,
  monthlyContribution: number,
  annualReturnRate: number,
  years: number
): Promise<number> {
  return financialCalculator.calculateInvestmentGrowth(
    initialInvestment,
    monthlyContribution,
    annualReturnRate,
    years
  );
}

export async function calculateMortgagePayment(
  principal: number,
  annualRate: number,
  years: number,
  options?: {
    pmiRate?: number;
    propertyTaxRate?: number;
    homeValue?: number;
  }
): Promise<number> {
  return financialCalculator.calculateMortgagePayment(principal, annualRate, years, options);
}

export default financialCalculator;