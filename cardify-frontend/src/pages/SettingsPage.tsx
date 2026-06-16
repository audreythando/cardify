import React, { useEffect, useState } from 'react';
import {
  Box, Typography, TextField, Button, Avatar,
  Switch, Divider, alpha, Chip, CircularProgress, Snackbar, Alert,
  Dialog, DialogTitle, DialogContent, DialogActions,
} from '@mui/material';
import PersonRoundedIcon from '@mui/icons-material/PersonRounded';
import NotificationsRoundedIcon from '@mui/icons-material/NotificationsRounded';
import SecurityRoundedIcon from '@mui/icons-material/SecurityRounded';
import AutoAwesomeRoundedIcon from '@mui/icons-material/AutoAwesomeRounded';
import PaletteRoundedIcon from '@mui/icons-material/PaletteRounded';
import DeleteRoundedIcon from '@mui/icons-material/DeleteRounded';
import {
  getSettings,
  updateProfile,
  updatePreferences,
  changePassword,
  type NotificationSettings,
  type AiSettings,
} from '../services/settingsService';

interface SettingRowProps {
  label: string;
  description: string;
  control: React.ReactNode;
}

const SettingRow: React.FC<SettingRowProps> = ({ label, description, control }) => (
  <Box sx={{
    display: 'flex', alignItems: 'center',
    justifyContent: 'space-between', gap: 2,
    py: 1.8,
    borderBottom: '1px solid rgba(255,255,255,0.04)',
    '&:last-child': { borderBottom: 'none' },
  }}>
    <Box sx={{ flex: 1 }}>
      <Typography variant="body2" sx={{ fontWeight: 600, mb: 0.2 }}>
        {label}
      </Typography>
      <Typography variant="caption" sx={{ color: 'text.secondary', lineHeight: 1.4 }}>
        {description}
      </Typography>
    </Box>
    {control}
  </Box>
);

interface SectionCardProps {
  icon: React.ReactNode;
  title: string;
  iconColor: string;
  children: React.ReactNode;
}

const SectionCard: React.FC<SectionCardProps> = ({ icon, title, iconColor, children }) => (
  <Box sx={{
    p: 3, borderRadius: 3,
    background: '#161A23',
    border: '1px solid rgba(255,255,255,0.06)',
    mb: 3,
  }}>
    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 2.5 }}>
      <Box sx={{
        width: 34, height: 34, borderRadius: 2,
        backgroundColor: alpha(iconColor, 0.12),
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        '& svg': { fontSize: 18, color: iconColor },
      }}>
        {icon}
      </Box>
      <Typography variant="body1" sx={{ fontWeight: 700 }}>
        {title}
      </Typography>
    </Box>
    {children}
  </Box>
);

const ActionButton: React.FC<{ label: string; onClick?: () => void }> = ({ label, onClick }) => (
  <Button
    variant="outlined"
    size="small"
    onClick={onClick}
    sx={{
      borderRadius: 2, fontSize: '0.72rem',
      borderColor: 'rgba(255,255,255,0.1)',
      color: 'text.secondary',
      whiteSpace: 'nowrap',
      '&:hover': { borderColor: 'primary.main', color: 'primary.main' },
    }}
  >
    {label}
  </Button>
);

const getInitials = (name: string) =>
  name
    .split(' ')
    .map((part) => part[0])
    .join('')
    .slice(0, 2)
    .toUpperCase() || 'CU';

const SettingsPage: React.FC = () => {
  const [loading, setLoading] = useState(true);
  const [savingProfile, setSavingProfile] = useState(false);
  const [toast, setToast] = useState<{ msg: string; severity: 'success' | 'error' } | null>(null);

  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');

  const [notifications, setNotifications] = useState<NotificationSettings>({
    spendingAlerts: true,
    budgetWarnings: true,
    aiInsights: true,
    weeklyReport: false,
    unusualActivity: true,
  });

  const [aiSettings, setAiSettings] = useState<AiSettings>({
    autoInsights: true,
    spendingPredictions: true,
    anomalyDetection: true,
    personalisation: true,
  });

  // Change password dialog
  const [pwOpen, setPwOpen] = useState(false);
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [pwSaving, setPwSaving] = useState(false);
  const [pwError, setPwError] = useState('');

  useEffect(() => {
    const load = async () => {
      try {
        const data = await getSettings();
        setFullName(data.fullName);
        setEmail(data.email);
        setPhoneNumber(data.phoneNumber ?? '');
        setNotifications(data.notifications);
        setAiSettings(data.ai);
      } catch {
        setToast({ msg: 'Could not load settings.', severity: 'error' });
      } finally {
        setLoading(false);
      }
    };

    load();
  }, []);

  const handleSaveProfile = async () => {
    setSavingProfile(true);
    try {
      const data = await updateProfile({
        fullName,
        email,
        phoneNumber: phoneNumber.trim() === '' ? null : phoneNumber.trim(),
      });
      setFullName(data.fullName);
      setEmail(data.email);
      setPhoneNumber(data.phoneNumber ?? '');
      setToast({ msg: 'Profile updated.', severity: 'success' });
    } catch {
      setToast({ msg: 'Could not save profile. The email may already be in use.', severity: 'error' });
    } finally {
      setSavingProfile(false);
    }
  };

  const persistPreferences = async (
    nextNotifications: NotificationSettings,
    nextAi: AiSettings
  ) => {
    try {
      await updatePreferences(nextNotifications, nextAi);
    } catch {
      setToast({ msg: 'Could not save that setting.', severity: 'error' });
    }
  };

  const toggleNotification = (key: keyof NotificationSettings) => {
    const next = { ...notifications, [key]: !notifications[key] };
    setNotifications(next);
    persistPreferences(next, aiSettings);
  };

  const toggleAI = (key: keyof AiSettings) => {
    const next = { ...aiSettings, [key]: !aiSettings[key] };
    setAiSettings(next);
    persistPreferences(notifications, next);
  };

  const closePwDialog = () => {
    setPwOpen(false);
    setCurrentPassword('');
    setNewPassword('');
    setConfirmPassword('');
    setPwError('');
  };

  const handleChangePassword = async () => {
    setPwError('');

    if (newPassword.length < 6) {
      setPwError('New password must be at least 6 characters.');
      return;
    }
    if (newPassword !== confirmPassword) {
      setPwError('New passwords do not match.');
      return;
    }

    setPwSaving(true);
    try {
      await changePassword(currentPassword, newPassword);
      closePwDialog();
      setToast({ msg: 'Password updated.', severity: 'success' });
    } catch {
      setPwError('Could not change password. Check your current password and try again.');
    } finally {
      setPwSaving(false);
    }
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', mt: 6 }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box sx={{ maxWidth: 760 }}>

      <SectionCard icon={<PersonRoundedIcon />} title="Profile" iconColor="#7C5CFC">
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2.5, mb: 3 }}>
          <Avatar sx={{ width: 64, height: 64, bgcolor: 'primary.main' }}>
            {getInitials(fullName)}
          </Avatar>
          <Box>
            <Typography variant="body1" sx={{ fontWeight: 700, mb: 0.3 }}>
              {fullName || 'Cardify User'}
            </Typography>
            <Typography variant="body2" sx={{ color: 'text.secondary', mb: 1 }}>
              {email}
            </Typography>
            <Chip
              label="Free Plan"
              size="small"
              sx={{
                height: 22, fontSize: '0.68rem', fontWeight: 700,
                backgroundColor: alpha('#7C5CFC', 0.15),
                color: 'primary.main',
              }}
            />
          </Box>
          <Button
            variant="outlined" size="small"
            sx={{
              ml: 'auto', borderRadius: 2,
              borderColor: 'rgba(255,255,255,0.1)',
              color: 'text.secondary',
              '&:hover': { borderColor: 'primary.main', color: 'primary.main' },
            }}
          >
            Change Photo
          </Button>
        </Box>

        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
            <Box sx={{ flex: 1, minWidth: 200 }}>
              <Typography variant="caption" sx={{ fontWeight: 600, display: 'block', mb: 0.8 }}>
                Full Name
              </Typography>
              <TextField
                fullWidth size="small"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
              />
            </Box>
            <Box sx={{ flex: 1, minWidth: 200 }}>
              <Typography variant="caption" sx={{ fontWeight: 600, display: 'block', mb: 0.8 }}>
                Email Address
              </Typography>
              <TextField
                fullWidth size="small"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </Box>
          </Box>
          <Box>
            <Typography variant="caption" sx={{ fontWeight: 600, display: 'block', mb: 0.8 }}>
              Phone Number
            </Typography>
            <TextField
              fullWidth size="small"
              placeholder="+27 XX XXX XXXX"
              value={phoneNumber}
              onChange={(e) => setPhoneNumber(e.target.value)}
            />
          </Box>
          <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
            <Button
              variant="contained" size="small"
              sx={{ borderRadius: 2 }}
              disabled={savingProfile}
              onClick={handleSaveProfile}
            >
              {savingProfile ? 'Saving…' : 'Save Changes'}
            </Button>
          </Box>
        </Box>
      </SectionCard>

      {/* ── Notifications ── */}
      <SectionCard
        icon={<NotificationsRoundedIcon />}
        title="Notifications"
        iconColor="#FFB547"
      >
        <SettingRow
          label="Spending Alerts"
          description="Get notified when a transaction is made on any of your cards"
          control={
            <Switch
              checked={notifications.spendingAlerts}
              onChange={() => toggleNotification('spendingAlerts')}
              size="small"
            />
          }
        />
        <SettingRow
          label="Budget Warnings"
          description="Alert when you reach 80% of any budget category"
          control={
            <Switch
              checked={notifications.budgetWarnings}
              onChange={() => toggleNotification('budgetWarnings')}
              size="small"
            />
          }
        />
        <SettingRow
          label="AI Insights"
          description="Receive personalised spending insights from your AI assistant"
          control={
            <Switch
              checked={notifications.aiInsights}
              onChange={() => toggleNotification('aiInsights')}
              size="small"
            />
          }
        />
        <SettingRow
          label="Weekly Report"
          description="A summary of your spending every Monday morning"
          control={
            <Switch
              checked={notifications.weeklyReport}
              onChange={() => toggleNotification('weeklyReport')}
              size="small"
            />
          }
        />
        <SettingRow
          label="Unusual Activity"
          description="Immediate alerts for transactions that look out of the ordinary"
          control={
            <Switch
              checked={notifications.unusualActivity}
              onChange={() => toggleNotification('unusualActivity')}
              size="small"
            />
          }
        />
      </SectionCard>

      {/* ── AI Settings ── */}
      <SectionCard
        icon={<AutoAwesomeRoundedIcon />}
        title="AI Assistant Settings"
        iconColor="#00D4AA"
      >
        <Box sx={{
          p: 2, borderRadius: 2, mb: 2.5,
          backgroundColor: alpha('#00D4AA', 0.06),
          border: '1px solid', borderColor: alpha('#00D4AA', 0.12),
        }}>
          <Typography variant="caption" sx={{ color: 'text.secondary', lineHeight: 1.6 }}>
            🤖 Powered by <strong>Ollama</strong> running locally — these settings control
            how your AI assistant analyses your financial data.
          </Typography>
        </Box>
        <SettingRow
          label="Auto Insights"
          description="AI automatically surfaces insights without you asking"
          control={
            <Switch
              checked={aiSettings.autoInsights}
              onChange={() => toggleAI('autoInsights')}
              size="small"
            />
          }
        />
        <SettingRow
          label="Spending Predictions"
          description="AI predicts your end-of-month spend based on patterns"
          control={
            <Switch
              checked={aiSettings.spendingPredictions}
              onChange={() => toggleAI('spendingPredictions')}
              size="small"
            />
          }
        />
        <SettingRow
          label="Anomaly Detection"
          description="AI flags unusual transactions in real time"
          control={
            <Switch
              checked={aiSettings.anomalyDetection}
              onChange={() => toggleAI('anomalyDetection')}
              size="small"
            />
          }
        />
        <SettingRow
          label="Personalisation"
          description="Allow AI to learn from your spending habits over time"
          control={
            <Switch
              checked={aiSettings.personalisation}
              onChange={() => toggleAI('personalisation')}
              size="small"
            />
          }
        />
      </SectionCard>

      {/* ── Security ── */}
      <SectionCard icon={<SecurityRoundedIcon />} title="Security" iconColor="#38BDF8">
        <SettingRow
          label="Two-Factor Authentication"
          description="Add an extra layer of security via SMS or authenticator app"
          control={<ActionButton label="Enable 2FA" />}
        />
        <SettingRow
          label="Change Password"
          description="Update your account password"
          control={<ActionButton label="Change" onClick={() => setPwOpen(true)} />}
        />
        <SettingRow
          label="Active Sessions"
          description="View and manage devices currently signed in to your account"
          control={<ActionButton label="View" />}
        />
      </SectionCard>

      {/* ── Appearance ── */}
      <SectionCard icon={<PaletteRoundedIcon />} title="Appearance" iconColor="#A78BFA">
        <SettingRow
          label="Theme"
          description="Cardify currently uses a dark theme optimised for readability"
          control={
            <Chip label="Dark Mode" size="small" sx={{
              height: 24, fontSize: '0.72rem', fontWeight: 600,
              backgroundColor: alpha('#7C5CFC', 0.15), color: 'primary.main',
            }} />
          }
        />
        <SettingRow
          label="Currency"
          description="Display currency used across the app"
          control={
            <Chip label="ZAR (R)" size="small" sx={{
              height: 24, fontSize: '0.72rem', fontWeight: 600,
              backgroundColor: alpha('#00D4AA', 0.12), color: '#00D4AA',
            }} />
          }
        />
        <SettingRow
          label="Language"
          description="Language used throughout the application"
          control={
            <Chip label="English (SA)" size="small" sx={{
              height: 24, fontSize: '0.72rem', fontWeight: 600,
              backgroundColor: alpha('#38BDF8', 0.12), color: '#38BDF8',
            }} />
          }
        />
      </SectionCard>

      {/* ── Danger Zone ── */}
      <Box sx={{
        p: 3, borderRadius: 3,
        background: '#161A23',
        border: '1px solid', borderColor: alpha('#FF5A7E', 0.2),
      }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 2 }}>
          <Box sx={{
            width: 34, height: 34, borderRadius: 2,
            backgroundColor: alpha('#FF5A7E', 0.12),
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>
            <DeleteRoundedIcon sx={{ fontSize: 18, color: '#FF5A7E' }} />
          </Box>
          <Typography variant="body1" sx={{ fontWeight: 700 }}>Danger Zone</Typography>
        </Box>
        <Divider sx={{ borderColor: 'rgba(255,255,255,0.04)', mb: 2 }} />
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 2 }}>
          <Box>
            <Typography variant="body2" sx={{ fontWeight: 600, mb: 0.2 }}>
              Delete Account
            </Typography>
            <Typography variant="caption" sx={{ color: 'text.secondary' }}>
              Permanently delete your account and all associated data. This cannot be undone.
            </Typography>
          </Box>
          <Button
            variant="outlined" size="small"
            sx={{
              borderRadius: 2, borderColor: alpha('#FF5A7E', 0.4),
              color: '#FF5A7E', whiteSpace: 'nowrap', flexShrink: 0,
              '&:hover': { borderColor: '#FF5A7E', backgroundColor: alpha('#FF5A7E', 0.06) },
            }}
          >
            Delete Account
          </Button>
        </Box>
      </Box>

      {/* ── Change Password Dialog ── */}
      <Dialog open={pwOpen} onClose={closePwDialog} maxWidth="xs" fullWidth>
        <DialogTitle>Change Password</DialogTitle>
        <DialogContent sx={{ display: 'flex', flexDirection: 'column', gap: 2, pt: 1 }}>
          {pwError && <Alert severity="error">{pwError}</Alert>}
          <TextField
            label="Current Password" type="password" size="small" fullWidth
            value={currentPassword} onChange={(e) => setCurrentPassword(e.target.value)}
          />
          <TextField
            label="New Password" type="password" size="small" fullWidth
            value={newPassword} onChange={(e) => setNewPassword(e.target.value)}
          />
          <TextField
            label="Confirm New Password" type="password" size="small" fullWidth
            value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)}
          />
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2 }}>
          <Button onClick={closePwDialog} color="inherit">Cancel</Button>
          <Button onClick={handleChangePassword} variant="contained" disabled={pwSaving}>
            {pwSaving ? 'Saving…' : 'Update Password'}
          </Button>
        </DialogActions>
      </Dialog>

      <Snackbar
        open={!!toast}
        autoHideDuration={3000}
        onClose={() => setToast(null)}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        {toast ? (
          <Alert severity={toast.severity} onClose={() => setToast(null)}>
            {toast.msg}
          </Alert>
        ) : undefined}
      </Snackbar>
    </Box>
  );
};

export default SettingsPage;