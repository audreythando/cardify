import React, { useEffect, useState } from 'react';
import {
  Box,
  Typography,
  Button,
  alpha,
  CircularProgress,
  Alert,
} from '@mui/material';
import ArrowForwardRoundedIcon from '@mui/icons-material/ArrowForwardRounded';
import StatCards from '../components/dashboard/StatCards';
import SpendingOverview from '../components/dashboard/SpendingOverview';
import RecentTransactions from '../components/dashboard/RecentTransactions';
import MyCardsPanel from '../components/dashboard/MyCardsPanel';
import AIAssistantPanel from '../components/dashboard/AIAssistantPanel';
import { getDashboardSummary } from '../services/dashboardService';
import type { DashboardSummary } from '../services/dashboardService';

interface DashboardPageProps {
  onNavigate: (page: string) => void;
}

const DashboardPage: React.FC<DashboardPageProps> = ({ onNavigate }) => {
  const [summary, setSummary] = useState<DashboardSummary | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const loadDashboard = async () => {
      try {
        const data = await getDashboardSummary();
        setSummary(data);
      } catch {
        setError('Could not load dashboard data.');
      } finally {
        setLoading(false);
      }
    };

    loadDashboard();
  }, []);

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', mt: 6 }}>
        <CircularProgress />
      </Box>
    );
  }

  if (error || !summary) {
    return <Alert severity="error">{error || 'Dashboard data unavailable.'}</Alert>;
  }

  return (
    <Box>
      <Box sx={{ mb: 3 }}>
        <StatCards summary={summary} />
      </Box>

      <Box
        sx={{
          display: 'grid',
          gridTemplateColumns: { xs: '1fr', lg: '1fr 380px' },
          gap: 3,
        }}
      >
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
          <Box
            sx={{
              display: 'grid',
              gridTemplateColumns: { xs: '1fr', md: '5fr 7fr' },
              gap: 3,
            }}
          >
            <SpendingOverview />
            <RecentTransactions />
          </Box>

          <Box
            sx={{
              p: 3,
              borderRadius: 3,
              background: `linear-gradient(135deg, ${alpha('#7C5CFC', 0.15)} 0%, ${alpha('#00D4AA', 0.08)} 100%)`,
              border: '1px solid',
              borderColor: alpha('#7C5CFC', 0.2),
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              gap: 2,
              flexWrap: 'wrap',
            }}
          >
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              <Box
                sx={{
                  width: 56,
                  height: 56,
                  borderRadius: 3,
                  background: 'linear-gradient(135deg, #7C5CFC, #00D4AA)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '1.5rem',
                  flexShrink: 0,
                }}
              >
                🤖
              </Box>

              <Box>
                <Typography variant="h6" sx={{ fontWeight: 700, mb: 0.3 }}>
                  Meet your AI Financial Assistant
                </Typography>
                <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                  Get personalised insights, spending tips and answers to your financial questions.
                </Typography>
              </Box>
            </Box>

            <Button
              variant="contained"
              endIcon={<ArrowForwardRoundedIcon />}
              onClick={() => onNavigate('ai-assistant')}
              sx={{ flexShrink: 0, whiteSpace: 'nowrap' }}
            >
              Chat with AI
            </Button>
          </Box>
        </Box>

        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
          <MyCardsPanel />
          <AIAssistantPanel onOpenChat={() => onNavigate('ai-assistant')} />
        </Box>
      </Box>
    </Box>
  );
};

export default DashboardPage;