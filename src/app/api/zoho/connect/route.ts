import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export const dynamic = 'force-dynamic'

export async function GET() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Não autorizado' }, { status: 401 })

  const { data: profile } = await supabase.from('profiles').select('role').eq('id', user.id).single()
  if (profile?.role !== 'admin') return NextResponse.json({ error: 'Sem permissão' }, { status: 403 })

  const clientId = process.env.ZOHO_CLIENT_ID
  const appUrl = process.env.NEXT_PUBLIC_APP_URL

  if (!clientId) {
    return NextResponse.redirect(`${appUrl}/?zoho_error=missing_client_id`)
  }

  const scopes = [
    'ZohoCRM.modules.deals.READ',
    'ZohoCRM.modules.contacts.READ',
    'ZohoCRM.modules.accounts.READ',
    'ZohoCRM.org.READ',
    'ZohoCRM.settings.modules.READ',
  ].join(',')

  const params = new URLSearchParams({
    response_type: 'code',
    client_id: clientId,
    scope: scopes,
    redirect_uri: `${appUrl}/api/zoho/callback`,
    access_type: 'offline',
    prompt: 'consent',
  })

  return NextResponse.redirect(`https://accounts.zoho.com/oauth/v2/auth?${params}`)
}
