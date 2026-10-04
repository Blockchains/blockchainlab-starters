// On-chain tools exposed to the model. Reads use a public RPC; writes need AGENT_PRIVATE_KEY and pass a spend policy first.
import { createPublicClient, createWalletClient, http, formatEther, formatUnits, parseEther, isAddress, erc20Abi } from 'viem'
import { privateKeyToAccount } from 'viem/accounts'
import { baseSepolia } from 'viem/chains'

export function makeClients({ chain = baseSepolia, rpc = process.env.RPC_URL, privateKey = process.env.AGENT_PRIVATE_KEY } = {}) {
  const transport = http(rpc || chain.rpcUrls.default.http[0])
  const publicClient = createPublicClient({ chain, transport })
  const account = privateKey ? privateKeyToAccount(privateKey) : null
  const walletClient = account ? createWalletClient({ chain, transport, account }) : null
  return { chain, publicClient, walletClient, account }
}

/** Spend policy: per-transfer cap and optional recipient allowlist (AGENT_MAX_ETH, AGENT_ALLOWLIST=0x..,0x..). */
export function checkPolicy({ to, amountEth }, { maxEth = Number(process.env.AGENT_MAX_ETH || '0.001'), allowlist = (process.env.AGENT_ALLOWLIST || '').split(',').filter(Boolean) } = {}) {
  if (!isAddress(to)) return { ok: false, reason: `invalid recipient ${to}` }
  const amt = Number(amountEth)
  if (!(amt > 0)) return { ok: false, reason: 'amount must be > 0' }
  if (amt > maxEth) return { ok: false, reason: `amount ${amt} exceeds per-transfer cap ${maxEth} ETH` }
  if (allowlist.length && !allowlist.map((a) => a.toLowerCase()).includes(to.toLowerCase())) return { ok: false, reason: 'recipient not in AGENT_ALLOWLIST' }
  return { ok: true }
}

export const TOOL_SPECS = [
  { type: 'function', function: { name: 'get_balance', description: 'Native balance (ETH) of an address on the agent chain', parameters: { type: 'object', properties: { address: { type: 'string' } }, required: ['address'] } } },
  { type: 'function', function: { name: 'get_erc20_balance', description: 'ERC-20 balance, symbol and decimals', parameters: { type: 'object', properties: { token: { type: 'string' }, owner: { type: 'string' } }, required: ['token', 'owner'] } } },
  { type: 'function', function: { name: 'get_chain_status', description: 'Chain id, latest block and gas price', parameters: { type: 'object', properties: {} } } },
  { type: 'function', function: { name: 'send_native', description: 'Send ETH from the agent wallet (policy-checked; dry-run if no key)', parameters: { type: 'object', properties: { to: { type: 'string' }, amount_eth: { type: 'string' } }, required: ['to', 'amount_eth'] } } },
]

export function makeTools(clients, policy) {
  const { publicClient, walletClient, account, chain } = clients
  return {
    async get_balance({ address }) {
      if (!isAddress(address)) throw new Error(`invalid address ${address}`)
      const wei = await publicClient.getBalance({ address })
      return { chain: chain.name, address, eth: formatEther(wei), wei: wei.toString() }
    },
    async get_erc20_balance({ token, owner }) {
      const [bal, decimals, symbol] = await Promise.all([
        publicClient.readContract({ address: token, abi: erc20Abi, functionName: 'balanceOf', args: [owner] }),
        publicClient.readContract({ address: token, abi: erc20Abi, functionName: 'decimals' }),
        publicClient.readContract({ address: token, abi: erc20Abi, functionName: 'symbol' }),
      ])
      return { token, owner, symbol, decimals, balance: formatUnits(bal, decimals) }
    },
    async get_chain_status() {
      const [block, gas] = await Promise.all([publicClient.getBlockNumber(), publicClient.getGasPrice()])
      return { chain: chain.name, chainId: chain.id, block: block.toString(), gasPriceGwei: formatUnits(gas, 9) }
    },
    async send_native({ to, amount_eth }) {
      const p = checkPolicy({ to, amountEth: amount_eth }, policy)
      if (!p.ok) return { sent: false, refused: p.reason }
      if (!walletClient) return { sent: false, dryRun: true, note: 'AGENT_PRIVATE_KEY not set: policy passed, transaction not sent' }
      const hash = await walletClient.sendTransaction({ to, value: parseEther(String(amount_eth)), account })
      const rcpt = await publicClient.waitForTransactionReceipt({ hash })
      return { sent: true, hash, status: rcpt.status, explorer: `${chain.blockExplorers.default.url}/tx/${hash}` }
    },
  }
}
