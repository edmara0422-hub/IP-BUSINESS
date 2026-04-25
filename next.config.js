const path = require('path')

/** @type {import('next').NextConfig} */
const nextConfig = {
    reactStrictMode: true,
    compress: true,
    ...(process.env.STATIC_EXPORT === '1' ? { output: 'export' } : {}),
    outputFileTracingRoot: path.resolve(__dirname),
    serverExternalPackages: ['groq-sdk'],
    typescript: { ignoreBuildErrors: true },
    experimental: {
        // tree-shake large icon/animation libraries — imports only what's used
        optimizePackageImports: ['lucide-react', 'framer-motion'],
    },
    turbopack: {},
    async headers() {
        return [
            // Static assets: cache agressivo (hash no nome = safe forever)
            {
                source: '/_next/static/:path*',
                headers: [
                    { key: 'Cache-Control', value: 'public, max-age=31536000, immutable' },
                ],
            },
            // HTML pages: nunca cachear — Capacitor iOS WebView busca sempre versão nova
            {
                source: '/((?!_next/static|_next/image|favicon).*)',
                headers: [
                    { key: 'Cache-Control', value: 'no-cache, must-revalidate' },
                    { key: 'Pragma', value: 'no-cache' },
                ],
            },
        ]
    },
}

module.exports = nextConfig
