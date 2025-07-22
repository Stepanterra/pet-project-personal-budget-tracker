export interface Transaction {
  id: string;
  type: 'income' | 'expense';
  amount: number;
  description: string;
  category: string;
  date: Date;
}

export interface MonthData {
  value: number;
  label: string;
}

export interface BudgetState {
  transactions: Transaction[];
  amount: string;
  description: string;
  category: string;
  type: 'income' | 'expense';
  selectedYear: number;
  selectedMonth: number;
  transactionYear: number;
  transactionMonth: number;
  selectedCategory: string;
  newCategory: string;
  showAddCategory: boolean;
  editingTransaction: Transaction | null;
  showZeroCategories: boolean;
  deleteConfirmOpen: boolean;
  transactionToDelete: string | null;
  incomeCategories: string[];
  expenseCategories: string[];
}

export interface BalanceData {
  balance: number;
  totalIncome: number;
  totalExpenses: number;
}