import React from 'react';
import { Paper, Box, Typography, Stack, FormControlLabel, Checkbox, FormControl, InputLabel, Select, MenuItem } from '@mui/material';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Transaction } from '@/types/budget';
import { MONTHS, formatCurrency, isCurrentMonth } from '@/utils/budgetHelpers';
import { 
  calculateRunningBalance, 
  calculateCategoryData, 
  calculateMonthlyTotal, 
  shouldShowCategory 
} from '@/utils/budgetCalculations';

interface CategorySummaryTableProps {
  transactions: Transaction[];
  incomeCategories: string[];
  expenseCategories: string[];
  selectedYear: number;
  showZeroCategories: boolean;
  availableYears: number[];
  onYearChange: (year: number) => void;
  onShowZeroCategoriesChange: (show: boolean) => void;
  onCategoryClick: (category: string) => void;
  onCellClick: (category: string, month: number) => void;
}

const CategorySummaryTable: React.FC<CategorySummaryTableProps> = ({
  transactions,
  incomeCategories,
  expenseCategories,
  selectedYear,
  showZeroCategories,
  availableYears,
  onYearChange,
  onShowZeroCategoriesChange,
  onCategoryClick,
  onCellClick,
}) => {
  const renderCategoryRows = (categories: string[], type: 'income' | 'expense') => {
    const colorClass = type === 'income' ? 'text-green-600' : 'text-red-600';
    
    return categories
      .filter(category => shouldShowCategory(category, type, transactions, selectedYear, showZeroCategories))
      .map((category) => {
        const categoryData = calculateCategoryData(transactions, category, type, selectedYear, MONTHS);
        const total = categoryData.reduce((acc, val) => acc + val, 0);
        
        return (
          <TableRow 
            key={category} 
            className="cursor-pointer hover:bg-gray-50" 
            onClick={() => onCategoryClick(category)}
          >
            <TableCell className={`font-medium ${colorClass}`}>{category}</TableCell>
            {categoryData.map((amount, index) => (
              <TableCell 
                key={index} 
                className={`text-center cursor-pointer hover:bg-gray-100 ${isCurrentMonth(index + 1) ? 'bg-gray-200' : ''}`}
                onClick={(e) => {
                  e.stopPropagation();
                  onCellClick(category, index + 1);
                }}
              >
                {formatCurrency(amount)}
              </TableCell>
            ))}
            <TableCell className={`text-center font-medium ${colorClass}`}>
              {formatCurrency(total)}
            </TableCell>
          </TableRow>
        );
      });
  };

  const renderSubtotalRow = (type: 'income' | 'expense', label: string) => {
    const bgClass = type === 'income' ? 'bg-green-50' : 'bg-red-50';
    const textClass = type === 'income' ? 'text-green-700' : 'text-red-700';
    
    return (
      <TableRow className={bgClass}>
        <TableCell className={`font-bold ${textClass}`}>{label}</TableCell>
        {MONTHS.map((month) => {
          const monthlyTotal = calculateMonthlyTotal(transactions, type, selectedYear, month.value);
          return (
            <TableCell 
              key={month.value} 
              className={`text-center font-bold ${textClass} ${isCurrentMonth(month.value) ? 'bg-gray-200' : ''}`}
            >
              {formatCurrency(monthlyTotal)}
            </TableCell>
          );
        })}
        <TableCell className={`text-center font-bold ${textClass}`}>
          {formatCurrency(
            transactions
              .filter(t => t.type === type && new Date(t.date).getFullYear() === selectedYear)
              .reduce((acc, t) => acc + t.amount, 0)
          )}
        </TableCell>
      </TableRow>
    );
  };

  return (
    <Paper sx={{ 
      flex: { lg: 4 }, 
      p: { xs: 2, sm: 3 },
      display: 'flex',
      flexDirection: 'column',
      overflow: 'hidden'
    }}>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
        <Typography variant="h6">
          Category Summary by Month
        </Typography>
        <Stack direction="row" spacing={2} alignItems="center">
          <FormControlLabel
            control={
              <Checkbox
                checked={showZeroCategories}
                onChange={(e) => onShowZeroCategoriesChange(e.target.checked)}
                size="small"
              />
            }
            label="Show zero categories"
            sx={{ color: 'text.secondary', '& .MuiFormControlLabel-label': { fontSize: '0.875rem' } }}
          />
          <FormControl size="small" sx={{ minWidth: 120 }}>
            <InputLabel>Year</InputLabel>
            <Select
              value={selectedYear}
              label="Year"
              onChange={(e) => onYearChange(Number(e.target.value))}
            >
              {availableYears.map((year) => (
                <MenuItem key={year} value={year}>
                  {year}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Stack>
      </Box>
      
      <Box sx={{ overflowX: 'auto', overflowY: 'auto', flex: 1 }}>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="font-medium">Category</TableHead>
              {MONTHS.map((month) => (
                <TableHead 
                  key={month.value} 
                  className={`text-center font-medium ${isCurrentMonth(month.value) ? 'bg-gray-200' : ''}`}
                >
                  {month.label.slice(0, 3)}
                </TableHead>
              ))}
              <TableHead className="text-center font-medium">Total</TableHead>
            </TableRow>
            
            {/* Running Balance Row */}
            <TableRow className="bg-blue-50">
              <TableCell className="font-bold text-blue-700">Running Balance</TableCell>
              {MONTHS.map((month) => {
                const runningBalance = calculateRunningBalance(transactions, selectedYear, month.value);
                const isNegative = runningBalance < 0;
                
                return (
                  <TableCell 
                    key={month.value} 
                    className={`text-center font-bold ${
                      isNegative ? 'text-red-700 bg-red-100' : 'text-blue-700'
                    } ${isCurrentMonth(month.value) ? 'bg-gray-200' : ''}`}
                  >
                    {formatCurrency(runningBalance, true)}
                  </TableCell>
                );
              })}
              <TableCell className="text-center font-bold text-blue-700">
                {formatCurrency(
                  transactions
                    .filter(t => new Date(t.date).getFullYear() === selectedYear)
                    .reduce((acc, t) => t.type === 'income' ? acc + t.amount : acc - t.amount, 0),
                  true
                )}
              </TableCell>
            </TableRow>
          </TableHeader>
          
          <TableBody>
            {/* Income Categories */}
            {renderCategoryRows(incomeCategories, 'income')}
            
            {/* Income Subtotal */}
            {renderSubtotalRow('income', 'Income Subtotal')}
            
            {/* Expense Categories */}
            {renderCategoryRows(expenseCategories, 'expense')}
            
            {/* Expense Subtotal */}
            {renderSubtotalRow('expense', 'Expense Subtotal')}
          </TableBody>
        </Table>
      </Box>
    </Paper>
  );
};

export default CategorySummaryTable;