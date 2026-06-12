import React, { useEffect, useState } from 'react';
import { Box, Typography, IconButton, alpha, CircularProgress, Alert } from '@mui/material';
import AddRoundedIcon from '@mui/icons-material/AddRounded';
import CardDisplay from '../cards/CardDisplay';
import { getCards, type Card } from '../../services/dashboardService';
import { formatZAR } from '../../utils/format';


const MyCardsPanel: React.FC = () => {
  const [cards, setCards] = useState<Card[]>([]);
  const [selectedCard, setSelectedCard] = useState<Card | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const loadCards = async () => {
      try {
        const data = await getCards();
        setCards(data);
        setSelectedCard(data[0] ?? null);
      } catch {
        setError('Could not load cards.');
      } finally {
        setLoading(false);
      }
    };

    loadCards();
  }, []);

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
        <CircularProgress size={24} />
      </Box>
    );
  }

  if (error) {
    return <Alert severity="error">{error}</Alert>;
  }

  if (!selectedCard) {
    return (
      <Box sx={{ p: 3, borderRadius: 3, background: '#161A23' }}>
        <Typography variant="h6" sx={{ fontWeight: 600, mb: 1 }}>
          My Cards
        </Typography>
        <Typography variant="body2" sx={{ color: 'text.secondary' }}>
          No cards yet. Add a card from Swagger or the Cards page later.
        </Typography>
      </Box>
    );
  }

  const utilisation = selectedCard.creditLimit === 0
    ? 0
    : (selectedCard.balance / selectedCard.creditLimit) * 100;

  const utilisationColor =
    utilisation > 75 ? '#FF5A7E' : utilisation > 50 ? '#FFB547' : '#00D4AA';

 const displayCard = {
  id: selectedCard.id,
  cardholderName: selectedCard.cardHolderName,
  lastFour: selectedCard.cardNumber.slice(-4),

  network:
    selectedCard.cardType.toLowerCase() === 'mastercard'
      ? 'mastercard'
      : selectedCard.cardType.toLowerCase() === 'amex'
      ? 'amex'
      : 'visa',

  balance: selectedCard.balance,
  creditLimit: selectedCard.creditLimit,
  availableCredit: selectedCard.availableCredit,

  expiryDate: new Date(selectedCard.expiryDate)
    .toLocaleDateString('en-US', {
      month: '2-digit',
      year: '2-digit',
    })
    .replace('/', '/'),

  color: 'purple',

  isPrimary: true,
};

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2.5 }}>
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <Typography variant="h6" sx={{ fontWeight: 600, fontSize: '1rem' }}>
          My Cards
        </Typography>

        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
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

          <IconButton
            size="small"
            sx={{
              backgroundColor: alpha('#7C5CFC', 0.15),
              '&:hover': { backgroundColor: alpha('#7C5CFC', 0.25) },
            }}
          >
            <AddRoundedIcon sx={{ fontSize: 18, color: 'primary.main' }} />
          </IconButton>
        </Box>
      </Box>

     <CardDisplay
  card={displayCard as any}
  size="large"
/>

      <Box sx={{ display: 'flex', justifyContent: 'center', gap: 1 }}>
        {cards.map((card) => (
          <Box
            key={card.id}
            onClick={() => setSelectedCard(card)}
            sx={{
              width: card.id === selectedCard.id ? 20 : 6,
              height: 6,
              borderRadius: 3,
              backgroundColor:
                card.id === selectedCard.id ? 'primary.main' : 'rgba(255,255,255,0.2)',
              cursor: 'pointer',
              transition: 'all 0.3s ease',
            }}
          />
        ))}
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
          Credit Utilization
        </Typography>

        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <Box sx={{ position: 'relative', width: 72, height: 72, flexShrink: 0 }}>
            <svg width="72" height="72" viewBox="0 0 72 72">
              <circle cx="36" cy="36" r="28" fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth="8" />
              <circle
                cx="36"
                cy="36"
                r="28"
                fill="none"
                stroke={utilisationColor}
                strokeWidth="8"
                strokeDasharray={`${(utilisation / 100) * 175.9} 175.9`}
                strokeLinecap="round"
                transform="rotate(-90 36 36)"
              />
            </svg>

            <Box
              sx={{
                position: 'absolute',
                inset: 0,
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <Typography sx={{ fontSize: '0.9rem', fontWeight: 700, color: utilisationColor, lineHeight: 1 }}>
                {Math.round(utilisation)}%
              </Typography>
              <Typography sx={{ fontSize: '0.5rem', color: 'text.secondary' }}>
                Used
              </Typography>
            </Box>
          </Box>

          <Box>
            <Typography variant="body2" sx={{ fontWeight: 600, mb: 0.5 }}>
              {formatZAR(selectedCard.balance)} of {formatZAR(selectedCard.creditLimit)}
            </Typography>

            <Typography variant="caption" sx={{ color: 'text.secondary', lineHeight: 1.4 }}>
              {utilisation > 75
                ? '⚠️ High utilisation — consider paying down'
                : utilisation > 50
                ? '⚡ Moderate — keep under 30% for best score'
                : '✅ Good utilisation — great for your score'}
            </Typography>
          </Box>
        </Box>
      </Box>
    </Box>
  );
};

export default MyCardsPanel;