import React, { useEffect, useMemo, useState } from 'react';
import {
  Box, Typography, TextField, Select, MenuItem, Button,
  Chip, InputAdornment, alpha, CircularProgress, Alert,
  Dialog, DialogTitle, DialogContent, DialogActions,
} from '@mui/material';
import SearchRoundedIcon from '@mui/icons-material/SearchRounded';
import AddRoundedIcon from '@mui/icons-material/AddRounded';
import { formatZAR } from '../utils/format';
import {
  getTransactions,
  getCards,
  createTransaction,
  type Transaction,
  type Card,
} from '../services/dashboardService';

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

const categoryEmojis: Record<string, string> = {
  Shopping: '🛍️',
  Groceries: '🛒',
  Entertainment: '🎬',
  Fuel: '⛽',
  Transportation: '🚗',
  'Food & Dining': '🍔',
  Healthcare: '💊',
  Other: '💳',
};

const CATEGORY_OPTIONS = [
  'Groceries', 'Shopping', 'Entertainment', 'Transportation',
  'Healthcare', 'Food & Dining', 'Fuel', 'Other',
];

const TransactionsPage: React.FC = () => {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [cards, setCards] = useState<Card[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('All');

  // Add dialog
  const [addOpen, setAddOpen] = useState(false);
  const [saving, setSaving] = useState(false);
  const [formError, setFormError] = useState('');
  const [form, setForm] = useState({
    creditCardId: '',
    merchantName: '',
    category: 'Groceries',
    amount: '',
  });

  const loadData = async () => {
    try {
      const [txns, cardsData] = await Promise.all([getTransactions(), getCards()]);
      setTransactions(txns);
      setCards(cardsData);
    } catch {
      setError('Could not load transactions.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const resetForm = () => {
    setForm({ creditCardId: cards[0]?.id ?? '', merchantName: '', category: 'Groceries', amount: '' });
    setFormError('');
  };

  const openAddDialog = () => {
    setForm((f) => ({ ...f, creditCardId: cards[0]?.id ?? '' }));
    setAddOpen(true);
  };

  const closeAddDialog = () => {
    setAddOpen(false);
    resetForm();
  };

  const handleCreate = async () => {
    setFormError('');

    if (!form.creditCardId) {
      setFormError('Add a card first, then record a transaction against it.');
      return;
    }
    if (!form.merchantName.trim()) {
      setFormError('Merchant name is required.');
      return;
    }
    const amount = parseFloat(form.amount);
    if (isNaN(amount) || amount <= 0) {
      setFormError('Enter a valid amount.');
      return;
    }

    setSaving(true);
    try {
      await createTransaction({
        creditCardId: form.creditCardId,
        merchantName: form.merchantName.trim(),
        category: form.category,
        amount,
      });
      closeAddDialog();
      await loadData();
    } catch {
      setFormError('Could not add transaction. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  const categories = useMemo(
    () => ['All', ...Array.from(new Set(transactions.map((t) => t.category)))],
    [transactions]
  );

  const filtered = transactions.filter((t) => {
    const matchesSearch = t.merchantName.toLowerCase().includes(search.toLowerCase());
    const matchesCat = category === 'All' || t.category === category;
    return matchesSearch && matchesCat;
  });

  const grouped = filtered.reduce((acc, txn) => {
    const key = new Date(txn.transactionDate).toLocaleDateString('en-ZA', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    });
    if (!acc[key]) acc[key] = [];
    acc[key].push(txn);
    return acc;
  }, {} as Record<string, Transaction[]>);

  const totalSpent = transactions.reduce((s, t) => s + t.amount, 0);

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

  return (
    <Box>
      <Box sx={{
        display: 'flex', gap: 2, mb: 3,
        p: 2.5, borderRadius: 3,
        background: '#161A23',
        border: '1px solid rgba(255,255,255,0.06)',
        flexWrap: 'wrap', alignItems: 'center',
      }}>
        {[
          { label: 'Total Transactions', value: transactions.length },
          { label: 'Total Spent', value: formatZAR(totalSpent) },
          { label: 'Categories', value: new Set(transactions.map((t) => t.category)).size },
        ].map((stat) => (
          <Box key={stat.label} sx={{ flex: 1, minWidth: 120 }}>
            <Typography variant="caption" sx={{ color: 'text.secondary', display: 'block', mb: 0.3 }}>
              {stat.label}
            </Typography>
            <Typography variant="h6" sx={{ fontWeight: 700, fontSize: '1.1rem' }}>
              {stat.value}
            </Typography>
          </Box>
        ))}

        <Button
          variant="contained"
          startIcon={<AddRoundedIcon />}
          onClick={openAddDialog}
          sx={{ borderRadius: 2, flexShrink: 0 }}
        >
          Add Transaction
        </Button>
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
          {categories.map((c) => (
            <MenuItem key={c} value={c}>{c}</MenuItem>
          ))}
        </Select>
        <Typography variant="caption" sx={{ color: 'text.secondary', ml: 'auto' }}>
          {filtered.length} transaction{filtered.length !== 1 ? 's' : ''}
        </Typography>
      </Box>

      {Object.keys(grouped).length === 0 ? (
        <Box sx={{ textAlign: 'center', py: 8, color: 'text.secondary' }}>
          <Typography sx={{ fontSize: '2rem', mb: 1 }}>🔍</Typography>
          <Typography variant="body2">
            {transactions.length === 0
              ? 'No transactions yet. Add one to get started.'
              : 'No transactions match your search.'}
          </Typography>
        </Box>
      ) : (
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
          {Object.entries(grouped).map(([date, txns]) => (
            <Box key={date}>
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
                  const color = categoryColors[txn.category] || '#6B7280';
                  const emoji = categoryEmojis[txn.category] || '💳';

                  return (
                    <Box key={txn.id} sx={{
                      display: 'flex', alignItems: 'center', gap: 2,
                      px: 2.5, py: 2,
                      borderBottom: idx < txns.length - 1
                        ? '1px solid rgba(255,255,255,0.04)'
                        : 'none',
                      transition: 'background 0.15s',
                      '&:hover': { backgroundColor: alpha('#fff', 0.02) },
                    }}>
                      <Box sx={{
                        width: 42, height: 42, borderRadius: 2,
                        backgroundColor: alpha(color, 0.12),
                        display: 'flex', alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: '1.2rem', flexShrink: 0,
                      }}>
                        {emoji}
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
                          {txn.status && txn.status.toLowerCase() !== 'completed' && (
                            <Chip
                              label={txn.status}
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
                        color: 'text.primary',
                      }}>
                        {formatZAR(txn.amount)}
                      </Typography>
                    </Box>
                  );
                })}
              </Box>
            </Box>
          ))}
        </Box>
      )}

      {/* Add Transaction dialog */}
      <Dialog open={addOpen} onClose={closeAddDialog} maxWidth="xs" fullWidth>
        <DialogTitle>Add Transaction</DialogTitle>
        <DialogContent sx={{ display: 'flex', flexDirection: 'column', gap: 2, pt: 1 }}>
          {formError && <Alert severity="error">{formError}</Alert>}

          {cards.length === 0 ? (
            <Alert severity="info">
              You need a card first. Add a card, then record transactions against it.
            </Alert>
          ) : (
            <TextField
              label="Card"
              size="small"
              fullWidth
              select
              value={form.creditCardId}
              onChange={(e) => setForm({ ...form, creditCardId: e.target.value })}
            >
              {cards.map((c) => (
                <MenuItem key={c.id} value={c.id}>
                  {c.cardType} •••• {c.cardNumber?.slice(-4) || '0000'}
                </MenuItem>
              ))}
            </TextField>
          )}

          <TextField
            label="Merchant"
            size="small"
            fullWidth
            value={form.merchantName}
            onChange={(e) => setForm({ ...form, merchantName: e.target.value })}
          />

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
                {categoryEmojis[c] ?? '💳'} {c}
              </MenuItem>
            ))}
          </TextField>

          <TextField
            label="Amount (R)"
            size="small"
            fullWidth
            type="number"
            value={form.amount}
            onChange={(e) => setForm({ ...form, amount: e.target.value })}
          />
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2 }}>
          <Button onClick={closeAddDialog} color="inherit">Cancel</Button>
          <Button
            onClick={handleCreate}
            variant="contained"
            disabled={saving || cards.length === 0}
          >
            {saving ? 'Adding…' : 'Add Transaction'}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default TransactionsPage;