import {
  Approval as ApprovalEvent,
  ApprovalForAll as ApprovalForAllEvent,
  InviteAccepted as InviteAcceptedEvent,
  InviteDeclined as InviteDeclinedEvent,
  InviteRevoked as InviteRevokedEvent,
  InviteSent as InviteSentEvent,
  OwnershipTransferred as OwnershipTransferredEvent,
  Transfer as TransferEvent
} from "../generated/FSEntityManager/FSEntityManager"
import {
  Approval,
  ApprovalForAll,
  InviteAccepted,
  InviteDeclined,
  InviteRevoked,
  InviteSent,
  OwnershipTransferred,
  Transfer
} from "../generated/schema"

export function handleApproval(event: ApprovalEvent): void {
  let entity = new Approval(
    event.transaction.hash.concatI32(event.logIndex.toI32())
  )
  entity.owner = event.params.owner
  entity.approved = event.params.approved
  entity.tokenId = event.params.tokenId

  entity.blockNumber = event.block.number
  entity.blockTimestamp = event.block.timestamp
  entity.transactionHash = event.transaction.hash

  entity.save()
}

export function handleApprovalForAll(event: ApprovalForAllEvent): void {
  let entity = new ApprovalForAll(
    event.transaction.hash.concatI32(event.logIndex.toI32())
  )
  entity.owner = event.params.owner
  entity.operator = event.params.operator
  entity.approved = event.params.approved

  entity.blockNumber = event.block.number
  entity.blockTimestamp = event.block.timestamp
  entity.transactionHash = event.transaction.hash

  entity.save()
}

export function handleInviteAccepted(event: InviteAcceptedEvent): void {
  let entity = new InviteAccepted(
    event.transaction.hash.concatI32(event.logIndex.toI32())
  )
  entity.inviteId = event.params.inviteId
  entity.acceptedBy = event.params.acceptedBy

  entity.blockNumber = event.block.number
  entity.blockTimestamp = event.block.timestamp
  entity.transactionHash = event.transaction.hash

  entity.save()
}

export function handleInviteDeclined(event: InviteDeclinedEvent): void {
  let entity = new InviteDeclined(
    event.transaction.hash.concatI32(event.logIndex.toI32())
  )
  entity.inviteId = event.params.inviteId
  entity.declinedBy = event.params.declinedBy

  entity.blockNumber = event.block.number
  entity.blockTimestamp = event.block.timestamp
  entity.transactionHash = event.transaction.hash

  entity.save()
}

export function handleInviteRevoked(event: InviteRevokedEvent): void {
  let entity = new InviteRevoked(
    event.transaction.hash.concatI32(event.logIndex.toI32())
  )
  entity.inviteId = event.params.inviteId
  entity.revokedBy = event.params.revokedBy

  entity.blockNumber = event.block.number
  entity.blockTimestamp = event.block.timestamp
  entity.transactionHash = event.transaction.hash

  entity.save()
}

export function handleInviteSent(event: InviteSentEvent): void {
  let entity = new InviteSent(
    event.transaction.hash.concatI32(event.logIndex.toI32())
  )
  entity.from = event.params.from
  entity.externalOrgOrTeamId = event.params.externalOrgOrTeamId
  entity.sourceEntityId = event.params.sourceEntityId
  entity.baseSharePerms = event.params.baseSharePerms
  entity.status = event.params.status

  entity.blockNumber = event.block.number
  entity.blockTimestamp = event.block.timestamp
  entity.transactionHash = event.transaction.hash

  entity.save()
}

export function handleOwnershipTransferred(
  event: OwnershipTransferredEvent
): void {
  let entity = new OwnershipTransferred(
    event.transaction.hash.concatI32(event.logIndex.toI32())
  )
  entity.previousOwner = event.params.previousOwner
  entity.newOwner = event.params.newOwner

  entity.blockNumber = event.block.number
  entity.blockTimestamp = event.block.timestamp
  entity.transactionHash = event.transaction.hash

  entity.save()
}

export function handleTransfer(event: TransferEvent): void {
  let entity = new Transfer(
    event.transaction.hash.concatI32(event.logIndex.toI32())
  )
  entity.from = event.params.from
  entity.to = event.params.to
  entity.tokenId = event.params.tokenId

  entity.blockNumber = event.block.number
  entity.blockTimestamp = event.block.timestamp
  entity.transactionHash = event.transaction.hash

  entity.save()
}
