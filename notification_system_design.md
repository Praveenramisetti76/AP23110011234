# Stage 1

## Priority Inbox Approach

The frontend treats every fetched notification as a candidate for the Priority Inbox unless the user has already viewed it. Viewed IDs are stored in `localStorage`, so refreshes and navigation do not make already-read notifications appear as new again.

Priority is calculated with two signals:

1. Notification type weight: `Placement` has the highest weight, followed by `Result`, then `Event`.
2. Recency: newer timestamps rank above older timestamps when the type weight is the same.

The score used by the app is:

```text
priorityScore = typeWeight * 100 + normalizedTimestamp
```

After scoring, unread notifications are sorted from highest to lowest priority and the top 10 are displayed in the Priority Inbox.

## Maintaining Top 10 Efficiently

For the current frontend stage, the API already supports `limit`, `page`, and `notification_type`, so the app requests only one page of data at a time instead of loading the entire notification history. For each page load, the app filters unread records, sorts them by priority, and slices the first 10 items.

If notifications were streaming continuously, the same scoring function can be used with a bounded min-heap of size 10:

- Score each incoming unread notification.
- If the heap has fewer than 10 items, insert it.
- If the heap is full and the new score is higher than the lowest score in the heap, replace the lowest item.
- Ignore incoming notifications that are already viewed or lower than the current top 10.

This keeps memory bounded and updates each new notification in `O(log 10)`, which is effectively constant time for the required top 10 display.

## Logging Middleware Usage

The reusable `Log(stack, level, package, message)` function lives in `logging_middleware/log.js`. The React app calls it when:

- Notifications are requested from the API.
- Notifications are loaded successfully.
- API loading fails.
- A notification is marked as viewed.
- All visible notifications are marked as viewed.

All calls use frontend-supported package values such as `api` and `state`.
