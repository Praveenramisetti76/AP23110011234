import { AppBar, Box, Button, IconButton, Stack, Toolbar, Tooltip, Typography } from '@mui/material'
import MarkEmailReadIcon from '@mui/icons-material/MarkEmailRead'
import NotificationsActiveIcon from '@mui/icons-material/NotificationsActive'
import RefreshIcon from '@mui/icons-material/Refresh'

export function AppHeader({ canMarkVisibleRead, onMarkAllViewed, onRefresh }) {
  return (
    <AppBar position="sticky" elevation={0} color="inherit" className="top-bar">
      <Toolbar className="toolbar">
        <Stack direction="row" spacing={1.25} alignItems="center">
          <Box className="brand-mark">
            <NotificationsActiveIcon />
          </Box>
          <Box>
            <Typography variant="h6">Campus Notifications</Typography>
            <Typography variant="body2" color="text.secondary">
              Priority inbox for student updates
            </Typography>
          </Box>
        </Stack>
        <Stack direction="row" spacing={1}>
          <Tooltip title="Refresh notifications">
            <IconButton aria-label="refresh notifications" onClick={onRefresh}>
              <RefreshIcon />
            </IconButton>
          </Tooltip>
          <Button
            startIcon={<MarkEmailReadIcon />}
            variant="contained"
            onClick={onMarkAllViewed}
            disabled={!canMarkVisibleRead}
          >
            Mark visible read
          </Button>
        </Stack>
      </Toolbar>
    </AppBar>
  )
}
