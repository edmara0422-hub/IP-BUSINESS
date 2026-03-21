export async function apiFetch(path: string): Promise<Response> {
  // Tenta .json local (empacotado no app)
  try {
    const res = await fetch(`${path}.json`)
    if (res.ok) return res
  } catch {}

  // Fallback sem extensão
  return fetch(path)
}
