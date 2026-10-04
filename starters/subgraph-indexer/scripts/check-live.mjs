// Live check: the configured data source really emits Transfer events on its network right now (public RPC, no key).
import { readFileSync } from 'node:fs'
const manifest = readFileSync(new URL('../subgraph.yaml', import.meta.url), 'utf8')
const address = manifest.match(/address: "(0x[0-9a-fA-F]{40})"/)[1]
const network = manifest.match(/network: (\S+)/)[1]
const RPC = process.env.RPC_URL || { base: 'https://mainnet.base.org', mainnet: 'https://ethereum-rpc.publicnode.com', optimism: 'https://mainnet.optimism.io', 'arbitrum-one': 'https://arb1.arbitrum.io/rpc' }[network]
const TOPIC = '0xddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef'
const call = async (method, params) => {
  const r = await fetch(RPC, { method: 'POST', headers: { 'content-type': 'application/json' }, body: JSON.stringify({ jsonrpc: '2.0', id: 1, method, params }) })
  const j = await r.json()
  if (j.error) throw new Error(JSON.stringify(j.error))
  return j.result
}
const head = parseInt(await call('eth_blockNumber', []), 16)
const logs = await call('eth_getLogs', [{ address, topics: [TOPIC], fromBlock: '0x' + (head - 50).toString(16), toBlock: '0x' + head.toString(16) }])
console.log(`${network} ${address}: ${logs.length} Transfer logs in the last 50 blocks (head ${head})`)
if (!logs.length) { console.error('no Transfer events - wrong address/network?'); process.exit(1) }
