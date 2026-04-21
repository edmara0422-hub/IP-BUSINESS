import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

export const dynamic = 'force-dynamic'

function adminDb() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    { auth: { autoRefreshToken: false, persistSession: false } }
  )
}

export async function GET(req: NextRequest) {
  const appUrl = process.env.NEXT_PUBLIC_APP_URL ?? ''
  const code = req.nextUrl.searchParams.get('code')
  const errorParam = req.nextUrl.searchParams.get('error')

  if (errorParam) {
    return NextResponse.redirect(`${appUrl}/?zoho_error=${errorParam}`)
  }
  if (!code) {
    return NextResponse.redirect(`${appUrl}/?zoho_error=no_code`)
  }

  const clientId = process.env.ZOHO_CLIENT_ID
  const clientSecret = process.env.ZOHO_CLIENT_SECRET
  if (!clientId || !clientSecret) {
    return NextResponse.redirect(`${appUrl}/?zoho_error=missing_env`)
  }

  try {
    const tokenRes = await fetch('https://accounts.zoho.com/oauth/v2/token', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams({
        code,
        client_id: clientId,
        client_secret: clientSecret,
        redirect_uri: `${appUrl}/api/zoho/callback`,
        grant_type: 'authorization_code',
      }),
    })

    const tokenData = await tokenRes.json()
    if (!tokenData.refresh_token) {
      return NextResponse.redirect(`${appUrl}/?zoho_error=no_refresh_token`)
    }

    const db = adminDb()
    await db.from('admin_settings').upsert(
      { key: 'zoho_refresh_token', value: tokenData.refresh_token, updated_at: new Date().toISOString() },
      { onConflict: 'key' }
    )

    return NextResponse.redirect(`${appUrl}/?zoho=connected`)
  } catch {
    return NextResponse.redirect(`${appUrl}/?zoho_error=token_exchange_failed`)
  }
}
