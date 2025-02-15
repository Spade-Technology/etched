export interface ABIParams {
  name: string;
  type: string;
}
export interface FunctionABI {
  name: string;
  type?: string;
  stateMutability: string;
  inputs: Array<ABIParams | any>;
  outputs: Array<ABIParams | any>;
  constant?: string | boolean;
  payable?: boolean;
}

export interface EncryptStringRequest extends EncryptRequestBase {
  dataToEncrypt: string;
}
export interface EncryptRequestBase {
  accessControlConditions?: AccessControlConditions;
  evmContractConditions?: EvmContractConditions;
  solRpcConditions?: SolRpcConditions;
  unifiedAccessControlConditions?: UnifiedAccessControlConditions;
  chain: string;
  authSig?: AuthSig;
  sessionSigs?: SessionSigsMap;
}

export interface SessionSigsMap {
  [nodeAddress: string]: SessionSig;
}

export interface SessionSig {
  sig: string;
  derivedVia: string;
  signedMessage: string;
  address: string;
  algo?: string;
}

export interface EncryptFileRequest extends EncryptRequestBase {
  file: AcceptedFileType;
}

export type ConditionType = "solRpc" | "evmBasic" | "evmContract" | "cosmos";
export interface AccsRegularParams {
  conditionType?: ConditionType;
  returnValueTest: {
    key?: string;
    comparator: string;
    value: string;
  };
  method?: string;
  params?: any[];
  chain: string;
}
export interface AccsEVMParams extends AccsRegularParams {
  functionAbi: FunctionABI;
  contractAddress: string;
  functionName: string;
  functionParams: any[];
}
export type EvmContractConditions = AccsEVMParams[];

export interface AccsDefaultParams extends AccsRegularParams {
  contractAddress?: string;
  standardContractType?: string;
  parameters?: any;
}

export interface LPACC_EVM_BASIC {
  contractAddress: string;
  standardContractType: string;
  parameters: any[];
}

export declare type AccessControlConditions = (AccsDefaultParams | AccsOperatorParams | AccessControlConditions)[];

export interface AuthSig {
  sig: any;
  derivedVia: string;
  signedMessage: string;
  address: string;
}
export interface AccsSOLV2Params extends AccsRegularParams {
  pdaKey: string;
  pdaInterface: {
    offset: string | number;
    fields: string | object;
  };
  pdaParams: [];
}
export type SolRpcConditions = AccsSOLV2Params[];

export interface AccsCOSMOSParams extends AccsRegularParams {
  path: string;
  method?: string;
  parameters?: string[];
}
export interface AccsOperatorParams {
  operator: string;
}
export type UnifiedAccessControlConditions = (
  | AccsRegularParams
  | AccsDefaultParams
  | AccsEVMParams
  | AccsSOLV2Params
  | AccsCOSMOSParams
  | AccsOperatorParams
)[];

export type AcceptedFileType = File | Blob;

export interface Metadata {
  type: string;
}

export interface EncryptToIpfsProps {
  authSig?: AuthSig;
  sessionSigs?: any;
  accessControlConditions?: AccessControlConditions;
  evmContractConditions?: EvmContractConditions;
  solRpcConditions?: SolRpcConditions;
  unifiedAccessControlConditions?: UnifiedAccessControlConditions;
  chain: string;
  string?: string;
  file?: AcceptedFileType;
  infuraId?: string;
  infuraSecretKey?: string;
  metadata?: Metadata;
}

export interface decryptToIpfsProps {
  authSig?: AuthSig;
  sessionSigs?: any;
  ipfsCid: string;
}
export type SymmetricKey = Uint8Array | string | CryptoKey | BufferSource;

export interface Pkp {
  tokenId: string;
  publicKey: string;
  ethAddress: string;
}