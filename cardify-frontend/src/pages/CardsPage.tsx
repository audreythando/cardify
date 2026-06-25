import React, { useEffect, useMemo, useState } from 'react';
import {
  Box,
  Typography,
  Button,
  Chip,
  LinearProgress,
  alpha,
  Grid,
  CircularProgress,
  Alert,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  MenuItem,
} from '@mui/material';
import AddRoundedIcon from '@mui/icons-material/AddRounded';
import CreditCardRoundedIcon from '@mui/icons-material/CreditCardRounded';
import LockRoundedIcon from '@mui/icons-material/LockRounded';
import TrendingUpRoundedIcon from '@mui/icons-material/TrendingUpRounded';
import CardDisplay from '../components/cards/CardDisplay';
import { formatZAR } from '../utils/format';
import {
  getCards,
  getTransactions,
  createCard,
  type Card,
  type Transaction,
} from '../services/dashboardService';
import type { CreditCard } from '../types';

const mapNetwork = (cardType: string): CreditCard['network'] => {
  const value = cardType.toLowerCase();

  if (value === 'mastercard') return 'mastercard';
  if (value === 'amex') return 'amex';

  return 'visa';
};

const mapCardToDisplayCard = (card: Card, index = 0): CreditCard => ({
  id: card.id,
  cardholderName: card.cardHolderName,
  lastFour: card.cardNumber?.slice(-4) || '0000',
  network: mapNetwork(card.cardType),
  balance: card.balance,
  creditLimit: card.creditLimit,
  availableCredit: card.availableCredit,
  expiryDate: new Date(card.expiryDate)
    .toLocaleDateString('en-US', {
      month: '2-digit',
      year: '2-digit',
    })
    .replace('/', '/'),
  color: index % 3 === 0 ? 'purple' : index % 3 === 1 ? 'gold' : 'dark',
  isPrimary: index === 0,
});

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

interface CardDetailPanelProps {
  card: CreditCard;
  transactions: Transaction[];
}

const CardDetailPanel: React.FC<CardDetailPanelProps> = ({ card, transactions }) => {
  const utilisation =
    card.creditLimit === 0 ? 0 : (card.balance / card.creditLimit) * 100;

  const utilisationColor =
    utilisation > 75 ? '#FF5A7E' : utilisation > 50 ? '#FFB547' : '#00D4AA';

  const cardTransactions = transactions
    .filter((transaction) => transaction.creditCardId === card.id)
    .slice(0, 4);

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2.5 }}>
      <Grid container spacing={2}>
        {[
          {
            label: 'Current Balance',
            value: formatZAR(card.balance),
            color: '#7C5CFC',
          },
          {
            label: 'Credit Limit',
            value: formatZAR(card.creditLimit),
            color: '#38BDF8',
          },
          {
            label: 'Available Credit',
            value: formatZAR(card.availableCredit),
            color: '#00D4AA',
          },
        ].map((stat) => (
          <Grid size={{ xs: 12, sm: 4 }} key={stat.label}>
            <Box
              sx={{
                p: 2,
                borderRadius: 3,
                textAlign: 'center',
                background: '#161A23',
                border: '1px solid rgba(255,255,255,0.06)',
              }}
            >
              <Typography
                variant="caption"
                sx={{ color: 'text.secondary', display: 'block', mb: 0.5 }}
              >
                {stat.label}
              </Typography>
              <Typography variant="body1" sx={{ fontWeight: 700, color: stat.color }}>
                {stat.value}
              </Typography>
            </Box>
          </Grid>
        ))}
      </Grid>

      <Box
        sx={{
          p: 2.5,
          borderRadius: 3,
          background: '#161A23',
          border: '1px solid rgba(255,255,255,0.06)',
        }}
      >
        <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1.5 }}>
          <Typography variant="body2" sx={{ fontWeight: 600 }}>
            Credit Utilization
          </Typography>
          <Typography variant="body2" sx={{ fontWeight: 700, color: utilisationColor }}>
            {Math.round(utilisation)}%
          </Typography>
        </Box>

        <LinearProgress
          variant="determinate"
          value={Math.min(utilisation, 100)}
          sx={{
            height: 8,
            borderRadius: 4,
            backgroundColor: 'rgba(255,255,255,0.06)',
            '& .MuiLinearProgress-bar': {
              borderRadius: 4,
              backgroundColor: utilisationColor,
            },
          }}
        />

        <Typography variant="caption" sx={{ color: 'text.secondary', mt: 1, display: 'block' }}>
          {utilisation > 75
            ? '⚠️ High utilisation — aim to pay this down soon'
            : utilisation > 50
              ? '⚡ Getting high — try to keep below 30% for a healthy score'
              : '✅ Great! Keeping utilisation low helps your credit score'}
        </Typography>
      </Box>

      <Box
        sx={{
          p: 2.5,
          borderRadius: 3,
          background: '#161A23',
          border: '1px solid rgba(255,255,255,0.06)',
        }}
      >
        <Typography variant="body2" sx={{ fontWeight: 600, mb: 2 }}>
          Card Actions
        </Typography>

        <Box sx={{ display: 'flex', gap: 1.5, flexWrap: 'wrap' }}>
          {[
            { label: 'View PIN', icon: '🔑' },
            { label: 'Freeze Card', icon: '🧊' },
            { label: 'Set Limit', icon: '⚙️' },
            { label: 'Report Lost', icon: '🚨' },
          ].map((action) => (
            <Button
              key={action.label}
              variant="outlined"
              size="small"
              sx={{
                borderColor: 'rgba(255,255,255,0.1)',
                color: 'text.secondary',
                borderRadius: 2,
                fontSize: '0.75rem',
                gap: 0.5,
                '&:hover': {
                  borderColor: 'primary.main',
                  color: 'primary.main',
                  backgroundColor: alpha('#7C5CFC', 0.05),
                },
              }}
            >
              {action.icon} {action.label}
            </Button>
          ))}
        </Box>
      </Box>

      <Box
        sx={{
          p: 2.5,
          borderRadius: 3,
          background: '#161A23',
          border: '1px solid rgba(255,255,255,0.06)',
        }}
      >
        <Typography variant="body2" sx={{ fontWeight: 600, mb: 2 }}>
          Recent on this card
        </Typography>

        {cardTransactions.length === 0 ? (
          <Typography variant="caption" sx={{ color: 'text.secondary' }}>
            No recent transactions on this card.
          </Typography>
        ) : (
          cardTransactions.map((transaction, idx) => {
            const icon = categoryIcons[transaction.category] || categoryIcons.Other;

            return (
              <Box
                key={transaction.id}
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 2,
                  py: 1.2,
                  borderBottom:
                    idx < cardTransactions.length - 1
                      ? '1px solid rgba(255,255,255,0.04)'
                      : 'none',
                }}
              >
                <Box sx={{ fontSize: '1.1rem' }}>{icon}</Box>

                <Box sx={{ flex: 1 }}>
                  <Typography variant="caption" sx={{ fontWeight: 600, display: 'block' }}>
                    {transaction.merchantName}
                  </Typography>
                  <Typography
                    variant="caption"
                    sx={{ color: 'text.secondary', fontSize: '0.7rem' }}
                  >
                    {new Date(transaction.transactionDate).toLocaleDateString('en-US', {
                      month: 'short',
                      day: 'numeric',
                    })}
                  </Typography>
                </Box>

                <Typography variant="caption" sx={{ fontWeight: 700, color: 'text.primary' }}>
                  {formatZAR(-Math.abs(transaction.amount), true)}
                </Typography>
              </Box>
            );
          })
        )}
      </Box>
    </Box>
  );
};

const CardsPage: React.FC = () => {
  const [cards, setCards] = useState<CreditCard[]>([]);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [selectedCard, setSelectedCard] = useState<CreditCard | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const [addOpen, setAddOpen] = useState(false);
  const [saving, setSaving] = useState(false);
  const [formError, setFormError] = useState('');
  const [form, setForm] = useState({
    cardHolderName: '',
    cardType: 'visa',
    creditLimit: '',
    expiryDate: '',
  });

  const resetForm = () => {
    setForm({ cardHolderName: '', cardType: 'visa', creditLimit: '', expiryDate: '' });
    setFormError('');
  };

  const closeAddDialog = () => {
    setAddOpen(false);
    resetForm();
  };

  const generateCardNumber = () =>
    Array.from({ length: 16 }, () => Math.floor(Math.random() * 10)).join('');

  const handleCreateCard = async () => {
    setFormError('');

    if (!form.cardHolderName.trim()) {
      setFormError('Cardholder name is required.');
      return;
    }
    const limit = parseFloat(form.creditLimit);
    if (isNaN(limit) || limit <= 0) {
      setFormError('Enter a valid credit limit.');
      return;
    }
    if (!form.expiryDate) {
      setFormError('Select an expiry date.');
      return;
    }

    setSaving(true);
    try {
      await createCard({
        cardHolderName: form.cardHolderName.trim(),
        cardNumber: generateCardNumber(),
        cardType: form.cardType,
        balance: 0, // starts at 0; grows via transactions
        creditLimit: limit,
        expiryDate: new Date(form.expiryDate + '-01').toISOString(),
      });

      closeAddDialog();
      await loadCardsPage();
    } catch {
      setFormError('Could not add card. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  const loadCardsPage = async () => {
    try {
      const [cardsData, transactionsData] = await Promise.all([
        getCards(),
        getTransactions(),
      ]);

      const mappedCards = cardsData.map((card, index) =>
        mapCardToDisplayCard(card, index)
      );

      setCards(mappedCards);
      setTransactions(transactionsData);
      setSelectedCard((prev) =>
        prev ? mappedCards.find((c) => c.id === prev.id) ?? mappedCards[0] ?? null : mappedCards[0] ?? null
      );
    } catch {
      setError('Could not load cards.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadCardsPage();
  }, []);

  const totalCardsText = useMemo(() => {
    return `${cards.length} card${cards.length === 1 ? '' : 's'} linked`;
  }, [cards.length]);


  const addCardDialog = (
    <Dialog open={addOpen} onClose={closeAddDialog} maxWidth="xs" fullWidth>
      <DialogTitle>Add New Card</DialogTitle>
      <DialogContent sx={{ display: 'flex', flexDirection: 'column', gap: 2, pt: 1 }}>
        {formError && <Alert severity="error">{formError}</Alert>}

        <TextField
          label="Cardholder Name"
          size="small"
          fullWidth
          value={form.cardHolderName}
          onChange={(e) => setForm({ ...form, cardHolderName: e.target.value })}
        />

        <TextField
          label="Card Type"
          size="small"
          fullWidth
          select
          value={form.cardType}
          onChange={(e) => setForm({ ...form, cardType: e.target.value })}
        >
          <MenuItem value="visa">Visa</MenuItem>
          <MenuItem value="mastercard">Mastercard</MenuItem>
          <MenuItem value="amex">Amex</MenuItem>
        </TextField>

        <TextField
          label="Credit Limit (R)"
          size="small"
          fullWidth
          type="number"
          value={form.creditLimit}
          onChange={(e) => setForm({ ...form, creditLimit: e.target.value })}
        />

        <TextField
          label="Expiry"
          size="small"
          fullWidth
          type="month"
          slotProps={{ inputLabel: { shrink: true } }}
          value={form.expiryDate}
          onChange={(e) => setForm({ ...form, expiryDate: e.target.value })}
        />

        <Typography variant="caption" sx={{ color: 'text.secondary' }}>
          Balance starts at R0 and grows as you add transactions to this card.
        </Typography>
      </DialogContent>
      <DialogActions sx={{ px: 3, pb: 2 }}>
        <Button onClick={closeAddDialog} color="inherit">
          Cancel
        </Button>
        <Button onClick={handleCreateCard} variant="contained" disabled={saving}>
          {saving ? 'Adding…' : 'Add Card'}
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

  if (!selectedCard) {
    return (
      <Box>
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 3 }}>
          <Box>
            <Typography variant="h6" sx={{ fontWeight: 600 }}>
              0 cards linked
            </Typography>
            <Typography variant="caption" sx={{ color: 'text.secondary' }}>
              Add your first card to manage it.
            </Typography>
          </Box>

          <Button
            variant="contained"
            startIcon={<AddRoundedIcon />}
            onClick={() => setAddOpen(true)}
            sx={{ borderRadius: 2 }}
          >
            Add New Card
          </Button>
        </Box>

        <Box
          sx={{
            p: 4,
            borderRadius: 3,
            background: '#161A23',
            border: '1px solid rgba(255,255,255,0.06)',
            textAlign: 'center',
          }}
        >
          <CreditCardRoundedIcon sx={{ color: 'text.secondary', fontSize: 40, mb: 1 }} />
          <Typography variant="body2" sx={{ color: 'text.secondary' }}>
            No cards found.
          </Typography>
        </Box>

        {addCardDialog}
      </Box>
    );
  }

  return (
    <Box>
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 3 }}>
        <Box>
          <Typography variant="h6" sx={{ fontWeight: 600 }}>
            {totalCardsText}
          </Typography>
          <Typography variant="caption" sx={{ color: 'text.secondary' }}>
            Click a card to manage it
          </Typography>
        </Box>

        <Button
          variant="contained"
          startIcon={<AddRoundedIcon />}
          onClick={() => setAddOpen(true)}
          sx={{ borderRadius: 2 }}
        >
          Add New Card
        </Button>
      </Box>

      <Grid container spacing={3}>
        <Grid size={{ xs: 12, lg: 5 }}>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            {cards.map((card) => (
              <Box
                key={card.id}
                onClick={() => setSelectedCard(card)}
                sx={{
                  p: 2,
                  borderRadius: 3,
                  cursor: 'pointer',
                  border: '2px solid',
                  borderColor:
                    selectedCard.id === card.id ? 'primary.main' : 'rgba(255,255,255,0.06)',
                  background: '#161A23',
                  transition: 'all 0.2s ease',
                  '&:hover': {
                    borderColor:
                      selectedCard.id === card.id ? 'primary.main' : 'rgba(255,255,255,0.15)',
                  },
                }}
              >
                <Box sx={{ mb: 2 }}>
                  <CardDisplay card={card} size="small" />
                </Box>

                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <Box>
                    <Typography variant="body2" sx={{ fontWeight: 600, mb: 0.3 }}>
                      •••• {card.lastFour}
                    </Typography>
                    <Typography
                      variant="caption"
                      sx={{ color: 'text.secondary', textTransform: 'capitalize' }}
                    >
                      {card.network} · Expires {card.expiryDate}
                    </Typography>
                  </Box>

                  <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
                    {card.isPrimary && (
                      <Chip
                        label="Primary"
                        size="small"
                        sx={{
                          height: 20,
                          fontSize: '0.65rem',
                          fontWeight: 700,
                          backgroundColor: alpha('#7C5CFC', 0.15),
                          color: 'primary.main',
                        }}
                      />
                    )}

                    <Chip
                      label="Active"
                      size="small"
                      sx={{
                        height: 20,
                        fontSize: '0.65rem',
                        fontWeight: 700,
                        backgroundColor: alpha('#00D4AA', 0.15),
                        color: '#00D4AA',
                      }}
                    />
                  </Box>
                </Box>
              </Box>
            ))}

            <Box
              onClick={() => setAddOpen(true)}
              sx={{
                p: 3,
                borderRadius: 3,
                cursor: 'pointer',
                border: '2px dashed rgba(255,255,255,0.08)',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                gap: 1,
                minHeight: 100,
                transition: 'all 0.2s ease',
                '&:hover': {
                  borderColor: 'primary.main',
                  backgroundColor: alpha('#7C5CFC', 0.04),
                },
              }}
            >
              <CreditCardRoundedIcon sx={{ color: 'text.secondary', fontSize: 28 }} />
              <Typography variant="body2" sx={{ color: 'text.secondary', fontWeight: 500 }}>
                + Add a new card
              </Typography>
            </Box>
          </Box>
        </Grid>

        <Grid size={{ xs: 12, lg: 7 }}>
          <Box sx={{ mb: 2.5, display: 'flex', alignItems: 'center', gap: 1.5 }}>
            <LockRoundedIcon sx={{ color: 'text.secondary', fontSize: 18 }} />

            <Typography variant="body2" sx={{ color: 'text.secondary' }}>
              Card details are encrypted and stored securely
            </Typography>

            <TrendingUpRoundedIcon sx={{ color: 'success.main', fontSize: 18, ml: 'auto' }} />

            <Typography variant="caption" sx={{ color: 'success.main', fontWeight: 600 }}>
              Score: Good
            </Typography>
          </Box>

          <CardDetailPanel card={selectedCard} transactions={transactions} />
        </Grid>
      </Grid>

      {addCardDialog}
    </Box>
  );
};

export default CardsPage;