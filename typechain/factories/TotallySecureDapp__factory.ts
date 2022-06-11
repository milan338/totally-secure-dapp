/* Autogenerated file. Do not edit manually. */
/* tslint:disable */
/* eslint-disable */

import { Signer, utils, Contract, ContractFactory, Overrides } from "ethers";
import { Provider, TransactionRequest } from "@ethersproject/providers";
import type {
  TotallySecureDapp,
  TotallySecureDappInterface,
} from "../TotallySecureDapp";

const _abi = [
  {
    constant: true,
    inputs: [
      {
        name: "",
        type: "uint256",
      },
    ],
    name: "_posts",
    outputs: [
      {
        name: "title",
        type: "string",
      },
      {
        name: "content",
        type: "string",
      },
    ],
    payable: false,
    stateMutability: "view",
    type: "function",
  },
  {
    constant: false,
    inputs: [
      {
        name: "index",
        type: "uint256",
      },
    ],
    name: "removePost",
    outputs: [],
    payable: false,
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    constant: true,
    inputs: [],
    name: "nPosts",
    outputs: [
      {
        name: "",
        type: "uint256",
      },
    ],
    payable: false,
    stateMutability: "view",
    type: "function",
  },
  {
    constant: true,
    inputs: [
      {
        name: "",
        type: "uint256",
      },
    ],
    name: "_authors",
    outputs: [
      {
        name: "",
        type: "address",
      },
    ],
    payable: false,
    stateMutability: "view",
    type: "function",
  },
  {
    constant: true,
    inputs: [],
    name: "_flagCaptured",
    outputs: [
      {
        name: "",
        type: "bool",
      },
    ],
    payable: false,
    stateMutability: "view",
    type: "function",
  },
  {
    constant: false,
    inputs: [
      {
        name: "title",
        type: "string",
      },
      {
        name: "content",
        type: "string",
      },
    ],
    name: "addPost",
    outputs: [],
    payable: false,
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    constant: true,
    inputs: [],
    name: "_owner",
    outputs: [
      {
        name: "",
        type: "address",
      },
    ],
    payable: false,
    stateMutability: "view",
    type: "function",
  },
  {
    constant: true,
    inputs: [],
    name: "_contractId",
    outputs: [
      {
        name: "",
        type: "string",
      },
    ],
    payable: false,
    stateMutability: "view",
    type: "function",
  },
  {
    constant: false,
    inputs: [
      {
        name: "index",
        type: "uint256",
      },
      {
        name: "title",
        type: "string",
      },
      {
        name: "content",
        type: "string",
      },
    ],
    name: "editPost",
    outputs: [],
    payable: false,
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    constant: false,
    inputs: [],
    name: "captureFlag",
    outputs: [],
    payable: false,
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    constant: false,
    inputs: [
      {
        name: "contractId",
        type: "string",
      },
    ],
    name: "initialize",
    outputs: [],
    payable: false,
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    payable: true,
    stateMutability: "payable",
    type: "fallback",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        name: "author",
        type: "address",
      },
      {
        indexed: true,
        name: "index",
        type: "uint256",
      },
    ],
    name: "PostPublished",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        name: "author",
        type: "address",
      },
      {
        indexed: true,
        name: "index",
        type: "uint256",
      },
    ],
    name: "PostEdited",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        name: "author",
        type: "address",
      },
      {
        indexed: true,
        name: "index",
        type: "uint256",
      },
    ],
    name: "PostRemoved",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        name: "capturer",
        type: "address",
      },
    ],
    name: "FlagCaptured",
    type: "event",
  },
];

const _bytecode =
  "0x608060405234801561001057600080fd5b5061132e806100206000396000f3006080604052600436106100af576000357c0100000000000000000000000000000000000000000000000000000000900463ffffffff16806305441afe146101435780631721ed48146102555780631fff8b391461028257806328704a8c146102ad578063a6da0dce1461031a578063b02c651614610349578063b2bdfa7b1461039c578063b63d94f9146103f3578063bf0ac63c14610483578063d481972f146104e0578063f62d1888146104f7575b6040517f08c379a00000000000000000000000000000000000000000000000000000000081526004018080602001828103825260218152602001807f436f6e747261637420646f6573206e6f7420616363657074207061796d656e7481526020017f730000000000000000000000000000000000000000000000000000000000000081525060400191505060405180910390fd5b34801561014f57600080fd5b5061016e60048036038101908080359060200190929190505050610560565b604051808060200180602001838103835285818151815260200191508051906020019080838360005b838110156101b2578082015181840152602081019050610197565b50505050905090810190601f1680156101df5780820380516001836020036101000a031916815260200191505b50838103825284818151815260200191508051906020019080838360005b838110156102185780820151818401526020810190506101fd565b50505050905090810190601f1680156102455780820380516001836020036101000a031916815260200191505b5094505050505060405180910390f35b34801561026157600080fd5b50610280600480360381019080803590602001909291905050506106c3565b005b34801561028e57600080fd5b5061029761088f565b6040518082815260200191505060405180910390f35b3480156102b957600080fd5b506102d86004803603810190808035906020019092919050505061089c565b604051808273ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16815260200191505060405180910390f35b34801561032657600080fd5b5061032f6108da565b604051808215151515815260200191505060405180910390f35b34801561035557600080fd5b5061039a6004803603810190808035906020019082018035906020019190919293919293908035906020019082018035906020019190919293919293905050506108ed565b005b3480156103a857600080fd5b506103b1610a94565b604051808273ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16815260200191505060405180910390f35b3480156103ff57600080fd5b50610408610aba565b6040518080602001828103825283818151815260200191508051906020019080838360005b8381101561044857808201518184015260208101905061042d565b50505050905090810190601f1680156104755780820380516001836020036101000a031916815260200191505b509250505060405180910390f35b34801561048f57600080fd5b506104de60048036038101908080359060200190929190803590602001908201803590602001919091929391929390803590602001908201803590602001919091929391929390505050610b58565b005b3480156104ec57600080fd5b506104f5610cce565b005b34801561050357600080fd5b5061055e600480360381019080803590602001908201803590602001908080601f0160208091040260200160405190810160405280939291908181526020018383808284378201915050505050509192919290505050610e88565b005b60048181548110151561056f57fe5b9060005260206000209060020201600091509050806000018054600181600116156101000203166002900480601f01602080910402602001604051908101604052809291908181526020018280546001816001161561010002031660029004801561061b5780601f106105f05761010080835404028352916020019161061b565b820191906000526020600020905b8154815290600101906020018083116105fe57829003601f168201915b505050505090806001018054600181600116156101000203166002900480601f0160208091040260200160405190810160405280929190818152602001828054600181600116156101000203166002900480156106b95780601f1061068e576101008083540402835291602001916106b9565b820191906000526020600020905b81548152906001019060200180831161069c57829003601f168201915b5050505050905082565b600060016004805490500382121561081b578190505b60016004805490500381101561081a576004600182018154811015156106fb57fe5b906000526020600020906002020160048281548110151561071857fe5b90600052602060002090600202016000820181600001908054600181600116156101000203166002900461074d929190611057565b5060018201816001019080546001816001161561010002031660029004610775929190611057565b5090505060036001820181548110151561078b57fe5b9060005260206000200160009054906101000a900473ffffffffffffffffffffffffffffffffffffffff166003828154811015156107c557fe5b9060005260206000200160006101000a81548173ffffffffffffffffffffffffffffffffffffffff021916908373ffffffffffffffffffffffffffffffffffffffff16021790555080806001019150506106d9565b5b600480548091906001900361083091906110de565b5060038054809190600190036108469190611110565b50813373ffffffffffffffffffffffffffffffffffffffff167fdf6442cc5b2ef43ec842be835a7e513c277ba2671e5d89ecb1f88bc12a6d539760405160405180910390a35050565b6000600480549050905090565b6003818154811015156108ab57fe5b906000526020600020016000915054906101000a900473ffffffffffffffffffffffffffffffffffffffff1681565b600560009054906101000a900460ff1681565b6108f561113c565b604080519081016040528086868080601f016020809104026020016040519081016040528093929190818152602001838380828437820191505050505050815260200184848080601f01602080910402602001604051908101604052809392919081815260200183838082843782019150505050505081525090506004819080600181540180825580915050906001820390600052602060002090600202016000909192909190915060008201518160000190805190602001906109ba929190611156565b5060208201518160010190805190602001906109d7929190611156565b5050505060033390806001815401808255809150509060018203906000526020600020016000909192909190916101000a81548173ffffffffffffffffffffffffffffffffffffffff021916908373ffffffffffffffffffffffffffffffffffffffff160217905550506001600480549050033373ffffffffffffffffffffffffffffffffffffffff167fc1a397be3a40743cefc893318b1c32f52e93741c2fdc4eeb4fd89db530a66a8b60405160405180910390a35050505050565b600260009054906101000a900473ffffffffffffffffffffffffffffffffffffffff1681565b60018054600181600116156101000203166002900480601f016020809104026020016040519081016040528092919081815260200182805460018160011615610100020316600290048015610b505780601f10610b2557610100808354040283529160200191610b50565b820191906000526020600020905b815481529060010190602001808311610b3357829003601f168201915b505050505081565b33600386815481101515610b6857fe5b9060005260206000200160006101000a81548173ffffffffffffffffffffffffffffffffffffffff021916908373ffffffffffffffffffffffffffffffffffffffff160217905550604080519081016040528085858080601f016020809104026020016040519081016040528093929190818152602001838380828437820191505050505050815260200183838080601f016020809104026020016040519081016040528093929190818152602001838380828437820191505050505050815250600486815481101515610c3857fe5b90600052602060002090600202016000820151816000019080519060200190610c62929190611156565b506020820151816001019080519060200190610c7f929190611156565b50905050843373ffffffffffffffffffffffffffffffffffffffff167f4cfba69796167f93e447393bc071ff8b77be5eff293a9081c5f865491dc6cf7460405160405180910390a35050505050565b600260009054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff163373ffffffffffffffffffffffffffffffffffffffff16141515610d93576040517f08c379a00000000000000000000000000000000000000000000000000000000081526004018080602001828103825260178152602001807f43616c6c6572206973206e6f7420746865206f776e657200000000000000000081525060200191505060405180910390fd5b6611c37937e080003073ffffffffffffffffffffffffffffffffffffffff1631111515610e28576040517f08c379a000000000000000000000000000000000000000000000000000000000815260040180806020018281038252600f8152602001807f42616c616e636520746f6f206c6f77000000000000000000000000000000000081525060200191505060405180910390fd5b6001600560006101000a81548160ff0219169083151502179055503373ffffffffffffffffffffffffffffffffffffffff167fa997c884ed725007d5670fff5cb8854c5e754b7a82ef7e74dad5f6e0cf8e8d8e60405160405180910390a2565b60008060019054906101000a900460ff1680610ea85750610ea7611040565b5b80610ebf57506000809054906101000a900460ff16155b1515610f59576040517f08c379a000000000000000000000000000000000000000000000000000000000815260040180806020018281038252602e8152602001807f496e697469616c697a61626c653a20636f6e747261637420697320616c72656181526020017f647920696e697469616c697a656400000000000000000000000000000000000081525060400191505060405180910390fd5b600060019054906101000a900460ff161590508015610fa8576001600060016101000a81548160ff02191690831515021790555060016000806101000a81548160ff0219169083151502179055505b8160019080519060200190610fbe9291906111d6565b5033600260006101000a81548173ffffffffffffffffffffffffffffffffffffffff021916908373ffffffffffffffffffffffffffffffffffffffff1602179055506000600560006101000a81548160ff021916908315150217905550801561103c5760008060016101000a81548160ff0219169083151502179055505b5050565b6000806000309150813b9050600081149250505090565b828054600181600116156101000203166002900490600052602060002090601f016020900481019282601f1061109057805485556110cd565b828001600101855582156110cd57600052602060002091601f016020900482015b828111156110cc5782548255916001019190600101906110b1565b5b5090506110da9190611256565b5090565b81548183558181111561110b5760020281600202836000526020600020918201910161110a919061127b565b5b505050565b815481835581811115611137578183600052602060002091820191016111369190611256565b5b505050565b604080519081016040528060608152602001606081525090565b828054600181600116156101000203166002900490600052602060002090601f016020900481019282601f1061119757805160ff19168380011785556111c5565b828001600101855582156111c5579182015b828111156111c45782518255916020019190600101906111a9565b5b5090506111d29190611256565b5090565b828054600181600116156101000203166002900490600052602060002090601f016020900481019282601f1061121757805160ff1916838001178555611245565b82800160010185558215611245579182015b82811115611244578251825591602001919060010190611229565b5b5090506112529190611256565b5090565b61127891905b8082111561127457600081600090555060010161125c565b5090565b90565b6112b791905b808211156112b3576000808201600061129a91906112ba565b6001820160006112aa91906112ba565b50600201611281565b5090565b90565b50805460018160011615610100020316600290046000825580601f106112e057506112ff565b601f0160209004906000526020600020908101906112fe9190611256565b5b505600a165627a7a72305820d35705e6004fd6495fede92edecbc9f8ec8b8094a57f5abedaf0d1ae886ffaf00029";

export class TotallySecureDapp__factory extends ContractFactory {
  constructor(
    ...args: [signer: Signer] | ConstructorParameters<typeof ContractFactory>
  ) {
    if (args.length === 1) {
      super(_abi, _bytecode, args[0]);
    } else {
      super(...args);
    }
  }

  deploy(
    overrides?: Overrides & { from?: string | Promise<string> }
  ): Promise<TotallySecureDapp> {
    return super.deploy(overrides || {}) as Promise<TotallySecureDapp>;
  }
  getDeployTransaction(
    overrides?: Overrides & { from?: string | Promise<string> }
  ): TransactionRequest {
    return super.getDeployTransaction(overrides || {});
  }
  attach(address: string): TotallySecureDapp {
    return super.attach(address) as TotallySecureDapp;
  }
  connect(signer: Signer): TotallySecureDapp__factory {
    return super.connect(signer) as TotallySecureDapp__factory;
  }
  static readonly bytecode = _bytecode;
  static readonly abi = _abi;
  static createInterface(): TotallySecureDappInterface {
    return new utils.Interface(_abi) as TotallySecureDappInterface;
  }
  static connect(
    address: string,
    signerOrProvider: Signer | Provider
  ): TotallySecureDapp {
    return new Contract(address, _abi, signerOrProvider) as TotallySecureDapp;
  }
}