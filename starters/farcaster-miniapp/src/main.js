import { sdk } from '@farcaster/miniapp-sdk'
import { createWalletClient, custom } from 'viem'
import { base } from 'viem/chains'

const out = (m) => { document.getElementById('out').textContent = `${m}\n` + document.getElementById('out').textContent }
const inApp = await sdk.isInMiniApp().catch(() => false)

if (inApp) {
  const ctx = await sdk.context
  document.getElementById('who').textContent = `Hi @${ctx.user.username || ctx.user.fid} (fid ${ctx.user.fid}) — opened from ${ctx.location?.type || 'a Farcaster client'}`
} else {
  document.getElementById('who').textContent = 'Not inside a Farcaster client: open this URL in Warpcast / the Mini App preview tool. Wallet falls back to the browser wallet.'
}
await sdk.actions.ready() // hide the splash screen

document.getElementById('connect').onclick = async () => {
  try {
    const provider = inApp ? await sdk.wallet.getEthereumProvider() : window.ethereum
    if (!provider) return out('no wallet provider available')
    const wallet = createWalletClient({ chain: base, transport: custom(provider) })
    const [address] = await wallet.requestAddresses()
    out(`connected ${address} (chain ${await wallet.getChainId()})`)
  } catch (e) { out('wallet error: ' + (e.shortMessage || e.message)) }
}

document.getElementById('cast').onclick = async () => {
  if (!inApp) return out('composeCast only works inside a Farcaster client')
  const r = await sdk.actions.composeCast({ text: 'Built with the Blockchain Lab Farcaster Mini App starter', embeds: [location.href] })
  out(r?.cast ? `cast ${r.cast.hash}` : 'cast cancelled')
}
