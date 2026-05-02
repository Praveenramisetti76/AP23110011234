import { Paper, Typography } from '@mui/material'
import NotificationsActiveIcon from '@mui/icons-material/NotificationsActive'

export function EmptyState({ title, message }) {
  return (
    <Paper className="empty-state" variant="outlined">
      <NotificationsActiveIcon color="disabled" />
      <Typography variant="h6">{title}</Typography>
      <Typography color="text.secondary">{message}</Typography>
    </Paper>
  )
}
