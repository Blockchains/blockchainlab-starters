import { test } from 'node:test'
import assert from 'node:assert/strict'
import { CarReader } from '@ipld/car/reader'
import { createStore, addBytes, addDirectory, cat, toCar, fetchFromGateways, pinWithPinata } from '../src/ipfs.js'

const HELLO = Buffer.from('hello world\n')

test('Kubo-compatible CID for "hello world\\n" (same as `ipfs add`)', async () => {
  const cid = await addBytes(createStore(), HELLO, { kubo: true })
  assert.equal(cid.toString(), 'QmT78zSuBmuS4z925WZfrqQ1qHaJ56DQaTfyMUF7F8ff5o')
})

test('CIDv1 raw-leaf add, cat round-trip and CAR export', async () => {
  const store = createStore()
  const data = Buffer.alloc(3 * 1024 * 1024, 7) // multi-chunk file
  const cid = await addBytes(store, data)
  assert.match(cid.toString(), /^bafy/)
  assert.deepEqual(await cat(store, cid), data)
  const car = await toCar(store, cid)
  const reader = await CarReader.fromBytes(car)
  assert.equal((await reader.getRoots())[0].toString(), cid.toString())
  let blocks = 0
  for await (const _ of reader.blocks()) blocks++
  assert.ok(blocks > 1, 'multi-block DAG exported')
})

test('directory of NFT metadata gives ipfs://<cid>/<id>.json URIs', async () => {
  const store = createStore()
  const dir = await addDirectory(store, { '1.json': Buffer.from('{"name":"#1"}'), '2.json': Buffer.from('{"name":"#2"}') })
  const entries = []
  for await (const e of store.fs.ls(dir)) entries.push(e.name)
  assert.deepEqual(entries.sort(), ['1.json', '2.json'])
})

test('live: public gateway serves the same bytes for the computed CID', async () => {
  const cid = await addBytes(createStore(), HELLO, { kubo: true })
  const { gateway, bytes } = await fetchFromGateways(cid.toString())
  assert.equal(bytes.toString(), HELLO.toString(), `from ${gateway}`)
})

test('live: Pinata pin returns the locally computed CID', { skip: !process.env.PINATA_JWT && 'PINATA_JWT not set' }, async () => {
  const bytes = Buffer.from(`blockchainlab ipfs-upload ${new Date().toISOString()}\n`)
  const local = await addBytes(createStore(), bytes)
  assert.equal(await pinWithPinata(bytes, 'starter-test.txt'), local.toString())
})
