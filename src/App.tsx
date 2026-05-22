import { ThemeProvider, CssBaseline, Box } from '@mui/material';
import { useState } from 'react';
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
  const [authScreen, setAuthScreen] = useState<AuthScreen>('login');
  const [activePage, setActivePage] = useState('dashboard');

  if (authScreen === 'login') {
    return (
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <LoginPage
          onLogin={() => setAuthScreen('app')}
          onGoToRegister={() => setAuthScreen('register')}
        />
      </ThemeProvider>
    );
  }

  if (authScreen === 'register') {
    return (
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <RegisterPage
          onRegister={() => setAuthScreen('app')}
          onGoToLogin={() => setAuthScreen('login')}
        />
      </ThemeProvider>
    );
  }

  const renderPage = () => {
    switch (activePage) {
      case 'dashboard': return <DashboardPage onNavigate={setActivePage} />;
      case 'cards': return <CardsPage />;
      case 'transactions': return <TransactionsPage />;
      case 'analytics': return <AnalyticsPage />;
      case 'budgets': return <BudgetsPage />;
      case 'ai-assistant': return <AIAssistantPage />;
      case 'settings': return <SettingsPage />;
      default: return <DashboardPage onNavigate={setActivePage} />;
    }
  };

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Box sx={{ display: 'flex', minHeight: '100vh', backgroundColor: 'background.default' }}>
        <Sidebar activePage={activePage} onNavigate={setActivePage} />
        <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
          <TopNav activePage={activePage} />
          <Box sx={{ flex: 1, overflowY: 'auto', p: { xs: 2, md: 4 } }}>
            {renderPage()}
          </Box>
        </Box>
      </Box>
    </ThemeProvider>
  );
}

export default App;