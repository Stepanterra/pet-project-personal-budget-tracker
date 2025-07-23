import React from 'react';
import { Box, Paper, Divider } from '@mui/material';
import { TooltipProvider } from '@/components/ui/tooltip';
import { useBudgetData } from '@/hooks/useBudgetData';
import { calculateBalance, filterTransactionsByPeriod, getAvailableYears } from '@/utils/budgetCalculations';
import BudgetHeader from '@/components/budget/BudgetHeader';
import BalanceOverview from '@/components/budget/BalanceOverview';
import CategorySummaryTable from '@/components/budget/CategorySummaryTable';
import TransactionForm from '@/components/budget/TransactionForm';
import TransactionHistory from '@/components/budget/TransactionHistory';
import DeleteConfirmDialog from '@/components/budget/DeleteConfirmDialog';

const BudgetApp: React.FC = () => {
  const budgetData = useBudgetData();

  // Calculate filtered data
  const filteredTransactions = filterTransactionsByPeriod(
    budgetData.transactions,
    budgetData.selectedYear,
    budgetData.selectedMonth,
    budgetData.selectedCategory
  );

  const balanceData = calculateBalance(filteredTransactions);
  const availableYears = getAvailableYears(budgetData.transactions);

  return (
    <TooltipProvider>
      <Box sx={{ height: '100vh', bgcolor: 'background.default', display: 'flex', flexDirection: 'column' }}>
        <BudgetHeader />

        <Box sx={{ px: 2, py: 2, flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
          <BalanceOverview balanceData={balanceData} />

          <Box sx={{ 
            display: 'flex', 
            flexDirection: { xs: 'column', lg: 'row' },
            gap: { xs: 2, lg: 3 }, 
            flex: 1,
            overflow: 'hidden'
          }}>
            <CategorySummaryTable
              transactions={budgetData.transactions}
              incomeCategories={budgetData.incomeCategories}
              expenseCategories={budgetData.expenseCategories}
              selectedYear={budgetData.selectedYear}
              showZeroCategories={budgetData.showZeroCategories}
              availableYears={availableYears}
              onYearChange={budgetData.setSelectedYear}
              onShowZeroCategoriesChange={budgetData.setShowZeroCategories}
              onCategoryClick={budgetData.setSelectedCategory}
              onCellClick={(category, month) => {
                budgetData.setSelectedCategory(category);
                budgetData.setSelectedMonth(month);
              }}
            />

            <Paper sx={{ 
              flex: { lg: 1 }, 
              p: { xs: 2, sm: 3 }, 
              display: 'flex', 
              flexDirection: 'column',
              minHeight: { xs: '400px', lg: 'auto' },
              overflow: 'hidden'
            }}>
              <TransactionForm
                amount={budgetData.amount}
                description={budgetData.description}
                category={budgetData.category}
                type={budgetData.type}
                transactionYear={budgetData.transactionYear}
                transactionMonth={budgetData.transactionMonth}
                newCategory={budgetData.newCategory}
                showAddCategory={budgetData.showAddCategory}
                editingTransaction={budgetData.editingTransaction}
                isFormValid={budgetData.isFormValid}
                repeatMonthly={budgetData.repeatMonthly}
                updateRelatedTransactions={budgetData.updateRelatedTransactions}
                allTransactions={budgetData.transactions}
                incomeCategories={budgetData.incomeCategories}
                expenseCategories={budgetData.expenseCategories}
                onAmountChange={budgetData.setAmount}
                onDescriptionChange={budgetData.setDescription}
                onCategoryChange={budgetData.setCategory}
                onTypeChange={budgetData.setType}
                onTransactionYearChange={budgetData.setTransactionYear}
                onTransactionMonthChange={budgetData.setTransactionMonth}
                onNewCategoryChange={budgetData.setNewCategory}
                onShowAddCategoryToggle={() => budgetData.setShowAddCategory(!budgetData.showAddCategory)}
                onAddTransaction={budgetData.addTransaction}
                onAddCategory={budgetData.addCategory}
                onCancelEdit={budgetData.cancelEdit}
                onRepeatMonthlyChange={budgetData.setRepeatMonthly}
                onUpdateRelatedTransactionsChange={budgetData.setUpdateRelatedTransactions}
              />

              <Divider sx={{ my: 2 }} />

              <TransactionHistory
                transactions={filteredTransactions}
                selectedYear={budgetData.selectedYear}
                selectedMonth={budgetData.selectedMonth}
                selectedCategory={budgetData.selectedCategory}
                availableYears={availableYears}
                editingTransaction={budgetData.editingTransaction}
                onYearChange={budgetData.setSelectedYear}
                onMonthChange={budgetData.setSelectedMonth}
                onClearCategory={() => budgetData.setSelectedCategory('')}
                onEditTransaction={budgetData.editTransaction}
                onEditAllRelated={budgetData.editAllRelatedTransactions}
                onDeleteTransaction={budgetData.promptDeleteTransaction}
              />
            </Paper>
          </Box>
        </Box>

        <DeleteConfirmDialog
          open={budgetData.deleteConfirmOpen}
          onConfirm={budgetData.confirmDeleteTransaction}
          onCancel={budgetData.cancelDeleteTransaction}
        />
      </Box>
    </TooltipProvider>
  );
};

export default BudgetApp;