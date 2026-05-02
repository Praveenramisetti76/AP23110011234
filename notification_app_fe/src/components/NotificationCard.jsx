import { Box, Chip, IconButton, Paper, Stack, Tooltip, Typography } from '@mui/material'
import MarkEmailReadIcon from '@mui/icons-material/MarkEmailRead'
import { getNotificationId } from '../utils/notificationPriority'
import { NotificationIcon } from './NotificationIcon'

export function NotificationCard({ notification, viewed, onMarkViewed, rank }) {
  const id = getNotificationId(notification)
  const timestamp = new Date(notification.Timestamp)

  return (
    <Paper className={`notification-card ${viewed ? 'is-viewed' : ''}`} variant="outlined">
      <Stack direction="row" spacing={2} alignItems="flex-start">
        <Box className={`notification-icon ${notification.Type.toLowerCase()}`}>
          <NotificationIcon type={notification.Type} />
        </Box>
        <Box sx={{ minWidth: 0, flex: 1 }}>
          <Stack
            direction={{ xs: 'column', sm: 'row' }}
            spacing={1}
            alignItems={{ xs: 'flex-start', sm: 'center' }}
            justifyContent="space-between"
          >
            <Stack direction="row" spacing={1} alignItems="center" flexWrap="wrap">
              {rank ? <Chip size="small" color="primary" label={`#${rank}`} /> : null}
              <Chip size="small" variant="outlined" label={notification.Type} />
              {!viewed ? <Chip size="small" color="secondary" label="New" /> : null}
            </Stack>
            <Typography variant="body2" color="text.secondary">
              {Number.isNaN(timestamp.getTime()) ? 'Time unavailable' : timestamp.toLocaleString()}
            </Typography>
          </Stack>

          <Typography className="notification-message" variant="h6">
            {notification.Message}
          </Typography>
          <Typography variant="caption" color="text.secondary">
            ID: {id}
          </Typography>
        </Box>
        <Tooltip title={viewed ? 'Already viewed' : 'Mark as viewed'}>
          <span>
            <IconButton
              aria-label="mark as viewed"
              disabled={viewed}
              onClick={() => onMarkViewed(id)}
              size="small"
            >
              <MarkEmailReadIcon fontSize="small" />
            </IconButton>
          </span>
        </Tooltip>
      </Stack>
    </Paper>
  )
}
