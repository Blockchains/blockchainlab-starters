import { defineConfig } from 'vite'
import { mkdirSync, writeFileSync } from 'node:fs'
import { miniapp, embed, accountAssociation } from './miniapp.config.js'

export default defineConfig({
  base: './',
  build: { target: 'es2022' },
  plugins: [{
    name: 'miniapp-meta',
    transformIndexHtml: (html) => html.replace('<!--fc:miniapp-->', `<meta name="fc:miniapp" content='${JSON.stringify(embed)}' />\n    <meta name="fc:frame" content='${JSON.stringify({ ...embed, button: { ...embed.button, action: { ...embed.button.action, type: 'launch_frame' } } })}' />`),
    closeBundle() {
      mkdirSync('dist/.well-known', { recursive: true })
      writeFileSync('dist/.well-known/farcaster.json', JSON.stringify({ ...(accountAssociation ? { accountAssociation } : {}), miniapp }, null, 2))
    },
  }],
})
