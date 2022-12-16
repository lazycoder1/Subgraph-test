import {
  Deposited as DepositedEvent,
  StakeLocked as StakeLockedEvent,
  StakeUnlocked as StakeUnlockedEvent,
  StakeWithdrawn as StakeWithdrawnEvent,
  UserOperationEvent as UserOperationEventEvent,
  UserOperationRevertReason as UserOperationRevertReasonEvent,
  Withdrawn as WithdrawnEvent
} from "../generated/BEntryPoint/BEntryPoint"
import {
  UserOp,
  Transfer,
  Staking
} from "../generated/schema"

export function handleBEntryPointDeposited(
  event: DepositedEvent
): void {
  let transfer = Transfer.load(event.transaction.hash.toHex())
  if (transfer == null) {
    transfer = new Transfer(event.transaction.hash.toHex())
  }

  transfer
  transfer.txHash = event.transaction.hash
  transfer.type = "Deposited"
  transfer.value = event.params.totalDeposit
  transfer.to = event.transaction.to
  transfer.from = event.params.account
  transfer.save()
}

export function handleBEntryPointStakeLocked(
  event: StakeLockedEvent
): void {
  let stake = Staking.load(event.transaction.hash.toHex())
  if (stake == null) {
    stake = new Staking(event.transaction.hash.toHex())
  }

  stake.type = "LOCKED"
  stake.requestFrom = event.params.account
  stake.value = event.params.totalStaked
}

export function handleBEntryPointStakeUnlocked(
  event: StakeUnlockedEvent
): void {
  let stake = Staking.load(event.transaction.hash.toHex())
  if (stake == null) {
    stake = new Staking(event.transaction.hash.toHex())
  }

  stake.type = "UNLOCKED"
  stake.requestFrom = event.params.account
}

export function handleBEntryPointStakeWithdrawn(
  event: StakeWithdrawnEvent
): void {
  let stake = Staking.load(event.transaction.hash.toHex())
  if (stake == null) {
    stake = new Staking(event.transaction.hash.toHex())
  }

  stake.type = "WITHDRAW"
  stake.requestFrom = event.params.account
  stake.value = event.params.amount
  stake.to = event.params.withdrawAddress
}

export function handleBEntryPointUserOperationEvent(
  event: UserOperationEventEvent
): void {
  let userOp = UserOp.load(event.params.requestId.toHex())
  if (userOp == null) {
    userOp = new UserOp(event.params.requestId.toHex())
  }

  userOp.userOpHash = event.params.requestId
  userOp.transactionHash = event.transaction.hash
  userOp.input = event.transaction.input
  userOp.sender = event.params.sender
  userOp.paymaster = event.params.paymaster
  userOp.nonce = event.params.nonce
  userOp.actualGasCost = event.params.actualGasCost
  userOp.actualGasPrice = event.params.actualGasPrice
  userOp.success = event.params.success
  userOp.blockTime = event.block.timestamp
  userOp.blockNumber = event.block.number
  userOp.network = "mumbai"
  // let transactionReceipt = event.receipt
  // if(transactionReceipt) {
  //   userOp.logLen = BigInt.fromI32(transactionReceipt.logs.length)
  // }
  userOp.save()
}

export function handleBEntryPointUserOperationRevertReason(
  event: UserOperationRevertReasonEvent
): void {
  let userOp = UserOp.load(event.params.requestId.toHex())
  if (userOp == null) {
    userOp = new UserOp(event.params.requestId.toHex())
  }

  userOp.userOpHash = event.params.requestId
  userOp.transactionHash = event.transaction.hash
  userOp.input = event.transaction.input
  userOp.sender = event.params.sender
  userOp.revertReason = event.params.revertReason
  userOp.success = false
  userOp.network = "mumbai"
  userOp.save()
}

export function handleBEntryPointWithdrawn(
  event: WithdrawnEvent
): void {
  let transfer = Transfer.load(event.transaction.hash.toHex())
  if (transfer == null) {
    transfer = new Transfer(event.transaction.hash.toHex())
  }

  transfer.txHash = event.transaction.hash
  transfer.type = "Withdraw"
  transfer.value = event.params.amount
  transfer.to = event.params.withdrawAddress
  transfer.from = event.transaction.from
  transfer.save()
}
