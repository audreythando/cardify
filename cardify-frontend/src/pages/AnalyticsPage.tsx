import React, { useState } from 'react';
import {
  Box, Typography, alpha, ToggleButton, ToggleButtonGroup
} from '@mui/material';
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer,
  LineChart, Line, CartesianGrid, Legend, PieChart, Pie, Cell
} from 'recharts';
import { mockSpendingOverview, mockTransactions } from '../utils/mockData';
import { formatZAR } from '../utils/format';

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <Box sx={{
        backgroundColor: '#1E2330',
        border: '1px solid rgba(255,255,255,0.1)',
        borderRadius: 2, p: 1.5,
      }}>
        <Typography variant="caption" sx={{ color: 'text.secondary', display: 'block', mb: 0.5 }}>
          {label}
        </Typography>
        {payload.map((p: any) => (
          <Typography key={p.name} variant="caption" sx={{ color: p.color, display: 'block', fontWeight: 600 }}>
            {p.name}: {formatZAR(p.value)}
          </Typography>
        ))}
      </Box>
    );
  }
  return null;
};

const AnalyticsPage: React.FC = () => {
  const [period, setPeriod] = useState('monthly');
  const { categories, monthlyTrend } = mockSpendingOverview;

  const dayPattern = [
    { day: 'Mon', amount: 1240 },
    { day: 'Tue', amount: 890 },
    { day: 'Wed', amount: 2100 },
    { day: 'Thu', amount: 1560 },
    { day: 'Fri', amount: 3200 },
    { day: 'Sat', amount: 4100 },
    { day: 'Sun', amount: 980 },
  ];

  const topMerchants = mockTransactions
    .filter(t => t.amount < 0)
    .reduce((acc, t) => {
      acc[t.merchantName] = (acc[t.merchantName] || 0) + Math.abs(t.amount);
      return acc;
    }, {} as Record<string, number>);

  const merchantList = Object.entries(topMerchants)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5);

  const totalMerchantSpend = merchantList.reduce((s, [, v]) => s + v, 0);

  const colors = ['#7C5CFC', '#FF5A7E', '#FFB547', '#00D4AA', '#38BDF8'];

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'flex-end', mb: 3 }}>
        <ToggleButtonGroup
          value={period}
          exclusive
          onChange={(_, v) => v && setPeriod(v)}
          size="small"
          sx={{
            '& .MuiToggleButton-root': {
              borderColor: 'rgba(255,255,255,0.1)',
              color: 'text.secondary',
              fontSize: '0.75rem',
              px: 2,
              '&.Mui-selected': {
                backgroundColor: alpha('#7C5CFC', 0.2),
                color: 'primary.main',
                borderColor: alpha('#7C5CFC', 0.3),
              },
            },
          }}
        >
          <ToggleButton value="weekly">Weekly</ToggleButton>
          <ToggleButton value="monthly">Monthly</ToggleButton>
          <ToggleButton value="yearly">Yearly</ToggleButton>
        </ToggleButtonGroup>
      </Box>
      <Box sx={{ display: 'flex', gap: 3, mb: 3, flexWrap: 'wrap' }}>

        <Box sx={{
          flex: 2, minWidth: 280, p: 3, borderRadius: 3,
          background: '#161A23',
          border: '1px solid rgba(255,255,255,0.06)',
        }}>
          <Typography variant="h6" sx={{ fontWeight: 600, fontSize: '1rem', mb: 0.5 }}>
            Spend vs Budget
          </Typography>
          <Typography variant="caption" sx={{ color: 'text.secondary', display: 'block', mb: 3 }}>
            Monthly spending compared to your R15,000 budget
          </Typography>
          <ResponsiveContainer width="100%" height={240}>
            <BarChart data={monthlyTrend} barGap={4}>
              <CartesianGrid vertical={false} stroke="rgba(255,255,255,0.04)" />
              <XAxis
                dataKey="month"
                axisLine={false} tickLine={false}
                tick={{ fill: '#8892A4', fontSize: 12 }}
              />
              <YAxis
                axisLine={false} tickLine={false}
                tick={{ fill: '#8892A4', fontSize: 11 }}
                tickFormatter={(v) => `R${(v / 1000).toFixed(0)}k`}
              />
              <Tooltip content={<CustomTooltip />} />
              <Legend wrapperStyle={{ fontSize: '0.75rem', paddingTop: '16px' }} />
              <Bar dataKey="amount" name="Spent" fill="#7C5CFC" radius={[4, 4, 0, 0]} />
              <Bar dataKey="budget" name="Budget" fill="rgba(255,255,255,0.06)" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </Box>

        <Box sx={{
          flex: 1, minWidth: 240, p: 3, borderRadius: 3,
          background: '#161A23',
          border: '1px solid rgba(255,255,255,0.06)',
        }}>
          <Typography variant="h6" sx={{ fontWeight: 600, fontSize: '1rem', mb: 3 }}>
            By Category
          </Typography>
          <ResponsiveContainer width="100%" height={180}>
            <PieChart>
              <Pie data={categories} cx="50%" cy="50%" outerRadius={80} dataKey="amount" stroke="none">
                {categories.map((entry, index) => (
                  <Cell key={index} fill={entry.color} />
                ))}
              </Pie>
                        <Tooltip
                formatter={(v) => [formatZAR(Number(v)), '']}
                contentStyle={{
                  backgroundColor: '#1E2330',
                  border: '1px solid rgba(255,255,255,0.1)',
                  borderRadius: 12, fontSize: 12,
                }}
              />
            </PieChart>
          </ResponsiveContainer>
          <Box sx={{ mt: 2 }}>
            {categories.slice(0, 4).map(cat => (
              <Box key={cat.category} sx={{
                display: 'flex', alignItems: 'center',
                justifyContent: 'space-between', mb: 1,
              }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <Box sx={{ width: 8, height: 8, borderRadius: '50%', backgroundColor: cat.color }} />
                  <Typography variant="caption" sx={{ color: 'text.secondary', fontSize: '0.75rem' }}>
                    {cat.category}
                  </Typography>
                </Box>
                <Typography variant="caption" sx={{ fontWeight: 600, fontSize: '0.75rem' }}>
                  {cat.percentage}%
                </Typography>
              </Box>
            ))}
          </Box>
        </Box>
      </Box>

      <Box sx={{ display: 'flex', gap: 3, mb: 3, flexWrap: 'wrap' }}>
        <Box sx={{
          flex: 2, minWidth: 280, p: 3, borderRadius: 3,
          background: '#161A23',
          border: '1px solid rgba(255,255,255,0.06)',
        }}>
          <Typography variant="h6" sx={{ fontWeight: 600, fontSize: '1rem', mb: 0.5 }}>
            Spending Trend
          </Typography>
          <Typography variant="caption" sx={{ color: 'text.secondary', display: 'block', mb: 3 }}>
            How your spending has moved over the past 5 months
          </Typography>
          <ResponsiveContainer width="100%" height={200}>
            <LineChart data={monthlyTrend}>
              <CartesianGrid stroke="rgba(255,255,255,0.04)" />
              <XAxis
                dataKey="month" axisLine={false} tickLine={false}
                tick={{ fill: '#8892A4', fontSize: 12 }}
              />
              <YAxis
                axisLine={false} tickLine={false}
                tick={{ fill: '#8892A4', fontSize: 11 }}
                tickFormatter={(v) => `R${(v / 1000).toFixed(0)}k`}
              />
              <Tooltip content={<CustomTooltip />} />
              <Line
                type="monotone" dataKey="amount" name="Spent"
                stroke="#7C5CFC" strokeWidth={2.5}
                dot={{ fill: '#7C5CFC', r: 4 }} activeDot={{ r: 6 }}
              />
              <Line
                type="monotone" dataKey="budget" name="Budget"
                stroke="rgba(255,255,255,0.2)" strokeWidth={1.5}
                strokeDasharray="5 5" dot={false}
              />
            </LineChart>
          </ResponsiveContainer>
        </Box>

        <Box sx={{
          flex: 1, minWidth: 240, p: 3, borderRadius: 3,
          background: '#161A23',
          border: '1px solid rgba(255,255,255,0.06)',
        }}>
          <Typography variant="h6" sx={{ fontWeight: 600, fontSize: '1rem', mb: 0.5 }}>
            Spend by Day
          </Typography>
          <Typography variant="caption" sx={{ color: 'text.secondary', display: 'block', mb: 3 }}>
            Which days you spend the most
          </Typography>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
            {dayPattern.map(({ day, amount }) => {
              const max = Math.max(...dayPattern.map(d => d.amount));
              const pct = (amount / max) * 100;
              const isHighest = amount === max;
              return (
                <Box key={day} sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                  <Typography variant="caption" sx={{ color: 'text.secondary', width: 28, fontSize: '0.75rem' }}>
                    {day}
                  </Typography>
                  <Box sx={{
                    flex: 1, height: 8, borderRadius: 4,
                    backgroundColor: 'rgba(255,255,255,0.05)', overflow: 'hidden',
                  }}>
                    <Box sx={{
                      width: `${pct}%`, height: '100%', borderRadius: 4,
                      backgroundColor: isHighest ? '#FF5A7E' : '#7C5CFC',
                      transition: 'width 0.6s ease',
                    }} />
                  </Box>
                  <Typography variant="caption" sx={{
                    fontWeight: 600, fontSize: '0.72rem',
                    color: isHighest ? '#FF5A7E' : 'text.secondary',
                    width: 70, textAlign: 'right',
                  }}>
                    {formatZAR(amount)}
                  </Typography>
                </Box>
              );
            })}
          </Box>
        </Box>
      </Box>

      <Box sx={{
        p: 3, borderRadius: 3,
        background: '#161A23',
        border: '1px solid rgba(255,255,255,0.06)',
      }}>
        <Typography variant="h6" sx={{ fontWeight: 600, fontSize: '1rem', mb: 0.5 }}>
          Top Merchants
        </Typography>
        <Typography variant="caption" sx={{ color: 'text.secondary', display: 'block', mb: 3 }}>
          Where most of your money is going this month
        </Typography>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          {merchantList.map(([name, amount], idx) => {
            const pct = (amount / totalMerchantSpend) * 100;
            return (
              <Box key={name}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.8 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                    <Box sx={{
                      width: 28, height: 28, borderRadius: 1.5,
                      backgroundColor: alpha(colors[idx], 0.15),
                      display: 'flex', alignItems: 'center',
                      justifyContent: 'center', fontSize: '0.9rem',
                    }}>
                      {mockTransactions.find(t => t.merchantName === name)?.merchantLogo || '🏪'}
                    </Box>
                    <Typography variant="body2" sx={{ fontWeight: 600, fontSize: '0.85rem' }}>
                      {name}
                    </Typography>
                  </Box>
                  <Box sx={{ textAlign: 'right' }}>
                    <Typography variant="body2" sx={{ fontWeight: 700 }}>
                      {formatZAR(amount)}
                    </Typography>
                    <Typography variant="caption" sx={{ color: 'text.secondary', fontSize: '0.7rem' }}>
                      {pct.toFixed(0)}% of top spend
                    </Typography>
                  </Box>
                </Box>
                <Box sx={{
                  height: 6, borderRadius: 3,
                  backgroundColor: 'rgba(255,255,255,0.05)', overflow: 'hidden',
                }}>
                  <Box sx={{
                    width: `${pct}%`, height: '100%', borderRadius: 3,
                    backgroundColor: colors[idx],
                    transition: 'width 0.6s ease',
                  }} />
                </Box>
              </Box>
            );
          })}
        </Box>
      </Box>
    </Box>
  );
};

export default AnalyticsPage;