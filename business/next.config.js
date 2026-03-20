const path = require('path')

/** @type {import('next').NextConfig} */
const nextConfig = {
    reactStrictMode: true,
    outputFileTracingRoot: path.resolve(__dirname),
    serverExternalPackages: ['groq-sdk'],
    // Capacitor: static export for native build
    ...(process.env.CAPACITOR_BUILD === '1' && {
        output: 'export',
        distDir: 'out',
    }),
}

module.exports = nextConfig
