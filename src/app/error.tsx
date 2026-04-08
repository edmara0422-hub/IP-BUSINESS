'use client'

export default function Error() {
  return (
    <main
      style={{
        minHeight: '100vh',
        display: 'grid',
        placeItems: 'center',
        background:
          'radial-gradient(circle at top, rgba(255,255,255,0.08), transparent 24%), #050505',
        color: 'white',
        fontFamily: 'Poppins, sans-serif',
        padding: '2rem',
      }}
    >
      <div
        style={{
          width: 'min(32rem, 100%)',
          border: '1px solid rgba(255,255,255,0.12)',
          borderRadius: '1.5rem',
          padding: '2rem',
          background:
            'linear-gradient(180deg, rgba(255,255,255,0.12) 0%, rgba(12,14,18,0.72) 46%, rgba(7,8,10,0.92) 100%)',
          boxShadow:
            'inset 0 1px 0 rgba(255,255,255,0.08), 0 18px 42px rgba(0,0,0,0.24)',
          backdropFilter: 'blur(20px) saturate(120%)',
          WebkitBackdropFilter: 'blur(20px) saturate(120%)',
        }}
      >
        <p
          style={{
            margin: 0,
            fontSize: '0.7rem',
            letterSpacing: '0.24em',
            textTransform: 'uppercase',
            color: 'rgba(255,255,255,0.42)',
          }}
        >
          IPB
        </p>
        <h1
          style={{
            marginTop: '0.9rem',
            marginBottom: '0.75rem',
            fontSize: '1.75rem',
            lineHeight: 1.1,
          }}
        >
          A plataforma encontrou uma falha inesperada.
        </h1>
        <p
          style={{
            margin: 0,
            color: 'rgba(255,255,255,0.64)',
            lineHeight: 1.6,
          }}
        >
          Tente atualizar a página. Se o erro persistir, reinicie a sessão do app.
        </p>
      </div>
    </main>
  )
}
