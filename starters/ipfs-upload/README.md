# ipfs-upload

IPFS upload starter on the [Helia](https://github.com/Blockchains/helia) stack (`@helia/unixfs`, `@ipld/car`): content-address files
locally with the same UnixFS algorithm as Kubo (no daemon, no libp2p), build NFT metadata directories, export CAR files for any pinning
service, pin to Pinata when `PINATA_JWT` is set, and verify retrieval through public gateways.

```bash
npm ci
npm test                                    # CID parity with `ipfs add`, multi-block round trip, CAR export, directory, live gateway fetch (+ Pinata if PINATA_JWT)
node src/cli.js ./image.png                 # -> {"cid":"bafy...","uri":"ipfs://bafy..."}
node src/cli.js ./image.png --car out.car   # CAR for Storacha / Filebase / Lighthouse uploads
PINATA_JWT=... node src/cli.js ./image.png --pin   # pins and checks Pinata returns the same CID
```

API (`src/ipfs.js`, works in Node 20+ and in the browser via Vite): `createStore()`, `addBytes(store, bytes, {kubo})`, `addDirectory(store, {name: bytes})`,
`cat(store, cid)`, `toCar(store, cid)`, `fetchFromGateways(cid)`, `pinWithPinata(bytes, name)`.

Pairs with `foundry-oz-tokens` (`LabNFT` token URIs, `LabItems` base URI `ipfs://<dirCID>/` → `<id>.json`).
