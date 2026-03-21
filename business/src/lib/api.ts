// No Capacitor (scheme https://localhost), API routes não existem como server.
// Busca do servidor Next.js rodando no Mac.
const isCapacitor = typeof window !== 'undefined' &&
  (window.location.protocol === 'capacitor:' || window.location.hostname === 'localhost' && !window.location.port)

const API_BASE = isCapacitor ? 'http://192.168.18.9:3005' : ''

export async function apiFetch(path: string, options?: RequestInit): Promise<Response> {
  // Tenta servidor ao vivo primeiro
  if (isCapacitor) {
    try {
      const res = await fetch(`${API_BASE}${path}`, { ...options, mode: 'cors' })
      if (res.ok) return res
    } catch {}
  }

  // Fallback: arquivo local .json
  try {
    const res = await fetch(`${path}.json`)
    if (res.ok) return res
  } catch {}

  // Fallback: arquivo local sem extensão
  return fetch(path, options)
}
