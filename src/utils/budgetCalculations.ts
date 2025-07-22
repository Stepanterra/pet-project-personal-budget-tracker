import { Transaction, BalanceData } from '@/types/budget';

export const calculateBalance = (transactions: Transaction[]): BalanceData => {
  const totalIncome = transactions
    .filter(t => t.type === 'income')
    .reduce((acc, t) => acc + t.amount, 0);

  const totalExpenses = transactions
    .filter(t => t.type === 'expense')
    .reduce((acc, t) => acc + t.amount, 0);

  const balance = totalIncome - totalExpenses;

  return { balance, totalIncome, totalExpenses };
};

export const filterTransactionsByPeriod = (
  transactions: Transaction[],
  year: number,
  month: number,
  category?: string
): Transaction[] => {
  return transactions.filter(t => {
    const transactionDate = new Date(t.date);
    const yearMatch = transactionDate.getFullYear() === year;
    const monthMatch = transactionDate.getMonth() + 1 === month;
    const categoryMatch = !category || category === '' || t.category === category;
    
    return yearMatch && monthMatch && categoryMatch;
  });
};

export const getAvailableYears = (transactions: Transaction[]): number[] => {
  const years = Array.from(
    new Set(transactions.map(t => new Date(t.date).getFullYear()))
  ).sort((a, b) => b - a);

  if (years.length === 0) {
    years.push(new Date().getFullYear());
  }

  return years;
};

export const calculateRunningBalance = (
  transactions: Transaction[],
  targetYear: number,
  targetMonth: number
): number => {
  let runningBalance = 0;
  
  const sortedTransactions = [...transactions].sort((a, b) => 
    new Date(a.date).getTime() - new Date(b.date).getTime()
  );
  
  for (const transaction of sortedTransactions) {
    const transactionDate = new Date(transaction.date);
    const transactionYear = transactionDate.getFullYear();
    const transactionMonth = transactionDate.getMonth() + 1;
    
    if (transactionYear < targetYear || 
        (transactionYear === targetYear && transactionMonth <= targetMonth)) {
      runningBalance += transaction.type === 'income' ? transaction.amount : -transaction.amount;
    }
  }
  
  return runningBalance;
};

export const calculateCategoryData = (
  transactions: Transaction[],
  category: string,
  type: 'income' | 'expense',
  year: number,
  months: { value: number; label: string }[]
): number[] => {
  return months.map((month) => {
    const sum = transactions
      .filter(t => 
        t.type === type && 
        t.category === category &&
        new Date(t.date).getFullYear() === year &&
        new Date(t.date).getMonth() + 1 === month.value
      )
      .reduce((acc, t) => acc + t.amount, 0);
    return sum;
  });
};

export const calculateMonthlyTotal = (
  transactions: Transaction[],
  type: 'income' | 'expense',
  year: number,
  month: number
): number => {
  return transactions
    .filter(t => 
      t.type === type &&
      new Date(t.date).getFullYear() === year &&
      new Date(t.date).getMonth() + 1 === month
    )
    .reduce((acc, t) => acc + t.amount, 0);
};

export const shouldShowCategory = (
  category: string,
  type: 'income' | 'expense',
  transactions: Transaction[],
  year: number,
  showZeroCategories: boolean
): boolean => {
  if (showZeroCategories) return true;
  
  const total = transactions
    .filter(t => 
      t.type === type && 
      t.category === category &&
      new Date(t.date).getFullYear() === year
    )
    .reduce((acc, t) => acc + t.amount, 0);
  
  return total > 0;
};