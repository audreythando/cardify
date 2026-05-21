import { createTheme, alpha } from '@mui/material/styles';

declare module '@mui/material/styles' {
  interface Palette {
    card: { purple: string; gold: string; dark: string };
  }
  interface PaletteOptions {
    card?: { purple: string; gold: string; dark: string };
  }
}

export const theme = createTheme({
  palette: {
    mode: 'dark',
    primary: {
      main: '#7C5CFC',
      light: '#9B80FF',
      dark: '#5A3DD8',
      contrastText: '#ffffff',
    },
    secondary: {
      main: '#00D4AA',
      light: '#33DDBB',
      dark: '#00A882',
    },
    background: {
      default: '#0D0F14',
      paper: '#161A23',
    },
    error: { main: '#FF5A7E' },
    warning: { main: '#FFB547' },
    success: { main: '#00D4AA' },
    text: {
      primary: '#F0F2F8',
      secondary: '#8892A4',
    },
    card: {
      purple: '#7C5CFC',
      gold: '#C8972B',
      dark: '#1E2330',
    },
    divider: 'rgba(255,255,255,0.06)',
  },
  typography: {
    fontFamily: '"DM Sans", "Inter", sans-serif',
    h1: { fontWeight: 700, letterSpacing: '-0.03em' },
    h2: { fontWeight: 700, letterSpacing: '-0.02em' },
    h3: { fontWeight: 600, letterSpacing: '-0.01em' },
    h4: { fontWeight: 600 },
    h5: { fontWeight: 600 },
    h6: { fontWeight: 600 },
    button: { fontWeight: 600, textTransform: 'none', letterSpacing: '0.01em' },
  },
  shape: { borderRadius: 16 },
  components: {
    MuiCssBaseline: {
      styleOverrides: `
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@300;400;500;600;700&display=swap');
        * { box-sizing: border-box; }
        ::-webkit-scrollbar { width: 4px; }
        ::-webkit-scrollbar-track { background: transparent; }
        ::-webkit-scrollbar-thumb { background: rgba(124,92,252,0.3); border-radius: 4px; }
      `,
    },
MuiButton: {
  styleOverrides: {
    root: {
      borderRadius: 12,
      padding: '10px 20px',
      fontSize: '0.875rem',
      boxShadow: 'none',
      '&:hover': { boxShadow: 'none' },
      '&.MuiButton-containedPrimary': {
        background: 'linear-gradient(135deg, #7C5CFC 0%, #5A3DD8 100%)',
        '&:hover': {
          background: 'linear-gradient(135deg, #9B80FF 0%, #7C5CFC 100%)',
        },
      },
    },
  },
},
    MuiCard: {
      styleOverrides: {
        root: {
          backgroundImage: 'none',
          backgroundColor: '#161A23',
          border: '1px solid rgba(255,255,255,0.06)',
          borderRadius: 20,
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          backgroundImage: 'none',
          backgroundColor: '#161A23',
        },
      },
    },
    MuiListItemButton: {
      styleOverrides: {
        root: {
          borderRadius: 12,
          margin: '2px 8px',
          '&.Mui-selected': {
            backgroundColor: alpha('#7C5CFC', 0.15),
            '&:hover': { backgroundColor: alpha('#7C5CFC', 0.2) },
          },
        },
      },
    },
    MuiTextField: {
      styleOverrides: {
        root: {
          '& .MuiOutlinedInput-root': {
            borderRadius: 12,
            backgroundColor: alpha('#ffffff', 0.03),
            '& fieldset': { borderColor: 'rgba(255,255,255,0.08)' },
            '&:hover fieldset': { borderColor: 'rgba(255,255,255,0.15)' },
            '&.Mui-focused fieldset': { borderColor: '#7C5CFC' },
          },
        },
      },
    },
    MuiChip: {
      styleOverrides: {
        root: { borderRadius: 8, fontWeight: 600 },
      },
    },
  },
});