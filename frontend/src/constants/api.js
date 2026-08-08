const isLocalHost = typeof window !== 'undefined' &&
  (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1')

export const baseUrl = isLocalHost
  ? "http://localhost:1337"
  : (import.meta.env.VITE_API_URL || "http://localhost:1337")
