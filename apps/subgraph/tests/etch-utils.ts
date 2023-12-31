import { Address, BigInt, ethereum } from '@graphprotocol/graph-ts';
import { newMockEvent } from 'matchstick-as';
import {
  Approval,
  ApprovalForAll,
  CommentAdded,
  EtchCreated,
  EtchTransferedToTeam,
  InvididualPermissionsUpdated,
  OwnershipTransferred,
  Transfer,
} from '../generated/Etch/Etch';

export function createApprovalEvent(owner: Address, approved: Address, tokenId: BigInt): Approval {
  let approvalEvent = changetype<Approval>(newMockEvent());

  approvalEvent.parameters = new Array();

  approvalEvent.parameters.push(new ethereum.EventParam('owner', ethereum.Value.fromAddress(owner)));
  approvalEvent.parameters.push(new ethereum.EventParam('approved', ethereum.Value.fromAddress(approved)));
  approvalEvent.parameters.push(new ethereum.EventParam('tokenId', ethereum.Value.fromUnsignedBigInt(tokenId)));

  return approvalEvent;
}

export function createApprovalForAllEvent(owner: Address, operator: Address, approved: boolean): ApprovalForAll {
  let approvalForAllEvent = changetype<ApprovalForAll>(newMockEvent());

  approvalForAllEvent.parameters = new Array();

  approvalForAllEvent.parameters.push(new ethereum.EventParam('owner', ethereum.Value.fromAddress(owner)));
  approvalForAllEvent.parameters.push(new ethereum.EventParam('operator', ethereum.Value.fromAddress(operator)));
  approvalForAllEvent.parameters.push(new ethereum.EventParam('approved', ethereum.Value.fromBoolean(approved)));

  return approvalForAllEvent;
}

export function createCommentAddedEvent(tokenId: BigInt, commentId: BigInt, comment: ethereum.Tuple): CommentAdded {
  let commentAddedEvent = changetype<CommentAdded>(newMockEvent());

  commentAddedEvent.parameters = new Array();

  commentAddedEvent.parameters.push(new ethereum.EventParam('tokenId', ethereum.Value.fromUnsignedBigInt(tokenId)));
  commentAddedEvent.parameters.push(new ethereum.EventParam('commentId', ethereum.Value.fromUnsignedBigInt(commentId)));
  commentAddedEvent.parameters.push(new ethereum.EventParam('comment', ethereum.Value.fromTuple(comment)));

  return commentAddedEvent;
}

export function createEtchCreatedEvent(tokenId: BigInt, to: Address): EtchCreated {
  let etchCreatedEvent = changetype<EtchCreated>(newMockEvent());

  etchCreatedEvent.parameters = new Array();

  etchCreatedEvent.parameters.push(new ethereum.EventParam('tokenId', ethereum.Value.fromUnsignedBigInt(tokenId)));
  etchCreatedEvent.parameters.push(new ethereum.EventParam('to', ethereum.Value.fromAddress(to)));

  return etchCreatedEvent;
}

export function createEtchTransferedToTeamEvent(tokenId: BigInt, from: Address, to: BigInt): EtchTransferedToTeam {
  let etchTransferedToTeamEvent = changetype<EtchTransferedToTeam>(newMockEvent());

  etchTransferedToTeamEvent.parameters = new Array();

  etchTransferedToTeamEvent.parameters.push(new ethereum.EventParam('tokenId', ethereum.Value.fromUnsignedBigInt(tokenId)));
  etchTransferedToTeamEvent.parameters.push(new ethereum.EventParam('from', ethereum.Value.fromAddress(from)));
  etchTransferedToTeamEvent.parameters.push(new ethereum.EventParam('to', ethereum.Value.fromUnsignedBigInt(to)));

  return etchTransferedToTeamEvent;
}

export function createInvididualPermissionsUpdatedEvent(tokenId: BigInt, account: Address, newPermission: i32): InvididualPermissionsUpdated {
  let invididualPermissionsUpdatedEvent = changetype<InvididualPermissionsUpdated>(newMockEvent());

  invididualPermissionsUpdatedEvent.parameters = new Array();

  invididualPermissionsUpdatedEvent.parameters.push(new ethereum.EventParam('tokenId', ethereum.Value.fromUnsignedBigInt(tokenId)));
  invididualPermissionsUpdatedEvent.parameters.push(new ethereum.EventParam('account', ethereum.Value.fromAddress(account)));
  invididualPermissionsUpdatedEvent.parameters.push(
    new ethereum.EventParam('newPermission', ethereum.Value.fromUnsignedBigInt(BigInt.fromI32(newPermission)))
  );

  return invididualPermissionsUpdatedEvent;
}

export function createOwnershipTransferredEvent(previousOwner: Address, newOwner: Address): OwnershipTransferred {
  let ownershipTransferredEvent = changetype<OwnershipTransferred>(newMockEvent());

  ownershipTransferredEvent.parameters = new Array();

  ownershipTransferredEvent.parameters.push(new ethereum.EventParam('previousOwner', ethereum.Value.fromAddress(previousOwner)));
  ownershipTransferredEvent.parameters.push(new ethereum.EventParam('newOwner', ethereum.Value.fromAddress(newOwner)));

  return ownershipTransferredEvent;
}

export function createTransferEvent(from: Address, to: Address, tokenId: BigInt): Transfer {
  let transferEvent = changetype<Transfer>(newMockEvent());

  transferEvent.parameters = new Array();

  transferEvent.parameters.push(new ethereum.EventParam('from', ethereum.Value.fromAddress(from)));
  transferEvent.parameters.push(new ethereum.EventParam('to', ethereum.Value.fromAddress(to)));
  transferEvent.parameters.push(new ethereum.EventParam('tokenId', ethereum.Value.fromUnsignedBigInt(tokenId)));

  return transferEvent;
}
