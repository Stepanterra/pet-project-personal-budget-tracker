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

  const incomeCategories = ['Salary', 'Freelance', 'Investment', 'Other Income'];
  const expenseCategories = ['Food', 'Transport', 'Entertainment', 'Bills', 'Shopping', 'Other'];

  const addTransaction = () => {
    if (!amount || !description || !category) return;

    const newTransaction: Transaction = {
      id: Date.now().toString(),
      type,
      amount: parseFloat(amount),
      description,
      category,
      date: new Date(),
    };

    setTransactions([newTransaction, ...transactions]);
    setAmount('');
    setDescription('');
    setCategory('');
  };

  const deleteTransaction = (id: string) => {
    setTransactions(transactions.filter(t => t.id !== id));
  };

  const balance = transactions.reduce((acc, t) => {
    return t.type === 'income' ? acc + t.amount : acc - t.amount;
  }, 0);

  const totalIncome = transactions
    .filter(t => t.type === 'income')
    .reduce((acc, t) => acc + t.amount, 0);

  const totalExpenses = transactions
    .filter(t => t.type === 'expense')
    .reduce((acc, t) => acc + t.amount, 0);

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

      {/* Add Transaction Form */}
      <Paper sx={{ p: 3, mb: 4 }}>
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
      <Paper sx={{ p: 3 }}>
        <Typography variant="h6" gutterBottom>
          Transaction History
        </Typography>
        {transactions.length === 0 ? (
          <Typography color="text.secondary" align="center" sx={{ py: 4 }}>
            No transactions yet. Add your first transaction above!
          </Typography>
        ) : (
          <List>
            {transactions.map((transaction) => (
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
    </Container>
  );
};

export default BudgetApp;