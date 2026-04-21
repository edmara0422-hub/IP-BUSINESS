import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export const dynamic = 'force-dynamic'

const CALLBACK = 'https://ip-business-ten.vercel.app/api/zoho/callback'
const HOME = 'https://ip-business-ten.vercel.app'

export async function GET() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Não autorizado' }, { status: 401 })

  const { data: profile } = await supabase.from('profiles').select('role').eq('id', user.id).single()
  if (profile?.role !== 'admin') return NextResponse.json({ error: 'Sem permissão' }, { status: 403 })

  const clientId = process.env.ZOHO_CLIENT_ID
  if (!clientId) return NextResponse.redirect(`${HOME}/?zoho_error=missing_client_id`)

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
    redirect_uri: CALLBACK,
    access_type: 'offline',
    prompt: 'consent',
  })

  return NextResponse.redirect(`https://accounts.zoho.com/oauth/v2/auth?${params}`)
}
