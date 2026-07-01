import React, { useState } from 'react';
import {
  Box, Typography, TextField, Button,
  Divider, alpha, CircularProgress, Alert
} from '@mui/material';
import CreditCardRoundedIcon from '@mui/icons-material/CreditCardRounded';
import GoogleIcon from '@mui/icons-material/Google';
import MicrosoftIcon from '@mui/icons-material/Window';
import { login } from '../services/authservice';
import { useGoogleLogin } from '@react-oauth/google';
import { googleLogin } from '../services/authservice';

interface LoginPageProps {
  onLogin: () => void;
  onGoToRegister: () => void;
}

const LoginPage: React.FC<LoginPageProps> = ({ onLogin, onGoToRegister }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleLogin = async () => {
    setError('');

    if (!email || !password) {
      setError('Please enter your email and password.');
      return;
    }

    try {
      setLoading(true);

      await login({
        email,
        password,
      });

      onLogin();
    } catch {
      setError('Invalid email or password.');
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = useGoogleLogin({
    onSuccess: async (tokenResponse) => {
      setError('');
      try {
        setLoading(true);
        await googleLogin(tokenResponse.access_token);
        onLogin();
      } catch {
        setError('Google sign-in failed. Please try again.');
      } finally {
        setLoading(false);
      }
    },
    onError: () => setError('Google sign-in was cancelled or failed.'),
  });

  return (
    <Box sx={{
      minHeight: '100vh',
      backgroundColor: '#0D0F14',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      p: 2,
    }}>
      <Box sx={{
        position: 'fixed', top: '20%', left: '50%',
        transform: 'translateX(-50%)',
        width: 600, height: 600, borderRadius: '50%',
        background: 'radial-gradient(circle, rgba(124,92,252,0.08) 0%, transparent 70%)',
        pointerEvents: 'none',
      }} />

      <Box sx={{
        width: '100%', maxWidth: 420,
        p: 4, borderRadius: 4,
        background: '#161A23',
        border: '1px solid rgba(255,255,255,0.06)',
        position: 'relative',
      }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 4 }}>
          <Box sx={{
            width: 40, height: 40, borderRadius: 2,
            background: 'linear-gradient(135deg, #7C5CFC, #5A3DD8)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>
            <CreditCardRoundedIcon sx={{ color: '#fff', fontSize: 22 }} />
          </Box>
          <Box>
            <Typography variant="h6" sx={{ fontWeight: 700, lineHeight: 1.2 }}>
              Cardify
            </Typography>
            <Typography variant="caption" sx={{ color: 'text.secondary', fontSize: '0.7rem' }}>
              Credit Card System
            </Typography>
          </Box>
        </Box>

        <Typography variant="h5" sx={{ fontWeight: 700, mb: 0.5 }}>
          Sign in to your account
        </Typography>
        <Typography variant="body2" sx={{ color: 'text.secondary', mb: 3 }}>
          Welcome back! Enter your details below.
        </Typography>

        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}

        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5, mb: 3 }}>
          <Button
            fullWidth
            variant="outlined"
            startIcon={<GoogleIcon sx={{ fontSize: 18 }} />}
            onClick={() => handleGoogleLogin()}
          >
            Continue with Google
          </Button>
          <Button fullWidth variant="outlined" startIcon={<MicrosoftIcon sx={{ fontSize: 18 }} />}>
            Continue with Microsoft
          </Button>
        </Box>

        <Divider sx={{ borderColor: 'rgba(255,255,255,0.06)', mb: 3 }}>
          <Typography variant="caption" sx={{ color: 'text.secondary', px: 1 }}>
            or
          </Typography>
        </Divider>

        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mb: 2 }}>
          <Box>
            <Typography variant="caption" sx={{ fontWeight: 600, display: 'block', mb: 0.8 }}>
              Email address
            </Typography>
            <TextField
              fullWidth
              size="small"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </Box>

          <Box>
            <Typography variant="caption" sx={{ fontWeight: 600, display: 'block', mb: 0.8 }}>
              Password
            </Typography>
            <TextField
              fullWidth
              size="small"
              type="password"
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  handleLogin();
                }
              }}
            />
          </Box>
        </Box>

        <Button
          fullWidth
          variant="contained"
          size="large"
          onClick={handleLogin}
          disabled={loading}
          sx={{ py: 1.4, mb: 3, borderRadius: 2, fontSize: '0.95rem' }}
        >
          {loading ? <CircularProgress size={20} sx={{ color: '#fff' }} /> : 'Sign in'}
        </Button>

        <Typography variant="body2" sx={{ textAlign: 'center', color: 'text.secondary' }}>
          Don't have an account?{' '}
          <Typography
            component="span"
            variant="body2"
            sx={{
              color: 'primary.main', fontWeight: 600, cursor: 'pointer',
              '&:hover': { color: 'primary.light' },
            }}
            onClick={onGoToRegister}
          >
            Sign up
          </Typography>
        </Typography>

        <Box sx={{
          mt: 3, p: 1.5, borderRadius: 2,
          backgroundColor: alpha('#7C5CFC', 0.06),
          border: '1px solid', borderColor: alpha('#7C5CFC', 0.12),
        }}>
          <Typography variant="caption" sx={{ color: 'text.secondary', fontSize: '0.7rem', lineHeight: 1.5 }}>
            🔐 Authentication now connects to the Cardify .NET backend using JWT.
          </Typography>
        </Box>
      </Box>
    </Box>
  );
};

export default LoginPage;