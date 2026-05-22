import React from 'react';
import { Box, Typography } from '@mui/material';
import type { CreditCard } from '../../types';

const cardGradients: Record<string, string> = {
  purple: 'linear-gradient(135deg, #7C5CFC 0%, #4A2EC7 50%, #3B1FA8 100%)',
  gold: 'linear-gradient(135deg, #C8972B 0%, #A67720 50%, #7A5510 100%)',
  dark: 'linear-gradient(135deg, #2A3244 0%, #1E2535 50%, #161C2A 100%)',
};

interface CardDisplayProps {
  card: CreditCard;
  isSelected?: boolean;
  onClick?: () => void;
  size?: 'small' | 'large';
}

const CardDisplay: React.FC<CardDisplayProps> = ({
  card, isSelected, onClick, size = 'large',
}) => {
  const isLarge = size === 'large';

  return (
    <Box
      onClick={onClick}
      sx={{
        background: cardGradients[card.color],
        borderRadius: isLarge ? 4 : 3,
        p: isLarge ? 3 : 2,
        width: '100%',
        aspectRatio: '1.586 / 1',
        cursor: onClick ? 'pointer' : 'default',
        position: 'relative',
        overflow: 'hidden',
        transition: 'all 0.3s ease',
        boxShadow: isSelected
          ? '0 0 0 2px #fff, 0 20px 40px rgba(0,0,0,0.4)'
          : '0 12px 32px rgba(0,0,0,0.3)',
        '&:hover': onClick ? {
          transform: 'translateY(-4px)',
          boxShadow: '0 20px 40px rgba(0,0,0,0.4)',
        } : {},
        '&::before': {
          content: '""',
          position: 'absolute',
          top: -60, right: -60,
          width: 200, height: 200,
          borderRadius: '50%',
          background: 'rgba(255,255,255,0.06)',
        },
        '&::after': {
          content: '""',
          position: 'absolute',
          bottom: -80, left: -30,
          width: 240, height: 240,
          borderRadius: '50%',
          background: 'rgba(255,255,255,0.04)',
        },
      }}
    >
      {/* Network Logo */}
      <Box sx={{ position: 'absolute', top: isLarge ? 20 : 14, right: isLarge ? 24 : 16, zIndex: 1 }}>
        {card.network === 'visa' && (
          <Typography sx={{
            fontStyle: 'italic', fontWeight: 900,
            fontSize: isLarge ? '1.4rem' : '1rem',
            color: '#fff', letterSpacing: '-0.02em',
          }}>
            VISA
          </Typography>
        )}
        {card.network === 'mastercard' && (
          <Box sx={{ display: 'flex' }}>
            <Box sx={{
              width: isLarge ? 28 : 20, height: isLarge ? 28 : 20,
              borderRadius: '50%', backgroundColor: '#EB001B', opacity: 0.9,
            }} />
            <Box sx={{
              width: isLarge ? 28 : 20, height: isLarge ? 28 : 20,
              borderRadius: '50%', backgroundColor: '#F79E1B', opacity: 0.9,
              ml: isLarge ? -1.2 : -0.8,
            }} />
          </Box>
        )}
      </Box>

      {/* Chip */}
      <Box sx={{ position: 'absolute', top: isLarge ? 48 : 34, left: isLarge ? 24 : 16, zIndex: 1 }}>
        <Box sx={{
          width: isLarge ? 42 : 30, height: isLarge ? 32 : 22,
          borderRadius: 1, backgroundColor: 'rgba(255,215,0,0.7)',
          display: 'grid', gridTemplateColumns: '1fr 1fr',
          gap: '1px', padding: '2px',
        }}>
          {[0, 1, 2, 3].map(i => (
            <Box key={i} sx={{ backgroundColor: 'rgba(184,134,11,0.5)', borderRadius: 0.3 }} />
          ))}
        </Box>
      </Box>

      {/* Card Number */}
      <Box sx={{ position: 'absolute', bottom: isLarge ? 60 : 42, left: isLarge ? 24 : 16, zIndex: 1 }}>
        <Typography sx={{
          fontFamily: 'monospace',
          fontSize: isLarge ? '1.05rem' : '0.8rem',
          fontWeight: 400,
          color: 'rgba(255,255,255,0.85)',
          letterSpacing: isLarge ? '0.18em' : '0.14em',
        }}>
          •••• •••• •••• {card.lastFour}
        </Typography>
      </Box>

      {/* Cardholder + Balance */}
      <Box sx={{
        position: 'absolute',
        bottom: isLarge ? 20 : 14,
        left: isLarge ? 24 : 16,
        right: isLarge ? 24 : 16,
        display: 'flex', justifyContent: 'space-between',
        alignItems: 'flex-end', zIndex: 1,
      }}>
        <Typography sx={{
          fontSize: isLarge ? '0.85rem' : '0.7rem',
          color: 'rgba(255,255,255,0.7)', fontWeight: 500,
        }}>
          {card.cardholderName}
        </Typography>
        <Box sx={{ textAlign: 'right' }}>
          <Typography sx={{
            fontSize: isLarge ? '1rem' : '0.8rem',
            fontWeight: 700, color: '#fff', lineHeight: 1,
          }}>
            ${card.balance.toLocaleString('en-US', { minimumFractionDigits: 2 })}
          </Typography>
          <Typography sx={{ fontSize: '0.6rem', color: 'rgba(255,255,255,0.5)', mt: 0.2 }}>
            Current Balance
          </Typography>
        </Box>
      </Box>

      {/* Expiry */}
      <Box sx={{ position: 'absolute', bottom: isLarge ? 38 : 28, right: isLarge ? 24 : 16, zIndex: 1 }}>
        <Typography sx={{ fontSize: '0.55rem', color: 'rgba(255,255,255,0.4)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
          Expires
        </Typography>
        <Typography sx={{
          fontSize: isLarge ? '0.72rem' : '0.6rem',
          fontWeight: 600, color: 'rgba(255,255,255,0.7)',
        }}>
          {card.expiryDate}
        </Typography>
      </Box>
    </Box>
  );
};

export default CardDisplay;