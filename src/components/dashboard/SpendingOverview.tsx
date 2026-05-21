import React, { useState } from 'react';
import { Box, Typography, Select, MenuItem, alpha } from '@mui/material';
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from 'recharts';
import { mockSpendingOverview } from '../../utils/mockData';

const SpendingOverview: React.FC = () => {
  const [period, setPeriod] = useState('this_month');
  const { totalSpend, categories } = mockSpendingOverview;

  const formatCurrency = (v: number) =>
    new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(v);

  const tooltipFormatter = (value: unknown) => {
    return [formatCurrency(value as number), ''];
  };

  return (
    <Box sx={{
      p: 3, borderRadius: 3,
      background: '#161A23',
      border: '1px solid rgba(255,255,255,0.06)',
      height: '100%',
    }}>
      <Box sx={{
        display: 'flex', alignItems: 'center',
        justifyContent: 'space-between', mb: 3,
      }}>
        <Typography variant="h6" sx={{ fontWeight: 600, fontSize: '1rem' }}>
          Spending Overview
        </Typography>
        <Select
          value={period}
          onChange={(e) => setPeriod(e.target.value)}
          size="small"
          sx={{
            fontSize: '0.75rem',
            borderRadius: 2,
            '& .MuiSelect-select': { py: 0.7, px: 1.5 },
            '& .MuiOutlinedInput-notchedOutline': {
              borderColor: 'rgba(255,255,255,0.1)',
            },
          }}
        >
          <MenuItem value="this_month">This Month</MenuItem>
          <MenuItem value="last_month">Last Month</MenuItem>
          <MenuItem value="last_3months">Last 3 Months</MenuItem>
        </Select>
      </Box>

      <Box sx={{ display: 'flex', alignItems: 'center', gap: 3 }}>
        <Box sx={{ position: 'relative', width: 180, height: 180, flexShrink: 0 }}>
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={categories}
                cx="50%"
                cy="50%"
                innerRadius={58}
                outerRadius={85}
                paddingAngle={2}
                dataKey="amount"
                stroke="none"
              >
                {categories.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip
                formatter={tooltipFormatter}
                contentStyle={{
                  backgroundColor: '#1E2330',
                  border: '1px solid rgba(255,255,255,0.1)',
                  borderRadius: 12,
                  fontSize: 12,
                }}
              />
            </PieChart>
          </ResponsiveContainer>

          <Box sx={{
            position: 'absolute', inset: 0,
            display: 'flex', flexDirection: 'column',
            alignItems: 'center', justifyContent: 'center',
            pointerEvents: 'none',
          }}>
            <Typography sx={{ fontSize: '1rem', fontWeight: 700 }}>
              {formatCurrency(totalSpend)}
            </Typography>
            <Typography sx={{ fontSize: '0.65rem', color: 'text.secondary' }}>
              Total Spend
            </Typography>
          </Box>
        </Box>

        <Box sx={{ flex: 1 }}>
          {categories.map((cat) => (
            <Box key={cat.category} sx={{
              display: 'flex', alignItems: 'center',
              justifyContent: 'space-between', mb: 1.2,
            }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <Box sx={{
                  width: 8, height: 8, borderRadius: '50%',
                  backgroundColor: cat.color, flexShrink: 0,
                }} />
                <Typography variant="caption" sx={{
                  color: 'text.secondary', fontSize: '0.78rem',
                }}>
                  {cat.category}
                </Typography>
              </Box>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                <Typography variant="caption" sx={{ fontWeight: 600, fontSize: '0.78rem' }}>
                  {formatCurrency(cat.amount)}
                </Typography>
                <Typography variant="caption" sx={{
                  fontSize: '0.72rem',
                  backgroundColor: alpha(cat.color, 0.12),
                  color: cat.color,
                  px: 0.7, py: 0.1, borderRadius: 1, fontWeight: 600,
                }}>
                  {cat.percentage}%
                </Typography>
              </Box>
            </Box>
          ))}
        </Box>
      </Box>

      <Box sx={{ mt: 2.5, pt: 2, borderTop: '1px solid rgba(255,255,255,0.05)' }}>
        <Typography
          component="a" href="#"
          sx={{
            color: 'primary.main', fontSize: '0.8rem',
            fontWeight: 600, textDecoration: 'none',
            '&:hover': { color: 'primary.light' },
          }}
        >
          View Full Analytics →
        </Typography>
      </Box>
    </Box>
  );
};

export default SpendingOverview;