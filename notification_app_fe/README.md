# Notification App Frontend

This folder contains the frontend-track React/Vite submission for the Campus Notifications Microservice.

## Run

```bash
npm install
npm run dev
```

The app runs at:

```text
http://localhost:3000
```

## What is included

- Responsive React frontend built with Material UI.
- All notifications page with pagination and notification type filtering.
- Priority Inbox page showing the top 10 unread notifications.
- Viewed notification state stored in browser localStorage.
- Protected API calls using `VITE_API_TOKEN` from `.env.local`.
- Logging middleware integration through `../logging_middleware/log.js`.

## Environment

Create `.env.local` in this folder with:

```text
VITE_API_TOKEN=your_bearer_token_here
```

The submitted local workspace already has this file for testing, and it is ignored by git.
