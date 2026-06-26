import React, { useEffect, useMemo, useState } from 'react';
import {
  Box, Typography, alpha, CircularProgress, Alert,
} from '@mui/material';
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer,
  CartesianGrid, Legend, PieChart, Pie, Cell,
} from 'recharts';
import { formatZAR } from '../utils/format';
import { getTransactions, type Transaction } from '../services/dashboardService';
import { getBudgets, type Budget } from '../services/budgetsService';

const PALETTE = ['#7C5CFC', '#FF5A7E', '#FFB547', '#00D4AA', '#38BDF8', '#A78BFA', '#34D399', '#6B7280'];

const categoryEmojis: Record<string, string> = {
  Shopping: '🛍️',
  Groceries: '🛒',
  Entertainment: '🎬',
  Fuel: '⛽',
  Transportation: '🚗',
  'Food & Dining': '🍔',
  Healthcare: '💊',
  'Bills & Utilities': '💡',
  Travel: '✈️',
  Other: '💳',
};

const WEEKDAYS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

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

const ChartCard: React.FC<{ title: string; subtitle: string; flex?: number; children: React.ReactNode }> = ({
  title, subtitle, flex = 1, children,
}) => (
  <Box sx={{
    flex, minWidth: 280, p: 3, borderRadius: 3,
    background: '#161A23',
    border: '1px solid rgba(255,255,255,0.06)',
  }}>
    <Typography variant="h6" sx={{ fontWeight: 600, fontSize: '1rem', mb: 0.5 }}>
      {title}
    </Typography>
    <Typography variant="caption" sx={{ color: 'text.secondary', display: 'block', mb: 3 }}>
      {subtitle}
    </Typography>
    {children}
  </Box>
);

const AnalyticsPage: React.FC = () => {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [budgets, setBudgets] = useState<Budget[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const load = async () => {
      try {
        const [txns, buds] = await Promise.all([getTransactions(), getBudgets()]);
        setTransactions(txns);
        setBudgets(buds);
      } catch {
        setError('Could not load analytics.');
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  const budgetVsSpent = useMemo(
    () => budgets.map((b) => ({
      category: b.category,
      Spent: b.currentSpent,
      Limit: b.limitAmount,
    })),
    [budgets]
  );

  const byCategory = useMemo(() => {
    const totals = transactions.reduce((acc, t) => {
      acc[t.category] = (acc[t.category] || 0) + t.amount;
      return acc;
    }, {} as Record<string, number>);

    const grandTotal = Object.values(totals).reduce((s, v) => s + v, 0);

    return Object.entries(totals)
      .sort((a, b) => b[1] - a[1])
      .map(([category, amount], i) => ({
        category,
        amount,
        percentage: grandTotal === 0 ? 0 : Math.round((amount / grandTotal) * 100),
        color: PALETTE[i % PALETTE.length],
      }));
  }, [transactions]);

  const spendByDay = useMemo(() => {
    const totals: Record<string, number> = Object.fromEntries(WEEKDAYS.map((d) => [d, 0]));
    transactions.forEach((t) => {
      const jsDay = new Date(t.transactionDate).getDay(); // 0=Sun..6=Sat
      const label = WEEKDAYS[(jsDay + 6) % 7]; // shift so Mon=0
      totals[label] += t.amount;
    });
    return WEEKDAYS.map((day) => ({ day, amount: totals[day] }));
  }, [transactions]);

  const topMerchants = useMemo(() => {
    const totals = transactions.reduce((acc, t) => {
      acc[t.merchantName] = (acc[t.merchantName] || 0) + t.amount;
      return acc;
    }, {} as Record<string, number>);

    const list = Object.entries(totals).sort((a, b) => b[1] - a[1]).slice(0, 5);
    const total = list.reduce((s, [, v]) => s + v, 0);
    return { list, total };
  }, [transactions]);

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

  if (transactions.length === 0 && budgets.length === 0) {
    return (
      <Box sx={{
        p: 6, borderRadius: 3, textAlign: 'center',
        background: '#161A23', border: '1px solid rgba(255,255,255,0.06)',
      }}>
        <Typography sx={{ fontSize: '2rem', mb: 1 }}>📊</Typography>
        <Typography variant="body2" sx={{ color: 'text.secondary' }}>
          No analytics yet. Add some transactions and budgets to see your spending insights.
        </Typography>
      </Box>
    );
  }

  const maxDay = Math.max(...spendByDay.map((d) => d.amount), 1);

  return (
    <Box>
      <Box sx={{ display: 'flex', gap: 3, mb: 3, flexWrap: 'wrap' }}>
        <ChartCard
          title="Budget vs Spent"
          subtitle="How much you've spent against each budget"
          flex={2}
        >
          {budgetVsSpent.length === 0 ? (
            <Typography variant="caption" sx={{ color: 'text.secondary' }}>
              Set a budget to compare your spending against it.
            </Typography>
          ) : (
            <ResponsiveContainer width="100%" height={240}>
              <BarChart data={budgetVsSpent} barGap={4}>
                <CartesianGrid vertical={false} stroke="rgba(255,255,255,0.04)" />
                <XAxis dataKey="category" axisLine={false} tickLine={false} tick={{ fill: '#8892A4', fontSize: 12 }} />
                <YAxis
                  axisLine={false} tickLine={false}
                  tick={{ fill: '#8892A4', fontSize: 11 }}
                  tickFormatter={(v) => `R${(v / 1000).toFixed(0)}k`}
                />
                <Tooltip content={<CustomTooltip />} cursor={{ fill: 'rgba(255,255,255,0.03)' }} />
                <Legend wrapperStyle={{ fontSize: '0.75rem', paddingTop: '16px' }} />
                <Bar dataKey="Spent" fill="#7C5CFC" radius={[4, 4, 0, 0]} />
                <Bar dataKey="Limit" fill="rgba(255,255,255,0.08)" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          )}
        </ChartCard>

        <ChartCard title="By Category" subtitle="Where your spending goes" flex={1}>
          {byCategory.length === 0 ? (
            <Typography variant="caption" sx={{ color: 'text.secondary' }}>
              No transactions yet.
            </Typography>
          ) : (
            <>
              <ResponsiveContainer width="100%" height={180}>
                <PieChart>
                  <Pie data={byCategory} cx="50%" cy="50%" outerRadius={80} dataKey="amount" stroke="none">
                    {byCategory.map((entry, index) => (
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
                {byCategory.slice(0, 4).map((cat) => (
                  <Box key={cat.category} sx={{
                    display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 1,
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
            </>
          )}
        </ChartCard>
      </Box>

      <Box sx={{ display: 'flex', gap: 3, mb: 3, flexWrap: 'wrap' }}>
        <ChartCard title="Spend by Day" subtitle="Which days you spend the most" flex={2}>
          {transactions.length === 0 ? (
            <Typography variant="caption" sx={{ color: 'text.secondary' }}>
              No transactions yet.
            </Typography>
          ) : (
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
              {spendByDay.map(({ day, amount }) => {
                const pct = (amount / maxDay) * 100;
                const isHighest = amount === maxDay && amount > 0;
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
          )}
        </ChartCard>

        <ChartCard title="Top Merchants" subtitle="Where most of your money goes" flex={1}>
          {topMerchants.list.length === 0 ? (
            <Typography variant="caption" sx={{ color: 'text.secondary' }}>
              No transactions yet.
            </Typography>
          ) : (
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
              {topMerchants.list.map(([name, amount], idx) => {
                const pct = topMerchants.total === 0 ? 0 : (amount / topMerchants.total) * 100;
                return (
                  <Box key={name}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.8 }}>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                        <Box sx={{
                          width: 28, height: 28, borderRadius: 1.5,
                          backgroundColor: alpha(PALETTE[idx], 0.15),
                          display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.9rem',
                        }}>
                          {categoryEmojis[
                            transactions.find((t) => t.merchantName === name)?.category || 'Other'
                          ] || '🏪'}
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
                        backgroundColor: PALETTE[idx],
                        transition: 'width 0.6s ease',
                      }} />
                    </Box>
                  </Box>
                );
              })}
            </Box>
          )}
        </ChartCard>
      </Box>
    </Box>
  );
};

export default AnalyticsPage;