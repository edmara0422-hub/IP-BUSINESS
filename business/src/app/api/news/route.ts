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

function parseItems(xml: string, category: string, defaultSource = 'Google News'): NewsItem[] {
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
  return items
}

// ── Fontes RSS reais por categoria ──────────────────────────────────────
const SOURCES = [
  // Economia BR
  { url: 'https://news.google.com/rss/search?q=economia+Brasil+SELIC+PIB+inflação&hl=pt-BR&gl=BR&ceid=BR:pt-419', category: 'economia', source: 'Google News' },
  { url: 'https://exame.com/economia/feed/', category: 'economia', source: 'Exame' },

  // Mercado financeiro
  { url: 'https://news.google.com/rss/search?q=bolsa+ibovespa+B3+ações+dólar+mercado&hl=pt-BR&gl=BR&ceid=BR:pt-419', category: 'mercado', source: 'Google News' },
  { url: 'https://exame.com/invest/feed/', category: 'mercado', source: 'Exame Invest' },

  // Inovação / IA
  { url: 'https://news.google.com/rss/search?q=inteligência+artificial+inovação+tecnologia+2025&hl=pt-BR&gl=BR&ceid=BR:pt-419', category: 'inovacao', source: 'Google News' },
  { url: 'https://exame.com/tecnologia/feed/', category: 'inovacao', source: 'Exame Tech' },
  { url: 'https://techcrunch.com/feed/', category: 'tecnologia', source: 'TechCrunch' },

  // Startups
  { url: 'https://news.google.com/rss/search?q=startups+venture+capital+unicórnio+Brasil&hl=pt-BR&gl=BR&ceid=BR:pt-419', category: 'startups', source: 'Google News' },
  { url: 'https://exame.com/negocios/feed/', category: 'startups', source: 'Exame Negócios' },

  // Global
  { url: 'https://news.google.com/rss/search?q=federal+reserve+nasdaq+sp500+wall+street&hl=en-US&gl=US&ceid=US:en', category: 'mercado', source: 'Global Markets' },
]

let cache: { data: { news: NewsItem[]; updatedAt: string } | null; ts: number } = { data: null, ts: 0 }
const CACHE_TTL = 60_000 // 60s — mesmo ritmo dos dados de mercado

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

    const data = { news: (fresh.length > 5 ? fresh : unique).slice(0, 20), updatedAt: new Date().toISOString() }
    cache = { data, ts: Date.now() }
    return NextResponse.json(data)
  } catch {
    return NextResponse.json({ news: [], updatedAt: new Date().toISOString() })
  }
}
