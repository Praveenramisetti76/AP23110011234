import { Box, Paper, Stack, Typography } from '@mui/material'

export function PageHeading({ loadedCount, unreadCount }) {
  return (
    <Box className="page-heading">
      <Box>
        <Typography variant="h4">Notification Center</Typography>
        <Typography color="text.secondary">
          Review campus updates, filter by type, and keep the most important unread items in front.
        </Typography>
      </Box>
      <Stack direction={{ xs: 'column', sm: 'row' }} spacing={1.5}>
        <Paper className="metric" variant="outlined">
          <Typography variant="caption" color="text.secondary">
            Loaded
          </Typography>
          <Typography variant="h6">{loadedCount}</Typography>
        </Paper>
        <Paper className="metric" variant="outlined">
          <Typography variant="caption" color="text.secondary">
            Unread
          </Typography>
          <Typography variant="h6">{unreadCount}</Typography>
        </Paper>
      </Stack>
    </Box>
  )
}
