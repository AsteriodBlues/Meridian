// Utility to convert existing transaction data format to RealTransactionData format
import type { RealTransactionData } from '@/services/dataIntegration';

interface ExistingTransaction {
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

export const convertTransactionsToRealData = (
  existingTransactions: ExistingTransaction[]
): RealTransactionData[] => {
  return existingTransactions.map(transaction => ({
    ...transaction,
    // Ensure all required fields are present
    merchant: transaction.merchant || transaction.title,
    description: transaction.description || `${transaction.type} transaction`,
  }));
};

// Generate mock transaction data that mimics real user data
export const generateMockRealTransactions = (): RealTransactionData[] => {
  const transactions: RealTransactionData[] = [];
  const currentDate = new Date();
  
  // Generate salary payments (monthly)
  for (let i = 0; i < 6; i++) {
    const date = new Date(currentDate.getFullYear(), currentDate.getMonth() - i, 15);
    transactions.push({
      id: `salary-${i}`,
      title: 'Salary Deposit',
      category: 'Income',
      amount: 8500 + (Math.random() - 0.5) * 200, // Small variance
      date: date.toISOString().split('T')[0],
      time: '09:00:00',
      type: 'income',
      merchant: 'TechCorp Inc.',
      description: 'Monthly salary payment'
    });
  }

  // Generate freelance payments (irregular)
  const freelanceMonths = [0, 1, 3, 4]; // Some months have freelance income
  freelanceMonths.forEach((monthsAgo, index) => {
    const date = new Date(currentDate.getFullYear(), currentDate.getMonth() - monthsAgo, 5 + Math.random() * 20);
    transactions.push({
      id: `freelance-${index}`,
      title: 'Freelance Payment',
      category: 'Income',
      amount: 1200 + Math.random() * 800,
      date: date.toISOString().split('T')[0],
      time: '14:30:00',
      type: 'income',
      merchant: 'Upwork',
      description: 'Web development project'
    });
  });

  // Generate rental income (monthly)
  for (let i = 0; i < 6; i++) {
    const date = new Date(currentDate.getFullYear(), currentDate.getMonth() - i, 1);
    transactions.push({
      id: `rental-${i}`,
      title: 'Rental Income',
      category: 'Income',
      amount: 2300,
      date: date.toISOString().split('T')[0],
      time: '08:00:00',
      type: 'income',
      merchant: 'Property Management',
      description: 'Monthly rental payment'
    });
  }

  // Generate investment dividends (quarterly)
  for (let i = 0; i < 2; i++) {
    const date = new Date(currentDate.getFullYear(), currentDate.getMonth() - (i * 3), 1);
    transactions.push({
      id: `dividend-${i}`,
      title: 'Investment Dividends',
      category: 'Income',
      amount: 450 + Math.random() * 100,
      date: date.toISOString().split('T')[0],
      time: '10:00:00',
      type: 'income',
      merchant: 'Vanguard',
      description: 'Quarterly dividend payment'
    });
  }

  // Generate regular expenses
  const expenseCategories = [
    { category: 'Housing', merchants: ['Rent Payment', 'Mortgage Co.'], amounts: [2800, 3200], frequency: 1 },
    { category: 'Food', merchants: ['Whole Foods', 'Starbucks', 'DoorDash'], amounts: [50, 150], frequency: 15 },
    { category: 'Transport', merchants: ['Shell', 'Uber', 'Metro Card'], amounts: [30, 80], frequency: 8 },
    { category: 'Utilities', merchants: ['Electric Co.', 'Gas Co.', 'Internet Provider'], amounts: [80, 150], frequency: 1 },
    { category: 'Entertainment', merchants: ['Netflix', 'Spotify', 'Movie Theater'], amounts: [10, 50], frequency: 5 },
    { category: 'Shopping', merchants: ['Amazon', 'Target', 'Best Buy'], amounts: [25, 200], frequency: 6 },
    { category: 'Health', merchants: ['CVS Pharmacy', 'Gym Membership'], amounts: [15, 80], frequency: 3 }
  ];

  let transactionId = 1000;
  
  expenseCategories.forEach(category => {
    const transactionsThisMonth = Math.floor(category.frequency * (1 + (Math.random() - 0.5) * 0.4));
    
    for (let i = 0; i < transactionsThisMonth * 6; i++) { // 6 months of data
      const monthsAgo = Math.floor(i / transactionsThisMonth);
      const dayInMonth = Math.floor(Math.random() * 28) + 1;
      const date = new Date(currentDate.getFullYear(), currentDate.getMonth() - monthsAgo, dayInMonth);
      
      const merchant = category.merchants[Math.floor(Math.random() * category.merchants.length)];
      const baseAmount = category.amounts[0] + Math.random() * (category.amounts[1] - category.amounts[0]);
      const amount = Math.round(baseAmount * 100) / 100;
      
      transactions.push({
        id: `expense-${transactionId++}`,
        title: `${category.category} Purchase`,
        category: category.category,
        amount,
        date: date.toISOString().split('T')[0],
        time: `${Math.floor(Math.random() * 24)}:${Math.floor(Math.random() * 60).toString().padStart(2, '0')}:00`,
        type: 'expense',
        merchant,
        description: `${category.category} expense at ${merchant}`
      });
    }
  });

  // Sort by date (newest first)
  return transactions.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
};

// Get transaction data from localStorage if available, otherwise generate mock data
export const getRealTransactionData = (): RealTransactionData[] => {
  // In a real app, this would fetch from your database/API
  // For now, we'll use mock data that represents realistic patterns
  
  try {
    const stored = localStorage.getItem('meridian-transactions');
    if (stored) {
      const parsed = JSON.parse(stored);
      return convertTransactionsToRealData(parsed);
    }
  } catch (error) {
    console.warn('Could not load stored transactions:', error);
  }
  
  // Generate and cache mock data
  const mockData = generateMockRealTransactions();
  try {
    localStorage.setItem('meridian-transactions', JSON.stringify(mockData));
  } catch (error) {
    console.warn('Could not cache transaction data:', error);
  }
  
  return mockData;
};