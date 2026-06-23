import React, { useEffect, useState } from 'react';
import {
  Box, Typography, IconButton, Avatar, Badge, alpha,
  Menu, Divider, Button, CircularProgress,
} from '@mui/material';
import SearchRoundedIcon from '@mui/icons-material/SearchRounded';
import NotificationsRoundedIcon from '@mui/icons-material/NotificationsRounded';
import {
  getNotifications,
  markNotificationRead,
  markAllNotificationsRead,
  type AppNotification,
} from '../../services/notificationsService';

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
  return name.split(' ').map((p) => p[0]).join('').slice(0, 2).toUpperCase();
};

const dotColor = (type: string) => {
  const v = type.toLowerCase();
  if (v === 'alert') return '#FF5A7E';
  if (v === 'warning') return '#FFB547';
  return '#7C5CFC';
};

interface TopNavProps {
  activePage: string;
}

const TopNav: React.FC<TopNavProps> = ({ activePage }) => {
  const [user, setUser] = useState<StoredUser>(getStoredUser);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [items, setItems] = useState<AppNotification[]>([]);
  const [unread, setUnread] = useState(0);
  const [loadingNotifs, setLoadingNotifs] = useState(false);

  useEffect(() => {
    const refresh = () => setUser(getStoredUser());
    window.addEventListener('cardify-user-updated', refresh);
    return () => window.removeEventListener('cardify-user-updated', refresh);
  }, []);

  const loadNotifications = async () => {
    try {
      const feed = await getNotifications();
      setItems(feed.items);
      setUnread(feed.unreadCount);
    } catch {
    }
  };

  // Initial count on mount.
  useEffect(() => {
    loadNotifications();
  }, []);

  const openMenu = async (e: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(e.currentTarget);
    setLoadingNotifs(true);
    await loadNotifications();
    setLoadingNotifs(false);
  };

  const closeMenu = () => setAnchorEl(null);

  const handleItemClick = async (n: AppNotification) => {
    if (!n.isRead) {
      try {
        await markNotificationRead(n.id);
        setItems((prev) =>
          prev.map((it) => (it.id === n.id ? { ...it, isRead: true } : it))
        );
        setUnread((u) => Math.max(0, u - 1));
      } catch {
        /* ignore */
      }
    }
  };

  const handleMarkAll = async () => {
    try {
      await markAllNotificationsRead();
      setItems((prev) => prev.map((it) => ({ ...it, isRead: true })));
      setUnread(0);
    } catch {
      /* ignore */
    }
  };

  const firstName = user.fullName?.split(' ')[0] || 'there';

  const pageTitles: Record<string, { title: string; subtitle: string }> = {
    dashboard: { title: `Welcome back, ${firstName} 👋`, subtitle: "Here's what's happening with your cards today." },
    cards: { title: 'My Cards', subtitle: 'Manage your credit cards and track balances.' },
    transactions: { title: 'Transactions', subtitle: 'View and search your recent activity.' },
    analytics: { title: 'Analytics', subtitle: 'Insights into your spending behaviour.' },
    budgets: { title: 'Budgets', subtitle: 'Set and track your monthly spending limits.' },
    'ai-assistant': { title: 'AI Assistant', subtitle: 'Your personal AI-powered financial advisor.' },
    settings: { title: 'Settings', subtitle: 'Manage your account and preferences.' },
  };

  const page = pageTitles[activePage] || pageTitles.dashboard;

  return (
    <Box sx={{
      display: 'flex', alignItems: 'center', justifyContent: 'space-between',
      px: 4, py: 2.5, borderBottom: '1px solid rgba(255,255,255,0.05)',
      backgroundColor: '#0D0F14', position: 'sticky', top: 0, zIndex: 100,
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
          backgroundColor: alpha('#fff', 0.05), borderRadius: 2,
          '&:hover': { backgroundColor: alpha('#fff', 0.08) },
        }}>
          <SearchRoundedIcon sx={{ fontSize: 20 }} />
        </IconButton>

        <IconButton
          onClick={openMenu}
          sx={{
            backgroundColor: alpha('#fff', 0.05), borderRadius: 2,
            '&:hover': { backgroundColor: alpha('#fff', 0.08) },
          }}
        >
          <Badge
            badgeContent={unread}
            color="error"
            sx={{ '& .MuiBadge-badge': { fontSize: '0.6rem', minWidth: 16, height: 16 } }}
          >
            <NotificationsRoundedIcon sx={{ fontSize: 20 }} />
          </Badge>
        </IconButton>

        <Menu
          anchorEl={anchorEl}
          open={Boolean(anchorEl)}
          onClose={closeMenu}
          anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
          transformOrigin={{ vertical: 'top', horizontal: 'right' }}
          slotProps={{
            paper: {
              sx: {
                width: 360, maxHeight: 460, mt: 1,
                backgroundColor: '#161A23',
                border: '1px solid rgba(255,255,255,0.08)',
                borderRadius: 3,
              },
            },
          }}
        >
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', px: 2, py: 1.5 }}>
            <Typography variant="body2" sx={{ fontWeight: 700 }}>
              Notifications
            </Typography>
            {unread > 0 && (
              <Button size="small" onClick={handleMarkAll} sx={{ fontSize: '0.7rem' }}>
                Mark all read
              </Button>
            )}
          </Box>

          <Divider sx={{ borderColor: 'rgba(255,255,255,0.06)' }} />

          {loadingNotifs && (
            <Box sx={{ display: 'flex', justifyContent: 'center', py: 3 }}>
              <CircularProgress size={20} />
            </Box>
          )}

          {!loadingNotifs && items.length === 0 && (
            <Box sx={{ px: 2, py: 3, textAlign: 'center' }}>
              <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                You're all caught up.
              </Typography>
            </Box>
          )}

          {!loadingNotifs && items.map((n) => (
            <Box
              key={n.id}
              onClick={() => handleItemClick(n)}
              sx={{
                display: 'flex', gap: 1.5, px: 2, py: 1.4, cursor: 'pointer',
                borderBottom: '1px solid rgba(255,255,255,0.04)',
                backgroundColor: n.isRead ? 'transparent' : alpha('#7C5CFC', 0.06),
                '&:hover': { backgroundColor: alpha('#fff', 0.04) },
              }}
            >
              <Box sx={{
                width: 8, height: 8, borderRadius: '50%', mt: 0.6, flexShrink: 0,
                backgroundColor: n.isRead ? 'transparent' : dotColor(n.type),
                border: n.isRead ? '1px solid rgba(255,255,255,0.15)' : 'none',
              }} />
              <Box sx={{ flex: 1, minWidth: 0 }}>
                <Typography variant="caption" sx={{ fontWeight: 700, display: 'block' }}>
                  {n.title}
                </Typography>
                <Typography variant="caption" sx={{ color: 'text.secondary', display: 'block', lineHeight: 1.4 }}>
                  {n.message}
                </Typography>
              </Box>
            </Box>
          ))}
        </Menu>

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