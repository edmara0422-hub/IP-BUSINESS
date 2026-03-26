import { NextResponse } from 'next/server'

async function safeFetch(url: string, ms = 4000): Promise<Response | null> {
  try {
    const controller = new AbortController()
    const timer = setTimeout(() => controller.abort(), ms)
    const res = await fetch(url, { signal: controller.signal, cache: 'no-store' })
    clearTimeout(timer)
    return res.ok ? res : null
  } catch { return null }
}

function simpleHash(str: string): string {
  let hash = 0
  for (let i = 0; i < str.length; i++) {
    hash = ((hash << 5) - hash) + str.charCodeAt(i)
    hash |= 0
  }
  return Math.abs(hash).toString(36)
}

function extractTag(xml: string, tag: string): string {
  const re = new RegExp(`<${tag}[^>]*>(?:<!\\[CDATA\\[)?([\\s\\S]*?)(?:\\]\\]>)?</${tag}>`)
  return (xml.match(re)?.[1] ?? '').trim()
}

interface NewsItem { id: string; title: string; source: string; category: string; pubDate: string; link: string }

function parseItems(xml: string, category: string, defaultSource = 'RSS'): NewsItem[] {
  const items: NewsItem[] = []
  const re = /<item>([\s\S]*?)<\/item>/g
  let m: RegExpExecArray | null
  while ((m = re.exec(xml)) !== null) {
    const block = m[1]
    const title = extractTag(block, 'title')
    if (!title) continue
    const link = extractTag(block, 'link')
    const pubDateRaw = extractTag(block, 'pubDate')
    const srcMatch = block.match(/<source[^>]*>(?:<!\[CDATA\[)?([\s\S]*?)(?:\]\]>)?<\/source>/)
    const source = srcMatch?.[1]?.trim() ?? defaultSource
    items.push({ id: simpleHash(title), title, source, category, pubDate: pubDateRaw ? new Date(pubDateRaw).toISOString() : new Date().toISOString(), link })
  }
  // Atom feed fallback (entry instead of item)
  const atomRe = /<entry>([\s\S]*?)<\/entry>/g
  while ((m = atomRe.exec(xml)) !== null) {
    const block = m[1]
    const title = extractTag(block, 'title')
    if (!title) continue
    const linkMatch = block.match(/<link[^>]*href="([^"]*)"/)
    const link = linkMatch?.[1] ?? extractTag(block, 'link')
    const pubDateRaw = extractTag(block, 'published') || extractTag(block, 'updated')
    items.push({ id: simpleHash(title), title, source: defaultSource, category, pubDate: pubDateRaw ? new Date(pubDateRaw).toISOString() : new Date().toISOString(), link })
  }
  return items
}

// ── Fontes RSS diversificadas ──────────────────────────────────────
const SOURCES = [
  // Economia BR
  { url: 'https://www.infomoney.com.br/feed/', category: 'economia', source: 'InfoMoney' },
  { url: 'https://valor.globo.com/rss/valor', category: 'economia', source: 'Valor Econômico' },
  { url: 'https://agenciabrasil.ebc.com.br/rss/economia/feed.xml', category: 'economia', source: 'Agência Brasil' },

  // Mercado financeiro
  { url: 'https://www.infomoney.com.br/mercados/feed/', category: 'mercado', source: 'InfoMoney' },
  { url: 'https://br.investing.com/rss/news.rss', category: 'mercado', source: 'Investing.com' },

  // Inovação e Tecnologia
  { url: 'https://www.tecmundo.com.br/rss', category: 'tecnologia', source: 'TecMundo' },
  { url: 'https://canaltech.com.br/rss/', category: 'tecnologia', source: 'Canaltech' },
  { url: 'https://techcrunch.com/feed/', category: 'tecnologia', source: 'TechCrunch' },

  // Startups e Negócios
  { url: 'https://startups.com.br/feed/', category: 'startups', source: 'Startups.com.br' },
  { url: 'https://www.infomoney.com.br/negocios/feed/', category: 'startups', source: 'InfoMoney' },

  // Inovação
  { url: 'https://epocanegocios.globo.com/rss/epocanegocios', category: 'inovacao', source: 'Época Negócios' },
]

let cache: { data: { news: NewsItem[]; updatedAt: string } | null; ts: number } = { data: null, ts: 0 }
const CACHE_TTL = 60_000

export const dynamic = 'force-dynamic'

export async function GET() {
  if (cache.data && Date.now() - cache.ts < CACHE_TTL) return NextResponse.json(cache.data)

  try {
    const results = await Promise.allSettled(
      SOURCES.map(async ({ url, category, source }) => {
        const res = await safeFetch(url)
        if (!res) return []
        return parseItems(await res.text(), category, source)
      })
    )

    const all: NewsItem[] = []
    for (const r of results) if (r.status === 'fulfilled') all.push(...r.value)

    // Deduplica por título (55 chars)
    const seen = new Set<string>()
    const unique = all.filter(item => {
      const key = item.title.slice(0, 55).toLowerCase()
      if (seen.has(key)) return false
      seen.add(key)
      return true
    })

    // Ordena por data desc, filtra últimas 48h
    unique.sort((a, b) => new Date(b.pubDate).getTime() - new Date(a.pubDate).getTime())
    const cutoff = Date.now() - 48 * 3600 * 1000
    const fresh = unique.filter(n => new Date(n.pubDate).getTime() > cutoff)

    // Balancear categorias: max 5 por categoria
    const balanced: NewsItem[] = []
    const catCount: Record<string, number> = {}
    for (const item of (fresh.length > 5 ? fresh : unique)) {
      const c = catCount[item.category] ?? 0
      if (c < 5) {
        balanced.push(item)
        catCount[item.category] = c + 1
      }
      if (balanced.length >= 20) break
    }

    const data = { news: balanced, updatedAt: new Date().toISOString() }
    cache = { data, ts: Date.now() }
    return NextResponse.json(data, { headers: { 'Access-Control-Allow-Origin': '*' } })
  } catch {
    return NextResponse.json({ news: [], updatedAt: new Date().toISOString() }, { headers: { 'Access-Control-Allow-Origin': '*' } })
  }
}
