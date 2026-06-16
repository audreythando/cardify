import React, { useState, useRef, useEffect } from 'react';
import {
  Box,
  Typography,
  TextField,
  IconButton,
  CircularProgress,
  Chip,
  Avatar,
  alpha,
} from '@mui/material';
import SendRoundedIcon from '@mui/icons-material/SendRounded';
import AutoAwesomeRoundedIcon from '@mui/icons-material/AutoAwesomeRounded';
import type { ChatMessage } from '../types';
import { generateFinancialInsight } from '../services/aiService';

const SUGGESTED_PROMPTS = [
  'How can I reduce my spending this month?',
  'What is my highest spending category?',
  'Am I on track with my budget?',
  'How can I improve my credit score?',
  'Are there any unusual transactions?',
];

const getStoredUser = () => {
  const rawUser = localStorage.getItem('cardify_user');

  if (!rawUser) {
    return {
      fullName: 'Cardify User',
      email: 'user@cardify.app',
    };
  }

  try {
    return JSON.parse(rawUser) as {
      fullName?: string;
      email?: string;
    };
  } catch {
    return {
      fullName: 'Cardify User',
      email: 'user@cardify.app',
    };
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

const AIAssistantPage: React.FC = () => {
  const user = getStoredUser();
  const firstName = user.fullName?.split(' ')[0] || 'there';

  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: '0',
      role: 'assistant',
      content: `👋 Hi ${firstName}! I'm your Cardify AI Financial Assistant.

I can help you understand your spending, budgets, card usage, and financial habits.

Ask me things like:
• How can I reduce my spending?
• Which category should I watch?
• Am I on track with my budget?`,
      timestamp: new Date().toISOString(),
    },
  ]);

  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const sendMessage = async (text: string) => {
    if (!text.trim() || isLoading) return;

    const userMsg: ChatMessage = {
      id: Date.now().toString(),
      role: 'user',
      content: text,
      timestamp: new Date().toISOString(),
    };

    setMessages((prev) => [...prev, userMsg]);
    setInput('');
    setIsLoading(true);

    try {
      const replyText = await generateFinancialInsight(text);

      setMessages((prev) => [
        ...prev,
        {
          id: (Date.now() + 1).toString(),
          role: 'assistant',
          content: replyText,
          timestamp: new Date().toISOString(),
        },
      ]);
    } catch {
      setMessages((prev) => [
        ...prev,
        {
          id: (Date.now() + 1).toString(),
          role: 'assistant',
          content:
            '⚠️ Could not connect to Cardify AI right now. Make sure the .NET backend is running and Ollama is available locally.',
          timestamp: new Date().toISOString(),
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage(input);
    }
  };

  const formatTime = (ts: string) =>
    new Date(ts).toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
    });

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', height: 'calc(100vh - 130px)' }}>
      <Box sx={{ flex: 1, overflowY: 'auto', px: 1, py: 2 }}>
        {messages.map((msg) => (
          <Box
            key={msg.id}
            sx={{
              display: 'flex',
              flexDirection: msg.role === 'user' ? 'row-reverse' : 'row',
              gap: 1.5,
              mb: 2.5,
            }}
          >
            {msg.role === 'assistant' ? (
              <Box
                sx={{
                  width: 34,
                  height: 34,
                  borderRadius: 2,
                  flexShrink: 0,
                  background: 'linear-gradient(135deg, #7C5CFC, #00D4AA)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  mt: 0.5,
                }}
              >
                <AutoAwesomeRoundedIcon sx={{ fontSize: 16, color: '#fff' }} />
              </Box>
            ) : (
              <Avatar sx={{ width: 34, height: 34, mt: 0.5, flexShrink: 0, bgcolor: 'primary.main' }}>
                {getInitials(user.fullName)}
              </Avatar>
            )}

            <Box sx={{ maxWidth: '72%' }}>
              <Box
                sx={{
                  p: 2,
                  borderRadius:
                    msg.role === 'user'
                      ? '16px 4px 16px 16px'
                      : '4px 16px 16px 16px',
                  backgroundColor:
                    msg.role === 'user' ? alpha('#7C5CFC', 0.2) : '#1E2330',
                  border: '1px solid',
                  borderColor:
                    msg.role === 'user'
                      ? alpha('#7C5CFC', 0.3)
                      : 'rgba(255,255,255,0.06)',
                }}
              >
                <Typography
                  variant="body2"
                  sx={{
                    fontSize: '0.875rem',
                    lineHeight: 1.7,
                    whiteSpace: 'pre-wrap',
                  }}
                >
                  {msg.content}
                </Typography>
              </Box>

              <Typography
                variant="caption"
                sx={{
                  color: 'text.secondary',
                  fontSize: '0.68rem',
                  mt: 0.5,
                  display: 'block',
                  textAlign: msg.role === 'user' ? 'right' : 'left',
                }}
              >
                {formatTime(msg.timestamp)}
              </Typography>
            </Box>
          </Box>
        ))}

        {isLoading && (
          <Box sx={{ display: 'flex', gap: 1.5, mb: 2 }}>
            <Box
              sx={{
                width: 34,
                height: 34,
                borderRadius: 2,
                background: 'linear-gradient(135deg, #7C5CFC, #00D4AA)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <AutoAwesomeRoundedIcon sx={{ fontSize: 16, color: '#fff' }} />
            </Box>

            <Box
              sx={{
                p: 2,
                borderRadius: '4px 16px 16px 16px',
                backgroundColor: '#1E2330',
                border: '1px solid rgba(255,255,255,0.06)',
                display: 'flex',
                alignItems: 'center',
                gap: 1,
              }}
            >
              <CircularProgress size={14} sx={{ color: 'primary.main' }} />
              <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                Cardify AI is thinking...
              </Typography>
            </Box>
          </Box>
        )}

        <div ref={bottomRef} />
      </Box>

      {messages.length <= 1 && (
        <Box sx={{ px: 1, pb: 2 }}>
          <Typography variant="caption" sx={{ color: 'text.secondary', mb: 1, display: 'block' }}>
            Try asking:
          </Typography>

          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
            {SUGGESTED_PROMPTS.map((prompt) => (
              <Chip
                key={prompt}
                label={prompt}
                size="small"
                clickable
                onClick={() => sendMessage(prompt)}
                sx={{
                  fontSize: '0.72rem',
                  height: 'auto',
                  py: 0.5,
                  backgroundColor: alpha('#7C5CFC', 0.1),
                  border: '1px solid',
                  borderColor: alpha('#7C5CFC', 0.2),
                  color: 'text.primary',
                  '&:hover': { backgroundColor: alpha('#7C5CFC', 0.2) },
                }}
              />
            ))}
          </Box>
        </Box>
      )}

      <Box
        sx={{
          display: 'flex',
          gap: 1.5,
          p: 2,
          borderTop: '1px solid rgba(255,255,255,0.06)',
          backgroundColor: '#161A23',
          borderRadius: 3,
        }}
      >
        <TextField
          fullWidth
          multiline
          maxRows={4}
          placeholder="Ask me anything about your finances..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          size="small"
          sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2.5, fontSize: '0.875rem' } }}
        />

        <IconButton
          onClick={() => sendMessage(input)}
          disabled={!input.trim() || isLoading}
          sx={{
            background: 'linear-gradient(135deg, #7C5CFC, #5A3DD8)',
            borderRadius: 2,
            width: 44,
            height: 44,
            flexShrink: 0,
            '&:hover': { background: 'linear-gradient(135deg, #9B80FF, #7C5CFC)' },
            '&.Mui-disabled': { opacity: 0.4 },
          }}
        >
          <SendRoundedIcon sx={{ fontSize: 18, color: '#fff' }} />
        </IconButton>
      </Box>
    </Box>
  );
};

export default AIAssistantPage;