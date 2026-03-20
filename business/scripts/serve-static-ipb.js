const http = require('http')
const fs = require('fs')
const path = require('path')

const root = process.cwd()
const port = Number(process.env.PORT || 3001)
const runtimePatchPath = path.join(root, 'scripts', 'ipb-runtime-cleanup.js')
const runtimePatchSource = fs.readFileSync(runtimePatchPath, 'utf8')
const buildDirCandidates = ['.next', '.next-stale-20260313-1']

const resolveBuildDir = () => {
  for (const candidate of buildDirCandidates) {
    const appIndex = path.join(root, candidate, 'server', 'app', 'index.html')
    if (fs.existsSync(appIndex)) {
      return candidate
    }
  }

  return '.next'
}

const buildDir = resolveBuildDir()

const staticRoutes = {
  '/': `${buildDir}/server/app/index.html`,
  '/splash-preview': `${buildDir}/server/app/splash-preview.html`,
  '/splash-preview/': `${buildDir}/server/app/splash-preview.html`,
  '/icon.svg': `${buildDir}/server/app/icon.svg.body`,
}

const contentTypes = {
  '.html': 'text/html; charset=utf-8',
  '.js': 'application/javascript; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.svg': 'image/svg+xml',
  '.json': 'application/json; charset=utf-8',
}

const server = http.createServer((req, res) => {
  const url = new URL(req.url, 'http://127.0.0.1')
  let file = staticRoutes[url.pathname]

  if (!file && url.pathname.startsWith('/_next/static/')) {
    file = `${buildDir}/static/${url.pathname.slice('/_next/static/'.length)}`
  }

  if (!file) {
    res.statusCode = 404
    res.end('Not found')
    return
  }

  const fullPath = path.join(root, file)

  fs.readFile(fullPath, (error, data) => {
    if (error) {
      res.statusCode = 404
      res.end('Not found')
      return
    }

    const extension = path.extname(fullPath)
    const contentType = contentTypes[extension] || 'application/octet-stream'

    res.setHeader('Content-Type', contentType)

    if (extension === '.html') {
      const html = data.toString('utf8')
      const runtimePatch = `<script>${runtimePatchSource}</script>`

      res.end(html.replace('</body>', `${runtimePatch}</body>`))
      return
    }

    res.end(data)
  })
})

server.listen(port, '127.0.0.1', () => {
  console.log('ready')
})
