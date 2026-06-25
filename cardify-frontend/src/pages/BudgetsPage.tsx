import React, { useEffect, useState } from 'react';
import {
  Box, Typography, Button, LinearProgress,
  alpha, CircularProgress, Alert,
  Dialog, DialogTitle, DialogContent, DialogActions,
  TextField, MenuItem,
} from '@mui/material';
import AddRoundedIcon from '@mui/icons-material/AddRounded';
import TrendingUpRoundedIcon from '@mui/icons-material/TrendingUpRounded';
import TrendingDownRoundedIcon from '@mui/icons-material/TrendingDownRounded';
import WarningAmberRoundedIcon from '@mui/icons-material/WarningAmberRounded';
import CheckCircleRoundedIcon from '@mui/icons-material/CheckCircleRounded';
import { formatZAR } from '../utils/format';
import { getBudgets, createBudget, type Budget } from '../services/budgetsService';

const categoryEmojis: Record<string, string> = {
  Shopping: '🛍️',
  Groceries: '🛒',
  Entertainment: '🎬',
  Transportation: '🚗',
  Healthcare: '❤️',
  'Food & Dining': '🍔',
  'Bills & Utilities': '💡',
  Fuel: '⛽',
  Travel: '✈️',
  Other: '📦',
};

const CATEGORY_OPTIONS = [
  'Groceries', 'Shopping', 'Entertainment', 'Transportation',
  'Healthcare', 'Food & Dining', 'Bills & Utilities', 'Fuel', 'Travel', 'Other',
];

const BudgetsPage: React.FC = () => {
  const [budgets, setBudgets] = useState<Budget[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Add-budget dialog
  const [addOpen, setAddOpen] = useState(false);
  const [saving, setSaving] = useState(false);
  const [formError, setFormError] = useState('');
  const [form, setForm] = useState({ category: 'Groceries', limitAmount: '' });

  const loadBudgets = async () => {
    try {
      const data = await getBudgets();
      setBudgets(data);
    } catch {
      setError('Could not load budgets.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadBudgets();
  }, []);

  const resetForm = () => {
    setForm({ category: 'Groceries', limitAmount: '' });
    setFormError('');
  };

  const closeAddDialog = () => {
    setAddOpen(false);
    resetForm();
  };

  const handleCreateBudget = async () => {
    setFormError('');

    const limit = parseFloat(form.limitAmount);
    if (isNaN(limit) || limit <= 0) {
      setFormError('Enter a valid limit amount.');
      return;
    }

    setSaving(true);
    try {
      await createBudget({ category: form.category, limitAmount: limit });
      closeAddDialog();
      await loadBudgets();
    } catch {
      setFormError('Could not add budget. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  const addBudgetDialog = (
    <Dialog open={addOpen} onClose={closeAddDialog} maxWidth="xs" fullWidth>
      <DialogTitle>Add Budget</DialogTitle>
      <DialogContent sx={{ display: 'flex', flexDirection: 'column', gap: 2, pt: 1 }}>
        {formError && <Alert severity="error">{formError}</Alert>}

        <TextField
          label="Category"
          size="small"
          fullWidth
          select
          value={form.category}
          onChange={(e) => setForm({ ...form, category: e.target.value })}
        >
          {CATEGORY_OPTIONS.map((c) => (
            <MenuItem key={c} value={c}>
              {categoryEmojis[c] ?? '📦'} {c}
            </MenuItem>
          ))}
        </TextField>

        <TextField
          label="Monthly Limit (R)"
          size="small"
          fullWidth
          type="number"
          value={form.limitAmount}
          onChange={(e) => setForm({ ...form, limitAmount: e.target.value })}
        />

        <Typography variant="caption" sx={{ color: 'text.secondary' }}>
          Spending updates automatically as you add transactions in this category.
        </Typography>
      </DialogContent>
      <DialogActions sx={{ px: 3, pb: 2 }}>
        <Button onClick={closeAddDialog} color="inherit">Cancel</Button>
        <Button onClick={handleCreateBudget} variant="contained" disabled={saving}>
          {saving ? 'Adding…' : 'Add Budget'}
        </Button>
      </DialogActions>
    </Dialog>
  );

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', mt: 6 }}>
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return <Alert severity="error">{error}</Alert>;
  }

  const totalBudget = budgets.reduce((s, b) => s + b.limitAmount, 0);
  const totalSpent = budgets.reduce((s, b) => s + b.currentSpent, 0);
  const totalRemaining = totalBudget - totalSpent;
  const overallPct = totalBudget === 0 ? 0 : (totalSpent / totalBudget) * 100;
  const overallColor = overallPct > 90 ? '#FF5A7E' : overallPct > 70 ? '#FFB547' : '#00D4AA';

  return (
    <Box>
      <Box sx={{
        p: 3, borderRadius: 3, mb: 3,
        background: 'linear-gradient(135deg, rgba(124,92,252,0.12) 0%, rgba(0,212,170,0.06) 100%)',
        border: '1px solid', borderColor: alpha('#7C5CFC', 0.2),
      }}>
        <Box sx={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', mb: 2.5, flexWrap: 'wrap', gap: 2 }}>
          <Box>
            <Typography variant="h6" sx={{ fontWeight: 700, mb: 0.3 }}>
              Monthly Budget Overview
            </Typography>
            <Typography variant="body2" sx={{ color: 'text.secondary' }}>
              {budgets.length} budget{budgets.length === 1 ? '' : 's'} set
            </Typography>
          </Box>
          <Button
            variant="contained"
            startIcon={<AddRoundedIcon />}
            size="small"
            onClick={() => setAddOpen(true)}
            sx={{ borderRadius: 2 }}
          >
            Add Budget
          </Button>
        </Box>

        <Box sx={{ display: 'flex', gap: 2, mb: 2.5, flexWrap: 'wrap' }}>
          {[
            { label: 'Total Budget', value: formatZAR(totalBudget), color: '#7C5CFC' },
            { label: 'Total Spent', value: formatZAR(totalSpent), color: overallColor },
            { label: 'Remaining', value: formatZAR(totalRemaining), color: '#00D4AA' },
          ].map(stat => (
            <Box key={stat.label} sx={{
              flex: 1, minWidth: 120, p: 2, borderRadius: 2.5,
              backgroundColor: alpha('#000', 0.2),
              border: '1px solid rgba(255,255,255,0.06)',
            }}>
              <Typography variant="caption" sx={{ color: 'text.secondary', display: 'block', mb: 0.5 }}>
                {stat.label}
              </Typography>
              <Typography variant="h6" sx={{ fontWeight: 700, color: stat.color, fontSize: '1.1rem' }}>
                {stat.value}
              </Typography>
            </Box>
          ))}
        </Box>

        <Box>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
            <Typography variant="caption" sx={{ color: 'text.secondary' }}>
              Overall spend
            </Typography>
            <Typography variant="caption" sx={{ fontWeight: 700, color: overallColor }}>
              {overallPct.toFixed(0)}% used
            </Typography>
          </Box>
          <LinearProgress
            variant="determinate"
            value={Math.min(overallPct, 100)}
            sx={{
              height: 10, borderRadius: 5,
              backgroundColor: 'rgba(255,255,255,0.06)',
              '& .MuiLinearProgress-bar': {
                borderRadius: 5,
                backgroundColor: overallColor,
              },
            }}
          />
        </Box>
      </Box>

      <Box sx={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
        gap: 2.5,
      }}>
        {budgets.map((budget) => {
          const pct = budget.limitAmount === 0 ? 0 : (budget.currentSpent / budget.limitAmount) * 100;
          const remaining = budget.limitAmount - budget.currentSpent;
          const isOver = pct >= 100;
          const isWarning = pct >= 80 && pct < 100;

          const barColor = isOver ? '#FF5A7E' : isWarning ? '#FFB547' : '#00D4AA';
          const statusIcon = isOver
            ? <WarningAmberRoundedIcon sx={{ fontSize: 16, color: '#FF5A7E' }} />
            : isWarning
            ? <WarningAmberRoundedIcon sx={{ fontSize: 16, color: '#FFB547' }} />
            : <CheckCircleRoundedIcon sx={{ fontSize: 16, color: '#00D4AA' }} />;

          const statusLabel = isOver ? 'Over budget' : isWarning ? 'Almost full' : 'On track';
          const statusColor = isOver ? '#FF5A7E' : isWarning ? '#FFB547' : '#00D4AA';

          return (
            <Box
              key={budget.id}
              sx={{
                p: 2.5, borderRadius: 3,
                background: '#161A23',
                border: '1px solid',
                borderColor: isOver
                  ? alpha('#FF5A7E', 0.2)
                  : isWarning
                  ? alpha('#FFB547', 0.15)
                  : 'rgba(255,255,255,0.06)',
                transition: 'all 0.2s ease',
                '&:hover': {
                  transform: 'translateY(-2px)',
                  boxShadow: `0 8px 24px ${alpha(barColor, 0.1)}`,
                },
              }}
            >
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                  <Box sx={{
                    width: 40, height: 40, borderRadius: 2,
                    backgroundColor: alpha(barColor, 0.12),
                    display: 'flex', alignItems: 'center',
                    justifyContent: 'center', fontSize: '1.2rem',
                  }}>
                    {categoryEmojis[budget.category] || '📦'}
                  </Box>
                  <Box>
                    <Typography variant="body2" sx={{ fontWeight: 700 }}>
                      {budget.category}
                    </Typography>
                    <Typography variant="caption" sx={{ color: 'text.secondary', fontSize: '0.7rem' }}>
                      Monthly budget
                    </Typography>
                  </Box>
                </Box>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                  {statusIcon}
                  <Typography variant="caption" sx={{ color: statusColor, fontWeight: 600, fontSize: '0.72rem' }}>
                    {statusLabel}
                  </Typography>
                </Box>
              </Box>

              <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1.5 }}>
                <Box>
                  <Typography variant="caption" sx={{ color: 'text.secondary', display: 'block', mb: 0.2 }}>
                    Spent
                  </Typography>
                  <Typography variant="body1" sx={{ fontWeight: 700, fontSize: '1rem' }}>
                    {formatZAR(budget.currentSpent)}
                  </Typography>
                </Box>
                <Box sx={{ textAlign: 'right' }}>
                  <Typography variant="caption" sx={{ color: 'text.secondary', display: 'block', mb: 0.2 }}>
                    {isOver ? 'Over by' : 'Remaining'}
                  </Typography>
                  <Typography variant="body1" sx={{
                    fontWeight: 700, fontSize: '1rem',
                    color: isOver ? '#FF5A7E' : 'text.primary',
                  }}>
                    {formatZAR(Math.abs(remaining))}
                  </Typography>
                </Box>
              </Box>

              <LinearProgress
                variant="determinate"
                value={Math.min(pct, 100)}
                sx={{
                  height: 8, borderRadius: 4, mb: 1.5,
                  backgroundColor: 'rgba(255,255,255,0.06)',
                  '& .MuiLinearProgress-bar': {
                    borderRadius: 4,
                    backgroundColor: barColor,
                  },
                }}
              />

              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Typography variant="caption" sx={{ color: 'text.secondary', fontSize: '0.72rem' }}>
                  Limit: {formatZAR(budget.limitAmount)}
                </Typography>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                  {pct < 80 ? (
                    <TrendingDownRoundedIcon sx={{ fontSize: 14, color: '#00D4AA' }} />
                  ) : (
                    <TrendingUpRoundedIcon sx={{ fontSize: 14, color: barColor }} />
                  )}
                  <Typography variant="caption" sx={{
                    fontWeight: 700, fontSize: '0.72rem', color: barColor,
                  }}>
                    {pct.toFixed(0)}%
                  </Typography>
                </Box>
              </Box>
            </Box>
          );
        })}

        <Box
          onClick={() => setAddOpen(true)}
          sx={{
            p: 2.5, borderRadius: 3, cursor: 'pointer',
            border: '2px dashed rgba(255,255,255,0.08)',
            display: 'flex', flexDirection: 'column',
            alignItems: 'center', justifyContent: 'center',
            gap: 1.5, minHeight: 200,
            transition: 'all 0.2s ease',
            '&:hover': {
              borderColor: 'primary.main',
              backgroundColor: alpha('#7C5CFC', 0.04),
            },
          }}
        >
          <Box sx={{
            width: 44, height: 44, borderRadius: 2,
            backgroundColor: alpha('#7C5CFC', 0.1),
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>
            <AddRoundedIcon sx={{ color: 'primary.main', fontSize: 22 }} />
          </Box>
          <Box sx={{ textAlign: 'center' }}>
            <Typography variant="body2" sx={{ fontWeight: 600, mb: 0.3 }}>
              Add a new budget
            </Typography>
            <Typography variant="caption" sx={{ color: 'text.secondary' }}>
              Set a spending limit for any category
            </Typography>
          </Box>
        </Box>
      </Box>

      {addBudgetDialog}
    </Box>
  );
};

export default BudgetsPage;