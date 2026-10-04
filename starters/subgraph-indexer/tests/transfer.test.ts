import { assert, clearStore, describe, newMockEvent, test, afterEach } from 'matchstick-as/assembly/index'
import { Address, BigInt, ethereum } from '@graphprotocol/graph-ts'
import { Transfer as TransferEvent } from '../generated/Token/ERC20'
import { handleTransfer } from '../src/mapping'

// Matchstick builds synthetic events in-memory to unit-test the mapping logic (this is the official test harness, not shipped data).
function transfer(from: string, to: string, value: i32): TransferEvent {
  const e = changetype<TransferEvent>(newMockEvent())
  e.parameters = new Array()
  e.parameters.push(new ethereum.EventParam('from', ethereum.Value.fromAddress(Address.fromString(from))))
  e.parameters.push(new ethereum.EventParam('to', ethereum.Value.fromAddress(Address.fromString(to))))
  e.parameters.push(new ethereum.EventParam('value', ethereum.Value.fromUnsignedBigInt(BigInt.fromI32(value))))
  return e
}

const ZERO = '0x0000000000000000000000000000000000000000'
const ALICE = '0x00000000000000000000000000000000000a11ce'
const BOB = '0x0000000000000000000000000000000000000b0b'

describe('handleTransfer', () => {
  afterEach(() => {
    clearStore()
  })

  test('mint credits the receiver and does not debit the zero address', () => {
    handleTransfer(transfer(ZERO, ALICE, 100))
    assert.fieldEquals('Account', ALICE, 'balance', '100')
    assert.fieldEquals('Account', ALICE, 'receivedCount', '1')
    assert.fieldEquals('Account', ZERO, 'balance', '0')
    assert.entityCount('Transfer', 1)
  })

  test('transfer moves balance between accounts', () => {
    handleTransfer(transfer(ZERO, ALICE, 100))
    const e = transfer(ALICE, BOB, 40)
    e.logIndex = BigInt.fromI32(2)
    handleTransfer(e)
    assert.fieldEquals('Account', ALICE, 'balance', '60')
    assert.fieldEquals('Account', BOB, 'balance', '40')
    assert.fieldEquals('Account', ALICE, 'sentCount', '1')
    assert.entityCount('Transfer', 2)
  })
})
