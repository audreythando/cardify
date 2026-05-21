import React from 'react';
import {
    Box, Drawer, List, ListItemButton, ListItemIcon,
    ListItemText, Typography, Avatar, Chip, Button, Divider, alpha
} from '@mui/material';
import DashboardRoundedIcon from '@mui/icons-material/DashboardRounded';
import CreditCardRoundedIcon from '@mui/icons-material/CreditCardRounded';
import ReceiptLongRoundedIcon from '@mui/icons-material/ReceiptLongRounded';
import BarChartRoundedIcon from '@mui/icons-material/BarChartRounded';
import AccountBalanceWalletRoundedIcon from '@mui/icons-material/AccountBalanceWalletRounded';
import AutoAwesomeRoundedIcon from '@mui/icons-material/AutoAwesomeRounded';
import SettingsRoundedIcon from '@mui/icons-material/SettingsRounded';
import StarRoundedIcon from '@mui/icons-material/StarRounded';
import KeyboardArrowDownRoundedIcon from '@mui/icons-material/KeyboardArrowDownRounded';
import { mockUser } from '../../utils/mockData';

const DRAWER_WIDTH = 260;

const navItems = [
    { label: 'Dashboard', icon: <DashboardRoundedIcon />, id: 'dashboard' },
    { label: 'My Cards', icon: <CreditCardRoundedIcon />, id: 'cards' },
    { label: 'Transactions', icon: <ReceiptLongRoundedIcon />, id: 'transactions' },
    { label: 'Analytics', icon: <BarChartRoundedIcon />, id: 'analytics' },
    { label: 'Budgets', icon: <AccountBalanceWalletRoundedIcon />, id: 'budgets' },
    { label: 'AI Assistant', icon: <AutoAwesomeRoundedIcon />, id: 'ai-assistant' },
    { label: 'Settings', icon: <SettingsRoundedIcon />, id: 'settings' },
];

interface SidebarProps {
    activePage: string;
    onNavigate: (page: string) => void;
}

const Sidebar: React.FC<SidebarProps> = ({ activePage, onNavigate }) => {
    return (
        <Drawer
            variant="permanent"
            sx={{
                width: DRAWER_WIDTH,
                flexShrink: 0,
                '& .MuiDrawer-paper': {
                    width: DRAWER_WIDTH,
                    boxSizing: 'border-box',
                    backgroundColor: '#0F1117',
                    borderRight: '1px solid rgba(255,255,255,0.05)',
                    display: 'flex',
                    flexDirection: 'column',
                },
            }}
        >
            {/* Logo */}
            <Box sx={{ px: 3, pt: 3, pb: 2 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                    <Box sx={{
                        width: 36, height: 36, borderRadius: 2,
                        background: 'linear-gradient(135deg, #7C5CFC, #5A3DD8)',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                    }}>
                        <CreditCardRoundedIcon sx={{ color: '#fff', fontSize: 20 }} />
                    </Box>
                    <Box>
                        <Typography variant="h6" sx={{ fontSize: '1rem', fontWeight: 700, lineHeight: 1.2 }}>
                            Cardify
                        </Typography>
                        <Typography variant="caption" sx={{ color: 'text.secondary', fontSize: '0.7rem' }}>
                            Credit Card System
                        </Typography>
                    </Box>
                </Box>
            </Box>

            {/* Nav Items */}
            <List sx={{ flex: 1, px: 1, py: 1 }}>
                {navItems.map((item) => {
                    const isActive = activePage === item.id;
                    return (
                        <ListItemButton
                            key={item.id}
                            selected={isActive}
                            onClick={() => onNavigate(item.id)}
                            sx={{
                                mb: 0.5,
                                py: 1.2,
                                '& .MuiListItemIcon-root': {
                                    color: isActive ? 'primary.main' : 'text.secondary',
                                    minWidth: 38,
                                },
                            }}
                        >
                            <ListItemIcon>{item.icon}</ListItemIcon>
                            <ListItemText
                                primary={
                                    <Typography sx={{
                                        fontSize: '0.875rem',
                                        fontWeight: isActive ? 600 : 400,
                                        color: isActive ? 'text.primary' : 'text.secondary',
                                    }}>
                                        {item.label}
                                    </Typography>
                                }
                            />
                            {item.id === 'ai-assistant' && (
                                <Chip
                                    label="AI"
                                    size="small"
                                    sx={{
                                        height: 18, fontSize: '0.6rem', fontWeight: 700,
                                        background: 'linear-gradient(135deg, #7C5CFC, #00D4AA)',
                                        color: '#fff',
                                    }}
                                />
                            )}
                        </ListItemButton>
                    );
                })}
            </List>

            <Divider sx={{ borderColor: 'rgba(255,255,255,0.05)', mx: 2 }} />

            {/* Upgrade Banner */}
            <Box sx={{
                mx: 2, my: 2, p: 2, borderRadius: 3,
                background: alpha('#7C5CFC', 0.1),
                border: '1px solid',
                borderColor: alpha('#7C5CFC', 0.2),
            }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 0.5 }}>
                    <StarRoundedIcon sx={{ color: 'primary.main', fontSize: 16 }} />
                    <Typography variant="caption" sx={{ fontWeight: 700, color: 'primary.light' }}>
                        Upgrade to Premium
                    </Typography>
                </Box>
                <Typography variant="caption" sx={{
                    color: 'text.secondary', display: 'block', mb: 1.5, lineHeight: 1.4,
                }}>
                    Unlock exclusive AI insights & unlimited cards
                </Typography>
                <Button variant="contained" size="small" fullWidth sx={{ py: 0.8, fontSize: '0.75rem' }}>
                    Upgrade Now
                </Button>
            </Box>

            {/* User Profile */}
            <Box sx={{ p: 2, pt: 0 }}>
                <Box sx={{
                    display: 'flex', alignItems: 'center', gap: 1.5,
                    p: 1.5, borderRadius: 2, cursor: 'pointer',
                    '&:hover': { backgroundColor: alpha('#fff', 0.04) },
                }}>
                    <Avatar src={mockUser.avatarUrl} sx={{ width: 36, height: 36 }} />
                    <Box sx={{ flex: 1, minWidth: 0 }}>
                        <Typography variant="body2" sx={{ fontWeight: 600, fontSize: '0.8rem' }}>
                            {mockUser.name}
                        </Typography>
                        <Typography variant="caption" sx={{ color: 'text.secondary', fontSize: '0.7rem' }}>
                            {mockUser.email}
                        </Typography>
                    </Box>
                    <KeyboardArrowDownRoundedIcon sx={{ color: 'text.secondary', fontSize: 18 }} />
                </Box>
            </Box>
        </Drawer>
    );
};

export default Sidebar;