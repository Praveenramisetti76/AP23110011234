const LOG_API_URL = 'http://20.207.122.201/evaluation-service/logs'

const allowedStacks = new Set(['frontend'])
const allowedLevels = new Set(['debug', 'info', 'warn', 'error', 'fatal'])
const allowedPackages = new Set(['api', 'component', 'hook', 'page', 'state', 'style'])

function normalizeValue(value) {
  return String(value || '').trim().toLowerCase()
}



function getAuthHeaders() {
  const token =
    import.meta.env.VITE_API_TOKEN ||
    localStorage.getItem('campus_api_token') ||
    localStorage.getItem('access_token')

  return token ? { Authorization: `Bearer ${token}` } : {}
}


export async function Log(stack, level, packageName, message) {
  const payload = {
    stack: normalizeValue(stack),
    level: normalizeValue(level),
    package: normalizeValue(packageName),
    message: String(message || '').trim(),
  }

  if (!allowedStacks.has(payload.stack)) {
    payload.stack = 'frontend'
  }

  if (!allowedLevels.has(payload.level)) {
    payload.level = 'info'
  }

  if (!allowedPackages.has(payload.package)) {
    payload.package = 'component'
  }

  if (!payload.message) {
    payload.message = 'Frontend event recorded without message'
  }



  try {
    const response = await fetch(LOG_API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...getAuthHeaders(),
      },
      body: JSON.stringify(payload),
    })

    return response.ok
  } catch {
    return false
  }
}
