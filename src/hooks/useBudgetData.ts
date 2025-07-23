import { useState } from 'react';
import { Transaction, BudgetState } from '@/types/budget';
import { DEFAULT_INCOME_CATEGORIES, DEFAULT_EXPENSE_CATEGORIES, generateTransactionId, createTransactionDate, findRelatedRepeatableTransactions } from '@/utils/budgetHelpers';
import { useToast } from '@/hooks/use-toast';

export const useBudgetData = () => {
  const { toast } = useToast();
  
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [amount, setAmount] = useState<string>('');
  const [description, setDescription] = useState<string>('');
  const [category, setCategory] = useState<string>('');
  const [type, setType] = useState<'income' | 'expense'>('income');
  const [selectedYear, setSelectedYear] = useState<number>(new Date().getFullYear());
  const [selectedMonth, setSelectedMonth] = useState<number>(new Date().getMonth() + 1);
  const [transactionYear, setTransactionYear] = useState<number>(new Date().getFullYear());
  const [transactionMonth, setTransactionMonth] = useState<number>(new Date().getMonth() + 1);
  const [selectedCategory, setSelectedCategory] = useState<string>('');
  const [newCategory, setNewCategory] = useState<string>('');
  const [showAddCategory, setShowAddCategory] = useState<boolean>(false);
  const [editingTransaction, setEditingTransaction] = useState<Transaction | null>(null);
  const [showZeroCategories, setShowZeroCategories] = useState<boolean>(true);
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState<boolean>(false);
  const [transactionToDelete, setTransactionToDelete] = useState<string | null>(null);
  const [incomeCategories, setIncomeCategories] = useState(DEFAULT_INCOME_CATEGORIES);
  const [expenseCategories, setExpenseCategories] = useState(DEFAULT_EXPENSE_CATEGORIES);
  const [repeatMonthly, setRepeatMonthly] = useState<boolean>(false);
  const [updateRelatedTransactions, setUpdateRelatedTransactions] = useState<boolean>(false);

  const addTransaction = () => {
    if (!amount || !category) return;

    const transactionDate = createTransactionDate(transactionYear, transactionMonth);

    if (editingTransaction) {
      const updatedTransaction: Transaction = {
        ...editingTransaction,
        type,
        amount: parseFloat(amount),
        description,
        category,
        date: transactionDate,
      };

      if (updateRelatedTransactions) {
        // Update the current transaction and all related ones
        const relatedTransactions = findRelatedRepeatableTransactions(transactions, editingTransaction);
        const updatedTransactions = transactions.map(t => {
          if (t.id === editingTransaction.id) {
            return updatedTransaction;
          } else if (relatedTransactions.some(rt => rt.id === t.id)) {
            return {
              ...t,
              type,
              amount: parseFloat(amount),
              description,
              category,
            };
          }
          return t;
        });
        setTransactions(updatedTransactions);
        toast({
          title: "Success",
          description: `Updated ${relatedTransactions.length + 1} related transactions`,
        });
      } else {
        setTransactions(transactions.map(t => 
          t.id === editingTransaction.id ? updatedTransaction : t
        ));
      }
      setEditingTransaction(null);
    } else {
      if (repeatMonthly) {
        // Create 12 transactions, one for each month of the year
        const newTransactions: Transaction[] = [];
        for (let month = 1; month <= 12; month++) {
          const monthlyTransaction: Transaction = {
            id: generateTransactionId(),
            type,
            amount: parseFloat(amount),
            description,
            category,
            date: createTransactionDate(transactionYear, month),
          };
          newTransactions.push(monthlyTransaction);
        }
        setTransactions([...newTransactions, ...transactions]);
      } else {
        const newTransaction: Transaction = {
          id: generateTransactionId(),
          type,
          amount: parseFloat(amount),
          description,
          category,
          date: transactionDate,
        };
        setTransactions([newTransaction, ...transactions]);
      }
    }

    resetForm();
  };

  const editTransaction = (transaction: Transaction) => {
    setEditingTransaction(transaction);
    setType(transaction.type);
    setAmount(transaction.amount.toString());
    setDescription(transaction.description);
    setCategory(transaction.category);
    setTransactionYear(new Date(transaction.date).getFullYear());
    setTransactionMonth(new Date(transaction.date).getMonth() + 1);
  };

  const cancelEdit = () => {
    setEditingTransaction(null);
    resetForm();
  };

  const resetForm = () => {
    setAmount('');
    setDescription('');
    setCategory('');
    setType('income');
    setTransactionYear(new Date().getFullYear());
    setTransactionMonth(new Date().getMonth() + 1);
    setRepeatMonthly(false);
    setUpdateRelatedTransactions(false);
  };

  const addCategory = () => {
    if (!newCategory.trim()) return;
    
    if (type === 'income') {
      setIncomeCategories([...incomeCategories, newCategory.trim()]);
    } else {
      setExpenseCategories([...expenseCategories, newCategory.trim()]);
    }
    setNewCategory('');
    setShowAddCategory(false);
  };

  const promptDeleteTransaction = (id: string) => {
    setTransactionToDelete(id);
    setDeleteConfirmOpen(true);
  };

  const confirmDeleteTransaction = () => {
    if (transactionToDelete) {
      setTransactions(transactions.filter(t => t.id !== transactionToDelete));
      setTransactionToDelete(null);
    }
    setDeleteConfirmOpen(false);
  };

  const cancelDeleteTransaction = () => {
    setTransactionToDelete(null);
    setDeleteConfirmOpen(false);
  };

  const isFormValid = Boolean(amount && category && type);

  return {
    // State
    transactions,
    amount,
    description,
    category,
    type,
    selectedYear,
    selectedMonth,
    transactionYear,
    transactionMonth,
    selectedCategory,
    newCategory,
    showAddCategory,
    editingTransaction,
    showZeroCategories,
    deleteConfirmOpen,
    transactionToDelete,
    incomeCategories,
    expenseCategories,
    isFormValid,
    repeatMonthly,
    updateRelatedTransactions,

    // Setters
    setAmount,
    setDescription,
    setCategory,
    setType,
    setSelectedYear,
    setSelectedMonth,
    setTransactionYear,
    setTransactionMonth,
    setSelectedCategory,
    setNewCategory,
    setShowAddCategory,
    setShowZeroCategories,
    setRepeatMonthly,
    setUpdateRelatedTransactions,

    // Actions
    addTransaction,
    editTransaction,
    cancelEdit,
    addCategory,
    promptDeleteTransaction,
    confirmDeleteTransaction,
    cancelDeleteTransaction,
  };
};