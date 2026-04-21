import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

export const dynamic = 'force-dynamic'

const APP_URL = process.env.NEXT_PUBLIC_APP_URL ?? 'https://ip-business-ten.vercel.app'

function adminDb() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    { auth: { autoRefreshToken: false, persistSession: false } }
  )
}

export async function GET(req: NextRequest) {
  const code = req.nextUrl.searchParams.get('code')
  const errorParam = req.nextUrl.searchParams.get('error')

  if (errorParam) {
    return NextResponse.redirect(`${APP_URL}/?zoho_error=${encodeURIComponent(errorParam)}`)
  }
  if (!code) {
    return NextResponse.redirect(`${APP_URL}/?zoho_error=no_code`)
  }

  const clientId = process.env.ZOHO_CLIENT_ID
  const clientSecret = process.env.ZOHO_CLIENT_SECRET

  if (!clientId || !clientSecret) {
    return NextResponse.redirect(`${APP_URL}/?zoho_error=missing_env`)
  }

  try {
    const tokenRes = await fetch('https://accounts.zoho.com/oauth/v2/token', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams({
        code,
        client_id: clientId,
        client_secret: clientSecret,
        redirect_uri: `${APP_URL}/api/zoho/callback`,
        grant_type: 'authorization_code',
      }),
    })

    const tokenData = await tokenRes.json()

    if (tokenData.error) {
      return NextResponse.redirect(`${APP_URL}/?zoho_error=${encodeURIComponent(tokenData.error)}`)
    }

    if (!tokenData.refresh_token) {
      return NextResponse.redirect(`${APP_URL}/?zoho_error=no_refresh_token&hint=${encodeURIComponent(JSON.stringify(tokenData).slice(0, 100))}`)
    }

    const db = adminDb()
    const { error: dbError } = await db.from('admin_settings').upsert(
      { key: 'zoho_refresh_token', value: tokenData.refresh_token, updated_at: new Date().toISOString() },
      { onConflict: 'key' }
    )

    if (dbError) {
      return NextResponse.redirect(`${APP_URL}/?zoho_error=db_${encodeURIComponent(dbError.message.slice(0, 50))}`)
    }

    return NextResponse.redirect(`${APP_URL}/?zoho=connected`)
  } catch (err) {
    const msg = err instanceof Error ? err.message.slice(0, 60) : 'unknown'
    return NextResponse.redirect(`${APP_URL}/?zoho_error=exception_${encodeURIComponent(msg)}`)
  }
}
