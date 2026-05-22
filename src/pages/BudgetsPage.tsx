import React, { useState } from 'react';
import {
  Box, Typography, Button, LinearProgress,
  alpha, Chip
} from '@mui/material';
import AddRoundedIcon from '@mui/icons-material/AddRounded';
import TrendingUpRoundedIcon from '@mui/icons-material/TrendingUpRounded';
import TrendingDownRoundedIcon from '@mui/icons-material/TrendingDownRounded';
import WarningAmberRoundedIcon from '@mui/icons-material/WarningAmberRounded';
import CheckCircleRoundedIcon from '@mui/icons-material/CheckCircleRounded';
import { mockBudgets} from '../utils/mockData';
import { formatZAR } from '../utils/format';

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

const BudgetsPage: React.FC = () => {
  const [budgets] = useState(mockBudgets);

  const totalBudget = budgets.reduce((s, b) => s + b.limit, 0);
  const totalSpent = budgets.reduce((s, b) => s + b.spent, 0);
  const totalRemaining = totalBudget - totalSpent;
  const overallPct = (totalSpent / totalBudget) * 100;
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
              May 2024 · Resets in 9 days
            </Typography>
          </Box>
          <Button
            variant="contained"
            startIcon={<AddRoundedIcon />}
            size="small"
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
        p: 2, borderRadius: 3, mb: 3,
        backgroundColor: alpha('#FFB547', 0.08),
        border: '1px solid', borderColor: alpha('#FFB547', 0.2),
        display: 'flex', alignItems: 'center', gap: 1.5,
      }}>
        <WarningAmberRoundedIcon sx={{ color: '#FFB547', fontSize: 20, flexShrink: 0 }} />
        <Typography variant="body2" sx={{ color: 'text.primary', fontSize: '0.85rem' }}>
          <strong>AI Insight:</strong> Your Shopping budget is at 90% with 9 days remaining.
          Consider pausing non-essential purchases to stay within budget.
        </Typography>
        <Chip
          label="AI Powered"
          size="small"
          sx={{
            ml: 'auto', flexShrink: 0,
            height: 20, fontSize: '0.6rem', fontWeight: 700,
            background: 'linear-gradient(135deg, #7C5CFC, #00D4AA)',
            color: '#fff',
          }}
        />
      </Box>

      <Box sx={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
        gap: 2.5,
      }}>
        {budgets.map((budget) => {
          const pct = (budget.spent / budget.limit) * 100;
          const remaining = budget.limit - budget.spent;
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
                    <Typography variant="caption" sx={{ color: 'text.secondary', fontSize: '0.7rem', textTransform: 'capitalize' }}>
                      {budget.period} budget
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
                    {formatZAR(budget.spent)}
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
                  Limit: {formatZAR(budget.limit)}
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

        <Box sx={{
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
        }}>
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

      <Box sx={{ mt: 3, p: 3, borderRadius: 3, background: '#161A23', border: '1px solid rgba(255,255,255,0.06)' }}>
        <Typography variant="body2" sx={{ fontWeight: 700, mb: 2 }}>
          💡 Budget Tips from your AI Assistant
        </Typography>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
          {[
            { tip: 'The 50/30/20 rule: 50% needs, 30% wants, 20% savings. Your current split is 61% / 25% / 14%.', color: '#7C5CFC' },
            { tip: 'Your groceries budget has R566.70 left — you\'re doing great this month!', color: '#00D4AA' },
            { tip: 'Shopping is your biggest category. Setting a lower limit could save you R1,200/month.', color: '#FFB547' },
          ].map((item, idx) => (
            <Box key={idx} sx={{
              display: 'flex', gap: 1.5, p: 1.5, borderRadius: 2,
              backgroundColor: alpha(item.color, 0.06),
              border: '1px solid', borderColor: alpha(item.color, 0.12),
            }}>
              <Box sx={{ width: 3, borderRadius: 2, backgroundColor: item.color, flexShrink: 0 }} />
              <Typography variant="caption" sx={{ color: 'text.secondary', lineHeight: 1.6, fontSize: '0.8rem' }}>
                {item.tip}
              </Typography>
            </Box>
          ))}
        </Box>
      </Box>
    </Box>
  );
};

export default BudgetsPage;