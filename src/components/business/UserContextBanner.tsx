'use client'

// Banner de contexto personalizado exibido no topo de cada seção Business
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export default function UserContextBanner({ userProfile, sectionInsight }: { userProfile?: any; sectionInsight?: string }) {
  if (!userProfile?.subtype && !userProfile?.sectors?.length) return null

  const nome    = userProfile?.nomeNegocio || userProfile?.nome_negocio || ''
  const fase    = userProfile?.subtype ?? ''
  const setores = userProfile?.sectors?.join(', ') ?? ''
  const revenue = userProfile?.revenue ?? ''

  const faseLabel: Record<string, string> = {
    validacao: 'Validação', mei: 'MEI', slu: 'SLU', startup: 'Startup', ltda: 'LTDA',
  }

  return (
    <div className="mb-3 rounded-lg px-4 py-2.5 flex items-start gap-3"
      style={{ background: 'rgba(93,173,226,0.07)', border: '1px solid rgba(93,173,226,0.18)' }}>
      <div className="w-1.5 h-1.5 rounded-full mt-1.5 shrink-0" style={{ background: '#5dade2', boxShadow: '0 0 6px #5dade2' }} />
      <div className="flex-1 min-w-0">
        <div className="flex flex-wrap items-center gap-x-2 gap-y-0.5 mb-0.5">
          {nome && <span className="text-[11px] font-bold text-white/70">{nome}</span>}
          {nome && (fase || setores) && <span className="text-white/20">·</span>}
          {faseLabel[fase] && <span className="text-[10px] font-mono font-bold px-1.5 py-0.5 rounded" style={{ background: 'rgba(93,173,226,0.15)', color: '#5dade2' }}>{faseLabel[fase]}</span>}
          {setores && <span className="text-[10px] text-white/40 truncate">{setores}</span>}
          {revenue && <span className="text-[10px] text-white/30">· {revenue}</span>}
        </div>
        {sectionInsight && (
          <p className="text-[11px] text-white/50 leading-snug">{sectionInsight}</p>
        )}
      </div>
    </div>
  )
}
