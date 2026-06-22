import React, { useEffect, useState } from 'react';
import { Box, Typography, IconButton, Avatar, Badge, alpha } from '@mui/material';
import SearchRoundedIcon from '@mui/icons-material/SearchRounded';
import NotificationsRoundedIcon from '@mui/icons-material/NotificationsRounded';

interface StoredUser {
  fullName?: string;
  email?: string;
  avatarUrl?: string | null;
}

const getStoredUser = (): StoredUser => {
  const raw = localStorage.getItem('cardify_user');
  if (!raw) return {};
  try {
    return JSON.parse(raw) as StoredUser;
  } catch {
    return {};
  }
};

const getInitials = (name?: string) => {
  if (!name) return 'CU';
  return name
    .split(' ')
    .map((part) => part[0])
    .join('')
    .slice(0, 2)
    .toUpperCase();
};

interface TopNavProps {
  activePage: string;
}

const TopNav: React.FC<TopNavProps> = ({ activePage }) => {
  const [user, setUser] = useState<StoredUser>(getStoredUser);

  // Refresh when the photo/profile changes elsewhere (e.g. Settings page).
  useEffect(() => {
    const refresh = () => setUser(getStoredUser());
    window.addEventListener('cardify-user-updated', refresh);
    return () => window.removeEventListener('cardify-user-updated', refresh);
  }, []);

  const firstName = user.fullName?.split(' ')[0] || 'there';

  const pageTitles: Record<string, { title: string; subtitle: string }> = {
    dashboard: {
      title: `Welcome back, ${firstName} 👋`,
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

      <Box>
        <Typography variant="h5" sx={{ fontWeight: 700, fontSize: '1.3rem' }}>
          {page.title}
        </Typography>
        <Typography variant="body2" sx={{ color: 'text.secondary', mt: 0.3 }}>
          {page.subtitle}
        </Typography>
      </Box>

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
          src={user.avatarUrl ?? undefined}
          sx={{ width: 36, height: 36, cursor: 'pointer', ml: 1, bgcolor: 'primary.main' }}
        >
          {getInitials(user.fullName)}
        </Avatar>
      </Box>
    </Box>
  );
};

export default TopNav;