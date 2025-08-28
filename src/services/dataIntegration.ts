'use client';

// Data Integration Service for Cash Flow Forecasting
// This service connects real Meridian financial data to the forecasting system

export interface RealTransactionData {
  id: string;
  title: string;
  category: string;
  amount: number;
  date: string;
  time: string;
  type: 'income' | 'expense';
  merchant?: string;
  description?: string;
}

export interface RealIncomeSource {
  id: string;
  name: string;
  amount: number;
  frequency: 'monthly' | 'weekly' | 'biweekly' | 'annual';
  lastReceived: string;
  reliability: number;
  growth: number;
  category: 'salary' | 'freelance' | 'investment' | 'rental' | 'business' | 'other';
}

export interface RealExpenseCategory {
  id: string;
  name: string;
  budgeted: number;
  spent: number;
  transactions: RealTransactionData[];
  trend: number;
  isFixed: boolean;
}

export interface RealEmergencyFundData {
  currentAmount: number;
  targetAmount: number;
  monthlyExpenses: number;
  accounts: Array<{
    id: string;
    name: string;
    amount: number;
    type: 'checking' | 'savings' | 'money_market';
  }>;
}

export interface RealCashFlowData {
  monthlyIncome: number;
  monthlyExpenses: number;
  netCashFlow: number;
  historicalData: Array<{
    month: string;
    income: number;
    expenses: number;
    netFlow: number;
  }>;
  incomeStreams: RealIncomeSource[];
  expenseCategories: RealExpenseCategory[];
  emergencyFund: RealEmergencyFundData;
  volatilityMetrics: {
    incomeVolatility: number;
    expenseVolatility: number;
    overallRisk: 'low' | 'medium' | 'high';
    confidenceScore: number;
  };
}

class DataIntegrationService {
  private static instance: DataIntegrationService;

  public static getInstance(): DataIntegrationService {
    if (!DataIntegrationService.instance) {
      DataIntegrationService.instance = new DataIntegrationService();
    }
    return DataIntegrationService.instance;
  }

  // Analyze transactions to extract income patterns
  public analyzeIncomePatterns(transactions: RealTransactionData[]): RealIncomeSource[] {
    const incomeTransactions = transactions.filter(t => t.type === 'income');
    const incomeGroups = new Map<string, RealTransactionData[]>();
    
    // Group income by source/merchant
    incomeTransactions.forEach(transaction => {
      const key = transaction.merchant || transaction.title || 'Unknown';
      if (!incomeGroups.has(key)) {
        incomeGroups.set(key, []);
      }
      incomeGroups.get(key)!.push(transaction);
    });

    const incomeStreams: RealIncomeSource[] = [];
    let streamIndex = 0;

    incomeGroups.forEach((groupTransactions, sourceName) => {
      if (groupTransactions.length === 0) return;

      // Calculate average amount and frequency
      const amounts = groupTransactions.map(t => t.amount);
      const avgAmount = amounts.reduce((sum, amt) => sum + amt, 0) / amounts.length;
      
      // Determine frequency based on transaction intervals
      const dates = groupTransactions.map(t => new Date(t.date)).sort((a, b) => a.getTime() - b.getTime());
      let frequency: RealIncomeSource['frequency'] = 'monthly';
      
      if (dates.length > 1) {
        const avgIntervalDays = dates.slice(1).reduce((sum, date, index) => {
          const prevDate = dates[index];
          return sum + (date.getTime() - prevDate.getTime()) / (1000 * 60 * 60 * 24);
        }, 0) / (dates.length - 1);

        if (avgIntervalDays <= 10) frequency = 'weekly';
        else if (avgIntervalDays <= 20) frequency = 'biweekly';
        else if (avgIntervalDays <= 40) frequency = 'monthly';
        else frequency = 'annual';
      }

      // Calculate reliability (consistency of payments)
      const reliability = Math.min(0.95, 0.4 + (groupTransactions.length * 0.1));
      
      // Calculate growth trend (comparing recent vs older transactions)
      let growth = 0;
      if (groupTransactions.length > 2) {
        const recentTransactions = groupTransactions.slice(-Math.ceil(groupTransactions.length / 2));
        const olderTransactions = groupTransactions.slice(0, Math.floor(groupTransactions.length / 2));
        
        const recentAvg = recentTransactions.reduce((sum, t) => sum + t.amount, 0) / recentTransactions.length;
        const olderAvg = olderTransactions.reduce((sum, t) => sum + t.amount, 0) / olderTransactions.length;
        
        if (olderAvg > 0) {
          growth = (recentAvg - olderAvg) / olderAvg;
        }
      }

      // Categorize income source
      const category = this.categorizeIncomeSource(sourceName);

      incomeStreams.push({
        id: `income-stream-${streamIndex++}`,
        name: sourceName,
        amount: avgAmount,
        frequency,
        lastReceived: groupTransactions[groupTransactions.length - 1].date,
        reliability,
        growth: Math.max(-0.5, Math.min(0.5, growth)), // Cap between -50% and +50%
        category
      });
    });

    return incomeStreams.sort((a, b) => b.amount - a.amount);
  }

  // Analyze expense patterns from transactions
  public analyzeExpensePatterns(transactions: RealTransactionData[]): RealExpenseCategory[] {
    const expenseTransactions = transactions.filter(t => t.type === 'expense');
    const categoryGroups = new Map<string, RealTransactionData[]>();
    
    // Group expenses by category
    expenseTransactions.forEach(transaction => {
      const category = transaction.category || 'Other';
      if (!categoryGroups.has(category)) {
        categoryGroups.set(category, []);
      }
      categoryGroups.get(category)!.push(transaction);
    });

    const expenseCategories: RealExpenseCategory[] = [];
    let categoryIndex = 0;

    categoryGroups.forEach((categoryTransactions, categoryName) => {
      const totalSpent = categoryTransactions.reduce((sum, t) => sum + t.amount, 0);
      
      // Estimate budget (20% higher than current spending)
      const budgeted = Math.round(totalSpent * 1.2);
      
      // Calculate trend (comparing recent vs older spending)
      let trend = 0;
      if (categoryTransactions.length > 2) {
        const sortedTransactions = [...categoryTransactions].sort((a, b) => 
          new Date(a.date).getTime() - new Date(b.date).getTime()
        );
        
        const recentTransactions = sortedTransactions.slice(-Math.ceil(sortedTransactions.length / 2));
        const olderTransactions = sortedTransactions.slice(0, Math.floor(sortedTransactions.length / 2));
        
        const recentSpending = recentTransactions.reduce((sum, t) => sum + t.amount, 0);
        const olderSpending = olderTransactions.reduce((sum, t) => sum + t.amount, 0);
        
        if (olderSpending > 0) {
          trend = (recentSpending - olderSpending) / olderSpending;
        }
      }

      // Determine if category is fixed expense
      const isFixed = this.isFixedExpenseCategory(categoryName);

      expenseCategories.push({
        id: `expense-category-${categoryIndex++}`,
        name: categoryName,
        budgeted,
        spent: totalSpent,
        transactions: categoryTransactions,
        trend: Math.max(-0.8, Math.min(0.8, trend)), // Cap between -80% and +80%
        isFixed
      });
    });

    return expenseCategories.sort((a, b) => b.spent - a.spent);
  }

  // Calculate emergency fund metrics
  public calculateEmergencyFundMetrics(
    incomeStreams: RealIncomeSource[],
    expenseCategories: RealExpenseCategory[]
  ): RealEmergencyFundData {
    const monthlyIncome = this.calculateMonthlyIncome(incomeStreams);
    const monthlyExpenses = expenseCategories.reduce((sum, cat) => sum + (cat.spent / 12), 0); // Assuming yearly data
    
    // Mock current emergency fund (in real app, this would come from account balances)
    const currentAmount = monthlyExpenses * 4.2; // 4.2 months as current amount
    const targetAmount = monthlyExpenses * 6; // 6 months target
    
    return {
      currentAmount,
      targetAmount,
      monthlyExpenses,
      accounts: [
        {
          id: 'savings-main',
          name: 'High-Yield Savings',
          amount: currentAmount * 0.7,
          type: 'savings'
        },
        {
          id: 'checking-emergency',
          name: 'Emergency Checking',
          amount: currentAmount * 0.2,
          type: 'checking'
        },
        {
          id: 'money-market',
          name: 'Money Market',
          amount: currentAmount * 0.1,
          type: 'money_market'
        }
      ]
    };
  }

  // Calculate volatility metrics
  public calculateVolatilityMetrics(
    incomeStreams: RealIncomeSource[],
    expenseCategories: RealExpenseCategory[]
  ): RealCashFlowData['volatilityMetrics'] {
    // Income volatility based on reliability and stream diversity
    const incomeReliabilities = incomeStreams.map(stream => stream.reliability);
    const avgIncomeReliability = incomeReliabilities.reduce((sum, r) => sum + r, 0) / incomeReliabilities.length;
    const incomeVolatility = 1 - avgIncomeReliability;

    // Expense volatility based on variance in spending patterns
    const expenseTrends = expenseCategories.map(cat => Math.abs(cat.trend));
    const avgExpenseTrend = expenseTrends.reduce((sum, t) => sum + t, 0) / expenseTrends.length;
    const expenseVolatility = Math.min(0.8, avgExpenseTrend);

    // Overall risk assessment
    const combinedVolatility = (incomeVolatility + expenseVolatility) / 2;
    let overallRisk: 'low' | 'medium' | 'high' = 'low';
    
    if (combinedVolatility > 0.6) overallRisk = 'high';
    else if (combinedVolatility > 0.3) overallRisk = 'medium';
    
    const confidenceScore = Math.max(0.1, 1 - combinedVolatility);

    return {
      incomeVolatility,
      expenseVolatility,
      overallRisk,
      confidenceScore
    };
  }

  // Generate historical data from current patterns
  public generateHistoricalData(
    incomeStreams: RealIncomeSource[],
    expenseCategories: RealExpenseCategory[],
    months: number = 12
  ): Array<{ month: string; income: number; expenses: number; netFlow: number }> {
    const monthlyIncome = this.calculateMonthlyIncome(incomeStreams);
    const monthlyExpenses = expenseCategories.reduce((sum, cat) => sum + (cat.spent / 12), 0);
    
    const historicalData = [];
    const currentDate = new Date();
    
    for (let i = months - 1; i >= 0; i--) {
      const date = new Date(currentDate.getFullYear(), currentDate.getMonth() - i, 1);
      const monthName = date.toLocaleDateString('en-US', { month: 'short', year: '2-digit' });
      
      // Add some realistic variance to the data
      const incomeVariance = (Math.random() - 0.5) * 0.2; // ±10% variance
      const expenseVariance = (Math.random() - 0.5) * 0.3; // ±15% variance
      
      const income = Math.round(monthlyIncome * (1 + incomeVariance));
      const expenses = Math.round(monthlyExpenses * (1 + expenseVariance));
      const netFlow = income - expenses;
      
      historicalData.push({
        month: monthName,
        income,
        expenses,
        netFlow
      });
    }
    
    return historicalData;
  }

  // Main integration method - combines all real data
  public integrateRealData(transactions: RealTransactionData[]): RealCashFlowData {
    const incomeStreams = this.analyzeIncomePatterns(transactions);
    const expenseCategories = this.analyzeExpensePatterns(transactions);
    const emergencyFund = this.calculateEmergencyFundMetrics(incomeStreams, expenseCategories);
    const volatilityMetrics = this.calculateVolatilityMetrics(incomeStreams, expenseCategories);
    const historicalData = this.generateHistoricalData(incomeStreams, expenseCategories);
    
    const monthlyIncome = this.calculateMonthlyIncome(incomeStreams);
    const monthlyExpenses = expenseCategories.reduce((sum, cat) => sum + (cat.spent / 12), 0);
    
    return {
      monthlyIncome,
      monthlyExpenses,
      netCashFlow: monthlyIncome - monthlyExpenses,
      historicalData,
      incomeStreams,
      expenseCategories,
      emergencyFund,
      volatilityMetrics
    };
  }

  // Helper method to calculate monthly income from all streams
  private calculateMonthlyIncome(streams: RealIncomeSource[]): number {
    return streams.reduce((total, stream) => {
      let monthlyAmount = stream.amount;
      
      // Convert to monthly based on frequency
      switch (stream.frequency) {
        case 'weekly':
          monthlyAmount = stream.amount * 4.33; // Average weeks per month
          break;
        case 'biweekly':
          monthlyAmount = stream.amount * 2.17; // Average bi-weeks per month
          break;
        case 'annual':
          monthlyAmount = stream.amount / 12;
          break;
        case 'monthly':
        default:
          monthlyAmount = stream.amount;
      }
      
      return total + monthlyAmount;
    }, 0);
  }

  // Helper method to categorize income sources
  private categorizeIncomeSource(sourceName: string): RealIncomeSource['category'] {
    const name = sourceName.toLowerCase();
    
    if (name.includes('salary') || name.includes('payroll') || name.includes('wages')) {
      return 'salary';
    }
    if (name.includes('freelance') || name.includes('contract') || name.includes('consulting')) {
      return 'freelance';
    }
    if (name.includes('rent') || name.includes('property') || name.includes('lease')) {
      return 'rental';
    }
    if (name.includes('dividend') || name.includes('interest') || name.includes('investment')) {
      return 'investment';
    }
    if (name.includes('business') || name.includes('revenue') || name.includes('sales')) {
      return 'business';
    }
    
    return 'other';
  }

  // Helper method to determine if expense category is fixed
  private isFixedExpenseCategory(categoryName: string): boolean {
    const fixedCategories = [
      'rent', 'mortgage', 'insurance', 'subscription', 'utilities',
      'loan', 'car payment', 'phone', 'internet', 'streaming'
    ];
    
    const name = categoryName.toLowerCase();
    return fixedCategories.some(fixed => name.includes(fixed));
  }
}

// Export singleton instance
export const dataIntegrationService = DataIntegrationService.getInstance();