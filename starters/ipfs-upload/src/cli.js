#!/usr/bin/env node
// Usage: node src/cli.js <file> [--car out.car] [--pin]
import { readFileSync, writeFileSync } from 'node:fs'
import { basename } from 'node:path'
import { createStore, addBytes, toCar, pinWithPinata } from './ipfs.js'

const [file, ...rest] = process.argv.slice(2)
if (!file) { console.error('usage: ipfs-upload <file> [--car out.car] [--pin]'); process.exit(2) }
const bytes = readFileSync(file)
const store = createStore()
const cid = await addBytes(store, bytes)
console.log(JSON.stringify({ file, bytes: bytes.length, cid: cid.toString(), uri: `ipfs://${cid}` }))
const carAt = rest.indexOf('--car')
if (carAt >= 0) { writeFileSync(rest[carAt + 1], await toCar(store, cid)); console.log('car ->', rest[carAt + 1]) }
if (rest.includes('--pin')) {
  const pinned = await pinWithPinata(bytes, basename(file))
  console.log(JSON.stringify({ pinned, matches: pinned === cid.toString() }))
}
