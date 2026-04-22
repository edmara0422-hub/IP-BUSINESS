export async function apiFetch(path: string, options?: RequestInit): Promise<Response> {
  // Em ambiente Capacitor com GET, tenta .json local empacotado
  if (!options?.method || options.method === 'GET') {
    if (typeof window !== 'undefined' && (window as any).Capacitor) {
      try {
        const res = await fetch(`${path}.json`)
        if (res.ok) return res
      } catch {}
    }
  }

  return fetch(path, { cache: 'no-store', ...options })
}
