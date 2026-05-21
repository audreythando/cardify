import React, { useState } from 'react';
import { Box, Typography, IconButton, alpha } from '@mui/material';
import AddRoundedIcon from '@mui/icons-material/AddRounded';
import CardDisplay from '../cards/CardDisplay';
import { mockCards } from '../../utils/mockData';

const MyCardsPanel: React.FC = () => {
  const [selectedCard, setSelectedCard] = useState(mockCards[0]);
  const utilisation = (selectedCard.balance / selectedCard.creditLimit) * 100;
  const utilisationColor =
    utilisation > 75 ? '#FF5A7E' : utilisation > 50 ? '#FFB547' : '#00D4AA';

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2.5 }}>
      {/* Header */}
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <Typography variant="h6" sx={{ fontWeight: 600, fontSize: '1rem' }}>My Cards</Typography>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <Typography
            component="a" href="#"
            sx={{ color: 'primary.main', fontSize: '0.8rem', fontWeight: 600, textDecoration: 'none', '&:hover': { color: 'primary.light' } }}
          >
            View All
          </Typography>
          <IconButton size="small" sx={{
            backgroundColor: alpha('#7C5CFC', 0.15),
            '&:hover': { backgroundColor: alpha('#7C5CFC', 0.25) },
          }}>
            <AddRoundedIcon sx={{ fontSize: 18, color: 'primary.main' }} />
          </IconButton>
        </Box>
      </Box>

      {/* Card */}
      <CardDisplay card={selectedCard} size="large" />

      {/* Selector dots */}
      <Box sx={{ display: 'flex', justifyContent: 'center', gap: 1 }}>
        {mockCards.map((card) => (
          <Box
            key={card.id}
            onClick={() => setSelectedCard(card)}
            sx={{
              width: card.id === selectedCard.id ? 20 : 6,
              height: 6, borderRadius: 3,
              backgroundColor: card.id === selectedCard.id
                ? 'primary.main'
                : 'rgba(255,255,255,0.2)',
              cursor: 'pointer',
              transition: 'all 0.3s ease',
            }}
          />
        ))}
      </Box>

      {/* Credit Utilisation */}
      <Box sx={{
        p: 2.5, borderRadius: 3,
        background: '#161A23',
        border: '1px solid rgba(255,255,255,0.06)',
      }}>
        <Typography variant="body2" sx={{ fontWeight: 600, mb: 2 }}>
          Credit Utilization
        </Typography>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          {/* SVG Gauge */}
          <Box sx={{ position: 'relative', width: 72, height: 72, flexShrink: 0 }}>
            <svg width="72" height="72" viewBox="0 0 72 72">
              <circle cx="36" cy="36" r="28" fill="none"
                stroke="rgba(255,255,255,0.06)" strokeWidth="8" />
              <circle cx="36" cy="36" r="28" fill="none"
                stroke={utilisationColor}
                strokeWidth="8"
                strokeDasharray={`${(utilisation / 100) * 175.9} 175.9`}
                strokeLinecap="round"
                transform="rotate(-90 36 36)"
              />
            </svg>
            <Box sx={{
              position: 'absolute', inset: 0,
              display: 'flex', flexDirection: 'column',
              alignItems: 'center', justifyContent: 'center',
            }}>
              <Typography sx={{ fontSize: '0.9rem', fontWeight: 700, color: utilisationColor, lineHeight: 1 }}>
                {Math.round(utilisation)}%
              </Typography>
              <Typography sx={{ fontSize: '0.5rem', color: 'text.secondary' }}>Used</Typography>
            </Box>
          </Box>
          <Box>
            <Typography variant="body2" sx={{ fontWeight: 600, mb: 0.5 }}>
              ${selectedCard.balance.toLocaleString()} of ${selectedCard.creditLimit.toLocaleString()}
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