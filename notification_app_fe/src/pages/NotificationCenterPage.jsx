import { useState } from 'react'
import { Alert, Container } from '@mui/material'
import { AppHeader } from '../components/AppHeader'
import { NotificationControls } from '../components/NotificationControls'
import { NotificationList } from '../components/NotificationList'
import { PageHeading } from '../components/PageHeading'
import { useNotifications } from '../hooks/useNotifications'

export function NotificationCenterPage() {
  const [selectedTab, setSelectedTab] = useState('all')
  const {
    changeType,
    error,
    fetchNotifications,
    loading,
    markAllViewed,
    markViewed,
    notifications,
    page,
    priorityNotifications,
    setPage,
    type,
    unreadNotifications,
    viewedIds,
  } = useNotifications()

  const displayedNotifications = selectedTab === 'priority' ? priorityNotifications : notifications

  return (
    <>
      <AppHeader
        canMarkVisibleRead={Boolean(notifications.length)}
        onMarkAllViewed={markAllViewed}
        onRefresh={fetchNotifications}
      />

      <Container maxWidth="lg" className="main-content">
        <PageHeading loadedCount={notifications.length} unreadCount={unreadNotifications.length} />

        <NotificationControls
          page={page}
          priorityCount={priorityNotifications.length}
          selectedTab={selectedTab}
          selectedType={type}
          onPageChange={setPage}
          onTabChange={setSelectedTab}
          onTypeChange={changeType}
        />

        {error ? (
          <Alert severity="error" className="status-alert">
            {error}
          </Alert>
        ) : null}

        <NotificationList
          loading={loading}
          notifications={displayedNotifications}
          selectedTab={selectedTab}
          viewedIds={viewedIds}
          onMarkViewed={markViewed}
        />
      </Container>
    </>
  )
}
