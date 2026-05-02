import {
  Badge,
  Button,
  Divider,
  FormControl,
  InputLabel,
  MenuItem,
  Paper,
  Select,
  Stack,
  Tab,
  Tabs,
} from '@mui/material'
import FilterListIcon from '@mui/icons-material/FilterList'
import NotificationsActiveIcon from '@mui/icons-material/NotificationsActive'
import PriorityHighIcon from '@mui/icons-material/PriorityHigh'
import { NOTIFICATION_TYPES } from '../constants/notifications'

export function NotificationControls({
  page,
  priorityCount,
  selectedTab,
  selectedType,
  onPageChange,
  onTabChange,
  onTypeChange,
}) {
  return (
    <Paper className="control-strip" variant="outlined">
      <Tabs value={selectedTab} onChange={(_, nextTab) => onTabChange(nextTab)} aria-label="notification views">
        <Tab value="all" label="All notifications" icon={<NotificationsActiveIcon />} iconPosition="start" />
        <Tab
          value="priority"
          label={
            <Badge color="secondary" badgeContent={priorityCount}>
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
            value={selectedType}
            onChange={(event) => onTypeChange(event.target.value)}
            startAdornment={<FilterListIcon className="select-icon" />}
          >
            {NOTIFICATION_TYPES.map((option) => (
              <MenuItem key={option} value={option}>
                {option}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
        <Stack direction="row" spacing={1}>
          <Button variant="outlined" disabled={page === 1} onClick={() => onPageChange(page - 1)}>
            Previous
          </Button>
          <Button variant="outlined" onClick={() => onPageChange(page + 1)}>
            Page {page}
          </Button>
        </Stack>
      </Stack>
    </Paper>
  )
}
