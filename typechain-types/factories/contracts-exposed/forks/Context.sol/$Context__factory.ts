/* Autogenerated file. Do not edit manually. */
/* tslint:disable */
/* eslint-disable */
import {
  Contract,
  ContractFactory,
  ContractTransactionResponse,
  Interface,
} from "ethers";
import type { Signer, ContractDeployTransaction, ContractRunner } from "ethers";
import type { PayableOverrides } from "../../../../common";
import type {
  $Context,
  $ContextInterface,
} from "../../../../contracts-exposed/forks/Context.sol/$Context";

const _abi = [
  {
    inputs: [],
    stateMutability: "payable",
    type: "constructor",
  },
  {
    inputs: [],
    name: "$_msgData",
    outputs: [
      {
        internalType: "bytes",
        name: "ret0",
        type: "bytes",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "$_msgSender",
    outputs: [
      {
        internalType: "address",
        name: "ret0",
        type: "address",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "__hh_exposed_bytecode_marker",
    outputs: [
      {
        internalType: "bytes32",
        name: "",
        type: "bytes32",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    stateMutability: "payable",
    type: "receive",
  },
] as const;

const _bytecode =
  "0x6080604052600080546001600160a01b03191690556101c5806100236000396000f3fe6080604052600436106100385760003560e01c80632904df291461004457806332cadf3c14610076578063342db7391461009857600080fd5b3661003f57005b600080fd5b34801561005057600080fd5b506100596100cc565b6040516001600160a01b0390911681526020015b60405180910390f35b34801561008257600080fd5b5061008b6100db565b60405161006d9190610141565b3480156100a457600080fd5b506100be6e1a185c991a185d0b595e1c1bdcd959608a1b81565b60405190815260200161006d565b60006100d661011a565b905090565b60606000368080601f01602080910402602001604051908101604052809392919081815260200183838082843760009201919091525092949350505050565b600080546001600160a01b03161561013c57506000546001600160a01b031690565b503390565b600060208083528351808285015260005b8181101561016e57858101830151858201604001528201610152565b506000604082860101526040601f19601f830116850101925050509291505056fea2646970667358221220c5fc3caf1e133dcd0fc55eed764739043a3583c4bb942ea65b14aac60711b5cd64736f6c63430008130033";

type $ContextConstructorParams =
  | [signer?: Signer]
  | ConstructorParameters<typeof ContractFactory>;

const isSuperArgs = (
  xs: $ContextConstructorParams
): xs is ConstructorParameters<typeof ContractFactory> => xs.length > 1;

export class $Context__factory extends ContractFactory {
  constructor(...args: $ContextConstructorParams) {
    if (isSuperArgs(args)) {
      super(...args);
    } else {
      super(_abi, _bytecode, args[0]);
    }
  }

  override getDeployTransaction(
    overrides?: PayableOverrides & { from?: string }
  ): Promise<ContractDeployTransaction> {
    return super.getDeployTransaction(overrides || {});
  }
  override deploy(overrides?: PayableOverrides & { from?: string }) {
    return super.deploy(overrides || {}) as Promise<
      $Context & {
        deploymentTransaction(): ContractTransactionResponse;
      }
    >;
  }
  override connect(runner: ContractRunner | null): $Context__factory {
    return super.connect(runner) as $Context__factory;
  }

  static readonly bytecode = _bytecode;
  static readonly abi = _abi;
  static createInterface(): $ContextInterface {
    return new Interface(_abi) as $ContextInterface;
  }
  static connect(address: string, runner?: ContractRunner | null): $Context {
    return new Contract(address, _abi, runner) as unknown as $Context;
  }
}
