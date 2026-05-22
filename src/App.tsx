import { ThemeProvider, CssBaseline, Box, Typography } from '@mui/material';
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

const PlaceholderPage = ({ title }: { title: string }) => (
  <Box sx={{
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    height: '60vh', flexDirection: 'column', gap: 2,
  }}>
    <Box sx={{ fontSize: '3rem' }}>🚧</Box>
    <Typography variant="h5" sx={{ fontWeight: 700 }}>{title}</Typography>
    <Typography variant="body2" sx={{ color: 'text.secondary' }}>
      Coming in the next branch!
    </Typography>
  </Box>
);

function App() {
  const [activePage, setActivePage] = useState('dashboard');

  const renderPage = () => {
    switch (activePage) {
      case 'dashboard': return <DashboardPage onNavigate={setActivePage} />;
      case 'cards': return <CardsPage />;
      case 'transactions': return <TransactionsPage />;
      case 'analytics': return <AnalyticsPage />;
      case 'budgets': return <BudgetsPage />;
      case 'ai-assistant': return <AIAssistantPage />;
      case 'settings': return <PlaceholderPage title="Settings" />;
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