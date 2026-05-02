import { useCallback, useEffect, useMemo, useState } from 'react'
import { Log } from '../../../logging_middleware/log'
import { PAGE_SIZE } from '../constants/notifications'
import { fetchNotificationsPage } from '../services/notificationsApi'
import { getStoredViewedIds, persistViewedIds } from '../utils/notificationStorage'
import { getNotificationId, sortByPriority } from '../utils/notificationPriority'

export function useNotifications() {
  const [type, setType] = useState('All')
  const [page, setPage] = useState(1)
  const [notifications, setNotifications] = useState([])
  const [viewedIds, setViewedIds] = useState(() => new Set(getStoredViewedIds()))
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const fetchNotifications = useCallback(async () => {
    setLoading(true)
    setError('')
    await Log('frontend', 'info', 'api', `Fetching notifications page=${page}, type=${type}`)

    try {
      const nextNotifications = await fetchNotificationsPage({ page, type })
      setNotifications(nextNotifications)
      await Log(
        'frontend',
        'info',
        'api',
        `Loaded ${nextNotifications.length} notifications for page=${page}, type=${type}`,
      )
    } catch (requestError) {
      setError(requestError.message)
      await Log('frontend', 'error', 'api', `Unable to load notifications: ${requestError.message}`)
    } finally {
      setLoading(false)
    }
  }, [page, type])

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    fetchNotifications()
  }, [fetchNotifications])

  const unreadNotifications = useMemo(
    () => notifications.filter((notification) => !viewedIds.has(getNotificationId(notification))),
    [notifications, viewedIds],
  )

  const priorityNotifications = useMemo(
    () => sortByPriority(unreadNotifications).slice(0, PAGE_SIZE),
    [unreadNotifications],
  )

  const changeType = (nextType) => {
    setPage(1)
    setType(nextType)
  }

  const markViewed = async (id) => {
    const nextViewedIds = new Set(viewedIds)
    nextViewedIds.add(id)
    setViewedIds(nextViewedIds)
    persistViewedIds(nextViewedIds)
    await Log('frontend', 'info', 'state', `Notification ${id} marked as viewed`)
  }

  const markAllViewed = async () => {
    const nextViewedIds = new Set(viewedIds)
    notifications.forEach((notification) => nextViewedIds.add(getNotificationId(notification)))
    setViewedIds(nextViewedIds)
    persistViewedIds(nextViewedIds)
    await Log('frontend', 'info', 'state', `Marked ${notifications.length} visible notifications as viewed`)
  }

  return {
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
    changeType,
  }
}
