import { createClient } from '@supabase/supabase-js'
import { NextResponse } from 'next/server'
import { createClient as createServerClient } from '@/lib/supabase/server'

function getAdminClient() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    { auth: { autoRefreshToken: false, persistSession: false } }
  )
}

export const dynamic = 'force-dynamic'

export async function POST(request: Request) {
  const adminClient = getAdminClient()
  // Verifica se quem chama é admin
  const supabase = await createServerClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Não autorizado' }, { status: 401 })

  const { data: profile } = await supabase.from('profiles').select('role').eq('id', user.id).single()
  if (profile?.role !== 'admin') return NextResponse.json({ error: 'Sem permissão' }, { status: 403 })

  const { email, name, role } = await request.json() as { email: string; name: string; role: string }

  // Cria usuário com senha temporária e envia email de redefinição
  const { data, error } = await adminClient.auth.admin.createUser({
    email,
    email_confirm: true,
    user_metadata: { name },
  })

  if (error) return NextResponse.json({ error: error.message }, { status: 400 })

  // Define o role correto
  await adminClient.from('profiles').update({ role, name }).eq('id', data.user.id)

  // Envia link de redefinição de senha
  await adminClient.auth.admin.generateLink({ type: 'recovery', email })

  return NextResponse.json({ success: true })
}
