const path = require('path')

/** @type {import('next').NextConfig} */
const nextConfig = {
    reactStrictMode: true,
    output: 'export',
    outputFileTracingRoot: path.resolve(__dirname),
    serverExternalPackages: ['groq-sdk'],
    typescript: { ignoreBuildErrors: true },
}

module.exports = nextConfig
