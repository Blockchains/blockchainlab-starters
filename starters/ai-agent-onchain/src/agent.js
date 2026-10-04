// Minimal tool-calling loop against xAI's OpenAI-compatible Chat Completions API (no SDK needed).
import { TOOL_SPECS, makeTools, makeClients } from './tools.js'

export async function runAgent(prompt, { apiKey = process.env.XAI_API_KEY, model = process.env.XAI_MODEL || 'grok-4.7', clients = makeClients(), policy, maxSteps = 6, log = () => {} } = {}) {
  if (!apiKey) throw new Error('XAI_API_KEY not set')
  const tools = makeTools(clients, policy)
  const messages = [
    { role: 'system', content: `You are an on-chain agent on ${clients.chain.name} (chain id ${clients.chain.id}). Use the tools for every fact about chain state; never guess balances. Agent wallet: ${clients.account?.address || 'none (read-only / dry-run)'}.` },
    { role: 'user', content: prompt },
  ]
  const trace = []
  for (let step = 0; step < maxSteps; step++) {
    const r = await fetch('https://api.x.ai/v1/chat/completions', {
      method: 'POST', headers: { Authorization: `Bearer ${apiKey}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({ model, messages, tools: TOOL_SPECS, tool_choice: 'auto' }),
    })
    if (r.status === 403) throw new Error('xAI credits needed or key not permitted (HTTP 403)')
    if (!r.ok) throw new Error(`xAI HTTP ${r.status}: ${(await r.text()).slice(0, 300)}`)
    const msg = (await r.json()).choices[0].message
    messages.push(msg)
    if (!msg.tool_calls?.length) return { answer: msg.content, trace }
    for (const call of msg.tool_calls) {
      let result
      try {
        result = await tools[call.function.name](JSON.parse(call.function.arguments || '{}'))
      } catch (e) {
        result = { error: e.message }
      }
      trace.push({ tool: call.function.name, args: call.function.arguments, result })
      log(call.function.name, result)
      messages.push({ role: 'tool', tool_call_id: call.id, content: JSON.stringify(result) })
    }
  }
  return { answer: '(stopped: step limit)', trace }
}
