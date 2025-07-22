import React from 'react';
import { Box, Typography, Stack, FormControl, InputLabel, Select, MenuItem, Chip, List, ListItem, ListItemText, IconButton } from '@mui/material';
import { Edit as EditIcon, Delete as DeleteIcon } from '@mui/icons-material';
import { Transaction } from '@/types/budget';
import { MONTHS } from '@/utils/budgetHelpers';

interface TransactionHistoryProps {
  transactions: Transaction[];
  selectedYear: number;
  selectedMonth: number;
  selectedCategory: string;
  availableYears: number[];
  editingTransaction: Transaction | null;
  onYearChange: (year: number) => void;
  onMonthChange: (month: number) => void;
  onClearCategory: () => void;
  onEditTransaction: (transaction: Transaction) => void;
  onDeleteTransaction: (id: string) => void;
}

const TransactionHistory: React.FC<TransactionHistoryProps> = ({
  transactions,
  selectedYear,
  selectedMonth,
  selectedCategory,
  availableYears,
  editingTransaction,
  onYearChange,
  onMonthChange,
  onClearCategory,
  onEditTransaction,
  onDeleteTransaction,
}) => {
  return (
    <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={2} sx={{ flexShrink: 0 }}>
        <Typography variant="h6">
          History
        </Typography>
        <Stack direction="row" spacing={1} alignItems="center">
          <FormControl size="small" sx={{ minWidth: 70 }}>
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
          
          <FormControl size="small" sx={{ minWidth: 70 }}>
            <InputLabel>Month</InputLabel>
            <Select
              value={selectedMonth}
              label="Month"
              onChange={(e) => onMonthChange(Number(e.target.value))}
            >
              {MONTHS.map((month) => (
                <MenuItem key={month.value} value={month.value}>
                  {month.label.slice(0, 3)}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Stack>
      </Box>
      
      {selectedCategory && (
        <Box mb={2} sx={{ flexShrink: 0 }}>
          <Chip 
            label={selectedCategory}
            onDelete={onClearCategory}
            color="primary"
            variant="outlined"
            size="small"
          />
        </Box>
      )}

      <List sx={{ flex: 1, overflow: 'auto', px: 0 }}>
        {transactions.length === 0 ? (
          <Typography color="text.secondary" align="center" sx={{ py: 2 }}>
            No transactions
          </Typography>
        ) : (
          transactions.map((transaction) => (
            <ListItem
              key={transaction.id}
              sx={{
                border: 1,
                borderColor: 'divider',
                borderRadius: 1,
                mb: 1,
                bgcolor: 'background.paper',
                p: 1,
              }}
              secondaryAction={
                <Stack direction="row" spacing={0.5}>
                  <IconButton
                    onClick={() => onEditTransaction(transaction)}
                    color="primary"
                    size="small"
                    disabled={editingTransaction !== null}
                  >
                    <EditIcon fontSize="small" />
                  </IconButton>
                  <IconButton
                    onClick={() => onDeleteTransaction(transaction.id)}
                    color="error"
                    size="small"
                    disabled={editingTransaction !== null}
                  >
                    <DeleteIcon fontSize="small" />
                  </IconButton>
                </Stack>
              }
            >
              <ListItemText
                primary={
                  <Box>
                    <Typography variant="body2" noWrap>
                      {transaction.description}
                    </Typography>
                    <Chip
                      label={`$${transaction.amount.toFixed(2)}`}
                      color={transaction.type === 'income' ? 'success' : 'error'}
                      size="small"
                      sx={{ mt: 0.5 }}
                    />
                  </Box>
                }
                secondary={
                  <Typography variant="caption" color="text.secondary">
                    {transaction.category}
                  </Typography>
                }
              />
            </ListItem>
          ))
        )}
      </List>
    </Box>
  );
};

export default TransactionHistory;