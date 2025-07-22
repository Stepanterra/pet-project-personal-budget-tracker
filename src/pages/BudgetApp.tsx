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
  const [selectedCategory, setSelectedCategory] = useState<string>('');
  const [newCategory, setNewCategory] = useState<string>('');
  const [showAddCategory, setShowAddCategory] = useState<boolean>(false);

  const [incomeCategories, setIncomeCategories] = useState(['Salary', 'Freelance', 'Investment', 'Other Income']);
  const [expenseCategories, setExpenseCategories] = useState(['Food', 'Transport', 'Entertainment', 'Bills', 'Shopping', 'Other']);

  const addTransaction = () => {
    if (!amount || !category) return;

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

  const deleteTransaction = (id: string) => {
    setTransactions(transactions.filter(t => t.id !== id));
  };

  // Filter transactions by selected year and month
  const filteredTransactions = transactions.filter(t => {
    const transactionDate = new Date(t.date);
    const yearMatch = transactionDate.getFullYear() === selectedYear;
    const monthMatch = transactionDate.getMonth() + 1 === selectedMonth;
    const categoryMatch = selectedCategory === '' || t.category === selectedCategory;
    
    return yearMatch && monthMatch && categoryMatch;
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

  // Check if all required fields are filled
  const isFormValid = amount && category && type;

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: 'background.default', px: 2, py: 4 }}>
      <Typography variant="h4" component="h1" gutterBottom align="center" color="primary">
        Personal Budget Tracker
      </Typography>

      {/* Balance Overview */}
      <Stack direction={{ xs: 'column', md: 'row' }} spacing={3} sx={{ mb: 4, maxWidth: '100%' }}>
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

      {/* Main Layout: Table (80%) + Transaction History (20%) */}
      <Box sx={{ display: 'flex', gap: 3, minHeight: 'calc(100vh - 300px)' }}>
        {/* Category Summary Table - 80% */}
        <Paper sx={{ flex: 4, p: 3 }}>
          <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
            <Typography variant="h6">
              Category Summary by Month
            </Typography>
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
          </Box>
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
                {/* Running Balance Row */}
                <TableRow className="bg-blue-50">
                  <TableCell className="font-bold text-blue-700">Running Balance</TableCell>
                  {months.map((month, index) => {
                    // Calculate cumulative running balance from beginning of all time up to this month
                    let runningBalance = 0;
                    
                    // Get all transactions sorted by date
                    const sortedTransactions = [...transactions].sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
                    
                    for (const transaction of sortedTransactions) {
                      const transactionDate = new Date(transaction.date);
                      const transactionYear = transactionDate.getFullYear();
                      const transactionMonth = transactionDate.getMonth() + 1;
                      
                      // Include all transactions up to the target year/month
                      if (transactionYear < selectedYear || 
                          (transactionYear === selectedYear && transactionMonth <= month.value)) {
                        runningBalance += transaction.type === 'income' ? transaction.amount : -transaction.amount;
                      }
                    }
                    
                    const isNegative = runningBalance < 0;
                    
                    return (
                      <TableCell key={month.value} className={`text-center font-bold ${isNegative ? 'text-red-700 bg-red-100' : 'text-blue-700'}`}>
                        ${Math.round(runningBalance)}
                      </TableCell>
                    );
                  })}
                  <TableCell className="text-center font-bold text-blue-700">
                    ${Math.round(transactions
                      .filter(t => new Date(t.date).getFullYear() === selectedYear)
                      .reduce((acc, t) => t.type === 'income' ? acc + t.amount : acc - t.amount, 0)
                    )}
                  </TableCell>
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
                     <TableRow key={category} className="cursor-pointer hover:bg-gray-50" onClick={() => setSelectedCategory(category)}>
                       <TableCell className="font-medium text-green-600">{category}</TableCell>
                       {categoryData.map((amount, index) => (
                         <TableCell key={index} className="text-center cursor-pointer hover:bg-gray-100" 
                           onClick={(e) => {
                             e.stopPropagation();
                             setSelectedCategory(category);
                             setSelectedMonth(index + 1);
                           }}>
                            {amount > 0 ? `$${Math.round(amount)}` : '-'}
                         </TableCell>
                       ))}
                       <TableCell className="text-center font-medium text-green-600">
                          {total > 0 ? `$${Math.round(total)}` : '-'}
                       </TableCell>
                     </TableRow>
                   );
                })}
                
                {/* Income Subtotal */}
                <TableRow className="bg-green-50">
                  <TableCell className="font-bold text-green-700">Income Subtotal</TableCell>
                  {months.map((month) => {
                    const monthlyIncome = transactions
                      .filter(t => 
                        t.type === 'income' &&
                        new Date(t.date).getFullYear() === selectedYear &&
                        new Date(t.date).getMonth() + 1 === month.value
                      )
                      .reduce((acc, t) => acc + t.amount, 0);
                    return (
                      <TableCell key={month.value} className="text-center font-bold text-green-700">
                        {monthlyIncome > 0 ? `$${Math.round(monthlyIncome)}` : '-'}
                      </TableCell>
                    );
                  })}
                  <TableCell className="text-center font-bold text-green-700">
                    ${Math.round(transactions
                      .filter(t => t.type === 'income' && new Date(t.date).getFullYear() === selectedYear)
                      .reduce((acc, t) => acc + t.amount, 0)
                    )}
                  </TableCell>
                </TableRow>
                
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
                     <TableRow key={category} className="cursor-pointer hover:bg-gray-50" onClick={() => setSelectedCategory(category)}>
                       <TableCell className="font-medium text-red-600">{category}</TableCell>
                       {categoryData.map((amount, index) => (
                         <TableCell key={index} className="text-center cursor-pointer hover:bg-gray-100"
                           onClick={(e) => {
                             e.stopPropagation();
                             setSelectedCategory(category);
                             setSelectedMonth(index + 1);
                           }}>
                           {amount > 0 ? `$${Math.round(amount)}` : '-'}
                         </TableCell>
                       ))}
                       <TableCell className="text-center font-medium text-red-600">
                         {total > 0 ? `$${Math.round(total)}` : '-'}
                       </TableCell>
                     </TableRow>
                   );
                })}
                
                {/* Expense Subtotal */}
                <TableRow className="bg-red-50">
                  <TableCell className="font-bold text-red-700">Expense Subtotal</TableCell>
                  {months.map((month) => {
                    const monthlyExpenses = transactions
                      .filter(t => 
                        t.type === 'expense' &&
                        new Date(t.date).getFullYear() === selectedYear &&
                        new Date(t.date).getMonth() + 1 === month.value
                      )
                      .reduce((acc, t) => acc + t.amount, 0);
                    return (
                      <TableCell key={month.value} className="text-center font-bold text-red-700">
                        {monthlyExpenses > 0 ? `$${Math.round(monthlyExpenses)}` : '-'}
                      </TableCell>
                    );
                  })}
                  <TableCell className="text-center font-bold text-red-700">
                    ${Math.round(transactions
                      .filter(t => t.type === 'expense' && new Date(t.date).getFullYear() === selectedYear)
                      .reduce((acc, t) => acc + t.amount, 0)
                    )}
                  </TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </Box>
        </Paper>

        {/* Transaction History + Add Transaction - 20% */}
        <Paper sx={{ flex: 1, p: 3, display: 'flex', flexDirection: 'column' }}>
          {/* Add Transaction Form */}
          <Box sx={{ mb: 3 }}>
            <Typography variant="h6" gutterBottom>
              Add Transaction
            </Typography>
            <Stack spacing={2}>
              <FormControl fullWidth size="small" required>
                <InputLabel>Type *</InputLabel>
                <Select
                  value={type}
                  label="Type *"
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
                size="small"
                label="Amount *"
                type="number"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                inputProps={{ min: 0, step: 0.01 }}
                required
              />
              <Stack direction="row" spacing={1} alignItems="flex-end">
                <FormControl fullWidth size="small" required sx={{ flex: 1 }}>
                  <InputLabel>Category *</InputLabel>
                  <Select
                    value={category}
                    label="Category *"
                    onChange={(e) => setCategory(e.target.value)}
                  >
                    {(type === 'income' ? incomeCategories : expenseCategories).map((cat) => (
                      <MenuItem key={cat} value={cat}>
                        {cat}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
                <Button
                  size="small"
                  variant="outlined"
                  onClick={() => setShowAddCategory(!showAddCategory)}
                  sx={{ minWidth: 'auto', px: 1 }}
                >
                  +
                </Button>
              </Stack>
              
              {showAddCategory && (
                <Stack direction="row" spacing={1}>
                  <TextField
                    fullWidth
                    size="small"
                    label="New Category"
                    value={newCategory}
                    onChange={(e) => setNewCategory(e.target.value)}
                    placeholder={`Add ${type} category`}
                  />
                  <Button
                    size="small"
                    variant="contained"
                    onClick={addCategory}
                    disabled={!newCategory.trim()}
                  >
                    Add
                  </Button>
                  <Button
                    size="small"
                    variant="outlined"
                    onClick={() => {
                      setShowAddCategory(false);
                      setNewCategory('');
                    }}
                  >
                    Cancel
                  </Button>
                </Stack>
              )}
              <TextField
                fullWidth
                size="small"
                label="Description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              />
              <Stack direction="row" spacing={1}>
                <FormControl fullWidth size="small">
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
                <FormControl fullWidth size="small">
                  <InputLabel>Month</InputLabel>
                  <Select
                    value={transactionMonth}
                    label="Month"
                    onChange={(e) => setTransactionMonth(Number(e.target.value))}
                  >
                    {months.map((month) => (
                      <MenuItem key={month.value} value={month.value}>
                        {month.label.slice(0, 3)}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Stack>
              <Button
                variant="contained"
                startIcon={<AddIcon />}
                onClick={addTransaction}
                fullWidth
                size="small"
                disabled={!isFormValid}
                sx={{
                  bgcolor: isFormValid ? 'primary.main' : 'grey.400',
                  '&:hover': {
                    bgcolor: isFormValid ? 'primary.dark' : 'grey.400',
                  }
                }}
              >
                Add
              </Button>
            </Stack>
          </Box>

          {/* Transaction History */}
          <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
            <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
              <Typography variant="h6">
                History
              </Typography>
              <Stack direction="row" spacing={1}>
                <FormControl size="small" sx={{ minWidth: 80 }}>
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
                <FormControl size="small" sx={{ minWidth: 80 }}>
                  <InputLabel>Month</InputLabel>
                  <Select
                    value={selectedMonth}
                    label="Month"
                    onChange={(e) => setSelectedMonth(Number(e.target.value))}
                  >
                    {months.map((month) => (
                      <MenuItem key={month.value} value={month.value}>
                        {month.label.slice(0, 3)}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Stack>
            </Box>
            
            {selectedCategory && (
              <Box mb={2}>
                <Chip 
                  label={selectedCategory}
                  onDelete={() => setSelectedCategory('')}
                  color="primary"
                  variant="outlined"
                  size="small"
                />
              </Box>
            )}

            <List sx={{ flex: 1, overflow: 'auto', maxHeight: 'calc(100vh - 600px)' }}>
              {filteredTransactions.length === 0 ? (
                <Typography color="text.secondary" align="center" sx={{ py: 2 }}>
                  No transactions
                </Typography>
              ) : (
                filteredTransactions.map((transaction) => (
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
                      <IconButton
                        edge="end"
                        onClick={() => deleteTransaction(transaction.id)}
                        color="error"
                        size="small"
                      >
                        <DeleteIcon fontSize="small" />
                      </IconButton>
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
        </Paper>
      </Box>
    </Box>
  );
};

export default BudgetApp;