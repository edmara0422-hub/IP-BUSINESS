export async function apiFetch(path: string): Promise<Response> {
  // Em ambiente Capacitor (app nativo), tenta .json local empacotado
  if (typeof window !== 'undefined' && (window as any).Capacitor) {
    try {
      const res = await fetch(`${path}.json`)
      if (res.ok) return res
    } catch {}
  }

  // Busca dados dinâmicos da API (tempo real)
  return fetch(path, { cache: 'no-store' })
}
