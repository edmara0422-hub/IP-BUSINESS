const path = require('path')

/** @type {import('next').NextConfig} */
const nextConfig = {
    reactStrictMode: true,
    ...(process.env.STATIC_EXPORT === '1' ? { output: 'export' } : {}),
    outputFileTracingRoot: path.resolve(__dirname),
    serverExternalPackages: ['groq-sdk'],
    typescript: { ignoreBuildErrors: true },
    async headers() {
        return [
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
