import React, { useEffect, useState } from 'react';
import { Box, Typography, Chip, alpha, CircularProgress, Alert } from '@mui/material';
import { formatZAR, formatDate } from '../../utils/format';
import {
  getTransactions,
  type Transaction,
} from '../../services/dashboardService';

const categoryColors: Record<string, string> = {
  Shopping: '#7C5CFC',
  Groceries: '#00D4AA',
  Entertainment: '#38BDF8',
  Fuel: '#FFB547',
  Transportation: '#A78BFA',
  'Food & Dining': '#FF5A7E',
  Healthcare: '#34D399',
  Other: '#6B7280',
};

const categoryIcons: Record<string, string> = {
  Shopping: '📦',
  Groceries: '🛒',
  Entertainment: '🎬',
  Fuel: '⛽',
  Transportation: '🚗',
  'Food & Dining': '🍔',
  Healthcare: '💊',
  Other: '💳',
};

const RecentTransactions: React.FC = () => {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const formatCurrency = (v: number) => formatZAR(-Math.abs(v), true);

  useEffect(() => {
    const loadTransactions = async () => {
      try {
        const data = await getTransactions();
        setTransactions(data.slice(0, 6));
      } catch {
        setError('Could not load transactions.');
      } finally {
        setLoading(false);
      }
    };

    loadTransactions();
  }, []);

  return (
    <Box
      sx={{
        p: 3,
        borderRadius: 3,
        background: '#161A23',
        border: '1px solid rgba(255,255,255,0.06)',
        height: '100%',
      }}
    >
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          mb: 2.5,
        }}
      >
        <Typography variant="h6" sx={{ fontWeight: 600, fontSize: '1rem' }}>
          Recent Transactions
        </Typography>

        <Typography
          component="a"
          href="#"
          sx={{
            color: 'primary.main',
            fontSize: '0.8rem',
            fontWeight: 600,
            textDecoration: 'none',
            '&:hover': { color: 'primary.light' },
          }}
        >
          View All
        </Typography>
      </Box>

      {loading && (
        <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
          <CircularProgress size={24} />
        </Box>
      )}

      {error && <Alert severity="error">{error}</Alert>}

      {!loading && !error && transactions.length === 0 && (
        <Typography variant="body2" sx={{ color: 'text.secondary' }}>
          No transactions yet.
        </Typography>
      )}

      {!loading && !error && transactions.length > 0 && (
        <Box>
          {transactions.map((txn, idx) => {
            const color = categoryColors[txn.category] || categoryColors.Other;
            const icon = categoryIcons[txn.category] || categoryIcons.Other;
            const isPending = txn.status?.toLowerCase() === 'pending';

            return (
              <Box
                key={txn.id}
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 2,
                  py: 1.5,
                  borderBottom:
                    idx < transactions.length - 1
                      ? '1px solid rgba(255,255,255,0.04)'
                      : 'none',
                  borderRadius: 1,
                  px: 0.5,
                  transition: 'background 0.15s',
                  '&:hover': { backgroundColor: alpha('#fff', 0.02) },
                }}
              >
                <Box
                  sx={{
                    width: 40,
                    height: 40,
                    borderRadius: 2,
                    backgroundColor: alpha(color, 0.12),
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '1.2rem',
                    flexShrink: 0,
                  }}
                >
                  {icon}
                </Box>

                <Box sx={{ flex: 1, minWidth: 0 }}>
                  <Typography
                    variant="body2"
                    sx={{ fontWeight: 600, fontSize: '0.85rem', mb: 0.2 }}
                  >
                    {txn.merchantName}
                  </Typography>
                  <Typography
                    variant="caption"
                    sx={{ color: 'text.secondary', fontSize: '0.72rem' }}
                  >
                    {txn.category}
                  </Typography>
                </Box>

                <Box sx={{ textAlign: 'right', flexShrink: 0 }}>
                  <Typography
                    variant="body2"
                    sx={{
                      fontWeight: 700,
                      fontSize: '0.85rem',
                      mb: 0.2,
                      color: 'text.primary',
                    }}
                  >
                    {formatCurrency(txn.amount)}
                  </Typography>
                  <Typography
                    variant="caption"
                    sx={{ color: 'text.secondary', fontSize: '0.7rem' }}
                  >
                    {formatDate(txn.transactionDate)}
                  </Typography>
                </Box>

                {isPending && (
                  <Chip
                    label="Pending"
                    size="small"
                    sx={{
                      height: 18,
                      fontSize: '0.6rem',
                      fontWeight: 600,
                      backgroundColor: alpha('#FFB547', 0.15),
                      color: '#FFB547',
                    }}
                  />
                )}
              </Box>
            );
          })}
        </Box>
      )}
    </Box>
  );
};

export default RecentTransactions;