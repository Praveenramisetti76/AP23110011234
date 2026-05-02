import { useCallback, useEffect, useMemo, useState } from 'react'
import {
  Alert,
  AppBar,
  Badge,
  Box,
  Button,
  Chip,
  CircularProgress,
  Container,
  Divider,
  FormControl,
  IconButton,
  InputLabel,
  MenuItem,
  Paper,
  Select,
  Stack,
  Tab,
  Tabs,
  ThemeProvider,
  Toolbar,
  Tooltip,
  Typography,
  createTheme,
} from '@mui/material'
import EventAvailableIcon from '@mui/icons-material/EventAvailable'
import FilterListIcon from '@mui/icons-material/FilterList'
import MarkEmailReadIcon from '@mui/icons-material/MarkEmailRead'
import NotificationsActiveIcon from '@mui/icons-material/NotificationsActive'
import PriorityHighIcon from '@mui/icons-material/PriorityHigh'
import RefreshIcon from '@mui/icons-material/Refresh'
import SchoolIcon from '@mui/icons-material/School'
import WorkIcon from '@mui/icons-material/Work'
import { Log } from '../logging_middleware/log'
import './App.css'

const API_URL = 'http://20.207.122.201/evaluation-service/notifications'
const PAGE_SIZE = 10
const STORAGE_KEY = 'campus-notification-viewed-ids'
const notificationTypes = ['All', 'Event', 'Result', 'Placement']
const priorityTypeWeight = {
  Placement: 3,
  Result: 2,
  Event: 1,
}

const theme = createTheme({
  palette: {
    mode: 'light',
    primary: { main: '#255c99' },
    secondary: { main: '#2f7d62' },
    background: { default: '#f6f8fb', paper: '#ffffff' },
    text: { primary: '#17212f', secondary: '#607084' },
  },
  shape: { borderRadius: 8 },
  typography: {
    fontFamily: ['Inter', 'Segoe UI', 'Roboto', 'Arial', 'sans-serif'].join(','),
    h4: { fontWeight: 800, letterSpacing: 0 },
    h6: { fontWeight: 750, letterSpacing: 0 },
    button: { textTransform: 'none', fontWeight: 700 },
  },
  components: {
    MuiPaper: {
      styleOverrides: {
        root: { backgroundImage: 'none' },
      },
    },
  },
})

function getStoredViewedIds() {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]')
  } catch {
    return []
  }
}

function persistViewedIds(ids) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify([...ids]))
}

function buildUrl({ page, type }) {
  const url = new URL(API_URL)
  url.searchParams.set('limit', String(PAGE_SIZE))
  url.searchParams.set('page', String(page))
  if (type !== 'All') {
    url.searchParams.set('notification_type', type)
  }
  return url.toString()
}

function getAuthHeaders() {
  const token =
    import.meta.env.VITE_API_TOKEN ||
    localStorage.getItem('campus_api_token') ||
    localStorage.getItem('access_token')

  return token ? { Authorization: `Bearer ${token}` } : {}
}

function getNotificationId(notification) {
  return notification.ID || notification.id
}

function getPriorityScore(notification) {
  const dateValue = new Date(notification.Timestamp).getTime()
  const recencyScore = Number.isNaN(dateValue) ? 0 : dateValue / 1000000000000
  return (priorityTypeWeight[notification.Type] || 0) * 100 + recencyScore
}

function sortByPriority(notifications) {
  return [...notifications].sort((first, second) => {
    const scoreDifference = getPriorityScore(second) - getPriorityScore(first)
    if (scoreDifference !== 0) {
      return scoreDifference
    }
    return new Date(second.Timestamp) - new Date(first.Timestamp)
  })
}

function NotificationIcon({ type }) {
  if (type === 'Placement') {
    return <WorkIcon />
  }
  if (type === 'Result') {
    return <SchoolIcon />
  }
  return <EventAvailableIcon />
}

function NotificationCard({ notification, viewed, onMarkViewed, rank }) {
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

function EmptyState({ title, message }) {
  return (
    <Paper className="empty-state" variant="outlined">
      <NotificationsActiveIcon color="disabled" />
      <Typography variant="h6">{title}</Typography>
      <Typography color="text.secondary">{message}</Typography>
    </Paper>
  )
}

function App() {
  const [tab, setTab] = useState('all')
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
      const response = await fetch(buildUrl({ page, type }), {
        headers: {
          Accept: 'application/json',
          ...getAuthHeaders(),
        },
      })

      if (!response.ok) {
        throw new Error(`Request failed with status ${response.status}`)
      }

      const data = await response.json()
      const nextNotifications = Array.isArray(data.notifications) ? data.notifications : []
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

  const displayedNotifications = tab === 'priority' ? priorityNotifications : notifications

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

  return (
    <ThemeProvider theme={theme}>
      <Box className="app-shell">
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
                <IconButton aria-label="refresh notifications" onClick={fetchNotifications}>
                  <RefreshIcon />
                </IconButton>
              </Tooltip>
              <Button
                startIcon={<MarkEmailReadIcon />}
                variant="contained"
                onClick={markAllViewed}
                disabled={!notifications.length}
              >
                Mark visible read
              </Button>
            </Stack>
          </Toolbar>
        </AppBar>

        <Container maxWidth="lg" className="main-content">
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
                <Typography variant="h6">{notifications.length}</Typography>
              </Paper>
              <Paper className="metric" variant="outlined">
                <Typography variant="caption" color="text.secondary">
                  Unread
                </Typography>
                <Typography variant="h6">{unreadNotifications.length}</Typography>
              </Paper>
            </Stack>
          </Box>

          <Paper className="control-strip" variant="outlined">
            <Tabs value={tab} onChange={(_, nextTab) => setTab(nextTab)} aria-label="notification views">
              <Tab
                value="all"
                label="All notifications"
                icon={<NotificationsActiveIcon />}
                iconPosition="start"
              />
              <Tab
                value="priority"
                label={
                  <Badge color="secondary" badgeContent={priorityNotifications.length}>
                    Priority inbox
                  </Badge>
                }
                icon={<PriorityHighIcon />}
                iconPosition="start"
              />
            </Tabs>
            <Divider flexItem orientation="vertical" className="desktop-divider" />
            <Stack className="filters" direction={{ xs: 'column', sm: 'row' }} spacing={1.5}>
              <FormControl size="small" sx={{ minWidth: 170 }}>
                <InputLabel id="type-filter-label">Type</InputLabel>
                <Select
                  labelId="type-filter-label"
                  label="Type"
                  value={type}
                  onChange={(event) => {
                    setPage(1)
                    setType(event.target.value)
                  }}
                  startAdornment={<FilterListIcon className="select-icon" />}
                >
                  {notificationTypes.map((option) => (
                    <MenuItem key={option} value={option}>
                      {option}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
              <Stack direction="row" spacing={1}>
                <Button variant="outlined" disabled={page === 1} onClick={() => setPage((value) => value - 1)}>
                  Previous
                </Button>
                <Button variant="outlined" onClick={() => setPage((value) => value + 1)}>
                  Page {page}
                </Button>
              </Stack>
            </Stack>
          </Paper>

          {error ? (
            <Alert severity="error" className="status-alert">
              {error}
            </Alert>
          ) : null}

          {loading ? (
            <Box className="loading-area">
              <CircularProgress />
              <Typography color="text.secondary">Loading notifications</Typography>
            </Box>
          ) : (
            <Stack spacing={1.5}>
              {displayedNotifications.length ? (
                displayedNotifications.map((notification, index) => {
                  const id = getNotificationId(notification)
                  return (
                    <NotificationCard
                      key={id}
                      notification={notification}
                      viewed={viewedIds.has(id)}
                      onMarkViewed={markViewed}
                      rank={tab === 'priority' ? index + 1 : null}
                    />
                  )
                })
              ) : (
                <EmptyState
                  title={tab === 'priority' ? 'Priority inbox is clear' : 'No notifications found'}
                  message={
                    tab === 'priority'
                      ? 'Unread Placement, Result, and Event updates will appear here in priority order.'
                      : 'Try another page or notification type.'
                  }
                />
              )}
            </Stack>
          )}
        </Container>
      </Box>
    </ThemeProvider>
  )
}

export default App
