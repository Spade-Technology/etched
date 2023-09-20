/* Autogenerated file. Do not edit manually. */
/* tslint:disable */
/* eslint-disable */
import type {
  BaseContract,
  BigNumberish,
  BytesLike,
  FunctionFragment,
  Result,
  Interface,
  EventFragment,
  AddressLike,
  ContractRunner,
  ContractMethod,
  Listener,
} from "ethers";
import type {
  TypedContractEvent,
  TypedDeferredTopicFilter,
  TypedEventLog,
  TypedLogDescription,
  TypedListener,
  TypedContractMethod,
} from "../../common";

export declare namespace SignatureVerifier {
  export type EncodedMessageStruct = {
    blockNumber: BigNumberish;
    nodeAddress: AddressLike;
  };

  export type EncodedMessageStructOutput = [
    blockNumber: bigint,
    nodeAddress: string
  ] & { blockNumber: bigint; nodeAddress: string };

  export type SignatureStruct = {
    encodedMessage: BytesLike;
    messageHash: BytesLike;
    signature: BytesLike;
    signer: AddressLike;
  };

  export type SignatureStructOutput = [
    encodedMessage: string,
    messageHash: string,
    signature: string,
    signer: string
  ] & {
    encodedMessage: string;
    messageHash: string;
    signature: string;
    signer: string;
  };
}

export interface $NodeHandlerInterface extends Interface {
  getFunction(
    nameOrSignature:
      | "$_checkOwner"
      | "$_msgData"
      | "$_msgSender"
      | "$_transferOwnership"
      | "$checkMessageValidity"
      | "$getEthSignedMessageHash"
      | "$getMessageHash"
      | "__hh_exposed_bytecode_marker"
      | "_nodes"
      | "addNode"
      | "checkSignature"
      | "delegateCallsToSelf"
      | "getParent"
      | "isNode"
      | "owner"
      | "renounceOwnership"
      | "transferOwnership"
  ): FunctionFragment;

  getEvent(nameOrSignatureOrTopic: "OwnershipTransferred"): EventFragment;

  encodeFunctionData(
    functionFragment: "$_checkOwner",
    values?: undefined
  ): string;
  encodeFunctionData(functionFragment: "$_msgData", values?: undefined): string;
  encodeFunctionData(
    functionFragment: "$_msgSender",
    values?: undefined
  ): string;
  encodeFunctionData(
    functionFragment: "$_transferOwnership",
    values: [AddressLike]
  ): string;
  encodeFunctionData(
    functionFragment: "$checkMessageValidity",
    values: [SignatureVerifier.EncodedMessageStruct]
  ): string;
  encodeFunctionData(
    functionFragment: "$getEthSignedMessageHash",
    values: [BytesLike]
  ): string;
  encodeFunctionData(
    functionFragment: "$getMessageHash",
    values: [BytesLike]
  ): string;
  encodeFunctionData(
    functionFragment: "__hh_exposed_bytecode_marker",
    values?: undefined
  ): string;
  encodeFunctionData(functionFragment: "_nodes", values: [AddressLike]): string;
  encodeFunctionData(
    functionFragment: "addNode",
    values: [AddressLike]
  ): string;
  encodeFunctionData(
    functionFragment: "checkSignature",
    values: [SignatureVerifier.SignatureStruct]
  ): string;
  encodeFunctionData(
    functionFragment: "delegateCallsToSelf",
    values: [SignatureVerifier.SignatureStruct, BytesLike[]]
  ): string;
  encodeFunctionData(functionFragment: "getParent", values?: undefined): string;
  encodeFunctionData(functionFragment: "isNode", values: [AddressLike]): string;
  encodeFunctionData(functionFragment: "owner", values?: undefined): string;
  encodeFunctionData(
    functionFragment: "renounceOwnership",
    values?: undefined
  ): string;
  encodeFunctionData(
    functionFragment: "transferOwnership",
    values: [AddressLike]
  ): string;

  decodeFunctionResult(
    functionFragment: "$_checkOwner",
    data: BytesLike
  ): Result;
  decodeFunctionResult(functionFragment: "$_msgData", data: BytesLike): Result;
  decodeFunctionResult(
    functionFragment: "$_msgSender",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "$_transferOwnership",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "$checkMessageValidity",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "$getEthSignedMessageHash",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "$getMessageHash",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "__hh_exposed_bytecode_marker",
    data: BytesLike
  ): Result;
  decodeFunctionResult(functionFragment: "_nodes", data: BytesLike): Result;
  decodeFunctionResult(functionFragment: "addNode", data: BytesLike): Result;
  decodeFunctionResult(
    functionFragment: "checkSignature",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "delegateCallsToSelf",
    data: BytesLike
  ): Result;
  decodeFunctionResult(functionFragment: "getParent", data: BytesLike): Result;
  decodeFunctionResult(functionFragment: "isNode", data: BytesLike): Result;
  decodeFunctionResult(functionFragment: "owner", data: BytesLike): Result;
  decodeFunctionResult(
    functionFragment: "renounceOwnership",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "transferOwnership",
    data: BytesLike
  ): Result;
}

export namespace OwnershipTransferredEvent {
  export type InputTuple = [previousOwner: AddressLike, newOwner: AddressLike];
  export type OutputTuple = [previousOwner: string, newOwner: string];
  export interface OutputObject {
    previousOwner: string;
    newOwner: string;
  }
  export type Event = TypedContractEvent<InputTuple, OutputTuple, OutputObject>;
  export type Filter = TypedDeferredTopicFilter<Event>;
  export type Log = TypedEventLog<Event>;
  export type LogDescription = TypedLogDescription<Event>;
}

export interface $NodeHandler extends BaseContract {
  connect(runner?: ContractRunner | null): $NodeHandler;
  waitForDeployment(): Promise<this>;

  interface: $NodeHandlerInterface;

  queryFilter<TCEvent extends TypedContractEvent>(
    event: TCEvent,
    fromBlockOrBlockhash?: string | number | undefined,
    toBlock?: string | number | undefined
  ): Promise<Array<TypedEventLog<TCEvent>>>;
  queryFilter<TCEvent extends TypedContractEvent>(
    filter: TypedDeferredTopicFilter<TCEvent>,
    fromBlockOrBlockhash?: string | number | undefined,
    toBlock?: string | number | undefined
  ): Promise<Array<TypedEventLog<TCEvent>>>;

  on<TCEvent extends TypedContractEvent>(
    event: TCEvent,
    listener: TypedListener<TCEvent>
  ): Promise<this>;
  on<TCEvent extends TypedContractEvent>(
    filter: TypedDeferredTopicFilter<TCEvent>,
    listener: TypedListener<TCEvent>
  ): Promise<this>;

  once<TCEvent extends TypedContractEvent>(
    event: TCEvent,
    listener: TypedListener<TCEvent>
  ): Promise<this>;
  once<TCEvent extends TypedContractEvent>(
    filter: TypedDeferredTopicFilter<TCEvent>,
    listener: TypedListener<TCEvent>
  ): Promise<this>;

  listeners<TCEvent extends TypedContractEvent>(
    event: TCEvent
  ): Promise<Array<TypedListener<TCEvent>>>;
  listeners(eventName?: string): Promise<Array<Listener>>;
  removeAllListeners<TCEvent extends TypedContractEvent>(
    event?: TCEvent
  ): Promise<this>;

  $_checkOwner: TypedContractMethod<[], [void], "view">;

  $_msgData: TypedContractMethod<[], [string], "view">;

  $_msgSender: TypedContractMethod<[], [string], "view">;

  $_transferOwnership: TypedContractMethod<
    [newOwner: AddressLike],
    [void],
    "nonpayable"
  >;

  $checkMessageValidity: TypedContractMethod<
    [_encodedMessage: SignatureVerifier.EncodedMessageStruct],
    [boolean],
    "view"
  >;

  $getEthSignedMessageHash: TypedContractMethod<
    [_messageHash: BytesLike],
    [string],
    "view"
  >;

  $getMessageHash: TypedContractMethod<[_data: BytesLike], [string], "view">;

  __hh_exposed_bytecode_marker: TypedContractMethod<[], [string], "view">;

  _nodes: TypedContractMethod<[node: AddressLike], [boolean], "view">;

  addNode: TypedContractMethod<[node: AddressLike], [void], "nonpayable">;

  checkSignature: TypedContractMethod<
    [_signature: SignatureVerifier.SignatureStruct],
    [SignatureVerifier.EncodedMessageStructOutput],
    "view"
  >;

  delegateCallsToSelf: TypedContractMethod<
    [signature: SignatureVerifier.SignatureStruct, _calldata: BytesLike[]],
    [void],
    "nonpayable"
  >;

  getParent: TypedContractMethod<[], [string], "view">;

  isNode: TypedContractMethod<[node: AddressLike], [boolean], "view">;

  owner: TypedContractMethod<[], [string], "view">;

  renounceOwnership: TypedContractMethod<[], [void], "nonpayable">;

  transferOwnership: TypedContractMethod<
    [newOwner: AddressLike],
    [void],
    "nonpayable"
  >;

  getFunction<T extends ContractMethod = ContractMethod>(
    key: string | FunctionFragment
  ): T;

  getFunction(
    nameOrSignature: "$_checkOwner"
  ): TypedContractMethod<[], [void], "view">;
  getFunction(
    nameOrSignature: "$_msgData"
  ): TypedContractMethod<[], [string], "view">;
  getFunction(
    nameOrSignature: "$_msgSender"
  ): TypedContractMethod<[], [string], "view">;
  getFunction(
    nameOrSignature: "$_transferOwnership"
  ): TypedContractMethod<[newOwner: AddressLike], [void], "nonpayable">;
  getFunction(
    nameOrSignature: "$checkMessageValidity"
  ): TypedContractMethod<
    [_encodedMessage: SignatureVerifier.EncodedMessageStruct],
    [boolean],
    "view"
  >;
  getFunction(
    nameOrSignature: "$getEthSignedMessageHash"
  ): TypedContractMethod<[_messageHash: BytesLike], [string], "view">;
  getFunction(
    nameOrSignature: "$getMessageHash"
  ): TypedContractMethod<[_data: BytesLike], [string], "view">;
  getFunction(
    nameOrSignature: "__hh_exposed_bytecode_marker"
  ): TypedContractMethod<[], [string], "view">;
  getFunction(
    nameOrSignature: "_nodes"
  ): TypedContractMethod<[node: AddressLike], [boolean], "view">;
  getFunction(
    nameOrSignature: "addNode"
  ): TypedContractMethod<[node: AddressLike], [void], "nonpayable">;
  getFunction(
    nameOrSignature: "checkSignature"
  ): TypedContractMethod<
    [_signature: SignatureVerifier.SignatureStruct],
    [SignatureVerifier.EncodedMessageStructOutput],
    "view"
  >;
  getFunction(
    nameOrSignature: "delegateCallsToSelf"
  ): TypedContractMethod<
    [signature: SignatureVerifier.SignatureStruct, _calldata: BytesLike[]],
    [void],
    "nonpayable"
  >;
  getFunction(
    nameOrSignature: "getParent"
  ): TypedContractMethod<[], [string], "view">;
  getFunction(
    nameOrSignature: "isNode"
  ): TypedContractMethod<[node: AddressLike], [boolean], "view">;
  getFunction(
    nameOrSignature: "owner"
  ): TypedContractMethod<[], [string], "view">;
  getFunction(
    nameOrSignature: "renounceOwnership"
  ): TypedContractMethod<[], [void], "nonpayable">;
  getFunction(
    nameOrSignature: "transferOwnership"
  ): TypedContractMethod<[newOwner: AddressLike], [void], "nonpayable">;

  getEvent(
    key: "OwnershipTransferred"
  ): TypedContractEvent<
    OwnershipTransferredEvent.InputTuple,
    OwnershipTransferredEvent.OutputTuple,
    OwnershipTransferredEvent.OutputObject
  >;

  filters: {
    "OwnershipTransferred(address,address)": TypedContractEvent<
      OwnershipTransferredEvent.InputTuple,
      OwnershipTransferredEvent.OutputTuple,
      OwnershipTransferredEvent.OutputObject
    >;
    OwnershipTransferred: TypedContractEvent<
      OwnershipTransferredEvent.InputTuple,
      OwnershipTransferredEvent.OutputTuple,
      OwnershipTransferredEvent.OutputObject
    >;
  };
}
