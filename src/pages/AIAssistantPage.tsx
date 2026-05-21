import React, { useState, useRef, useEffect } from 'react';
import {
  Box, Typography, TextField, IconButton,
  CircularProgress, Chip, Avatar, alpha
} from '@mui/material';
import SendRoundedIcon from '@mui/icons-material/SendRounded';
import AutoAwesomeRoundedIcon from '@mui/icons-material/AutoAwesomeRounded';
import type { ChatMessage } from '../types';
import { mockUser, mockDashboardSummary, mockSpendingOverview, mockTransactions } from '../utils/mockData';

const SUGGESTED_PROMPTS = [
  'How can I reduce my spending this month?',
  'What is my highest spending category?',
  'Am I on track with my budget?',
  'How can I improve my credit score?',
  'Are there any unusual transactions?',
];

const systemPrompt = `You are Cardify AI, a friendly and knowledgeable personal finance assistant embedded in the Cardify credit card management app. You help users understand their spending, manage budgets, and improve their financial health.

Here is the user's current financial data:
- Name: Audrey Thando
- Total Balance: $${mockDashboardSummary.totalBalance}
- Monthly Spend: $${mockDashboardSummary.monthlySpend} (${mockDashboardSummary.monthlySpendChange}% vs last month)
- Credit Limit: $${mockDashboardSummary.totalCreditLimit}
- Available Credit: $${mockDashboardSummary.availableCredit}
- Cashback Earned: $${mockDashboardSummary.cashbackEarned}
- Top Spending Categories:
${mockSpendingOverview.categories.map(c => `  • ${c.category}: $${c.amount} (${c.percentage}%)`).join('\n')}
- Recent Transactions: ${mockTransactions.slice(0, 5).map(t => `${t.merchantName} $${Math.abs(t.amount)}`).join(', ')}

Guidelines:
- Respond in a warm, encouraging tone
- Keep answers concise but insightful
- Use bullet points for lists
- Format currency in USD
- When suggesting savings, be specific with numbers
- This is relevant to the Azure AI-102 certification — you demonstrate real Azure OpenAI integration`;

const AIAssistantPage: React.FC = () => {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: '0',
      role: 'assistant',
      content: `👋 Hi ${mockUser.name.split(' ')[0]}! I'm your Cardify AI Financial Assistant.\n\nI've analysed your spending patterns and I'm here to help you:\n• Understand your finances\n• Optimise your budget\n• Spot unusual activity\n• Build better financial habits\n\nWhat would you like to explore today?`,
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

    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setIsLoading(true);

    try {
      const history = [...messages, userMsg]
        .filter(m => !m.isLoading)
        .map(m => ({ role: m.role, content: m.content }));

      const response = await fetch('https://api.anthropic.com/v1/messages', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          model: 'claude-sonnet-4-20250514',
          max_tokens: 1000,
          system: systemPrompt,
          messages: history,
        }),
      });

      const data = await response.json();
      const replyText = data.content
        ?.map((c: { type: string; text?: string }) => c.text || '')
        .join('') || 'Sorry, I could not process that. Please try again.';

      setMessages(prev => [...prev, {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: replyText,
        timestamp: new Date().toISOString(),
      }]);
    } catch {
      setMessages(prev => [...prev, {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: '⚠️ Could not connect right now. In production this will use Azure OpenAI (GPT-4o) — the same integration you will configure for AI-102.',
        timestamp: new Date().toISOString(),
      }]);
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
    new Date(ts).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', height: 'calc(100vh - 130px)' }}>

      <Box sx={{ flex: 1, overflowY: 'auto', px: 1, py: 2 }}>
        {messages.map((msg) => (
          <Box key={msg.id} sx={{
            display: 'flex',
            flexDirection: msg.role === 'user' ? 'row-reverse' : 'row',
            gap: 1.5, mb: 2.5,
          }}>
            {/* Avatar */}
            {msg.role === 'assistant' ? (
              <Box sx={{
                width: 34, height: 34, borderRadius: 2, flexShrink: 0,
                background: 'linear-gradient(135deg, #7C5CFC, #00D4AA)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                mt: 0.5,
              }}>
                <AutoAwesomeRoundedIcon sx={{ fontSize: 16, color: '#fff' }} />
              </Box>
            ) : (
              <Avatar
                src={mockUser.avatarUrl}
                sx={{ width: 34, height: 34, mt: 0.5, flexShrink: 0 }}
              />
            )}

            <Box sx={{ maxWidth: '72%' }}>
              <Box sx={{
                p: 2,
                borderRadius: msg.role === 'user'
                  ? '16px 4px 16px 16px'
                  : '4px 16px 16px 16px',
                backgroundColor: msg.role === 'user'
                  ? alpha('#7C5CFC', 0.2)
                  : '#1E2330',
                border: '1px solid',
                borderColor: msg.role === 'user'
                  ? alpha('#7C5CFC', 0.3)
                  : 'rgba(255,255,255,0.06)',
              }}>
                <Typography variant="body2" sx={{
                  fontSize: '0.875rem', lineHeight: 1.7,
                  whiteSpace: 'pre-wrap',
                }}>
                  {msg.content}
                </Typography>
              </Box>
              <Typography variant="caption" sx={{
                color: 'text.secondary', fontSize: '0.68rem', mt: 0.5,
                display: 'block',
                textAlign: msg.role === 'user' ? 'right' : 'left',
              }}>
                {formatTime(msg.timestamp)}
              </Typography>
            </Box>
          </Box>
        ))}

        {isLoading && (
          <Box sx={{ display: 'flex', gap: 1.5, mb: 2 }}>
            <Box sx={{
              width: 34, height: 34, borderRadius: 2,
              background: 'linear-gradient(135deg, #7C5CFC, #00D4AA)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}>
              <AutoAwesomeRoundedIcon sx={{ fontSize: 16, color: '#fff' }} />
            </Box>
            <Box sx={{
              p: 2, borderRadius: '4px 16px 16px 16px',
              backgroundColor: '#1E2330',
              border: '1px solid rgba(255,255,255,0.06)',
              display: 'flex', alignItems: 'center', gap: 1,
            }}>
              <CircularProgress size={14} sx={{ color: 'primary.main' }} />
              <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                Analysing your finances...
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
            {SUGGESTED_PROMPTS.map((p) => (
              <Chip
                key={p}
                label={p}
                size="small"
                clickable
                onClick={() => sendMessage(p)}
                sx={{
                  fontSize: '0.72rem', height: 'auto', py: 0.5,
                  backgroundColor: alpha('#7C5CFC', 0.1),
                  border: '1px solid', borderColor: alpha('#7C5CFC', 0.2),
                  color: 'text.primary',
                  '&:hover': { backgroundColor: alpha('#7C5CFC', 0.2) },
                }}
              />
            ))}
          </Box>
        </Box>
      )}

      <Box sx={{
        display: 'flex', gap: 1.5, p: 2,
        borderTop: '1px solid rgba(255,255,255,0.06)',
        backgroundColor: '#161A23', borderRadius: 3,
      }}>
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
            borderRadius: 2, width: 44, height: 44, flexShrink: 0,
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