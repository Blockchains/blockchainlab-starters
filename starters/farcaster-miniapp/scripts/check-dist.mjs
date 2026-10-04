// After `vite build`: the embed meta tag and the domain manifest are in dist and valid.
import { readFileSync } from 'node:fs'
import { createRequire } from 'node:module'
const require = createRequire(import.meta.url)
const { domainMiniAppConfigSchema, domainManifestSchema } = require('@farcaster/miniapp-core/dist/schemas/manifest.js')
const { miniAppEmbedNextSchema } = require('@farcaster/miniapp-core/dist/schemas/embeds.js')

const html = readFileSync('dist/index.html', 'utf8')
const meta = html.match(/<meta name="fc:miniapp" content='([^']+)'/)
if (!meta) throw new Error('fc:miniapp meta tag missing from dist/index.html')
const e = miniAppEmbedNextSchema.safeParse(JSON.parse(meta[1]))
if (!e.success) throw new Error('embed invalid: ' + JSON.stringify(e.error.issues))
const manifest = JSON.parse(readFileSync('dist/.well-known/farcaster.json', 'utf8'))
const m = domainMiniAppConfigSchema.safeParse(manifest.miniapp)
if (!m.success) throw new Error('manifest invalid: ' + JSON.stringify(m.error.issues))
if (manifest.accountAssociation) {
  const full = domainManifestSchema.safeParse(manifest)
  if (!full.success) throw new Error('accountAssociation invalid: ' + JSON.stringify(full.error.issues))
  console.log('accountAssociation present and well-formed')
} else console.log('note: no ACCOUNT_ASSOCIATION set - sign your domain before publishing')
console.log('dist OK: fc:miniapp embed + /.well-known/farcaster.json valid')
