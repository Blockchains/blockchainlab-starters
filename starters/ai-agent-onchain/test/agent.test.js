import { test } from 'node:test'
import assert from 'node:assert/strict'
import { makeClients, makeTools, checkPolicy } from '../src/tools.js'
import { runAgent } from '../src/agent.js'

const WETH = '0x4200000000000000000000000000000000000006' // predeploy on Base Sepolia (OP Stack)
const USDC = '0x036CbD53842c5426634e7929541eC2318f3dCF7e' // Circle USDC on Base Sepolia
const clients = makeClients({ privateKey: undefined })
const tools = makeTools(clients, { maxEth: 0.001, allowlist: [] })

test('policy refuses bad recipients, zero and over-cap amounts', () => {
  assert.equal(checkPolicy({ to: '0x12', amountEth: '0.0001' }).ok, false)
  assert.equal(checkPolicy({ to: WETH, amountEth: '0' }).ok, false)
  assert.match(checkPolicy({ to: WETH, amountEth: '1' }, { maxEth: 0.001, allowlist: [] }).reason, /exceeds/)
  assert.match(checkPolicy({ to: WETH, amountEth: '0.0001' }, { maxEth: 1, allowlist: [USDC] }).reason, /ALLOWLIST/)
  assert.equal(checkPolicy({ to: WETH, amountEth: '0.0001' }, { maxEth: 1, allowlist: [] }).ok, true)
})

test('live: chain status from Base Sepolia public RPC', async () => {
  const s = await tools.get_chain_status()
  assert.equal(s.chainId, 84532)
  assert.ok(BigInt(s.block) > 0n)
})

test('live: native + ERC-20 reads', async () => {
  const b = await tools.get_balance({ address: WETH })
  assert.ok(Number(b.eth) >= 0)
  const u = await tools.get_erc20_balance({ token: USDC, owner: WETH })
  assert.equal(u.symbol, 'USDC')
  assert.equal(u.decimals, 6)
})

test('send_native without a key is a policy-checked dry run', async () => {
  assert.equal((await tools.send_native({ to: WETH, amount_eth: '5' })).sent, false)
  const r = await tools.send_native({ to: WETH, amount_eth: '0.0001' })
  assert.equal(r.dryRun, true)
})

test('live: Grok answers using the tools', { skip: !process.env.XAI_API_KEY && 'XAI_API_KEY not set' }, async () => {
  const { answer, trace } = await runAgent(`What is the latest block number on this chain? Use a tool.`, { clients })
  assert.ok(trace.some((t) => t.tool === 'get_chain_status'), 'called get_chain_status')
  assert.match(answer, /\d{5,}/)
})
