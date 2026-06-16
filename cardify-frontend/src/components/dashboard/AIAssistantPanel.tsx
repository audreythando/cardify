import React, { useEffect, useState } from 'react';
import {
  Box,
  Typography,
  Button,
  alpha,
  CircularProgress,
  Alert,
  Chip,
} from '@mui/material';
import AutoAwesomeRoundedIcon from '@mui/icons-material/AutoAwesomeRounded';
import ArrowForwardRoundedIcon from '@mui/icons-material/ArrowForwardRounded';
import { getAiInsights, type AiInsight } from '../../services/dashboardService';

interface AIAssistantPanelProps {
  onOpenChat?: () => void;
}

const getInsightColor = (type: string) => {
  const value = type.toLowerCase();

  if (value.includes('warning')) return '#FFB547';
  if (value.includes('alert')) return '#FF5A7E';
  if (value.includes('success')) return '#00D4AA';

  return '#7C5CFC';
};

const getStoredFirstName = () => {
  const rawUser = localStorage.getItem('cardify_user');

  if (!rawUser) return 'there';

  try {
    const user = JSON.parse(rawUser) as { fullName?: string };
    return user.fullName?.split(' ')[0] || 'there';
  } catch {
    return 'there';
  }
};

const AIAssistantPanel: React.FC<AIAssistantPanelProps> = ({ onOpenChat }) => {
  const [insights, setInsights] = useState<AiInsight[]>([]);
  const [loading, setLoading] = useState(true);
  const [error] = useState('');

  const firstName = getStoredFirstName();

  useEffect(() => {
    const loadInsights = async () => {
      try {
        const data = await getAiInsights();
        setInsights(data.slice(0, 3));
      } catch {
        setInsights([
          {
            title: 'Ask Cardify AI',
            message: 'Open the chat to get personalised advice from your local Ollama assistant.',
            insightType: 'Info',
          },
        ]);
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
            Cardify AI
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
          Open Chat
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
          👋 Hi {firstName}! I reviewed your latest Cardify data.
        </Typography>

        <Typography
          variant="caption"
          sx={{
            color: 'text.secondary',
            fontWeight: 600,
            display: 'block',
            mt: 1,
            mb: 0.75,
          }}
        >
          Quick insights:
        </Typography>

        {loading && (
          <Box sx={{ display: 'flex', justifyContent: 'center', py: 2 }}>
            <CircularProgress size={20} />
          </Box>
        )}

        {error && (
          <Alert severity="error" sx={{ mt: 1 }}>
            {error}
          </Alert>
        )}

        {!loading && !error && insights.length === 0 && (
          <Typography
            variant="caption"
            sx={{
              color: 'text.secondary',
              fontSize: '0.72rem',
              lineHeight: 1.4,
              display: 'block',
            }}
          >
            Add budgets and transactions to unlock personalised AI insights.
          </Typography>
        )}

        {!loading &&
          !error &&
          insights.map((insight) => {
            const color = getInsightColor(insight.insightType);

            return (
              <Box
                key={`${insight.title}-${insight.message}`}
                sx={{
                  mt: 1,
                  p: 1,
                  borderRadius: 1.5,
                  backgroundColor: alpha(color, 0.08),
                  border: '1px solid',
                  borderColor: alpha(color, 0.16),
                }}
              >
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.75, mb: 0.4 }}>
                  <Box
                    sx={{
                      width: 6,
                      height: 6,
                      borderRadius: '50%',
                      backgroundColor: color,
                      flexShrink: 0,
                    }}
                  />

                  <Typography
                    variant="caption"
                    sx={{
                      color: 'text.primary',
                      fontWeight: 700,
                      fontSize: '0.72rem',
                    }}
                  >
                    {insight.title}
                  </Typography>

                  {insight.insightType && (
                    <Chip
                      label={insight.insightType}
                      size="small"
                      sx={{
                        ml: 'auto',
                        height: 17,
                        fontSize: '0.58rem',
                        fontWeight: 700,
                        backgroundColor: alpha(color, 0.15),
                        color,
                      }}
                    />
                  )}
                </Box>

                <Typography
                  variant="caption"
                  sx={{
                    color: 'text.secondary',
                    fontSize: '0.7rem',
                    lineHeight: 1.45,
                    display: 'block',
                  }}
                >
                  {insight.message}
                </Typography>
              </Box>
            );
          })}
      </Box>

      <Button
        variant="contained"
        size="small"
        fullWidth
        endIcon={<ArrowForwardRoundedIcon sx={{ fontSize: 16 }} />}
        onClick={onOpenChat}
        sx={{ py: 1, fontSize: '0.8rem' }}
      >
        Ask Cardify AI
      </Button>
    </Box>
  );
};

export default AIAssistantPanel;