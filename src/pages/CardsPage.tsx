import React, { useState } from 'react';
import {
    Box, Typography, Button, Chip,
    LinearProgress, alpha, Grid
} from '@mui/material';
import AddRoundedIcon from '@mui/icons-material/AddRounded';
import CreditCardRoundedIcon from '@mui/icons-material/CreditCardRounded';
import LockRoundedIcon from '@mui/icons-material/LockRounded';
import TrendingUpRoundedIcon from '@mui/icons-material/TrendingUpRounded';
import CardDisplay from '../components/cards/CardDisplay';
import { mockCards, mockTransactions } from '../utils/mockData';
import type { CreditCard } from '../types';
import { formatZAR } from '../utils/format';

const CardDetailPanel: React.FC<{ card: CreditCard }> = ({ card }) => {
    const utilisation = (card.balance / card.creditLimit) * 100;
    const utilisationColor =
        utilisation > 75 ? '#FF5A7E' : utilisation > 50 ? '#FFB547' : '#00D4AA';

    const cardTransactions = mockTransactions
        .filter(t => t.cardId === card.id)
        .slice(0, 4);

    const formatCurrency = formatZAR;

    return (
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2.5 }}>
            <Grid container spacing={2}>
                {[
                    { label: 'Current Balance', value: formatCurrency(card.balance), color: '#7C5CFC' },
                    { label: 'Credit Limit', value: formatCurrency(card.creditLimit), color: '#38BDF8' },
                    { label: 'Available Credit', value: formatCurrency(card.availableCredit), color: '#00D4AA' },
                ].map(stat => (
                    <Grid size={{ xs: 12, sm: 4 }} key={stat.label}>
                        <Box sx={{
                            p: 2, borderRadius: 3, textAlign: 'center',
                            background: '#161A23',
                            border: '1px solid rgba(255,255,255,0.06)',
                        }}>
                            <Typography variant="caption" sx={{ color: 'text.secondary', display: 'block', mb: 0.5 }}>
                                {stat.label}
                            </Typography>
                            <Typography variant="body1" sx={{ fontWeight: 700, color: stat.color }}>
                                {stat.value}
                            </Typography>
                        </Box>
                    </Grid>
                ))}
            </Grid>

            <Box sx={{
                p: 2.5, borderRadius: 3,
                background: '#161A23',
                border: '1px solid rgba(255,255,255,0.06)',
            }}>
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
                    value={utilisation}
                    sx={{
                        height: 8, borderRadius: 4,
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

            <Box sx={{
                p: 2.5, borderRadius: 3,
                background: '#161A23',
                border: '1px solid rgba(255,255,255,0.06)',
            }}>
                <Typography variant="body2" sx={{ fontWeight: 600, mb: 2 }}>
                    Card Actions
                </Typography>
                <Box sx={{ display: 'flex', gap: 1.5, flexWrap: 'wrap' }}>
                    {[
                        { label: 'View PIN', icon: '🔑' },
                        { label: 'Freeze Card', icon: '🧊' },
                        { label: 'Set Limit', icon: '⚙️' },
                        { label: 'Report Lost', icon: '🚨' },
                    ].map(action => (
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

            <Box sx={{
                p: 2.5, borderRadius: 3,
                background: '#161A23',
                border: '1px solid rgba(255,255,255,0.06)',
            }}>
                <Typography variant="body2" sx={{ fontWeight: 600, mb: 2 }}>
                    Recent on this card
                </Typography>
                {cardTransactions.length === 0 ? (
                    <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                        No recent transactions on this card.
                    </Typography>
                ) : (
                    cardTransactions.map((txn, idx) => (
                        <Box key={txn.id} sx={{
                            display: 'flex', alignItems: 'center', gap: 2,
                            py: 1.2,
                            borderBottom: idx < cardTransactions.length - 1
                                ? '1px solid rgba(255,255,255,0.04)'
                                : 'none',
                        }}>
                            <Box sx={{ fontSize: '1.1rem' }}>{txn.merchantLogo}</Box>
                            <Box sx={{ flex: 1 }}>
                                <Typography variant="caption" sx={{ fontWeight: 600, display: 'block' }}>
                                    {txn.merchantName}
                                </Typography>
                                <Typography variant="caption" sx={{ color: 'text.secondary', fontSize: '0.7rem' }}>
                                    {new Date(txn.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                                </Typography>
                            </Box>
                            <Typography variant="caption" sx={{
                                fontWeight: 700,
                                color: txn.amount > 0 ? 'success.main' : 'text.primary',
                            }}>
                                {formatZAR(txn.amount, true)}
                            </Typography>
                        </Box>
                    ))
                )}
            </Box>
        </Box>
    );
};

const CardsPage: React.FC = () => {
    const [selectedCard, setSelectedCard] = useState(mockCards[0]);

    return (
        <Box>
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 3 }}>
                <Box>
                    <Typography variant="h6" sx={{ fontWeight: 600 }}>
                        {mockCards.length} cards linked
                    </Typography>
                    <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                        Click a card to manage it
                    </Typography>
                </Box>
                <Button
                    variant="contained"
                    startIcon={<AddRoundedIcon />}
                    sx={{ borderRadius: 2 }}
                >
                    Add New Card
                </Button>
            </Box>

            <Grid container spacing={3}>
                <Grid size={{ xs: 12, lg: 5 }}>
                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                        {mockCards.map((card) => (
                            <Box
                                key={card.id}
                                onClick={() => setSelectedCard(card)}
                                sx={{
                                    p: 2, borderRadius: 3, cursor: 'pointer',
                                    border: '2px solid',
                                    borderColor: selectedCard.id === card.id
                                        ? 'primary.main'
                                        : 'rgba(255,255,255,0.06)',
                                    background: '#161A23',
                                    transition: 'all 0.2s ease',
                                    '&:hover': {
                                        borderColor: selectedCard.id === card.id
                                            ? 'primary.main'
                                            : 'rgba(255,255,255,0.15)',
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
                                        <Typography variant="caption" sx={{ color: 'text.secondary', textTransform: 'capitalize' }}>
                                            {card.network} · Expires {card.expiryDate}
                                        </Typography>
                                    </Box>
                                    <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
                                        {card.isPrimary && (
                                            <Chip
                                                label="Primary"
                                                size="small"
                                                sx={{
                                                    height: 20, fontSize: '0.65rem', fontWeight: 700,
                                                    backgroundColor: alpha('#7C5CFC', 0.15),
                                                    color: 'primary.main',
                                                }}
                                            />
                                        )}
                                        <Chip
                                            label="Active"
                                            size="small"
                                            sx={{
                                                height: 20, fontSize: '0.65rem', fontWeight: 700,
                                                backgroundColor: alpha('#00D4AA', 0.15),
                                                color: '#00D4AA',
                                            }}
                                        />
                                    </Box>
                                </Box>
                            </Box>
                        ))}
                        <Box sx={{
                            p: 3, borderRadius: 3, cursor: 'pointer',
                            border: '2px dashed rgba(255,255,255,0.08)',
                            display: 'flex', flexDirection: 'column',
                            alignItems: 'center', justifyContent: 'center',
                            gap: 1, minHeight: 100,
                            transition: 'all 0.2s ease',
                            '&:hover': {
                                borderColor: 'primary.main',
                                backgroundColor: alpha('#7C5CFC', 0.04),
                            },
                        }}>
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
                    <CardDetailPanel card={selectedCard} />
                </Grid>
            </Grid>
        </Box>
    );
};

export default CardsPage;