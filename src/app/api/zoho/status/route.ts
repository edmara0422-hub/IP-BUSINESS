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

export async function GET() {
  const supabase = await createServerClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Não autorizado' }, { status: 401 })

  const { data: profile } = await supabase.from('profiles').select('role').eq('id', user.id).single()
  if (profile?.role !== 'admin') return NextResponse.json({ error: 'Sem permissão' }, { status: 403 })

  const hasClientId = !!process.env.ZOHO_CLIENT_ID
  const hasClientSecret = !!process.env.ZOHO_CLIENT_SECRET

  const db = adminDb()
  const { data: tokenRow } = await db
    .from('admin_settings')
    .select('value')
    .eq('key', 'zoho_refresh_token')
    .single()

  const hasToken = !!tokenRow?.value
  let org: { name?: string; id?: string } | null = null

  if (hasToken && hasClientId && hasClientSecret) {
    try {
      // Get a fresh access token to verify connection is alive
      const tokenRes = await fetch('https://accounts.zoho.com/oauth/v2/token', {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: new URLSearchParams({
          grant_type: 'refresh_token',
          client_id: process.env.ZOHO_CLIENT_ID!,
          client_secret: process.env.ZOHO_CLIENT_SECRET!,
          refresh_token: tokenRow!.value,
        }),
      })
      const tokenData = await tokenRes.json()
      if (tokenData.access_token) {
        const orgRes = await fetch('https://www.zohoapis.com/crm/v3/org', {
          headers: { Authorization: `Zoho-oauthtoken ${tokenData.access_token}` },
        })
        const orgData = await orgRes.json()
        org = {
          name: orgData?.org?.[0]?.company_name ?? null,
          id: orgData?.org?.[0]?.zgid ?? null,
        }
      }
    } catch { /* token may be expired, not fatal */ }
  }

  return NextResponse.json({
    configured: hasClientId && hasClientSecret,
    connected: hasToken,
    level: hasToken ? 2 : hasClientId ? 1 : 0,
    org,
  })
}
