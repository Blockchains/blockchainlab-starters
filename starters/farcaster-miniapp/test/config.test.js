import { test } from 'node:test'
import assert from 'node:assert/strict'
import { createRequire } from 'node:module'
import { miniapp, embed } from '../miniapp.config.js'

const require = createRequire(import.meta.url)
const { domainMiniAppConfigSchema } = require('@farcaster/miniapp-core/dist/schemas/manifest.js')
const { miniAppEmbedNextSchema } = require('@farcaster/miniapp-core/dist/schemas/embeds.js')

test('manifest miniapp config passes the official schema', () => {
  const r = domainMiniAppConfigSchema.safeParse(miniapp)
  assert.ok(r.success, JSON.stringify(r.error?.issues))
})

test('embed passes the official fc:miniapp schema', () => {
  const r = miniAppEmbedNextSchema.safeParse(embed)
  assert.ok(r.success, JSON.stringify(r.error?.issues))
})
