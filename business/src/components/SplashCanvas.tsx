'use client'

export default function SplashCanvas() {
  return (
    <div className="absolute inset-0 flex items-center justify-center overflow-hidden">
      {/* Fundo radial */}
      <div
        className="absolute inset-0"
        style={{
          background:
            'radial-gradient(ellipse at 50% 38%, rgba(255,255,255,0.07) 0%, rgba(255,255,255,0.02) 28%, transparent 60%)',
        }}
      />

      {/* Arco principal girando */}
      <svg
        viewBox="0 0 440 440"
        className="absolute"
        style={{ width: 'min(60vw, 44rem)', height: 'min(60vw, 44rem)', animation: 'ipb-spin 4.8s linear infinite' }}
      >
        <defs>
          <linearGradient id="arc-grad" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="rgba(255,255,255,0)" />
            <stop offset="30%" stopColor="rgba(200,210,220,0.6)" />
            <stop offset="55%" stopColor="rgba(255,255,255,1)" />
            <stop offset="75%" stopColor="rgba(210,218,228,0.7)" />
            <stop offset="100%" stopColor="rgba(255,255,255,0)" />
          </linearGradient>
          <filter id="arc-glow">
            <feGaussianBlur stdDeviation="2.5" result="blur" />
            <feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge>
          </filter>
        </defs>
        {/* Trilha do arco */}
        <circle cx="220" cy="220" r="160" fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth="1.5" />
        {/* Arco com gradiente */}
        <circle
          cx="220"
          cy="220"
          r="160"
          fill="none"
          stroke="url(#arc-grad)"
          strokeWidth="2.2"
          strokeLinecap="round"
          strokeDasharray="480 528"
          filter="url(#arc-glow)"
        />
      </svg>

      {/* Halo exterior pulsando */}
      <div
        className="absolute rounded-full"
        style={{
          width: 'min(68vw, 52rem)',
          height: 'min(68vw, 52rem)',
          border: '1px solid rgba(255,255,255,0.05)',
          animation: 'ipb-pulse 3s ease-in-out infinite',
        }}
      />

      {/* Halo interior */}
      <div
        className="absolute rounded-full"
        style={{
          width: 'min(46vw, 36rem)',
          height: 'min(46vw, 36rem)',
          background:
            'radial-gradient(ellipse at center, rgba(255,255,255,0.05) 0%, rgba(255,255,255,0.01) 50%, transparent 78%)',
          animation: 'ipb-pulse 3s ease-in-out infinite 1.5s',
        }}
      />

      <style>{`
        @keyframes ipb-spin {
          from { transform: rotate(0deg); }
          to   { transform: rotate(360deg); }
        }
        @keyframes ipb-pulse {
          0%, 100% { opacity: 0.5; transform: scale(1); }
          50%       { opacity: 1;   transform: scale(1.02); }
        }
      `}</style>
    </div>
  )
}
