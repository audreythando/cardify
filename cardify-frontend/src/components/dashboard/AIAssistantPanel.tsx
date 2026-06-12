import React, { useEffect, useState } from 'react';
import {
  Box,
  Typography,
  Button,
  alpha,
  CircularProgress,
  Alert,
} from '@mui/material';
import AutoAwesomeRoundedIcon from '@mui/icons-material/AutoAwesomeRounded';
import ArrowForwardRoundedIcon from '@mui/icons-material/ArrowForwardRounded';
import { getAiInsights, type AiInsight } from '../../services/dashboardService';

interface AIAssistantPanelProps {
  onOpenChat?: () => void;
}

const AIAssistantPanel: React.FC<AIAssistantPanelProps> = ({ onOpenChat }) => {
  const [insights, setInsights] = useState<AiInsight[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const loadInsights = async () => {
      try {
        const data = await getAiInsights();
        setInsights(data.slice(0, 3));
      } catch {
        setError('Could not load AI insights.');
      } finally {
        setLoading(false);
      }
    };

    loadInsights();
  }, []);

  return (
    <Box
      sx={{
        p: 2.5,
        borderRadius: 3,
        background: '#161A23',
        border: '1px solid rgba(255,255,255,0.06)',
      }}
    >
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          mb: 2,
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <Box
            sx={{
              width: 28,
              height: 28,
              borderRadius: 1.5,
              background: 'linear-gradient(135deg, #7C5CFC, #00D4AA)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <AutoAwesomeRoundedIcon sx={{ fontSize: 15, color: '#fff' }} />
          </Box>

          <Typography variant="body2" sx={{ fontWeight: 700 }}>
            AI Assistant
          </Typography>
        </Box>

        <Typography
          component="a"
          href="#"
          onClick={(e) => {
            e.preventDefault();
            onOpenChat?.();
          }}
          sx={{
            color: 'primary.main',
            fontSize: '0.75rem',
            fontWeight: 600,
            textDecoration: 'none',
            cursor: 'pointer',
            '&:hover': { color: 'primary.light' },
          }}
        >
          View Chat
        </Typography>
      </Box>

      <Box
        sx={{
          p: 2,
          borderRadius: 2.5,
          mb: 2,
          background: alpha('#7C5CFC', 0.08),
          border: '1px solid',
          borderColor: alpha('#7C5CFC', 0.15),
        }}
      >
        <Typography
          variant="caption"
          sx={{ color: 'text.primary', lineHeight: 1.6, display: 'block' }}
        >
          👋 Hi Audrey! I've analysed your spending this month.
        </Typography>

        <Typography
          variant="caption"
          sx={{
            color: 'text.secondary',
            fontWeight: 600,
            display: 'block',
            mt: 1,
            mb: 0.5,
          }}
        >
          Here are some insights:
        </Typography>

        {loading && (
          <Box sx={{ display: 'flex', justifyContent: 'center', py: 2 }}>
            <CircularProgress size={20} />
          </Box>
        )}

        {error && <Alert severity="error">{error}</Alert>}

        {!loading && !error && insights.length === 0 && (
          <Typography
            variant="caption"
            sx={{ color: 'text.secondary', fontSize: '0.72rem', lineHeight: 1.4 }}
          >
            No insights yet. Add budgets and transactions to generate personalised insights.
          </Typography>
        )}

        {!loading &&
          !error &&
          insights.map((insight) => (
            <Box
              key={`${insight.title}-${insight.message}`}
              sx={{ display: 'flex', gap: 0.5, mt: 0.5 }}
            >
              <Typography
                variant="caption"
                sx={{ color: 'primary.light', fontSize: '0.7rem' }}
              >
                •
              </Typography>

              <Typography
                variant="caption"
                sx={{ color: 'text.secondary', fontSize: '0.72rem', lineHeight: 1.4 }}
              >
                {insight.title}: {insight.message}
              </Typography>
            </Box>
          ))}
      </Box>

      <Button
        variant="contained"
        size="small"
        fullWidth
        endIcon={<ArrowForwardRoundedIcon sx={{ fontSize: 16 }} />}
        onClick={onOpenChat}
        sx={{ py: 1, fontSize: '0.8rem' }}
      >
        Show me how to save
      </Button>
    </Box>
  );
};

export default AIAssistantPanel;