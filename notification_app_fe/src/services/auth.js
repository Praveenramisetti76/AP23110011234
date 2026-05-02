export function getAuthHeaders() {
  const token =
    import.meta.env.VITE_API_TOKEN ||
    localStorage.getItem('campus_api_token') ||
    localStorage.getItem('access_token')

  return token ? { Authorization: `Bearer ${token}` } : {}
}
