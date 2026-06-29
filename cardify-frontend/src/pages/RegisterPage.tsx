import React, { useState } from 'react';
import {
  Box, Typography, TextField, Button,
  Divider, alpha, CircularProgress, Alert
} from '@mui/material';
import CreditCardRoundedIcon from '@mui/icons-material/CreditCardRounded';
import GoogleIcon from '@mui/icons-material/Google';
import MicrosoftIcon from '@mui/icons-material/Window';
import { register } from '../services/authservice';

interface RegisterPageProps {
  onRegister: () => void;
  onGoToLogin: () => void;
}

const RegisterPage: React.FC<RegisterPageProps> = ({ onRegister, onGoToLogin }) => {
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleRegister = async () => {
    setError('');

    if (!fullName.trim() || !email.trim() || !password) {
      setError('Please fill in all fields.');
      return;
    }
    if (password.length < 6) {
      setError('Password must be at least 6 characters.');
      return;
    }

    try {
      setLoading(true);
      await register({
        fullName: fullName.trim(),
        email: email.trim(),
        password,
      });
      onRegister();
    } catch (err: any) {
      if (err?.response?.status === 400) {
        setError('An account with this email already exists.');
      } else {
        setError('Could not create account. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  const passwordStrength = password.length === 0
    ? null : password.length < 6
    ? { label: 'Too short', color: '#FF5A7E', width: '25%' }
    : password.length < 10
    ? { label: 'Fair', color: '#FFB547', width: '55%' }
    : { label: 'Strong', color: '#00D4AA', width: '100%' };

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
        background: 'radial-gradient(circle, rgba(0,212,170,0.06) 0%, transparent 70%)',
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
          Create your account
        </Typography>
        <Typography variant="body2" sx={{ color: 'text.secondary', mb: 3 }}>
          Start managing your finances smarter with AI.
        </Typography>

        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}

        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5, mb: 3 }}>
          <Button
            fullWidth variant="outlined"
            startIcon={<GoogleIcon sx={{ fontSize: 18 }} />}
            sx={{
              borderColor: 'rgba(255,255,255,0.1)', color: 'text.primary',
              borderRadius: 2, py: 1.2,
              '&:hover': { borderColor: 'rgba(255,255,255,0.2)', backgroundColor: alpha('#fff', 0.03) },
            }}
          >
            Continue with Google
          </Button>
          <Button
            fullWidth variant="outlined"
            startIcon={<MicrosoftIcon sx={{ fontSize: 18 }} />}
            sx={{
              borderColor: 'rgba(255,255,255,0.1)', color: 'text.primary',
              borderRadius: 2, py: 1.2,
              '&:hover': { borderColor: 'rgba(255,255,255,0.2)', backgroundColor: alpha('#fff', 0.03) },
            }}
          >
            Continue with Microsoft
          </Button>
        </Box>

        <Divider sx={{ borderColor: 'rgba(255,255,255,0.06)', mb: 3 }}>
          <Typography variant="caption" sx={{ color: 'text.secondary', px: 1 }}>or</Typography>
        </Divider>

        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mb: 2 }}>
          <Box>
            <Typography variant="caption" sx={{ fontWeight: 600, display: 'block', mb: 0.8 }}>
              Full name
            </Typography>
            <TextField
              fullWidth size="small"
              placeholder="Enter your full name"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
            />
          </Box>
          <Box>
            <Typography variant="caption" sx={{ fontWeight: 600, display: 'block', mb: 0.8 }}>
              Email address
            </Typography>
            <TextField
              fullWidth size="small"
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
              fullWidth size="small"
              type="password"
              placeholder="Create a password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  handleRegister();
                }
              }}
            />
            {passwordStrength && (
              <Box sx={{ mt: 1 }}>
                <Box sx={{
                  height: 4, borderRadius: 2,
                  backgroundColor: 'rgba(255,255,255,0.06)',
                  overflow: 'hidden', mb: 0.5,
                }}>
                  <Box sx={{
                    width: passwordStrength.width,
                    height: '100%', borderRadius: 2,
                    backgroundColor: passwordStrength.color,
                    transition: 'width 0.3s ease',
                  }} />
                </Box>
                <Typography variant="caption" sx={{
                  color: passwordStrength.color, fontSize: '0.7rem', fontWeight: 600,
                }}>
                  {passwordStrength.label}
                </Typography>
              </Box>
            )}
          </Box>
        </Box>

        <Button
          fullWidth variant="contained"
          size="large" onClick={handleRegister}
          disabled={loading}
          sx={{ py: 1.4, mb: 3, borderRadius: 2, fontSize: '0.95rem' }}
        >
          {loading
            ? <CircularProgress size={20} sx={{ color: '#fff' }} />
            : 'Sign up'}
        </Button>

        <Typography variant="body2" sx={{ textAlign: 'center', color: 'text.secondary' }}>
          Already have an account?{' '}
          <Typography
            component="span" variant="body2"
            sx={{
              color: 'primary.main', fontWeight: 600, cursor: 'pointer',
              '&:hover': { color: 'primary.light' },
            }}
            onClick={onGoToLogin}
          >
            Sign in
          </Typography>
        </Typography>
      </Box>
    </Box>
  );
};

export default RegisterPage;