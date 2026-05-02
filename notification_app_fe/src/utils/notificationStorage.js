import { VIEWED_IDS_STORAGE_KEY } from '../constants/notifications'

export function getStoredViewedIds() {
  try {
    return JSON.parse(localStorage.getItem(VIEWED_IDS_STORAGE_KEY) || '[]')
  } catch {
    return []
  }
}

export function persistViewedIds(ids) {
  localStorage.setItem(VIEWED_IDS_STORAGE_KEY, JSON.stringify([...ids]))
}
