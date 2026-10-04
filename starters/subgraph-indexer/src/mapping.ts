import { Address, BigInt, Bytes } from '@graphprotocol/graph-ts'
import { Transfer as TransferEvent } from '../generated/Token/ERC20'
import { Account, Transfer } from '../generated/schema'

const ZERO = Address.zero()

function loadAccount(addr: Address): Account {
  let acc = Account.load(addr)
  if (acc == null) {
    acc = new Account(addr)
    acc.balance = BigInt.zero()
    acc.sentCount = 0
    acc.receivedCount = 0
  }
  return acc
}

export function handleTransfer(event: TransferEvent): void {
  const from = loadAccount(event.params.from)
  const to = loadAccount(event.params.to)
  // mints come from the zero address; its balance is not meaningful, so it is not decremented
  if (!event.params.from.equals(ZERO)) from.balance = from.balance.minus(event.params.value)
  from.sentCount = from.sentCount + 1
  to.balance = to.balance.plus(event.params.value)
  to.receivedCount = to.receivedCount + 1
  from.save()
  to.save()

  const t = new Transfer(event.transaction.hash.concatI32(event.logIndex.toI32()))
  t.from = from.id
  t.to = to.id
  t.value = event.params.value
  t.blockNumber = event.block.number
  t.timestamp = event.block.timestamp
  t.txHash = changetype<Bytes>(event.transaction.hash)
  t.save()
}
