import { ThemeProvider, CssBaseline, Box } from '@mui/material';
import { useEffect, useState } from 'react';
import { isAuthenticated, logout, SESSION_EXPIRED_EVENT } from './utils/auth';
import { theme } from './theme/theme';
import Sidebar from './components/layout/Sidebar';
import TopNav from './components/layout/TopNav';
import DashboardPage from './pages/DashboardPage';
import TransactionsPage from './pages/TransactionsPage';
import AIAssistantPage from './pages/AIAssistantPage';
import CardsPage from './pages/CardsPage';
import AnalyticsPage from './pages/AnalyticsPage';
import BudgetsPage from './pages/BudgetsPage';
import SettingsPage from './pages/SettingsPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';

type AuthScreen = 'login' | 'register' | 'app';


function App() {
  // An expired token found on startup is cleared up front rather than
  // letting every page fail with 401s.
  const [hadStaleToken] = useState(
    () => !!localStorage.getItem('cardify_token') && !isAuthenticated()
  );
  const [authScreen, setAuthScreen] = useState<AuthScreen>(() => {
    if (isAuthenticated()) return 'app';
    logout();
    return 'login';
  });
  const [sessionExpired, setSessionExpired] = useState(hadStaleToken);

  const [activePage, setActivePage] = useState('dashboard');
  const [mobileNavOpen, setMobileNavOpen] = useState(false);

  // The API client fires this when a request comes back 401.
  useEffect(() => {
    const onExpired = () => {
      setSessionExpired(true);
      setAuthScreen('login');
      setActivePage('dashboard');
      setMobileNavOpen(false);
    };
    window.addEventListener(SESSION_EXPIRED_EVENT, onExpired);
    return () => window.removeEventListener(SESSION_EXPIRED_EVENT, onExpired);
  }, []);

  const handleLogin = () => {
    setSessionExpired(false);
    setAuthScreen('app');
  };

  const handleLogout = () => {
    localStorage.removeItem('cardify_token');
    localStorage.removeItem('cardify_user');
    setAuthScreen('login');
    setActivePage('dashboard');
  };

  if (authScreen === 'login') {
    return (
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <LoginPage
          onLogin={handleLogin}
          onGoToRegister={() => setAuthScreen('register')}
          notice={sessionExpired ? 'Your session has expired. Please sign in again.' : undefined}
        />
      </ThemeProvider>
    );
  }

  if (authScreen === 'register') {
    return (
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <RegisterPage
          onRegister={handleLogin}
          onGoToLogin={() => setAuthScreen('login')}
        />
      </ThemeProvider>
    );
  }

  const renderPage = () => {
    switch (activePage) {
      case 'dashboard':
        return <DashboardPage onNavigate={setActivePage} />;
      case 'cards':
        return <CardsPage />;
      case 'transactions':
        return <TransactionsPage />;
      case 'analytics':
        return <AnalyticsPage />;
      case 'budgets':
        return <BudgetsPage />;
      case 'ai-assistant':
        return <AIAssistantPage />;
      case 'settings':
        return <SettingsPage />;
      default:
        return <DashboardPage onNavigate={setActivePage} />;
    }
  };

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Box
        sx={{
          display: 'flex',
          minHeight: '100vh',
          backgroundColor: 'background.default',
        }}
      >
        <Sidebar
          activePage={activePage}
          onNavigate={setActivePage}
          onLogout={handleLogout}
          mobileOpen={mobileNavOpen}
          onMobileClose={() => setMobileNavOpen(false)}
        />

        <Box sx={{ flex: 1, minWidth: 0, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
          <TopNav activePage={activePage} onMenuClick={() => setMobileNavOpen(true)} />
          <Box sx={{ flex: 1, overflowY: 'auto', p: { xs: 2, md: 4 } }}>
            {renderPage()}
          </Box>
        </Box>
      </Box>
    </ThemeProvider>
  );
}

export default App;