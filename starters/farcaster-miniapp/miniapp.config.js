// Single source of truth for the embed meta tag and the /.well-known/farcaster.json manifest.
// APP_URL must be the https origin where the app is served at the domain root (custom domain or <user>.github.io).
export const APP_URL = (process.env.APP_URL || 'https://blockchains.github.io').replace(/\/$/, '')

export const miniapp = {
  version: '1',
  name: 'Blockchain Lab Mini App',
  iconUrl: `${APP_URL}/icon.png`,
  homeUrl: `${APP_URL}/`,
  imageUrl: `${APP_URL}/embed.png`,
  buttonTitle: 'Open',
  splashImageUrl: `${APP_URL}/icon.png`,
  splashBackgroundColor: '#0b0d12',
  subtitle: 'Wallet and cast starter',
  description: 'Farcaster Mini App starter from Blockchain Lab: reads your Farcaster context, connects the in-app wallet and composes casts.',
  primaryCategory: 'utility',
  tags: ['starter', 'wallet', 'blockchainlab'],
  requiredChains: ['eip155:8453'],
}

export const embed = {
  version: '1',
  imageUrl: miniapp.imageUrl,
  button: { title: miniapp.buttonTitle, action: { type: 'launch_miniapp', name: miniapp.name, url: miniapp.homeUrl, splashImageUrl: miniapp.splashImageUrl, splashBackgroundColor: miniapp.splashBackgroundColor } },
}

// accountAssociation proves you own APP_URL's domain: sign it with your Farcaster account at
// https://farcaster.xyz/~/developers/mini-apps/manifest and paste it into ACCOUNT_ASSOCIATION (JSON) at build time.
export const accountAssociation = process.env.ACCOUNT_ASSOCIATION ? JSON.parse(process.env.ACCOUNT_ASSOCIATION) : null
