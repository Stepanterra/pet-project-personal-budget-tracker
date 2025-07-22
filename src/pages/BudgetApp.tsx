import React, { useState } from 'react';
import {
  Container,
  Paper,
  Typography,
  Box,
  TextField,
  Button,
  List,
  ListItem,
  ListItemText,
  Chip,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Card,
  CardContent,
  IconButton,
  Stack,
} from '@mui/material';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Add as AddIcon,
  TrendingUp as IncomeIcon,
  TrendingDown as ExpenseIcon,
  Delete as DeleteIcon,
} from '@mui/icons-material';

interface Transaction {
  id: string;
  type: 'income' | 'expense';
  amount: number;
  description: string;
  category: string;
  date: Date;
}

const BudgetApp: React.FC = () => {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [amount, setAmount] = useState<string>('');
  const [description, setDescription] = useState<string>('');
  const [category, setCategory] = useState<string>('');
  const [type, setType] = useState<'income' | 'expense'>('income');
  const [selectedYear, setSelectedYear] = useState<number>(new Date().getFullYear());
  const [selectedMonth, setSelectedMonth] = useState<number>(new Date().getMonth() + 1);
  const [transactionYear, setTransactionYear] = useState<number>(new Date().getFullYear());
  const [transactionMonth, setTransactionMonth] = useState<number>(new Date().getMonth() + 1);

  const incomeCategories = ['Salary', 'Freelance', 'Investment', 'Other Income'];
  const expenseCategories = ['Food', 'Transport', 'Entertainment', 'Bills', 'Shopping', 'Other'];

  const addTransaction = () => {
    if (!amount || !description || !category) return;

    // Create date with selected year and month (first day of the month)
    const transactionDate = new Date(transactionYear, transactionMonth - 1, 1);

    const newTransaction: Transaction = {
      id: Date.now().toString(),
      type,
      amount: parseFloat(amount),
      description,
      category,
      date: transactionDate,
    };

    setTransactions([newTransaction, ...transactions]);
    setAmount('');
    setDescription('');
    setCategory('');
  };

  const deleteTransaction = (id: string) => {
    setTransactions(transactions.filter(t => t.id !== id));
  };

  // Filter transactions by selected year and month
  const filteredTransactions = transactions.filter(t => {
    const transactionDate = new Date(t.date);
    return (
      transactionDate.getFullYear() === selectedYear &&
      transactionDate.getMonth() + 1 === selectedMonth
    );
  });

  const balance = filteredTransactions.reduce((acc, t) => {
    return t.type === 'income' ? acc + t.amount : acc - t.amount;
  }, 0);

  const totalIncome = filteredTransactions
    .filter(t => t.type === 'income')
    .reduce((acc, t) => acc + t.amount, 0);

  const totalExpenses = filteredTransactions
    .filter(t => t.type === 'expense')
    .reduce((acc, t) => acc + t.amount, 0);

  // Get available years from transactions
  const availableYears = Array.from(
    new Set(transactions.map(t => new Date(t.date).getFullYear()))
  ).sort((a, b) => b - a);

  // If no transactions exist, include current year
  if (availableYears.length === 0) {
    availableYears.push(new Date().getFullYear());
  }

  const months = [
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

  return (
    <Container maxWidth="md" sx={{ py: 4 }}>
      <Typography variant="h4" component="h1" gutterBottom align="center" color="primary">
        Personal Budget Tracker
      </Typography>

      {/* Balance Overview */}
      <Stack direction={{ xs: 'column', md: 'row' }} spacing={3} sx={{ mb: 4 }}>
        <Card sx={{ flex: 1 }}>
          <CardContent sx={{ textAlign: 'center' }}>
            <Typography variant="h6" color="text.secondary">
              Balance
            </Typography>
            <Typography 
              variant="h4" 
              color={balance >= 0 ? 'success.main' : 'error.main'}
              fontWeight="bold"
            >
              ${balance.toFixed(2)}
            </Typography>
          </CardContent>
        </Card>
        <Card sx={{ flex: 1 }}>
          <CardContent sx={{ textAlign: 'center' }}>
            <Box display="flex" alignItems="center" justifyContent="center" gap={1}>
              <IncomeIcon color="success" />
              <Typography variant="h6" color="text.secondary">
                Income
              </Typography>
            </Box>
            <Typography variant="h5" color="success.main" fontWeight="bold">
              ${totalIncome.toFixed(2)}
            </Typography>
          </CardContent>
        </Card>
        <Card sx={{ flex: 1 }}>
          <CardContent sx={{ textAlign: 'center' }}>
            <Box display="flex" alignItems="center" justifyContent="center" gap={1}>
              <ExpenseIcon color="error" />
              <Typography variant="h6" color="text.secondary">
                Expenses
              </Typography>
            </Box>
            <Typography variant="h5" color="error.main" fontWeight="bold">
              ${totalExpenses.toFixed(2)}
            </Typography>
          </CardContent>
        </Card>
      </Stack>

      {/* Category Summary Table */}
      <Paper sx={{ p: 3, mb: 4 }}>
        <Typography variant="h6" gutterBottom>
          Category Summary by Month
        </Typography>
        <Box sx={{ overflowX: 'auto' }}>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="font-medium">Category</TableHead>
                {months.map((month) => (
                  <TableHead key={month.value} className="text-center font-medium">
                    {month.label.slice(0, 3)}
                  </TableHead>
                ))}
                <TableHead className="text-center font-medium">Total</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {/* Income Categories */}
              {incomeCategories.map((category) => {
                const categoryData = months.map((month) => {
                  const sum = transactions
                    .filter(t => 
                      t.type === 'income' && 
                      t.category === category &&
                      new Date(t.date).getFullYear() === selectedYear &&
                      new Date(t.date).getMonth() + 1 === month.value
                    )
                    .reduce((acc, t) => acc + t.amount, 0);
                  return sum;
                });
                const total = categoryData.reduce((acc, val) => acc + val, 0);
                
                return (
                  <TableRow key={category}>
                    <TableCell className="font-medium text-green-600">{category}</TableCell>
                    {categoryData.map((amount, index) => (
                      <TableCell key={index} className="text-center">
                        {amount > 0 ? `$${amount.toFixed(2)}` : '-'}
                      </TableCell>
                    ))}
                    <TableCell className="text-center font-medium text-green-600">
                      {total > 0 ? `$${total.toFixed(2)}` : '-'}
                    </TableCell>
                  </TableRow>
                );
              })}
              
              {/* Expense Categories */}
              {expenseCategories.map((category) => {
                const categoryData = months.map((month) => {
                  const sum = transactions
                    .filter(t => 
                      t.type === 'expense' && 
                      t.category === category &&
                      new Date(t.date).getFullYear() === selectedYear &&
                      new Date(t.date).getMonth() + 1 === month.value
                    )
                    .reduce((acc, t) => acc + t.amount, 0);
                  return sum;
                });
                const total = categoryData.reduce((acc, val) => acc + val, 0);
                
                return (
                  <TableRow key={category}>
                    <TableCell className="font-medium text-red-600">{category}</TableCell>
                    {categoryData.map((amount, index) => (
                      <TableCell key={index} className="text-center">
                        {amount > 0 ? `$${amount.toFixed(2)}` : '-'}
                      </TableCell>
                    ))}
                    <TableCell className="text-center font-medium text-red-600">
                      {total > 0 ? `$${total.toFixed(2)}` : '-'}
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </Box>
      </Paper>

      {/* Main Content - Side by Side */}
      <Stack direction={{ xs: 'column', lg: 'row' }} spacing={3} sx={{ mb: 4 }}>
        {/* Add Transaction Form */}
        <Paper sx={{ p: 3, flex: 1 }}>
          <Typography variant="h6" gutterBottom>
            Add Transaction
          </Typography>
          <Stack spacing={2}>
            <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
              <FormControl fullWidth>
                <InputLabel>Type</InputLabel>
                <Select
                  value={type}
                  label="Type"
                  onChange={(e) => {
                    setType(e.target.value as 'income' | 'expense');
                    setCategory('');
                  }}
                >
                  <MenuItem value="income">Income</MenuItem>
                  <MenuItem value="expense">Expense</MenuItem>
                </Select>
              </FormControl>
              <TextField
                fullWidth
                label="Amount"
                type="number"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                inputProps={{ min: 0, step: 0.01 }}
              />
            </Stack>
            <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
              <FormControl fullWidth>
                <InputLabel>Category</InputLabel>
                <Select
                  value={category}
                  label="Category"
                  onChange={(e) => setCategory(e.target.value)}
                >
                  {(type === 'income' ? incomeCategories : expenseCategories).map((cat) => (
                    <MenuItem key={cat} value={cat}>
                      {cat}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
              <TextField
                fullWidth
                label="Description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              />
            </Stack>
            <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
              <FormControl fullWidth>
                <InputLabel>Year</InputLabel>
                <Select
                  value={transactionYear}
                  label="Year"
                  onChange={(e) => setTransactionYear(Number(e.target.value))}
                >
                  {Array.from({ length: 10 }, (_, i) => new Date().getFullYear() - 5 + i).map((year) => (
                    <MenuItem key={year} value={year}>
                      {year}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
              <FormControl fullWidth>
                <InputLabel>Month</InputLabel>
                <Select
                  value={transactionMonth}
                  label="Month"
                  onChange={(e) => setTransactionMonth(Number(e.target.value))}
                >
                  {months.map((month) => (
                    <MenuItem key={month.value} value={month.value}>
                      {month.label}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Stack>
            <Button
              variant="contained"
              startIcon={<AddIcon />}
              onClick={addTransaction}
              disabled={!amount || !description || !category}
              fullWidth
            >
              Add Transaction
            </Button>
          </Stack>
        </Paper>

        {/* Transaction History */}
        <Paper sx={{ p: 3, flex: 1.5 }}>
        <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
          <Typography variant="h6">
            Transaction History
          </Typography>
          <Stack direction="row" spacing={2}>
            <FormControl size="small" sx={{ minWidth: 120 }}>
              <InputLabel>Year</InputLabel>
              <Select
                value={selectedYear}
                label="Year"
                onChange={(e) => setSelectedYear(Number(e.target.value))}
              >
                {availableYears.map((year) => (
                  <MenuItem key={year} value={year}>
                    {year}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            <FormControl size="small" sx={{ minWidth: 120 }}>
              <InputLabel>Month</InputLabel>
              <Select
                value={selectedMonth}
                label="Month"
                onChange={(e) => setSelectedMonth(Number(e.target.value))}
              >
                {months.map((month) => (
                  <MenuItem key={month.value} value={month.value}>
                    {month.label}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Stack>
        </Box>
        {filteredTransactions.length === 0 ? (
          <Typography color="text.secondary" align="center" sx={{ py: 4 }}>
            {transactions.length === 0 
              ? "No transactions yet. Add your first transaction above!" 
              : `No transactions found for ${months.find(m => m.value === selectedMonth)?.label} ${selectedYear}`
            }
          </Typography>
        ) : (
          <List>
            {filteredTransactions.map((transaction) => (
              <ListItem
                key={transaction.id}
                sx={{
                  border: 1,
                  borderColor: 'divider',
                  borderRadius: 1,
                  mb: 1,
                }}
                secondaryAction={
                  <IconButton 
                    edge="end" 
                    onClick={() => deleteTransaction(transaction.id)}
                    color="error"
                  >
                    <DeleteIcon />
                  </IconButton>
                }
              >
                <ListItemText
                  primary={
                    <Box display="flex" alignItems="center" gap={1}>
                      <Typography variant="body1" fontWeight="medium">
                        {transaction.description}
                      </Typography>
                      <Chip
                        label={transaction.category}
                        size="small"
                        color={transaction.type === 'income' ? 'success' : 'error'}
                        variant="outlined"
                      />
                    </Box>
                  }
                  secondary={
                    <Box display="flex" justifyContent="space-between" alignItems="center">
                      <Typography variant="body2" color="text.secondary">
                        {transaction.date.toLocaleDateString()}
                      </Typography>
                      <Typography
                        variant="h6"
                        color={transaction.type === 'income' ? 'success.main' : 'error.main'}
                        fontWeight="bold"
                      >
                        {transaction.type === 'income' ? '+' : '-'}${transaction.amount.toFixed(2)}
                      </Typography>
                    </Box>
                  }
                />
              </ListItem>
            ))}
          </List>
        )}
        </Paper>
      </Stack>
    </Container>
  );
};

export default BudgetApp;