import { NextResponse } from 'next/server'
import { createClient as createServerClient } from '@/lib/supabase/server'
import { createClient } from '@supabase/supabase-js'

export const dynamic = 'force-dynamic'

function adminDb() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    { auth: { autoRefreshToken: false, persistSession: false } }
  )
}

async function getAccessToken(refreshToken: string): Promise<string | null> {
  const res = await fetch('https://accounts.zoho.com/oauth/v2/token', {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({
      grant_type: 'refresh_token',
      client_id: process.env.ZOHO_CLIENT_ID!,
      client_secret: process.env.ZOHO_CLIENT_SECRET!,
      refresh_token: refreshToken,
    }),
  })
  const data = await res.json()
  return data.access_token ?? null
}

export async function GET() {
  const supabase = await createServerClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Não autorizado' }, { status: 401 })

  const { data: profile } = await supabase.from('profiles').select('role').eq('id', user.id).single()
  if (profile?.role !== 'admin') return NextResponse.json({ error: 'Sem permissão' }, { status: 403 })

  const db = adminDb()
  const { data: tokenRow } = await db
    .from('admin_settings')
    .select('value')
    .eq('key', 'zoho_refresh_token')
    .single()

  if (!tokenRow?.value) {
    return NextResponse.json({ error: 'Zoho não conectado' }, { status: 400 })
  }

  const accessToken = await getAccessToken(tokenRow.value)
  if (!accessToken) {
    return NextResponse.json({ error: 'Falha ao obter token de acesso' }, { status: 500 })
  }

  const headers = { Authorization: `Zoho-oauthtoken ${accessToken}` }
  const baseUrl = 'https://www.zohoapis.com/crm/v3'

  try {
    const [dealsRes, contactsRes] = await Promise.allSettled([
      fetch(`${baseUrl}/Deals?fields=Deal_Name,Amount,Stage,Closing_Date,Account_Name,Probability&per_page=200&sort_by=Closing_Date&sort_order=asc`, { headers }),
      fetch(`${baseUrl}/Contacts?fields=Full_Name,Email,Lead_Source,Created_Time&per_page=50&sort_by=Created_Time&sort_order=desc`, { headers }),
    ])

    interface ZohoDeal {
      id: string
      Deal_Name: string
      Amount: number | null
      Stage: string
      Closing_Date: string | null
      Probability: number | null
      Account_Name?: { name: string } | null
    }

    interface ZohoContact {
      id: string
      Full_Name: string
      Email: string | null
      Lead_Source: string | null
      Created_Time: string
    }

    let deals: ZohoDeal[] = []
    let contacts: ZohoContact[] = []

    if (dealsRes.status === 'fulfilled') {
      try {
        const d = await dealsRes.value.json()
        deals = d?.data ?? []
      } catch { /* fallback */ }
    }
    if (contactsRes.status === 'fulfilled') {
      try {
        const d = await contactsRes.value.json()
        contacts = d?.data ?? []
      } catch { /* fallback */ }
    }

    // Aggregate pipeline by stage
    const stageMap: Record<string, { count: number; value: number }> = {}
    let totalPipeline = 0
    let wonThisMonth = 0
    const now = new Date()
    const monthStart = new Date(now.getFullYear(), now.getMonth(), 1)

    for (const deal of deals) {
      const stage = deal.Stage ?? 'Unknown'
      if (!stageMap[stage]) stageMap[stage] = { count: 0, value: 0 }
      stageMap[stage].count++
      stageMap[stage].value += deal.Amount ?? 0

      if (stage !== 'Closed Won') {
        totalPipeline += deal.Amount ?? 0
      }

      if (stage === 'Closed Won' && deal.Closing_Date) {
        const closeDate = new Date(deal.Closing_Date)
        if (closeDate >= monthStart) {
          wonThisMonth += deal.Amount ?? 0
        }
      }
    }

    const pipeline = Object.entries(stageMap).map(([stage, data]) => ({
      stage,
      count: data.count,
      value: data.value,
    })).sort((a, b) => b.value - a.value)

    return NextResponse.json({
      summary: {
        totalDeals: deals.length,
        totalPipeline: Math.round(totalPipeline),
        wonThisMonth: Math.round(wonThisMonth),
        totalContacts: contacts.length,
      },
      pipeline,
      recentContacts: contacts.slice(0, 5).map(c => ({
        name: c.Full_Name,
        email: c.Email,
        source: c.Lead_Source,
        createdAt: c.Created_Time,
      })),
      updatedAt: new Date().toISOString(),
    })
  } catch {
    return NextResponse.json({ error: 'Falha ao buscar dados do CRM' }, { status: 500 })
  }
}
