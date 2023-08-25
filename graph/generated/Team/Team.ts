// THIS IS AN AUTOGENERATED FILE. DO NOT EDIT THIS FILE DIRECTLY.

import {
  ethereum,
  JSONValue,
  TypedMap,
  Entity,
  Bytes,
  Address,
  BigInt
} from "@graphprotocol/graph-ts";

export class Approval extends ethereum.Event {
  get params(): Approval__Params {
    return new Approval__Params(this);
  }
}

export class Approval__Params {
  _event: Approval;

  constructor(event: Approval) {
    this._event = event;
  }

  get owner(): Address {
    return this._event.parameters[0].value.toAddress();
  }

  get approved(): Address {
    return this._event.parameters[1].value.toAddress();
  }

  get tokenId(): BigInt {
    return this._event.parameters[2].value.toBigInt();
  }
}

export class ApprovalForAll extends ethereum.Event {
  get params(): ApprovalForAll__Params {
    return new ApprovalForAll__Params(this);
  }
}

export class ApprovalForAll__Params {
  _event: ApprovalForAll;

  constructor(event: ApprovalForAll) {
    this._event = event;
  }

  get owner(): Address {
    return this._event.parameters[0].value.toAddress();
  }

  get operator(): Address {
    return this._event.parameters[1].value.toAddress();
  }

  get approved(): boolean {
    return this._event.parameters[2].value.toBoolean();
  }
}

export class OwnershipTransferred extends ethereum.Event {
  get params(): OwnershipTransferred__Params {
    return new OwnershipTransferred__Params(this);
  }
}

export class OwnershipTransferred__Params {
  _event: OwnershipTransferred;

  constructor(event: OwnershipTransferred) {
    this._event = event;
  }

  get previousOwner(): Address {
    return this._event.parameters[0].value.toAddress();
  }

  get newOwner(): Address {
    return this._event.parameters[1].value.toAddress();
  }
}

export class Transfer extends ethereum.Event {
  get params(): Transfer__Params {
    return new Transfer__Params(this);
  }
}

export class Transfer__Params {
  _event: Transfer;

  constructor(event: Transfer) {
    this._event = event;
  }

  get from(): Address {
    return this._event.parameters[0].value.toAddress();
  }

  get to(): Address {
    return this._event.parameters[1].value.toAddress();
  }

  get tokenId(): BigInt {
    return this._event.parameters[2].value.toBigInt();
  }
}

export class Team extends ethereum.SmartContract {
  static bind(address: Address): Team {
    return new Team("Team", address);
  }

  _nodes(node: Address): boolean {
    let result = super.call("_nodes", "_nodes(address):(bool)", [
      ethereum.Value.fromAddress(node)
    ]);

    return result[0].toBoolean();
  }

  try__nodes(node: Address): ethereum.CallResult<boolean> {
    let result = super.tryCall("_nodes", "_nodes(address):(bool)", [
      ethereum.Value.fromAddress(node)
    ]);
    if (result.reverted) {
      return new ethereum.CallResult();
    }
    let value = result.value;
    return ethereum.CallResult.fromValue(value[0].toBoolean());
  }

  balanceOf(owner: Address): BigInt {
    let result = super.call("balanceOf", "balanceOf(address):(uint256)", [
      ethereum.Value.fromAddress(owner)
    ]);

    return result[0].toBigInt();
  }

  try_balanceOf(owner: Address): ethereum.CallResult<BigInt> {
    let result = super.tryCall("balanceOf", "balanceOf(address):(uint256)", [
      ethereum.Value.fromAddress(owner)
    ]);
    if (result.reverted) {
      return new ethereum.CallResult();
    }
    let value = result.value;
    return ethereum.CallResult.fromValue(value[0].toBigInt());
  }

  createTeam(to: Address): BigInt {
    let result = super.call("createTeam", "createTeam(address):(uint256)", [
      ethereum.Value.fromAddress(to)
    ]);

    return result[0].toBigInt();
  }

  try_createTeam(to: Address): ethereum.CallResult<BigInt> {
    let result = super.tryCall("createTeam", "createTeam(address):(uint256)", [
      ethereum.Value.fromAddress(to)
    ]);
    if (result.reverted) {
      return new ethereum.CallResult();
    }
    let value = result.value;
    return ethereum.CallResult.fromValue(value[0].toBigInt());
  }

  getApproved(tokenId: BigInt): Address {
    let result = super.call("getApproved", "getApproved(uint256):(address)", [
      ethereum.Value.fromUnsignedBigInt(tokenId)
    ]);

    return result[0].toAddress();
  }

  try_getApproved(tokenId: BigInt): ethereum.CallResult<Address> {
    let result = super.tryCall(
      "getApproved",
      "getApproved(uint256):(address)",
      [ethereum.Value.fromUnsignedBigInt(tokenId)]
    );
    if (result.reverted) {
      return new ethereum.CallResult();
    }
    let value = result.value;
    return ethereum.CallResult.fromValue(value[0].toAddress());
  }

  getNumberOfTeamsCreated(): BigInt {
    let result = super.call(
      "getNumberOfTeamsCreated",
      "getNumberOfTeamsCreated():(uint256)",
      []
    );

    return result[0].toBigInt();
  }

  try_getNumberOfTeamsCreated(): ethereum.CallResult<BigInt> {
    let result = super.tryCall(
      "getNumberOfTeamsCreated",
      "getNumberOfTeamsCreated():(uint256)",
      []
    );
    if (result.reverted) {
      return new ethereum.CallResult();
    }
    let value = result.value;
    return ethereum.CallResult.fromValue(value[0].toBigInt());
  }

  getParent(): Address {
    let result = super.call("getParent", "getParent():(address)", []);

    return result[0].toAddress();
  }

  try_getParent(): ethereum.CallResult<Address> {
    let result = super.tryCall("getParent", "getParent():(address)", []);
    if (result.reverted) {
      return new ethereum.CallResult();
    }
    let value = result.value;
    return ethereum.CallResult.fromValue(value[0].toAddress());
  }

  hasPermission(teamId: BigInt, user: Address, permission: i32): boolean {
    let result = super.call(
      "hasPermission",
      "hasPermission(uint256,address,uint8):(bool)",
      [
        ethereum.Value.fromUnsignedBigInt(teamId),
        ethereum.Value.fromAddress(user),
        ethereum.Value.fromUnsignedBigInt(BigInt.fromI32(permission))
      ]
    );

    return result[0].toBoolean();
  }

  try_hasPermission(
    teamId: BigInt,
    user: Address,
    permission: i32
  ): ethereum.CallResult<boolean> {
    let result = super.tryCall(
      "hasPermission",
      "hasPermission(uint256,address,uint8):(bool)",
      [
        ethereum.Value.fromUnsignedBigInt(teamId),
        ethereum.Value.fromAddress(user),
        ethereum.Value.fromUnsignedBigInt(BigInt.fromI32(permission))
      ]
    );
    if (result.reverted) {
      return new ethereum.CallResult();
    }
    let value = result.value;
    return ethereum.CallResult.fromValue(value[0].toBoolean());
  }

  isApprovedForAll(owner: Address, operator: Address): boolean {
    let result = super.call(
      "isApprovedForAll",
      "isApprovedForAll(address,address):(bool)",
      [ethereum.Value.fromAddress(owner), ethereum.Value.fromAddress(operator)]
    );

    return result[0].toBoolean();
  }

  try_isApprovedForAll(
    owner: Address,
    operator: Address
  ): ethereum.CallResult<boolean> {
    let result = super.tryCall(
      "isApprovedForAll",
      "isApprovedForAll(address,address):(bool)",
      [ethereum.Value.fromAddress(owner), ethereum.Value.fromAddress(operator)]
    );
    if (result.reverted) {
      return new ethereum.CallResult();
    }
    let value = result.value;
    return ethereum.CallResult.fromValue(value[0].toBoolean());
  }

  isNode(node: Address): boolean {
    let result = super.call("isNode", "isNode(address):(bool)", [
      ethereum.Value.fromAddress(node)
    ]);

    return result[0].toBoolean();
  }

  try_isNode(node: Address): ethereum.CallResult<boolean> {
    let result = super.tryCall("isNode", "isNode(address):(bool)", [
      ethereum.Value.fromAddress(node)
    ]);
    if (result.reverted) {
      return new ethereum.CallResult();
    }
    let value = result.value;
    return ethereum.CallResult.fromValue(value[0].toBoolean());
  }

  name(): string {
    let result = super.call("name", "name():(string)", []);

    return result[0].toString();
  }

  try_name(): ethereum.CallResult<string> {
    let result = super.tryCall("name", "name():(string)", []);
    if (result.reverted) {
      return new ethereum.CallResult();
    }
    let value = result.value;
    return ethereum.CallResult.fromValue(value[0].toString());
  }

  onERC721Received(
    param0: Address,
    param1: Address,
    param2: BigInt,
    param3: Bytes
  ): Bytes {
    let result = super.call(
      "onERC721Received",
      "onERC721Received(address,address,uint256,bytes):(bytes4)",
      [
        ethereum.Value.fromAddress(param0),
        ethereum.Value.fromAddress(param1),
        ethereum.Value.fromUnsignedBigInt(param2),
        ethereum.Value.fromBytes(param3)
      ]
    );

    return result[0].toBytes();
  }

  try_onERC721Received(
    param0: Address,
    param1: Address,
    param2: BigInt,
    param3: Bytes
  ): ethereum.CallResult<Bytes> {
    let result = super.tryCall(
      "onERC721Received",
      "onERC721Received(address,address,uint256,bytes):(bytes4)",
      [
        ethereum.Value.fromAddress(param0),
        ethereum.Value.fromAddress(param1),
        ethereum.Value.fromUnsignedBigInt(param2),
        ethereum.Value.fromBytes(param3)
      ]
    );
    if (result.reverted) {
      return new ethereum.CallResult();
    }
    let value = result.value;
    return ethereum.CallResult.fromValue(value[0].toBytes());
  }

  organisationOf(team: BigInt): BigInt {
    let result = super.call(
      "organisationOf",
      "organisationOf(uint256):(uint256)",
      [ethereum.Value.fromUnsignedBigInt(team)]
    );

    return result[0].toBigInt();
  }

  try_organisationOf(team: BigInt): ethereum.CallResult<BigInt> {
    let result = super.tryCall(
      "organisationOf",
      "organisationOf(uint256):(uint256)",
      [ethereum.Value.fromUnsignedBigInt(team)]
    );
    if (result.reverted) {
      return new ethereum.CallResult();
    }
    let value = result.value;
    return ethereum.CallResult.fromValue(value[0].toBigInt());
  }

  organisations(): Address {
    let result = super.call("organisations", "organisations():(address)", []);

    return result[0].toAddress();
  }

  try_organisations(): ethereum.CallResult<Address> {
    let result = super.tryCall(
      "organisations",
      "organisations():(address)",
      []
    );
    if (result.reverted) {
      return new ethereum.CallResult();
    }
    let value = result.value;
    return ethereum.CallResult.fromValue(value[0].toAddress());
  }

  owner(): Address {
    let result = super.call("owner", "owner():(address)", []);

    return result[0].toAddress();
  }

  try_owner(): ethereum.CallResult<Address> {
    let result = super.tryCall("owner", "owner():(address)", []);
    if (result.reverted) {
      return new ethereum.CallResult();
    }
    let value = result.value;
    return ethereum.CallResult.fromValue(value[0].toAddress());
  }

  ownerOf(tokenId: BigInt): Address {
    let result = super.call("ownerOf", "ownerOf(uint256):(address)", [
      ethereum.Value.fromUnsignedBigInt(tokenId)
    ]);

    return result[0].toAddress();
  }

  try_ownerOf(tokenId: BigInt): ethereum.CallResult<Address> {
    let result = super.tryCall("ownerOf", "ownerOf(uint256):(address)", [
      ethereum.Value.fromUnsignedBigInt(tokenId)
    ]);
    if (result.reverted) {
      return new ethereum.CallResult();
    }
    let value = result.value;
    return ethereum.CallResult.fromValue(value[0].toAddress());
  }

  permissionsOfTeam(team: BigInt, user: Address): i32 {
    let result = super.call(
      "permissionsOfTeam",
      "permissionsOfTeam(uint256,address):(uint8)",
      [
        ethereum.Value.fromUnsignedBigInt(team),
        ethereum.Value.fromAddress(user)
      ]
    );

    return result[0].toI32();
  }

  try_permissionsOfTeam(team: BigInt, user: Address): ethereum.CallResult<i32> {
    let result = super.tryCall(
      "permissionsOfTeam",
      "permissionsOfTeam(uint256,address):(uint8)",
      [
        ethereum.Value.fromUnsignedBigInt(team),
        ethereum.Value.fromAddress(user)
      ]
    );
    if (result.reverted) {
      return new ethereum.CallResult();
    }
    let value = result.value;
    return ethereum.CallResult.fromValue(value[0].toI32());
  }

  supportsInterface(interfaceId: Bytes): boolean {
    let result = super.call(
      "supportsInterface",
      "supportsInterface(bytes4):(bool)",
      [ethereum.Value.fromFixedBytes(interfaceId)]
    );

    return result[0].toBoolean();
  }

  try_supportsInterface(interfaceId: Bytes): ethereum.CallResult<boolean> {
    let result = super.tryCall(
      "supportsInterface",
      "supportsInterface(bytes4):(bool)",
      [ethereum.Value.fromFixedBytes(interfaceId)]
    );
    if (result.reverted) {
      return new ethereum.CallResult();
    }
    let value = result.value;
    return ethereum.CallResult.fromValue(value[0].toBoolean());
  }

  symbol(): string {
    let result = super.call("symbol", "symbol():(string)", []);

    return result[0].toString();
  }

  try_symbol(): ethereum.CallResult<string> {
    let result = super.tryCall("symbol", "symbol():(string)", []);
    if (result.reverted) {
      return new ethereum.CallResult();
    }
    let value = result.value;
    return ethereum.CallResult.fromValue(value[0].toString());
  }

  tokenURI(tokenId: BigInt): string {
    let result = super.call("tokenURI", "tokenURI(uint256):(string)", [
      ethereum.Value.fromUnsignedBigInt(tokenId)
    ]);

    return result[0].toString();
  }

  try_tokenURI(tokenId: BigInt): ethereum.CallResult<string> {
    let result = super.tryCall("tokenURI", "tokenURI(uint256):(string)", [
      ethereum.Value.fromUnsignedBigInt(tokenId)
    ]);
    if (result.reverted) {
      return new ethereum.CallResult();
    }
    let value = result.value;
    return ethereum.CallResult.fromValue(value[0].toString());
  }
}

export class ConstructorCall extends ethereum.Call {
  get inputs(): ConstructorCall__Inputs {
    return new ConstructorCall__Inputs(this);
  }

  get outputs(): ConstructorCall__Outputs {
    return new ConstructorCall__Outputs(this);
  }
}

export class ConstructorCall__Inputs {
  _call: ConstructorCall;

  constructor(call: ConstructorCall) {
    this._call = call;
  }

  get organisationsContract(): Address {
    return this._call.inputValues[0].value.toAddress();
  }
}

export class ConstructorCall__Outputs {
  _call: ConstructorCall;

  constructor(call: ConstructorCall) {
    this._call = call;
  }
}

export class AddNodeCall extends ethereum.Call {
  get inputs(): AddNodeCall__Inputs {
    return new AddNodeCall__Inputs(this);
  }

  get outputs(): AddNodeCall__Outputs {
    return new AddNodeCall__Outputs(this);
  }
}

export class AddNodeCall__Inputs {
  _call: AddNodeCall;

  constructor(call: AddNodeCall) {
    this._call = call;
  }

  get node(): Address {
    return this._call.inputValues[0].value.toAddress();
  }
}

export class AddNodeCall__Outputs {
  _call: AddNodeCall;

  constructor(call: AddNodeCall) {
    this._call = call;
  }
}

export class ApproveCall extends ethereum.Call {
  get inputs(): ApproveCall__Inputs {
    return new ApproveCall__Inputs(this);
  }

  get outputs(): ApproveCall__Outputs {
    return new ApproveCall__Outputs(this);
  }
}

export class ApproveCall__Inputs {
  _call: ApproveCall;

  constructor(call: ApproveCall) {
    this._call = call;
  }

  get to(): Address {
    return this._call.inputValues[0].value.toAddress();
  }

  get tokenId(): BigInt {
    return this._call.inputValues[1].value.toBigInt();
  }
}

export class ApproveCall__Outputs {
  _call: ApproveCall;

  constructor(call: ApproveCall) {
    this._call = call;
  }
}

export class CreateTeamCall extends ethereum.Call {
  get inputs(): CreateTeamCall__Inputs {
    return new CreateTeamCall__Inputs(this);
  }

  get outputs(): CreateTeamCall__Outputs {
    return new CreateTeamCall__Outputs(this);
  }
}

export class CreateTeamCall__Inputs {
  _call: CreateTeamCall;

  constructor(call: CreateTeamCall) {
    this._call = call;
  }

  get to(): Address {
    return this._call.inputValues[0].value.toAddress();
  }
}

export class CreateTeamCall__Outputs {
  _call: CreateTeamCall;

  constructor(call: CreateTeamCall) {
    this._call = call;
  }

  get newTeamId(): BigInt {
    return this._call.outputValues[0].value.toBigInt();
  }
}

export class DelegateCallsToSelfCall extends ethereum.Call {
  get inputs(): DelegateCallsToSelfCall__Inputs {
    return new DelegateCallsToSelfCall__Inputs(this);
  }

  get outputs(): DelegateCallsToSelfCall__Outputs {
    return new DelegateCallsToSelfCall__Outputs(this);
  }
}

export class DelegateCallsToSelfCall__Inputs {
  _call: DelegateCallsToSelfCall;

  constructor(call: DelegateCallsToSelfCall) {
    this._call = call;
  }

  get signature(): DelegateCallsToSelfCallSignatureStruct {
    return changetype<DelegateCallsToSelfCallSignatureStruct>(
      this._call.inputValues[0].value.toTuple()
    );
  }

  get _calldata(): Array<Bytes> {
    return this._call.inputValues[1].value.toBytesArray();
  }
}

export class DelegateCallsToSelfCall__Outputs {
  _call: DelegateCallsToSelfCall;

  constructor(call: DelegateCallsToSelfCall) {
    this._call = call;
  }
}

export class DelegateCallsToSelfCallSignatureStruct extends ethereum.Tuple {
  get encodedMessage(): Bytes {
    return this[0].toBytes();
  }

  get messageHash(): Bytes {
    return this[1].toBytes();
  }

  get signature(): Bytes {
    return this[2].toBytes();
  }

  get signer(): Address {
    return this[3].toAddress();
  }
}

export class OnERC721ReceivedCall extends ethereum.Call {
  get inputs(): OnERC721ReceivedCall__Inputs {
    return new OnERC721ReceivedCall__Inputs(this);
  }

  get outputs(): OnERC721ReceivedCall__Outputs {
    return new OnERC721ReceivedCall__Outputs(this);
  }
}

export class OnERC721ReceivedCall__Inputs {
  _call: OnERC721ReceivedCall;

  constructor(call: OnERC721ReceivedCall) {
    this._call = call;
  }

  get value0(): Address {
    return this._call.inputValues[0].value.toAddress();
  }

  get value1(): Address {
    return this._call.inputValues[1].value.toAddress();
  }

  get value2(): BigInt {
    return this._call.inputValues[2].value.toBigInt();
  }

  get value3(): Bytes {
    return this._call.inputValues[3].value.toBytes();
  }
}

export class OnERC721ReceivedCall__Outputs {
  _call: OnERC721ReceivedCall;

  constructor(call: OnERC721ReceivedCall) {
    this._call = call;
  }

  get value0(): Bytes {
    return this._call.outputValues[0].value.toBytes();
  }
}

export class RenounceOwnershipCall extends ethereum.Call {
  get inputs(): RenounceOwnershipCall__Inputs {
    return new RenounceOwnershipCall__Inputs(this);
  }

  get outputs(): RenounceOwnershipCall__Outputs {
    return new RenounceOwnershipCall__Outputs(this);
  }
}

export class RenounceOwnershipCall__Inputs {
  _call: RenounceOwnershipCall;

  constructor(call: RenounceOwnershipCall) {
    this._call = call;
  }
}

export class RenounceOwnershipCall__Outputs {
  _call: RenounceOwnershipCall;

  constructor(call: RenounceOwnershipCall) {
    this._call = call;
  }
}

export class SafeTransferFromCall extends ethereum.Call {
  get inputs(): SafeTransferFromCall__Inputs {
    return new SafeTransferFromCall__Inputs(this);
  }

  get outputs(): SafeTransferFromCall__Outputs {
    return new SafeTransferFromCall__Outputs(this);
  }
}

export class SafeTransferFromCall__Inputs {
  _call: SafeTransferFromCall;

  constructor(call: SafeTransferFromCall) {
    this._call = call;
  }

  get from(): Address {
    return this._call.inputValues[0].value.toAddress();
  }

  get to(): Address {
    return this._call.inputValues[1].value.toAddress();
  }

  get tokenId(): BigInt {
    return this._call.inputValues[2].value.toBigInt();
  }
}

export class SafeTransferFromCall__Outputs {
  _call: SafeTransferFromCall;

  constructor(call: SafeTransferFromCall) {
    this._call = call;
  }
}

export class SafeTransferFrom1Call extends ethereum.Call {
  get inputs(): SafeTransferFrom1Call__Inputs {
    return new SafeTransferFrom1Call__Inputs(this);
  }

  get outputs(): SafeTransferFrom1Call__Outputs {
    return new SafeTransferFrom1Call__Outputs(this);
  }
}

export class SafeTransferFrom1Call__Inputs {
  _call: SafeTransferFrom1Call;

  constructor(call: SafeTransferFrom1Call) {
    this._call = call;
  }

  get from(): Address {
    return this._call.inputValues[0].value.toAddress();
  }

  get to(): Address {
    return this._call.inputValues[1].value.toAddress();
  }

  get tokenId(): BigInt {
    return this._call.inputValues[2].value.toBigInt();
  }

  get data(): Bytes {
    return this._call.inputValues[3].value.toBytes();
  }
}

export class SafeTransferFrom1Call__Outputs {
  _call: SafeTransferFrom1Call;

  constructor(call: SafeTransferFrom1Call) {
    this._call = call;
  }
}

export class SetApprovalForAllCall extends ethereum.Call {
  get inputs(): SetApprovalForAllCall__Inputs {
    return new SetApprovalForAllCall__Inputs(this);
  }

  get outputs(): SetApprovalForAllCall__Outputs {
    return new SetApprovalForAllCall__Outputs(this);
  }
}

export class SetApprovalForAllCall__Inputs {
  _call: SetApprovalForAllCall;

  constructor(call: SetApprovalForAllCall) {
    this._call = call;
  }

  get operator(): Address {
    return this._call.inputValues[0].value.toAddress();
  }

  get approved(): boolean {
    return this._call.inputValues[1].value.toBoolean();
  }
}

export class SetApprovalForAllCall__Outputs {
  _call: SetApprovalForAllCall;

  constructor(call: SetApprovalForAllCall) {
    this._call = call;
  }
}

export class SetPermissionCall extends ethereum.Call {
  get inputs(): SetPermissionCall__Inputs {
    return new SetPermissionCall__Inputs(this);
  }

  get outputs(): SetPermissionCall__Outputs {
    return new SetPermissionCall__Outputs(this);
  }
}

export class SetPermissionCall__Inputs {
  _call: SetPermissionCall;

  constructor(call: SetPermissionCall) {
    this._call = call;
  }

  get teamId(): BigInt {
    return this._call.inputValues[0].value.toBigInt();
  }

  get user(): Address {
    return this._call.inputValues[1].value.toAddress();
  }

  get permission(): i32 {
    return this._call.inputValues[2].value.toI32();
  }
}

export class SetPermissionCall__Outputs {
  _call: SetPermissionCall;

  constructor(call: SetPermissionCall) {
    this._call = call;
  }
}

export class TransferFromCall extends ethereum.Call {
  get inputs(): TransferFromCall__Inputs {
    return new TransferFromCall__Inputs(this);
  }

  get outputs(): TransferFromCall__Outputs {
    return new TransferFromCall__Outputs(this);
  }
}

export class TransferFromCall__Inputs {
  _call: TransferFromCall;

  constructor(call: TransferFromCall) {
    this._call = call;
  }

  get from(): Address {
    return this._call.inputValues[0].value.toAddress();
  }

  get to(): Address {
    return this._call.inputValues[1].value.toAddress();
  }

  get tokenId(): BigInt {
    return this._call.inputValues[2].value.toBigInt();
  }
}

export class TransferFromCall__Outputs {
  _call: TransferFromCall;

  constructor(call: TransferFromCall) {
    this._call = call;
  }
}

export class TransferOwnershipCall extends ethereum.Call {
  get inputs(): TransferOwnershipCall__Inputs {
    return new TransferOwnershipCall__Inputs(this);
  }

  get outputs(): TransferOwnershipCall__Outputs {
    return new TransferOwnershipCall__Outputs(this);
  }
}

export class TransferOwnershipCall__Inputs {
  _call: TransferOwnershipCall;

  constructor(call: TransferOwnershipCall) {
    this._call = call;
  }

  get newOwner(): Address {
    return this._call.inputValues[0].value.toAddress();
  }
}

export class TransferOwnershipCall__Outputs {
  _call: TransferOwnershipCall;

  constructor(call: TransferOwnershipCall) {
    this._call = call;
  }
}

export class TransferToOrganisationCall extends ethereum.Call {
  get inputs(): TransferToOrganisationCall__Inputs {
    return new TransferToOrganisationCall__Inputs(this);
  }

  get outputs(): TransferToOrganisationCall__Outputs {
    return new TransferToOrganisationCall__Outputs(this);
  }
}

export class TransferToOrganisationCall__Inputs {
  _call: TransferToOrganisationCall;

  constructor(call: TransferToOrganisationCall) {
    this._call = call;
  }

  get teamId(): BigInt {
    return this._call.inputValues[0].value.toBigInt();
  }

  get orgId(): BigInt {
    return this._call.inputValues[1].value.toBigInt();
  }
}

export class TransferToOrganisationCall__Outputs {
  _call: TransferToOrganisationCall;

  constructor(call: TransferToOrganisationCall) {
    this._call = call;
  }
}
