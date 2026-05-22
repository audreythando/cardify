import React from 'react';
import { Box, Typography, alpha } from '@mui/material';
import AccountBalanceWalletRoundedIcon from '@mui/icons-material/AccountBalanceWalletRounded';
import CreditScoreRoundedIcon from '@mui/icons-material/CreditScoreRounded';
import ShoppingCartRoundedIcon from '@mui/icons-material/ShoppingCartRounded';
import CardGiftcardRoundedIcon from '@mui/icons-material/CardGiftcardRounded';
import TrendingUpRoundedIcon from '@mui/icons-material/TrendingUpRounded';
import TrendingDownRoundedIcon from '@mui/icons-material/TrendingDownRounded';
import { mockDashboardSummary } from '../../utils/mockData';
import { formatZAR } from '../../utils/format';

const stats = [
  {
    label: 'Total Balance',
    value: formatZAR(mockDashboardSummary.totalBalance),
    change: mockDashboardSummary.totalBalanceChange,
    changeLabel: 'from last month',
    icon: <AccountBalanceWalletRoundedIcon />,
    color: '#7C5CFC',
  },
  {
    label: 'Total Credit Limit',
    value: formatZAR(mockDashboardSummary.totalCreditLimit),
    subValue: `Available: ${formatZAR(mockDashboardSummary.availableCredit)}`,
    icon: <CreditScoreRoundedIcon />,
    color: '#38BDF8',
  },
  {
    label: 'Monthly Spend',
    value: formatZAR(mockDashboardSummary.monthlySpend),
    change: mockDashboardSummary.monthlySpendChange,
    changeLabel: 'from last month',
    icon: <ShoppingCartRoundedIcon />,
    color: '#FF5A7E',
  },
  {
    label: 'Cashback Earned',
    value: formatZAR(mockDashboardSummary.cashbackEarned),
    change: mockDashboardSummary.cashbackChange,
    changeLabel: 'from last month',
    icon: <CardGiftcardRoundedIcon />,
    color: '#00D4AA',
  },
];

const StatCards: React.FC = () => {
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
          <Box sx={{
            display: 'flex',
            alignItems: 'flex-start',
            justifyContent: 'space-between',
            mb: 1.5,
          }}>
            <Typography variant="caption" sx={{
              color: 'text.secondary',
              fontWeight: 500,
              fontSize: '0.75rem',
            }}>
              {stat.label}
            </Typography>
            <Box sx={{
              width: 36,
              height: 36,
              borderRadius: 2,
              backgroundColor: alpha(stat.color, 0.12),
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              '& svg': { fontSize: 18, color: stat.color },
            }}>
              {stat.icon}
            </Box>
          </Box>

          <Typography variant="h5" sx={{ fontWeight: 700, mb: 0.5, fontSize: '1.3rem' }}>
            {stat.value}
          </Typography>

          {stat.subValue && (
            <Typography variant="caption" sx={{ color: 'text.secondary' }}>
              {stat.subValue}
            </Typography>
          )}

          {stat.change !== undefined && (
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, mt: 0.5 }}>
              {stat.change >= 0 ? (
                <TrendingUpRoundedIcon sx={{ fontSize: 14, color: 'success.main' }} />
              ) : (
                <TrendingDownRoundedIcon sx={{ fontSize: 14, color: 'error.main' }} />
              )}
              <Typography variant="caption" sx={{
                color: stat.change >= 0 ? 'success.main' : 'error.main',
                fontWeight: 600,
                fontSize: '0.72rem',
              }}>
                {stat.change >= 0 ? '+' : ''}{stat.change}% {stat.changeLabel}
              </Typography>
            </Box>
          )}
        </Box>
      ))}
    </Box>
  );
};

export default StatCards;