import { Box, ThemeProvider } from '@mui/material'
import { NotificationCenterPage } from './pages/NotificationCenterPage'
import { theme } from './theme'
import './App.css'

function App() {
  return (
    <ThemeProvider theme={theme}>
      <Box className="app-shell">
        <NotificationCenterPage />
      </Box>
    </ThemeProvider>
  )
}

export default App
