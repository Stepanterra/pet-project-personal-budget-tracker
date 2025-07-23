import { MonthData, Transaction } from '@/types/budget';

export const MONTHS: MonthData[] = [
  { value: 1, label: 'January' },
  { value: 2, label: 'February' },
  { value: 3, label: 'March' },
  { value: 4, label: 'April' },
  { value: 5, label: 'May' },
  { value: 6, label: 'June' },
  { value: 7, label: 'July' },
  { value: 8, label: 'August' },
  { value: 9, label: 'September' },
  { value: 10, label: 'October' },
  { value: 11, label: 'November' },
  { value: 12, label: 'December' },
];

export const DEFAULT_INCOME_CATEGORIES = ['Salary', 'Freelance', 'Investment', 'Other Income'];
export const DEFAULT_EXPENSE_CATEGORIES = ['Food', 'Transport', 'Entertainment', 'Bills', 'Shopping', 'Other'];

export const generateYearRange = (yearsBefore = 5, yearsAfter = 5): number[] => {
  const currentYear = new Date().getFullYear();
  return Array.from({ length: yearsBefore + yearsAfter + 1 }, (_, i) => 
    currentYear - yearsBefore + i
  );
};

export const formatCurrency = (amount: number, showZero = false): string => {
  if (amount === 0 && !showZero) return '-';
  return `$${Math.round(amount)}`;
};

export const isCurrentMonth = (month: number): boolean => {
  return month === new Date().getMonth() + 1;
};

export const generateTransactionId = (): string => {
  return Date.now().toString();
};

export const createTransactionDate = (year: number, month: number): Date => {
  return new Date(year, month - 1, 1);
};

export const findRelatedRepeatableTransactions = (transactions: Transaction[], transaction: Transaction): Transaction[] => {
  const transactionYear = new Date(transaction.date).getFullYear();
  
  return transactions.filter(t => {
    const tYear = new Date(t.date).getFullYear();
    return t.id !== transaction.id &&
           t.type === transaction.type &&
           t.amount === transaction.amount &&
           t.description === transaction.description &&
           t.category === transaction.category &&
           tYear === transactionYear;
  });
};

export const isPartOfRepeatableGroup = (transactions: Transaction[], transaction: Transaction): boolean => {
  const related = findRelatedRepeatableTransactions(transactions, transaction);
  return related.length >= 2; // At least 3 total (including current) to be considered repeatable
};