/* Autogenerated file. Do not edit manually. */
/* tslint:disable */
/* eslint-disable */
import {
  Contract,
  ContractFactory,
  ContractTransactionResponse,
  Interface,
} from "ethers";
import type {
  Signer,
  AddressLike,
  ContractDeployTransaction,
  ContractRunner,
} from "ethers";
import type { NonPayableOverrides } from "../../../common";
import type {
  Teams,
  TeamsInterface,
} from "../../../contracts/CTeams.sol/Teams";

const _abi = [
  {
    inputs: [
      {
        internalType: "address",
        name: "organisationsContract",
        type: "address",
      },
    ],
    stateMutability: "nonpayable",
    type: "constructor",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "address",
        name: "owner",
        type: "address",
      },
      {
        indexed: true,
        internalType: "address",
        name: "approved",
        type: "address",
      },
      {
        indexed: true,
        internalType: "uint256",
        name: "tokenId",
        type: "uint256",
      },
    ],
    name: "Approval",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "address",
        name: "owner",
        type: "address",
      },
      {
        indexed: true,
        internalType: "address",
        name: "operator",
        type: "address",
      },
      {
        indexed: false,
        internalType: "bool",
        name: "approved",
        type: "bool",
      },
    ],
    name: "ApprovalForAll",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "address",
        name: "previousOwner",
        type: "address",
      },
      {
        indexed: true,
        internalType: "address",
        name: "newOwner",
        type: "address",
      },
    ],
    name: "OwnershipTransferred",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "address",
        name: "from",
        type: "address",
      },
      {
        indexed: true,
        internalType: "address",
        name: "to",
        type: "address",
      },
      {
        indexed: true,
        internalType: "uint256",
        name: "tokenId",
        type: "uint256",
      },
    ],
    name: "Transfer",
    type: "event",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "node",
        type: "address",
      },
    ],
    name: "_nodes",
    outputs: [
      {
        internalType: "bool",
        name: "isNode",
        type: "bool",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "node",
        type: "address",
      },
    ],
    name: "addNode",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "to",
        type: "address",
      },
      {
        internalType: "uint256",
        name: "tokenId",
        type: "uint256",
      },
    ],
    name: "approve",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "owner",
        type: "address",
      },
    ],
    name: "balanceOf",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "to",
        type: "address",
      },
    ],
    name: "createTeam",
    outputs: [
      {
        internalType: "uint256",
        name: "newTeamId",
        type: "uint256",
      },
    ],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "bytes[]",
        name: "_calldata",
        type: "bytes[]",
      },
    ],
    name: "delegateCallsToSelf",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "tokenId",
        type: "uint256",
      },
    ],
    name: "getApproved",
    outputs: [
      {
        internalType: "address",
        name: "",
        type: "address",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "getNumberOfTeamsCreated",
    outputs: [
      {
        internalType: "uint256",
        name: "totalAmountOfTeams",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "getParent",
    outputs: [
      {
        internalType: "address",
        name: "",
        type: "address",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "teamId",
        type: "uint256",
      },
      {
        internalType: "address",
        name: "user",
        type: "address",
      },
      {
        internalType: "enum ITeams.EPermissions",
        name: "permission",
        type: "uint8",
      },
    ],
    name: "hasPermission",
    outputs: [
      {
        internalType: "bool",
        name: "_hasPermission",
        type: "bool",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "owner",
        type: "address",
      },
      {
        internalType: "address",
        name: "operator",
        type: "address",
      },
    ],
    name: "isApprovedForAll",
    outputs: [
      {
        internalType: "bool",
        name: "",
        type: "bool",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "node",
        type: "address",
      },
    ],
    name: "isNode",
    outputs: [
      {
        internalType: "bool",
        name: "",
        type: "bool",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "name",
    outputs: [
      {
        internalType: "string",
        name: "",
        type: "string",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "",
        type: "address",
      },
      {
        internalType: "address",
        name: "",
        type: "address",
      },
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
      {
        internalType: "bytes",
        name: "",
        type: "bytes",
      },
    ],
    name: "onERC721Received",
    outputs: [
      {
        internalType: "bytes4",
        name: "",
        type: "bytes4",
      },
    ],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "team",
        type: "uint256",
      },
    ],
    name: "organisationOf",
    outputs: [
      {
        internalType: "uint256",
        name: "organisation",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "organisations",
    outputs: [
      {
        internalType: "address",
        name: "",
        type: "address",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "owner",
    outputs: [
      {
        internalType: "address",
        name: "",
        type: "address",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "tokenId",
        type: "uint256",
      },
    ],
    name: "ownerOf",
    outputs: [
      {
        internalType: "address",
        name: "",
        type: "address",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "team",
        type: "uint256",
      },
      {
        internalType: "address",
        name: "user",
        type: "address",
      },
    ],
    name: "permissionsOfTeam",
    outputs: [
      {
        internalType: "enum ITeams.EPermissions",
        name: "permission",
        type: "uint8",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "renounceOwnership",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "from",
        type: "address",
      },
      {
        internalType: "address",
        name: "to",
        type: "address",
      },
      {
        internalType: "uint256",
        name: "tokenId",
        type: "uint256",
      },
    ],
    name: "safeTransferFrom",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "from",
        type: "address",
      },
      {
        internalType: "address",
        name: "to",
        type: "address",
      },
      {
        internalType: "uint256",
        name: "tokenId",
        type: "uint256",
      },
      {
        internalType: "bytes",
        name: "data",
        type: "bytes",
      },
    ],
    name: "safeTransferFrom",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "operator",
        type: "address",
      },
      {
        internalType: "bool",
        name: "approved",
        type: "bool",
      },
    ],
    name: "setApprovalForAll",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "teamId",
        type: "uint256",
      },
      {
        internalType: "address",
        name: "user",
        type: "address",
      },
      {
        internalType: "enum ITeams.EPermissions",
        name: "permission",
        type: "uint8",
      },
    ],
    name: "setPermission",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "bytes4",
        name: "interfaceId",
        type: "bytes4",
      },
    ],
    name: "supportsInterface",
    outputs: [
      {
        internalType: "bool",
        name: "",
        type: "bool",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "symbol",
    outputs: [
      {
        internalType: "string",
        name: "",
        type: "string",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "tokenId",
        type: "uint256",
      },
    ],
    name: "tokenURI",
    outputs: [
      {
        internalType: "string",
        name: "",
        type: "string",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "from",
        type: "address",
      },
      {
        internalType: "address",
        name: "to",
        type: "address",
      },
      {
        internalType: "uint256",
        name: "tokenId",
        type: "uint256",
      },
    ],
    name: "transferFrom",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "newOwner",
        type: "address",
      },
    ],
    name: "transferOwnership",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "teamId",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "orgId",
        type: "uint256",
      },
    ],
    name: "transferToOrganisation",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
] as const;

const _bytecode =
  "0x60806040523480156200001157600080fd5b506040516200211a3803806200211a83398101604081905262000034916200013e565b806040518060400160405280600981526020016845746368205465616d60b81b815250604051806040016040528060068152602001650e85a8aa886960d31b815250816000908162000087919062000215565b50600162000096828262000215565b505050620000b3620000ad620000e860201b60201c565b620000ec565b600780546001600160a01b039283166001600160a01b031991821617909155600a8054939092169216919091179055620002e1565b3390565b600680546001600160a01b038381166001600160a01b0319831681179093556040519116919082907f8be0079c531659141344cd1fd0a4f28419497f9722a3daafe3b4186f6b6457e090600090a35050565b6000602082840312156200015157600080fd5b81516001600160a01b03811681146200016957600080fd5b9392505050565b634e487b7160e01b600052604160045260246000fd5b600181811c908216806200019b57607f821691505b602082108103620001bc57634e487b7160e01b600052602260045260246000fd5b50919050565b601f8211156200021057600081815260208120601f850160051c81016020861015620001eb5750805b601f850160051c820191505b818110156200020c57828155600101620001f7565b5050505b505050565b81516001600160401b0381111562000231576200023162000170565b620002498162000242845462000186565b84620001c2565b602080601f831160018114620002815760008415620002685750858301515b600019600386901b1c1916600185901b1785556200020c565b600085815260208120601f198616915b82811015620002b25788860151825594840194600190910190840162000291565b5085821015620002d15787850151600019600388901b60f8161c191681555b5050505050600190811b01905550565b611e2980620002f16000396000f3fe608060405234801561001057600080fd5b50600436106101da5760003560e01c806380f7602111610104578063a22cb465116100a2578063c87b56dd11610071578063c87b56dd1461041d578063e5299e5c14610430578063e985e9c51461046b578063f2fde38b146104a757600080fd5b8063a22cb465146103d1578063abf0e71f146103e4578063adfb881e146103f7578063b88d4fde1461040a57600080fd5b80638da5cb5b116100de5780638da5cb5b1461039257806395d89b41146103a3578063999f066e146103ab5780639d95f1cc146103be57600080fd5b806380f760211461034b57806381fb5d4b1461035c578063823abfd91461037f57600080fd5b806323b872dd1161017c5780636352211e1161014b5780636352211e146102fd57806370a0823114610310578063715018a61461032357806378c7c8b41461032b57600080fd5b806323b872dd146102ae57806338982096146102c157806342842e0e146102d45780634bb25cca146102e757600080fd5b8063081812fc116101b8578063081812fc1461022f578063095ea7b31461025a57806313327d961461026f578063150b7a021461028257600080fd5b806301750152146101df57806301ffc9a71461020757806306fdde031461021a575b600080fd5b6101f26101ed36600461175a565b6104ba565b60405190151581526020015b60405180910390f35b6101f261021536600461178d565b610558565b6102226105a8565b6040516101fe91906117fa565b61024261023d36600461180d565b61063a565b6040516001600160a01b0390911681526020016101fe565b61026d610268366004611826565b610661565b005b61026d61027d366004611852565b61077b565b61029561029036600461192b565b61081c565b6040516001600160e01b031990911681526020016101fe565b61026d6102bc366004611997565b61082d565b61026d6102cf3660046119d8565b61085e565b61026d6102e2366004611997565b610972565b6102ef61098d565b6040519081526020016101fe565b61024261030b36600461180d565b61099d565b6102ef61031e36600461175a565b6109fc565b61026d610a82565b6102ef61033936600461180d565b600c6020526000908152604090205481565b6007546001600160a01b0316610242565b6101f261036a36600461175a565b60086020526000908152604090205460ff1681565b6101f261038d366004611a9b565b610a96565b6006546001600160a01b0316610242565b610222610b16565b61026d6103b9366004611a9b565b610b25565b61026d6103cc36600461175a565b610c8e565b61026d6103df366004611aef565b610cba565b600a54610242906001600160a01b031681565b6102ef61040536600461175a565b610cc5565b61026d61041836600461192b565b610cec565b61022261042b36600461180d565b610d24565b61045e61043e366004611b28565b600b60209081526000928352604080842090915290825290205460ff1681565b6040516101fe9190611b63565b6101f2610479366004611b8b565b6001600160a01b03918216600090815260056020908152604080832093909416825291909152205460ff1690565b61026d6104b536600461175a565b610d97565b6007546000906001600160a01b03166105405760075460405162ba80a960e11b81526001600160a01b03848116600483015290911690630175015290602401602060405180830381865afa158015610516573d6000803e3d6000fd5b505050506040513d601f19601f8201168201806040525081019061053a9190611bb9565b92915050565b50503360009081526008602052604090205460ff1690565b60006001600160e01b031982166380ac58cd60e01b148061058957506001600160e01b03198216635b5e139f60e01b145b8061053a57506301ffc9a760e01b6001600160e01b031983161461053a565b6060600080546105b790611bd6565b80601f01602080910402602001604051908101604052809291908181526020018280546105e390611bd6565b80156106305780601f1061060557610100808354040283529160200191610630565b820191906000526020600020905b81548152906001019060200180831161061357829003601f168201915b5050505050905090565b600061064582610e10565b506000908152600460205260409020546001600160a01b031690565b600061066c8261099d565b9050806001600160a01b0316836001600160a01b0316036106de5760405162461bcd60e51b815260206004820152602160248201527f4552433732313a20617070726f76616c20746f2063757272656e74206f776e656044820152603960f91b60648201526084015b60405180910390fd5b336001600160a01b03821614806106fa57506106fa8133610479565b61076c5760405162461bcd60e51b815260206004820152603d60248201527f4552433732313a20617070726f76652063616c6c6572206973206e6f7420746f60448201527f6b656e206f776e6572206f7220617070726f76656420666f7220616c6c00000060648201526084016106d5565b6107768383610e60565b505050565b336107858361099d565b6001600160a01b0316146107f25760405162461bcd60e51b815260206004820152602e60248201527f5445414d533a204f6e6c79204f776e65722063616e207472616e73666572207460448201526d379027b933b0b734b9b0ba34b7b760911b60648201526084016106d5565b600a5461080a9033906001600160a01b031684610ece565b6000918252600c602052604090912055565b630a85bd0160e11b5b949350505050565b6108373382611032565b6108535760405162461bcd60e51b81526004016106d590611c10565b610776838383610ece565b610867336104ba565b6108b35760405162461bcd60e51b815260206004820152601e60248201527f4e4f444548414e444c45523a205045524d495353494f4e5f44454e494544000060448201526064016106d5565b60005b815181101561096e57600080306001600160a01b03168484815181106108de576108de611c5d565b60200260200101516040516108f39190611c73565b600060405180830381855af49150503d806000811461092e576040519150601f19603f3d011682016040523d82523d6000602084013e610933565b606091505b50915091508181906109585760405162461bcd60e51b81526004016106d591906117fa565b505050808061096690611c8f565b9150506108b6565b5050565b61077683838360405180602001604052806000815250610cec565b600061099860095490565b905090565b6000806109a9836110b0565b90506001600160a01b03811661053a5760405162461bcd60e51b8152602060048201526018602482015277115490cdcc8c4e881a5b9d985b1a59081d1bdad95b88125160421b60448201526064016106d5565b60006001600160a01b038216610a665760405162461bcd60e51b815260206004820152602960248201527f4552433732313a2061646472657373207a65726f206973206e6f7420612076616044820152683634b21037bbb732b960b91b60648201526084016106d5565b506001600160a01b031660009081526003602052604090205490565b610a8a611158565b610a9460006111b2565b565b6000826001600160a01b0316610aab8561099d565b6001600160a01b031603610ac157506001610b0f565b816002811115610ad357610ad3611b4d565b6000858152600b602090815260408083206001600160a01b038816845290915290205460ff166002811115610b0a57610b0a611b4d565b101590505b9392505050565b6060600180546105b790611bd6565b8233610b308261099d565b6001600160a01b03161480610bc45750600a546000828152600c60205260409081902054905163146a291160e01b815260048101919091523360248201526001600160a01b039091169063146a291190604401602060405180830381865afa158015610ba0573d6000803e3d6000fd5b505050506040513d601f19601f82011682018060405250810190610bc49190611bb9565b610c445760405162461bcd60e51b8152602060048201526044602482018190527f5445414d533a204f6e6c7920746865204f776e65722c206f7220616e204f7267908201527f616e69736174696f6e2041646d696e2063616e20736574207065726d6973736960648201526337b7399760e11b608482015260a4016106d5565b6000848152600b602090815260408083206001600160a01b03871684529091529020805483919060ff19166001836002811115610c8357610c83611b4d565b021790555050505050565b610c96611158565b6001600160a01b03166000908152600860205260409020805460ff19166001179055565b61096e338383611204565b6000610cd5600980546001019055565b6000610ce060095490565b905061053a83826112d2565b610cf63383611032565b610d125760405162461bcd60e51b81526004016106d590611c10565b610d1e848484846112ec565b50505050565b6060610d2f82610e10565b6000610d4660408051602081019091526000815290565b90506000815111610d665760405180602001604052806000815250610b0f565b80610d708461131f565b604051602001610d81929190611cb6565b6040516020818303038152906040529392505050565b610d9f611158565b6001600160a01b038116610e045760405162461bcd60e51b815260206004820152602660248201527f4f776e61626c653a206e6577206f776e657220697320746865207a65726f206160448201526564647265737360d01b60648201526084016106d5565b610e0d816111b2565b50565b610e19816113b2565b610e0d5760405162461bcd60e51b8152602060048201526018602482015277115490cdcc8c4e881a5b9d985b1a59081d1bdad95b88125160421b60448201526064016106d5565b600081815260046020526040902080546001600160a01b0319166001600160a01b0384169081179091558190610e958261099d565b6001600160a01b03167f8c5be1e5ebec7d5bd14f71427d1e84f3dd0314c0f7b2291e5b200ac8c7c3b92560405160405180910390a45050565b826001600160a01b0316610ee18261099d565b6001600160a01b031614610f075760405162461bcd60e51b81526004016106d590611ce5565b6001600160a01b038216610f695760405162461bcd60e51b8152602060048201526024808201527f4552433732313a207472616e7366657220746f20746865207a65726f206164646044820152637265737360e01b60648201526084016106d5565b826001600160a01b0316610f7c8261099d565b6001600160a01b031614610fa25760405162461bcd60e51b81526004016106d590611ce5565b600081815260046020908152604080832080546001600160a01b03199081169091556001600160a01b0387811680865260038552838620805460001901905590871680865283862080546001019055868652600290945282852080549092168417909155905184937fddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef91a4505050565b60008061103e8361099d565b9050806001600160a01b0316846001600160a01b0316148061108557506001600160a01b0380821660009081526005602090815260408083209388168352929052205460ff165b806108255750836001600160a01b031661109e8461063a565b6001600160a01b031614949350505050565b600081815260026020526040812054600a546001600160a01b039182169116810361053a57600a546000848152600c6020526040908190205490516331a9108f60e11b81526001600160a01b0390921691636352211e916111179160040190815260200190565b602060405180830381865afa158015611134573d6000803e3d6000fd5b505050506040513d601f19601f82011682018060405250810190610b0f9190611d2a565b6006546001600160a01b03163314610a945760405162461bcd60e51b815260206004820181905260248201527f4f776e61626c653a2063616c6c6572206973206e6f7420746865206f776e657260448201526064016106d5565b600680546001600160a01b038381166001600160a01b0319831681179093556040519116919082907f8be0079c531659141344cd1fd0a4f28419497f9722a3daafe3b4186f6b6457e090600090a35050565b816001600160a01b0316836001600160a01b0316036112655760405162461bcd60e51b815260206004820152601960248201527f4552433732313a20617070726f766520746f2063616c6c65720000000000000060448201526064016106d5565b6001600160a01b03838116600081815260056020908152604080832094871680845294825291829020805460ff191686151590811790915591519182527f17307eab39ab6107e8899845ad3d59bd9653f200f220920489ca2b5937696c31910160405180910390a3505050565b61096e8282604051806020016040528060008152506113cf565b6112f7848484610ece565b61130384848484611402565b610d1e5760405162461bcd60e51b81526004016106d590611d47565b6060600061132c83611500565b600101905060008167ffffffffffffffff81111561134c5761134c611874565b6040519080825280601f01601f191660200182016040528015611376576020820181803683370190505b5090508181016020015b600019016f181899199a1a9b1b9c1cb0b131b232b360811b600a86061a8153600a850494508461138057509392505050565b6000806113be836110b0565b6001600160a01b0316141592915050565b6113d983836115d8565b6113e66000848484611402565b6107765760405162461bcd60e51b81526004016106d590611d47565b60006001600160a01b0384163b156114f857604051630a85bd0160e11b81526001600160a01b0385169063150b7a0290611446903390899088908890600401611d99565b6020604051808303816000875af1925050508015611481575060408051601f3d908101601f1916820190925261147e91810190611dd6565b60015b6114de573d8080156114af576040519150601f19603f3d011682016040523d82523d6000602084013e6114b4565b606091505b5080516000036114d65760405162461bcd60e51b81526004016106d590611d47565b805181602001fd5b6001600160e01b031916630a85bd0160e11b149050610825565b506001610825565b60008072184f03e93ff9f4daa797ed6e38ed64bf6a1f0160401b831061153f5772184f03e93ff9f4daa797ed6e38ed64bf6a1f0160401b830492506040015b6d04ee2d6d415b85acef8100000000831061156b576d04ee2d6d415b85acef8100000000830492506020015b662386f26fc10000831061158957662386f26fc10000830492506010015b6305f5e10083106115a1576305f5e100830492506008015b61271083106115b557612710830492506004015b606483106115c7576064830492506002015b600a831061053a5760010192915050565b6001600160a01b03821661162e5760405162461bcd60e51b815260206004820181905260248201527f4552433732313a206d696e7420746f20746865207a65726f206164647265737360448201526064016106d5565b611637816113b2565b156116845760405162461bcd60e51b815260206004820152601c60248201527f4552433732313a20746f6b656e20616c7265616479206d696e7465640000000060448201526064016106d5565b61168d816113b2565b156116da5760405162461bcd60e51b815260206004820152601c60248201527f4552433732313a20746f6b656e20616c7265616479206d696e7465640000000060448201526064016106d5565b6001600160a01b038216600081815260036020908152604080832080546001019055848352600290915280822080546001600160a01b0319168417905551839291907fddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef908290a45050565b6001600160a01b0381168114610e0d57600080fd5b60006020828403121561176c57600080fd5b8135610b0f81611745565b6001600160e01b031981168114610e0d57600080fd5b60006020828403121561179f57600080fd5b8135610b0f81611777565b60005b838110156117c55781810151838201526020016117ad565b50506000910152565b600081518084526117e68160208601602086016117aa565b601f01601f19169290920160200192915050565b602081526000610b0f60208301846117ce565b60006020828403121561181f57600080fd5b5035919050565b6000806040838503121561183957600080fd5b823561184481611745565b946020939093013593505050565b6000806040838503121561186557600080fd5b50508035926020909101359150565b634e487b7160e01b600052604160045260246000fd5b604051601f8201601f1916810167ffffffffffffffff811182821017156118b3576118b3611874565b604052919050565b600082601f8301126118cc57600080fd5b813567ffffffffffffffff8111156118e6576118e6611874565b6118f9601f8201601f191660200161188a565b81815284602083860101111561190e57600080fd5b816020850160208301376000918101602001919091529392505050565b6000806000806080858703121561194157600080fd5b843561194c81611745565b9350602085013561195c81611745565b925060408501359150606085013567ffffffffffffffff81111561197f57600080fd5b61198b878288016118bb565b91505092959194509250565b6000806000606084860312156119ac57600080fd5b83356119b781611745565b925060208401356119c781611745565b929592945050506040919091013590565b600060208083850312156119eb57600080fd5b823567ffffffffffffffff80821115611a0357600080fd5b818501915085601f830112611a1757600080fd5b813581811115611a2957611a29611874565b8060051b611a3885820161188a565b9182528381018501918581019089841115611a5257600080fd5b86860192505b83831015611a8e57823585811115611a705760008081fd5b611a7e8b89838a01016118bb565b8352509186019190860190611a58565b9998505050505050505050565b600080600060608486031215611ab057600080fd5b833592506020840135611ac281611745565b9150604084013560038110611ad657600080fd5b809150509250925092565b8015158114610e0d57600080fd5b60008060408385031215611b0257600080fd5b8235611b0d81611745565b91506020830135611b1d81611ae1565b809150509250929050565b60008060408385031215611b3b57600080fd5b823591506020830135611b1d81611745565b634e487b7160e01b600052602160045260246000fd5b6020810160038310611b8557634e487b7160e01b600052602160045260246000fd5b91905290565b60008060408385031215611b9e57600080fd5b8235611ba981611745565b91506020830135611b1d81611745565b600060208284031215611bcb57600080fd5b8151610b0f81611ae1565b600181811c90821680611bea57607f821691505b602082108103611c0a57634e487b7160e01b600052602260045260246000fd5b50919050565b6020808252602d908201527f4552433732313a2063616c6c6572206973206e6f7420746f6b656e206f776e6560408201526c1c881bdc88185c1c1c9bdd9959609a1b606082015260800190565b634e487b7160e01b600052603260045260246000fd5b60008251611c858184602087016117aa565b9190910192915050565b600060018201611caf57634e487b7160e01b600052601160045260246000fd5b5060010190565b60008351611cc88184602088016117aa565b835190830190611cdc8183602088016117aa565b01949350505050565b60208082526025908201527f4552433732313a207472616e736665722066726f6d20696e636f72726563742060408201526437bbb732b960d91b606082015260800190565b600060208284031215611d3c57600080fd5b8151610b0f81611745565b60208082526032908201527f4552433732313a207472616e7366657220746f206e6f6e20455243373231526560408201527131b2b4bb32b91034b6b83632b6b2b73a32b960711b606082015260800190565b6001600160a01b0385811682528416602082015260408101839052608060608201819052600090611dcc908301846117ce565b9695505050505050565b600060208284031215611de857600080fd5b8151610b0f8161177756fea2646970667358221220894e9c3571b40074d888dea91f42a4f1dcbfe92253ddf92070bd78d953de325e64736f6c63430008130033";

type TeamsConstructorParams =
  | [signer?: Signer]
  | ConstructorParameters<typeof ContractFactory>;

const isSuperArgs = (
  xs: TeamsConstructorParams
): xs is ConstructorParameters<typeof ContractFactory> => xs.length > 1;

export class Teams__factory extends ContractFactory {
  constructor(...args: TeamsConstructorParams) {
    if (isSuperArgs(args)) {
      super(...args);
    } else {
      super(_abi, _bytecode, args[0]);
    }
  }

  override getDeployTransaction(
    organisationsContract: AddressLike,
    overrides?: NonPayableOverrides & { from?: string }
  ): Promise<ContractDeployTransaction> {
    return super.getDeployTransaction(organisationsContract, overrides || {});
  }
  override deploy(
    organisationsContract: AddressLike,
    overrides?: NonPayableOverrides & { from?: string }
  ) {
    return super.deploy(organisationsContract, overrides || {}) as Promise<
      Teams & {
        deploymentTransaction(): ContractTransactionResponse;
      }
    >;
  }
  override connect(runner: ContractRunner | null): Teams__factory {
    return super.connect(runner) as Teams__factory;
  }

  static readonly bytecode = _bytecode;
  static readonly abi = _abi;
  static createInterface(): TeamsInterface {
    return new Interface(_abi) as TeamsInterface;
  }
  static connect(address: string, runner?: ContractRunner | null): Teams {
    return new Contract(address, _abi, runner) as unknown as Teams;
  }
}