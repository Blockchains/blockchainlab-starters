// Content-addressing + CAR export with the Helia UnixFS implementation (Blockchains/helia), no daemon and no libp2p needed.
import { unixfs } from '@helia/unixfs'
import { MemoryBlockstore } from 'blockstore-core/memory'
import { CarWriter } from '@ipld/car/writer'
import { CID } from 'multiformats/cid'

export const GATEWAYS = ['https://ipfs.io/ipfs/', 'https://dweb.link/ipfs/', 'https://gateway.pinata.cloud/ipfs/']

/** Create an in-memory UnixFS store. `kubo: true` matches `ipfs add` defaults (CIDv0, dag-pb leaves). */
export function createStore() {
  const blockstore = new MemoryBlockstore()
  return { blockstore, fs: unixfs({ blockstore }) }
}

/** Add bytes and return the CID. Defaults to CIDv1 + raw leaves (what pinning services and browsers prefer). */
export async function addBytes(store, bytes, { kubo = false } = {}) {
  const opts = kubo ? { cidVersion: 0, rawLeaves: false } : { cidVersion: 1, rawLeaves: true }
  return store.fs.addBytes(bytes, opts)
}

/** Add several named files as a directory and return the directory CID (use with ERC-721/1155 base URIs: ipfs://<cid>/1.json). */
export async function addDirectory(store, files) {
  let dir = await store.fs.addDirectory()
  for (const [name, bytes] of Object.entries(files)) {
    const cid = await addBytes(store, bytes)
    dir = await store.fs.cp(cid, dir, name)
  }
  return dir
}

/** Read the full content of a CID back from the local store. */
export async function cat(store, cid) {
  const chunks = []
  for await (const c of store.fs.cat(typeof cid === 'string' ? CID.parse(cid) : cid)) chunks.push(c)
  return Buffer.concat(chunks)
}

/** Export the DAG rooted at `cid` as a CAR file (upload it to Storacha, Pinata, Filebase or Lighthouse). */
export async function toCar(store, cid) {
  const { writer, out } = CarWriter.create([cid])
  const parts = []
  const collect = (async () => { for await (const p of out) parts.push(p) })()
  const seen = new Set()
  const walk = async (c) => {
    const key = c.toString()
    if (seen.has(key)) return
    seen.add(key)
    let bytes = await store.blockstore.get(c)
    if (!(bytes instanceof Uint8Array)) {
      // blockstore-core >= 7 streams blocks as (async) iterables of chunks
      const chunks = []
      for await (const x of bytes) chunks.push(x)
      bytes = Buffer.concat(chunks)
    }
    await writer.put({ cid: c, bytes })
    if (c.code === 0x70) {
      const { decode } = await import('@ipld/dag-pb')
      for (const link of decode(bytes).Links) await walk(link.Hash)
    }
  }
  await walk(cid)
  await writer.close()
  await collect
  return Buffer.concat(parts)
}

/** Fetch a CID from public gateways, returning the first successful body. */
export async function fetchFromGateways(cid, { gateways = GATEWAYS, timeoutMs = 20000 } = {}) {
  const errors = []
  for (const g of gateways) {
    try {
      const r = await fetch(g + cid, { signal: AbortSignal.timeout(timeoutMs) })
      if (r.ok) return { gateway: g, bytes: Buffer.from(await r.arrayBuffer()) }
      errors.push(`${g}: HTTP ${r.status}`)
    } catch (e) {
      errors.push(`${g}: ${e.message}`)
    }
  }
  throw new Error('all gateways failed: ' + errors.join('; '))
}

/** Pin a file with Pinata (needs PINATA_JWT). Returns Pinata's CID, which must equal the locally computed CIDv1. */
export async function pinWithPinata(bytes, name, jwt = process.env.PINATA_JWT) {
  if (!jwt) throw new Error('PINATA_JWT not set')
  const form = new FormData()
  form.append('network', 'public')
  form.append('file', new Blob([bytes]), name)
  const r = await fetch('https://uploads.pinata.cloud/v3/files', { method: 'POST', headers: { Authorization: `Bearer ${jwt}` }, body: form })
  if (!r.ok) throw new Error(`Pinata HTTP ${r.status}: ${await r.text()}`)
  return (await r.json()).data.cid
}
