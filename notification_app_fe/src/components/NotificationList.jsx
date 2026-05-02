import { Box, CircularProgress, Stack, Typography } from '@mui/material'
import { getNotificationId } from '../utils/notificationPriority'
import { EmptyState } from './EmptyState'
import { NotificationCard } from './NotificationCard'

export function NotificationList({ loading, notifications, selectedTab, viewedIds, onMarkViewed }) {
  if (loading) {
    return (
      <Box className="loading-area">
        <CircularProgress />
        <Typography color="text.secondary">Loading notifications</Typography>
      </Box>
    )
  }

  if (!notifications.length) {
    return (
      <EmptyState
        title={selectedTab === 'priority' ? 'Priority inbox is clear' : 'No notifications found'}
        message={
          selectedTab === 'priority'
            ? 'Unread Placement, Result, and Event updates will appear here in priority order.'
            : 'Try another page or notification type.'
        }
      />
    )
  }

  return (
    <Stack spacing={1.5}>
      {notifications.map((notification, index) => {
        const id = getNotificationId(notification)

        return (
          <NotificationCard
            key={id}
            notification={notification}
            viewed={viewedIds.has(id)}
            onMarkViewed={onMarkViewed}
            rank={selectedTab === 'priority' ? index + 1 : null}
          />
        )
      })}
    </Stack>
  )
}
