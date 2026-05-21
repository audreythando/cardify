import React from 'react';
import { Box, Typography, IconButton, Avatar, Badge, alpha } from '@mui/material';
import SearchRoundedIcon from '@mui/icons-material/SearchRounded';
import NotificationsRoundedIcon from '@mui/icons-material/NotificationsRounded';
import { mockUser } from '../../utils/mockData';

const pageTitles: Record<string, { title: string; subtitle: string }> = {
  dashboard: {
    title: `Welcome back, ${mockUser.name.split(' ')[0]} 👋`,
    subtitle: "Here's what's happening with your cards today.",
  },
  cards: {
    title: 'My Cards',
    subtitle: 'Manage your credit cards and track balances.',
  },
  transactions: {
    title: 'Transactions',
    subtitle: 'View and search your recent activity.',
  },
  analytics: {
    title: 'Analytics',
    subtitle: 'Insights into your spending behaviour.',
  },
  budgets: {
    title: 'Budgets',
    subtitle: 'Set and track your monthly spending limits.',
  },
  'ai-assistant': {
    title: 'AI Assistant',
    subtitle: 'Your personal AI-powered financial advisor.',
  },
  settings: {
    title: 'Settings',
    subtitle: 'Manage your account and preferences.',
  },
};

interface TopNavProps {
  activePage: string;
}

const TopNav: React.FC<TopNavProps> = ({ activePage }) => {
  const page = pageTitles[activePage] || pageTitles.dashboard;

  return (
    <Box sx={{
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      px: 4,
      py: 2.5,
      borderBottom: '1px solid rgba(255,255,255,0.05)',
      backgroundColor: '#0D0F14',
      position: 'sticky',
      top: 0,
      zIndex: 100,
    }}>
      {/* Page Title */}
      <Box>
        <Typography variant="h5" sx={{ fontWeight: 700, fontSize: '1.3rem' }}>
          {page.title}
        </Typography>
        <Typography variant="body2" sx={{ color: 'text.secondary', mt: 0.3 }}>
          {page.subtitle}
        </Typography>
      </Box>

      {/* Actions */}
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
        <IconButton sx={{
          backgroundColor: alpha('#fff', 0.05),
          borderRadius: 2,
          '&:hover': { backgroundColor: alpha('#fff', 0.08) },
        }}>
          <SearchRoundedIcon sx={{ fontSize: 20 }} />
        </IconButton>

        <IconButton sx={{
          backgroundColor: alpha('#fff', 0.05),
          borderRadius: 2,
          '&:hover': { backgroundColor: alpha('#fff', 0.08) },
        }}>
          <Badge
            badgeContent={3}
            color="error"
            sx={{ '& .MuiBadge-badge': { fontSize: '0.6rem', minWidth: 16, height: 16 } }}
          >
            <NotificationsRoundedIcon sx={{ fontSize: 20 }} />
          </Badge>
        </IconButton>

        <Avatar
          src={mockUser.avatarUrl}
          sx={{ width: 36, height: 36, cursor: 'pointer', ml: 1 }}
        />
      </Box>
    </Box>
  );
};

export default TopNav;