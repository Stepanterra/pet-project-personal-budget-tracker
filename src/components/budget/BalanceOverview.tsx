import React from 'react';
import { Stack, Card, CardContent, Typography, Box } from '@mui/material';
import { TrendingUp as IncomeIcon, TrendingDown as ExpenseIcon } from '@mui/icons-material';
import { BalanceData } from '@/types/budget';

interface BalanceOverviewProps {
  balanceData: BalanceData;
}

const BalanceOverview: React.FC<BalanceOverviewProps> = ({ balanceData }) => {
  const { balance, totalIncome, totalExpenses } = balanceData;

  return (
    <Stack direction={{ xs: 'column', md: 'row' }} spacing={2} sx={{ mb: 3, flexShrink: 0 }}>
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
  );
};

export default BalanceOverview;