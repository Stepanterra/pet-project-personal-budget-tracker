import React from 'react';
import { Box, Typography, Chip, Stack, FormControl, InputLabel, Select, MenuItem, TextField, Button, FormControlLabel, Checkbox } from '@mui/material';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import { Add as AddIcon } from '@mui/icons-material';
import { Transaction } from '@/types/budget';
import { MONTHS, generateYearRange, isPartOfRepeatableGroup } from '@/utils/budgetHelpers';

interface TransactionFormProps {
  // Form state
  amount: string;
  description: string;
  category: string;
  type: 'income' | 'expense';
  transactionYear: number;
  transactionMonth: number;
  newCategory: string;
  showAddCategory: boolean;
  editingTransaction: Transaction | null;
  isFormValid: boolean;
  repeatMonthly: boolean;
  updateRelatedTransactions: boolean;
  allTransactions: Transaction[];
  
  // Categories
  incomeCategories: string[];
  expenseCategories: string[];
  
  // Handlers
  onAmountChange: (value: string) => void;
  onDescriptionChange: (value: string) => void;
  onCategoryChange: (value: string) => void;
  onTypeChange: (value: 'income' | 'expense') => void;
  onTransactionYearChange: (value: number) => void;
  onTransactionMonthChange: (value: number) => void;
  onNewCategoryChange: (value: string) => void;
  onShowAddCategoryToggle: () => void;
  onAddTransaction: () => void;
  onAddCategory: () => void;
  onCancelEdit: () => void;
  onRepeatMonthlyChange: (value: boolean) => void;
  onUpdateRelatedTransactionsChange: (value: boolean) => void;
}

const TransactionForm: React.FC<TransactionFormProps> = ({
  amount,
  description,
  category,
  type,
  transactionYear,
  transactionMonth,
  newCategory,
  showAddCategory,
  editingTransaction,
  isFormValid,
  repeatMonthly,
  updateRelatedTransactions,
  allTransactions,
  incomeCategories,
  expenseCategories,
  onAmountChange,
  onDescriptionChange,
  onCategoryChange,
  onTypeChange,
  onTransactionYearChange,
  onTransactionMonthChange,
  onNewCategoryChange,
  onShowAddCategoryToggle,
  onAddTransaction,
  onAddCategory,
  onCancelEdit,
  onRepeatMonthlyChange,
  onUpdateRelatedTransactionsChange,
}) => {
  const yearOptions = generateYearRange();
  const categoryOptions = type === 'income' ? incomeCategories : expenseCategories;
  const isRepeatableGroup = editingTransaction && isPartOfRepeatableGroup(allTransactions, editingTransaction);

  return (
    <Box sx={{ flexShrink: 0, mb: 2 }}>
      <Typography variant="h6" gutterBottom>
        {editingTransaction ? 'Edit Transaction' : 'Add Transaction'}
      </Typography>
      
      {editingTransaction && (
        <Chip 
          label="Editing"
          color="primary"
          size="small"
          onDelete={onCancelEdit}
          sx={{ mb: 2 }}
        />
      )}
      
      <Stack spacing={2}>
        <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
          <FormControl size="small" sx={{ minWidth: { xs: '100%', sm: 100 } }}>
            <InputLabel>Type</InputLabel>
            <Select
              value={type}
              label="Type"
              onChange={(e) => {
                onTypeChange(e.target.value as 'income' | 'expense');
                onCategoryChange('');
              }}
            >
              <MenuItem value="income">Income</MenuItem>
              <MenuItem value="expense">Expense</MenuItem>
            </Select>
          </FormControl>

          <TextField
            label="Amount"
            value={amount}
            onChange={(e) => onAmountChange(e.target.value)}
            type="number"
            size="small"
            sx={{ minWidth: { xs: '100%', sm: 120 } }}
            inputProps={{ min: 0, step: 0.01 }}
            required
          />
        </Stack>

        <TextField
          label="Description"
          value={description}
          onChange={(e) => onDescriptionChange(e.target.value)}
          size="small"
          fullWidth
        />

        <Stack direction="row" spacing={1} alignItems="flex-end">
          <FormControl size="small" sx={{ flex: 1 }}>
            <InputLabel>Category</InputLabel>
            <Select
              value={category}
              label="Category"
              onChange={(e) => onCategoryChange(e.target.value)}
            >
              {categoryOptions.map((cat) => (
                <MenuItem key={cat} value={cat}>
                  {cat}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                size="small"
                variant="outlined"
                onClick={onShowAddCategoryToggle}
                sx={{ minWidth: 40, px: 1 }}
              >
                +
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>Add new category</p>
            </TooltipContent>
          </Tooltip>
        </Stack>

        {showAddCategory && (
          <Stack direction="row" spacing={1}>
            <TextField
              size="small"
              label="New Category"
              value={newCategory}
              onChange={(e) => onNewCategoryChange(e.target.value)}
              sx={{ flex: 1 }}
            />
            <Button
              size="small"
              variant="contained"
              onClick={onAddCategory}
              disabled={!newCategory.trim()}
            >
              Add
            </Button>
          </Stack>
        )}

        <Stack direction="row" spacing={1}>
          <FormControl size="small" sx={{ flex: 1 }}>
            <InputLabel>Year</InputLabel>
            <Select
              value={transactionYear}
              label="Year"
              onChange={(e) => onTransactionYearChange(Number(e.target.value))}
            >
              {yearOptions.map((year) => (
                <MenuItem key={year} value={year}>
                  {year}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          <FormControl size="small" sx={{ flex: 1 }}>
            <InputLabel>Month</InputLabel>
            <Select
              value={transactionMonth}
              label="Month"
              onChange={(e) => onTransactionMonthChange(Number(e.target.value))}
              disabled={repeatMonthly}
            >
              {MONTHS.map((month) => (
                <MenuItem key={month.value} value={month.value}>
                  {month.label.slice(0, 3)}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Stack>

        {!editingTransaction && (
          <FormControlLabel
            control={
              <Checkbox
                checked={repeatMonthly}
                onChange={(e) => onRepeatMonthlyChange(e.target.checked)}
                size="small"
              />
            }
            label="Repeat monthly for 1 year"
            sx={{ alignSelf: 'flex-start' }}
          />
        )}

        {isRepeatableGroup && (
          <FormControlLabel
            control={
              <Checkbox
                checked={updateRelatedTransactions}
                onChange={(e) => onUpdateRelatedTransactionsChange(e.target.checked)}
                size="small"
              />
            }
            label="Update all related monthly transactions"
            sx={{ alignSelf: 'flex-start' }}
          />
        )}

        <Button
          variant="contained"
          onClick={onAddTransaction}
          disabled={!isFormValid}
          startIcon={<AddIcon />}
          fullWidth
          size="small"
        >
          {editingTransaction ? 'Update' : 'Add'}
        </Button>
      </Stack>
    </Box>
  );
};

export default TransactionForm;