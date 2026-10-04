# farcaster-miniapp

[Farcaster Mini App](https://miniapps.farcaster.xyz) starter: a static Vite app using `@farcaster/miniapp-sdk` — calls `ready()`, reads the
user's Farcaster context, connects the in-client Ethereum wallet (falls back to the browser wallet) and composes casts. The `fc:miniapp`
embed tag and `/.well-known/farcaster.json` are generated from `miniapp.config.js` and validated against the official
`@farcaster/miniapp-core` schemas in tests.

```bash
npm ci
npm test                       # schema tests + vite build + dist check (embed tag + manifest)
APP_URL=https://your.domain ACCOUNT_ASSOCIATION='{"header":"...","payload":"...","signature":"..."}' npm run build
npm run dev                    # then open the URL in the Mini App preview: https://farcaster.xyz/~/developers/mini-apps/preview
```

Publishing: the manifest must live at the **domain root** (`https://<domain>/.well-known/farcaster.json`), so deploy `dist/` to a custom
domain or a `<user>.github.io` site, then sign the domain with your Farcaster account (Developers → Manifest) and set `ACCOUNT_ASSOCIATION`.
Replace `public/icon.png` (1024×1024) and `public/embed.png` (3:2) with real artwork.
