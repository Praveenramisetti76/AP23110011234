import { PAGE_SIZE } from '../constants/notifications'
import { getAuthHeaders } from './auth'

const API_URL = 'http://20.207.122.201/evaluation-service/notifications'

function buildNotificationsUrl({ page, type }) {
  const url = new URL(API_URL)
  url.searchParams.set('limit', String(PAGE_SIZE))
  url.searchParams.set('page', String(page))

  if (type !== 'All') {
    url.searchParams.set('notification_type', type)
  }

  return url.toString()
}

export async function fetchNotificationsPage({ page, type }) {
  const response = await fetch(buildNotificationsUrl({ page, type }), {
    headers: {
      Accept: 'application/json',
      ...getAuthHeaders(),
    },
  })

  if (!response.ok) {
    throw new Error(`Request failed with status ${response.status}`)
  }

  const data = await response.json()
  return Array.isArray(data.notifications) ? data.notifications : []
}
