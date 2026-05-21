import { ThemeProvider, CssBaseline, Box, Typography } from '@mui/material'
import { theme } from './theme/theme'

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Box sx={{
        minHeight: '100vh',
        backgroundColor: 'background.default',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}>
        <Typography variant="h4" color="primary">
          Cardify is loading... 💳
        </Typography>
      </Box>
    </ThemeProvider>
  )
}

export default App