import React from 'react';
import { Box, Typography, alpha } from '@mui/material';
import AccountBalanceWalletRoundedIcon from '@mui/icons-material/AccountBalanceWalletRounded';
import CreditScoreRoundedIcon from '@mui/icons-material/CreditScoreRounded';
import ShoppingCartRoundedIcon from '@mui/icons-material/ShoppingCartRounded';
import ReceiptLongRoundedIcon from '@mui/icons-material/ReceiptLongRounded';
import { formatZAR } from '../../utils/format';
import type { DashboardSummary } from '../../services/dashboardService';

interface StatCardsProps {
  summary: DashboardSummary;
}

const StatCards: React.FC<StatCardsProps> = ({ summary }) => {
  const stats = [
    {
      label: 'Total Balance',
      value: formatZAR(summary.totalBalance),
      subValue: `${summary.totalCards} active card${summary.totalCards === 1 ? '' : 's'}`,
      icon: <AccountBalanceWalletRoundedIcon />,
      color: '#7C5CFC',
    },
    {
      label: 'Total Credit Limit',
      value: formatZAR(summary.totalCreditLimit),
      subValue: `Available: ${formatZAR(summary.availableCredit)}`,
      icon: <CreditScoreRoundedIcon />,
      color: '#38BDF8',
    },
    {
      label: 'Monthly Spend',
      value: formatZAR(summary.totalSpentThisMonth),
      subValue: 'Spent this month',
      icon: <ShoppingCartRoundedIcon />,
      color: '#FF5A7E',
    },
    {
      label: 'Transactions',
      value: summary.totalTransactions.toString(),
      subValue: `${summary.totalBudgets} budget${summary.totalBudgets === 1 ? '' : 's'} tracked`,
      icon: <ReceiptLongRoundedIcon />,
      color: '#00D4AA',
    },
  ];

  return (
    <Box
      sx={{
        display: 'grid',
        gridTemplateColumns: {
          xs: '1fr',
          sm: '1fr 1fr',
          lg: '1fr 1fr 1fr 1fr',
        },
        gap: 2.5,
      }}
    >
      {stats.map((stat) => (
        <Box
          key={stat.label}
          sx={{
            p: 2.5,
            borderRadius: 3,
            background: '#161A23',
            border: '1px solid rgba(255,255,255,0.06)',
            transition: 'all 0.2s ease',
            '&:hover': {
              border: `1px solid ${alpha(stat.color, 0.3)}`,
              transform: 'translateY(-2px)',
              boxShadow: `0 8px 24px ${alpha(stat.color, 0.1)}`,
            },
          }}
        >
          <Box
            sx={{
              display: 'flex',
              alignItems: 'flex-start',
              justifyContent: 'space-between',
              mb: 1.5,
            }}
          >
            <Typography
              variant="caption"
              sx={{
                color: 'text.secondary',
                fontWeight: 500,
                fontSize: '0.75rem',
              }}
            >
              {stat.label}
            </Typography>

            <Box
              sx={{
                width: 36,
                height: 36,
                borderRadius: 2,
                backgroundColor: alpha(stat.color, 0.12),
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                '& svg': { fontSize: 18, color: stat.color },
              }}
            >
              {stat.icon}
            </Box>
          </Box>

          <Typography
            variant="h5"
            sx={{ fontWeight: 700, mb: 0.5, fontSize: '1.3rem' }}
          >
            {stat.value}
          </Typography>

          <Typography variant="caption" sx={{ color: 'text.secondary' }}>
            {stat.subValue}
          </Typography>
        </Box>
      ))}
    </Box>
  );
};

export default StatCards;