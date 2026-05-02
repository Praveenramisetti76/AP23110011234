import EventAvailableIcon from '@mui/icons-material/EventAvailable'
import SchoolIcon from '@mui/icons-material/School'
import WorkIcon from '@mui/icons-material/Work'

export function NotificationIcon({ type }) {
  if (type === 'Placement') {
    return <WorkIcon />
  }

  if (type === 'Result') {
    return <SchoolIcon />
  }

  return <EventAvailableIcon />
}
