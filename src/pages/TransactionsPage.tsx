import React, { useState } from 'react';
import {
    Box, Typography, TextField, Select, MenuItem,
    Chip, InputAdornment, alpha
} from '@mui/material';
import SearchRoundedIcon from '@mui/icons-material/SearchRounded';
import { mockTransactions } from '../utils/mockData';
import type { Transaction } from '../types';

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

const TransactionsPage: React.FC = () => {
    const [search, setSearch] = useState('');
    const [category, setCategory] = useState('All');

    const categories = ['All', ...Array.from(new Set(mockTransactions.map(t => t.category)))];

    const filtered = mockTransactions.filter(t => {
        const matchesSearch = t.merchantName.toLowerCase().includes(search.toLowerCase());
        const matchesCat = category === 'All' || t.category === category;
        return matchesSearch && matchesCat;
    });

    const formatCurrency = (v: number) =>
        new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'USD',
            signDisplay: 'always',
        }).format(v);

    const formatDate = (dateStr: string) =>
        new Date(dateStr).toLocaleDateString('en-US', {
            weekday: 'short', month: 'short', day: 'numeric',
        });

    // Group transactions by date
    const grouped = filtered.reduce((acc, txn) => {
        const key = formatDate(txn.date);
        if (!acc[key]) acc[key] = [];
        acc[key].push(txn);
        return acc;
    }, {} as Record<string, Transaction[]>);

    return (
        <Box>
            <Box sx={{
                display: 'flex', gap: 2, mb: 3,
                p: 2.5, borderRadius: 3,
                background: '#161A23',
                border: '1px solid rgba(255,255,255,0.06)',
                flexWrap: 'wrap',
            }}>
                {[
                    { label: 'Total Transactions', value: mockTransactions.length },
                    {
                        label: 'Total Spent',
                        value: new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' })
                            .format(Math.abs(mockTransactions.filter(t => t.amount < 0).reduce((s, t) => s + t.amount, 0))),
                    },
                    {
                        label: 'Pending',
                        value: mockTransactions.filter(t => t.status === 'pending').length,
                    },
                ].map(stat => (
                    <Box key={stat.label} sx={{ flex: 1, minWidth: 120 }}>
                        <Typography variant="caption" sx={{ color: 'text.secondary', display: 'block', mb: 0.3 }}>
                            {stat.label}
                        </Typography>
                        <Typography variant="h6" sx={{ fontWeight: 700, fontSize: '1.1rem' }}>
                            {stat.value}
                        </Typography>
                    </Box>
                ))}
            </Box>

            <Box sx={{ display: 'flex', gap: 2, mb: 3, flexWrap: 'wrap', alignItems: 'center' }}>
                <TextField
                    placeholder="Search transactions..."
                    size="small"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    slotProps={{
                        input: {
                            startAdornment: (
                                <InputAdornment position="start">
                                    <SearchRoundedIcon sx={{ fontSize: 18, color: 'text.secondary' }} />
                                </InputAdornment>
                            ),
                        },
                    }}
                    sx={{ minWidth: 260 }}
                />
                <Select
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    size="small"
                    sx={{
                        minWidth: 160, borderRadius: 2,
                        '& .MuiOutlinedInput-notchedOutline': { borderColor: 'rgba(255,255,255,0.1)' },
                    }}
                >
                    {categories.map(c => (
                        <MenuItem key={c} value={c}>{c}</MenuItem>
                    ))}
                </Select>
                <Typography variant="caption" sx={{ color: 'text.secondary', ml: 'auto' }}>
                    {filtered.length} transaction{filtered.length !== 1 ? 's' : ''}
                </Typography>
            </Box>

            {Object.keys(grouped).length === 0 ? (
                <Box sx={{
                    textAlign: 'center', py: 8,
                    color: 'text.secondary',
                }}>
                    <Typography sx={{ fontSize: '2rem', mb: 1 }}>🔍</Typography>
                    <Typography variant="body2">No transactions match your search.</Typography>
                </Box>
            ) : (
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
                    {Object.entries(grouped).map(([date, txns]) => (
                        <Box key={date}>
                            {/* Date header */}
                            <Typography variant="caption" sx={{
                                color: 'text.secondary', fontWeight: 700,
                                textTransform: 'uppercase', letterSpacing: '0.08em',
                                fontSize: '0.7rem', mb: 1.5, display: 'block',
                            }}>
                                {date}
                            </Typography>

                            <Box sx={{
                                borderRadius: 3, background: '#161A23',
                                border: '1px solid rgba(255,255,255,0.06)',
                                overflow: 'hidden',
                            }}>
                                {txns.map((txn, idx) => {
                                    const isIncome = txn.amount > 0;
                                    const color = categoryColors[txn.category] || '#6B7280';

                                    return (
                                        <Box key={txn.id} sx={{
                                            display: 'flex', alignItems: 'center', gap: 2,
                                            px: 2.5, py: 2,
                                            borderBottom: idx < txns.length - 1
                                                ? '1px solid rgba(255,255,255,0.04)'
                                                : 'none',
                                            transition: 'background 0.15s',
                                            cursor: 'pointer',
                                            '&:hover': { backgroundColor: alpha('#fff', 0.02) },
                                        }}>
                                            <Box sx={{
                                                width: 42, height: 42, borderRadius: 2,
                                                backgroundColor: alpha(color, 0.12),
                                                display: 'flex', alignItems: 'center',
                                                justifyContent: 'center',
                                                fontSize: '1.2rem', flexShrink: 0,
                                            }}>
                                                {txn.merchantLogo}
                                            </Box>

                                            <Box sx={{ flex: 1, minWidth: 0 }}>
                                                <Typography variant="body2" sx={{ fontWeight: 600, mb: 0.3 }}>
                                                    {txn.merchantName}
                                                </Typography>
                                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                                    <Chip
                                                        label={txn.category}
                                                        size="small"
                                                        sx={{
                                                            height: 18, fontSize: '0.6rem', fontWeight: 600,
                                                            backgroundColor: alpha(color, 0.12),
                                                            color: color,
                                                        }}
                                                    />
                                                    {txn.status === 'pending' && (
                                                        <Chip
                                                            label="Pending"
                                                            size="small"
                                                            sx={{
                                                                height: 18, fontSize: '0.6rem',
                                                                backgroundColor: alpha('#FFB547', 0.15),
                                                                color: '#FFB547',
                                                            }}
                                                        />
                                                    )}
                                                </Box>
                                            </Box>

                                            <Typography variant="body2" sx={{
                                                fontWeight: 700, fontSize: '0.95rem', flexShrink: 0,
                                                color: isIncome ? 'success.main' : 'text.primary',
                                            }}>
                                                {formatCurrency(txn.amount)}
                                            </Typography>
                                        </Box>
                                    );
                                })}
                            </Box>
                        </Box>
                    ))}
                </Box>
            )}
        </Box>
    );
};

export default TransactionsPage;