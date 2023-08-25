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

export interface OrganizationInterface extends Interface {
  getFunction(
    nameOrSignature:
      | "PayMaster"
      | "createTeam"
      | "getTeam"
      | "getTeamCount"
      | "owner"
      | "renounceOwnership"
      | "setPayMaster"
      | "teams"
      | "transferOwnership"
  ): FunctionFragment;

  getEvent(
    nameOrSignatureOrTopic: "OwnershipTransferred" | "TeamCreated"
  ): EventFragment;

  encodeFunctionData(functionFragment: "PayMaster", values?: undefined): string;
  encodeFunctionData(
    functionFragment: "createTeam",
    values: [SignatureVerifier.SignatureStruct]
  ): string;
  encodeFunctionData(
    functionFragment: "getTeam",
    values: [BigNumberish]
  ): string;
  encodeFunctionData(
    functionFragment: "getTeamCount",
    values?: undefined
  ): string;
  encodeFunctionData(functionFragment: "owner", values?: undefined): string;
  encodeFunctionData(
    functionFragment: "renounceOwnership",
    values?: undefined
  ): string;
  encodeFunctionData(
    functionFragment: "setPayMaster",
    values: [SignatureVerifier.SignatureStruct, AddressLike]
  ): string;
  encodeFunctionData(functionFragment: "teams", values: [BigNumberish]): string;
  encodeFunctionData(
    functionFragment: "transferOwnership",
    values: [AddressLike]
  ): string;

  decodeFunctionResult(functionFragment: "PayMaster", data: BytesLike): Result;
  decodeFunctionResult(functionFragment: "createTeam", data: BytesLike): Result;
  decodeFunctionResult(functionFragment: "getTeam", data: BytesLike): Result;
  decodeFunctionResult(
    functionFragment: "getTeamCount",
    data: BytesLike
  ): Result;
  decodeFunctionResult(functionFragment: "owner", data: BytesLike): Result;
  decodeFunctionResult(
    functionFragment: "renounceOwnership",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "setPayMaster",
    data: BytesLike
  ): Result;
  decodeFunctionResult(functionFragment: "teams", data: BytesLike): Result;
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

export namespace TeamCreatedEvent {
  export type InputTuple = [creator: AddressLike, team: AddressLike];
  export type OutputTuple = [creator: string, team: string];
  export interface OutputObject {
    creator: string;
    team: string;
  }
  export type Event = TypedContractEvent<InputTuple, OutputTuple, OutputObject>;
  export type Filter = TypedDeferredTopicFilter<Event>;
  export type Log = TypedEventLog<Event>;
  export type LogDescription = TypedLogDescription<Event>;
}

export interface Organization extends BaseContract {
  connect(runner?: ContractRunner | null): Organization;
  waitForDeployment(): Promise<this>;

  interface: OrganizationInterface;

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

  PayMaster: TypedContractMethod<[], [string], "view">;

  createTeam: TypedContractMethod<
    [signature: SignatureVerifier.SignatureStruct],
    [string],
    "nonpayable"
  >;

  getTeam: TypedContractMethod<[index: BigNumberish], [string], "view">;

  getTeamCount: TypedContractMethod<[], [bigint], "view">;

  owner: TypedContractMethod<[], [string], "view">;

  renounceOwnership: TypedContractMethod<[], [void], "nonpayable">;

  setPayMaster: TypedContractMethod<
    [signature: SignatureVerifier.SignatureStruct, _paymaster: AddressLike],
    [void],
    "nonpayable"
  >;

  teams: TypedContractMethod<[arg0: BigNumberish], [string], "view">;

  transferOwnership: TypedContractMethod<
    [newOwner: AddressLike],
    [void],
    "nonpayable"
  >;

  getFunction<T extends ContractMethod = ContractMethod>(
    key: string | FunctionFragment
  ): T;

  getFunction(
    nameOrSignature: "PayMaster"
  ): TypedContractMethod<[], [string], "view">;
  getFunction(
    nameOrSignature: "createTeam"
  ): TypedContractMethod<
    [signature: SignatureVerifier.SignatureStruct],
    [string],
    "nonpayable"
  >;
  getFunction(
    nameOrSignature: "getTeam"
  ): TypedContractMethod<[index: BigNumberish], [string], "view">;
  getFunction(
    nameOrSignature: "getTeamCount"
  ): TypedContractMethod<[], [bigint], "view">;
  getFunction(
    nameOrSignature: "owner"
  ): TypedContractMethod<[], [string], "view">;
  getFunction(
    nameOrSignature: "renounceOwnership"
  ): TypedContractMethod<[], [void], "nonpayable">;
  getFunction(
    nameOrSignature: "setPayMaster"
  ): TypedContractMethod<
    [signature: SignatureVerifier.SignatureStruct, _paymaster: AddressLike],
    [void],
    "nonpayable"
  >;
  getFunction(
    nameOrSignature: "teams"
  ): TypedContractMethod<[arg0: BigNumberish], [string], "view">;
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
  getEvent(
    key: "TeamCreated"
  ): TypedContractEvent<
    TeamCreatedEvent.InputTuple,
    TeamCreatedEvent.OutputTuple,
    TeamCreatedEvent.OutputObject
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

    "TeamCreated(address,address)": TypedContractEvent<
      TeamCreatedEvent.InputTuple,
      TeamCreatedEvent.OutputTuple,
      TeamCreatedEvent.OutputObject
    >;
    TeamCreated: TypedContractEvent<
      TeamCreatedEvent.InputTuple,
      TeamCreatedEvent.OutputTuple,
      TeamCreatedEvent.OutputObject
    >;
  };
}