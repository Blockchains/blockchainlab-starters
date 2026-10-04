#!/usr/bin/env node
// Usage: XAI_API_KEY=... node src/cli.js "What is the ETH balance of 0x... ?"
import { runAgent } from './agent.js'

const prompt = process.argv.slice(2).join(' ') || 'What is the latest block and gas price on this chain?'
const { answer, trace } = await runAgent(prompt, { log: (t, r) => console.error(`[tool] ${t} ->`, JSON.stringify(r)) })
console.log(answer)
console.error(`[agent] ${trace.length} tool calls`)
