import { PRIORITY_TYPE_WEIGHT } from '../constants/notifications'

export function getNotificationId(notification) {
  return notification.ID || notification.id
}

function getPriorityScore(notification) {
  const dateValue = new Date(notification.Timestamp).getTime()
  const recencyScore = Number.isNaN(dateValue) ? 0 : dateValue / 1000000000000

  return (PRIORITY_TYPE_WEIGHT[notification.Type] || 0) * 100 + recencyScore
}

export function sortByPriority(notifications) {
  return [...notifications].sort((first, second) => {
    const scoreDifference = getPriorityScore(second) - getPriorityScore(first)

    if (scoreDifference !== 0) {
      return scoreDifference
    }

    return new Date(second.Timestamp) - new Date(first.Timestamp)
  })
}
