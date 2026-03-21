const SERVER = 'http://192.168.18.9:3005'

export async function apiFetch(path: string): Promise<Response> {
  // Sempre tenta o servidor ao vivo primeiro
  try {
    const res = await fetch(`${SERVER}${path}`)
    if (res.ok) return res
  } catch {}

  // Fallback: arquivo local .json
  try {
    const res = await fetch(`${path}.json`)
    if (res.ok) return res
  } catch {}

  // Fallback: arquivo local sem extensão
  return fetch(path)
}
