import * as LitJsSdk from "@lit-protocol/lit-node-client";
import { keccak256, toBytes, toHex } from "viem";
import { AddUserResponse, decryptToIpfsProps, Pkp } from "./utils/litTypes";
import { decryptToFile, decryptToString, encryptFile, encryptString } from '@lit-protocol/encryption';

import { LitContracts } from "@lit-protocol/contracts-sdk";
import { ethers, providers, Wallet } from "ethers";
import bs58 from "bs58";
// @ts-ignore
import IpfsHash from "ipfs-only-hash";

import { litActionCode } from "./litAction"
import { PKPEthersWallet } from '@lit-protocol/pkp-ethers';

import {
  AUTH_METHOD_SCOPE,
  AUTH_METHOD_TYPE,
  LIT_ABILITY
} from "@lit-protocol/constants";
import { LitPKPResource } from "@lit-protocol/auth-helpers";
import { SiweMessage } from "siwe";
import { pinata } from "./ipfs";
import { env } from "./env.mjs";



type ParameterType = Omit<Parameters<typeof encryptFile>[0], "file">;


export const litNetwork = env.NODE_ENV === "development" ? "datil-dev" : "datil";

const client = new LitJsSdk.LitNodeClient({
  litNetwork: litNetwork,
  debug: false,
  checkNodeAttestation: env.NODE_ENV !== "development",
});

const ipfsPlublicClientUrl = env.NEXT_PUBLIC_IPFS_PUBLIC_GATEWAY + "ipfs/" || "https://gateway.pinata.cloud/ipfs/";



class LitServerSide {
  public client?: LitJsSdk.LitNodeClient;
  private connectingLock?: Promise<LitJsSdk.LitNodeClient>;
  private ethersSigner: Wallet;

  public litContracts?: LitContracts;

  constructor() {
    this.ethersSigner = new Wallet(
      env.LIT_PRIVATE_KEY!,
      new providers.JsonRpcProvider("https://yellowstone-rpc.litprotocol.com/")
    );
    this.connect()

  }

  async connect () {
    if (this.client && this.litContracts) return this.client;

    if (!this.connectingLock) {
      this.connectingLock = new Promise(async (resolve, reject) => {
        console.log("connecting to lit node");

        try {
          await client.connect();
          if (!client) throw new Error(`Lit client is not connected`);

          console.log("connected to lit node: ", client.config.litNetwork);

          this.client = client;

          const litContracts = new LitContracts({
            signer: this.ethersSigner,
            network: litNetwork,
          });
          await litContracts.connect()
          this.litContracts = litContracts

          resolve(this.client);
        } catch (error) {
          reject(error);
        }
      });
    }

    return this.connectingLock;
  }


  async getMetadataFromIpfs (ipfsCid: string) {
    const ipfsData = await (await fetch(`${ipfsPlublicClientUrl}${ipfsCid}`)).json();

    return ipfsData.metadata;
  }

  async mintPkp (userId: string) {
    if (!this.litContracts) return
    try {
      const pkpMintCost = await this.getPkpMintCost(this.litContracts);
      const {
        authMethodType: clerkAuthMethodType,
        authMethodId: clerkAuthMethodId,
      } = this.getClerkAuthMethodInfo(userId);

      const tx =
        await this.litContracts.pkpHelperContract.write.mintNextAndAddAuthMethods(
          AUTH_METHOD_TYPE.LitAction, // keyType
          [AUTH_METHOD_TYPE.LitAction, clerkAuthMethodType], // permittedAuthMethodTypes
          [
            `0x${Buffer.from(
              bs58.decode(await this.getLitActionCodeIpfsCid())
            ).toString("hex")}`,
            clerkAuthMethodId,
          ], // permittedAuthMethodIds
          ["0x", "0x"], // permittedAuthMethodPubkeys
          [[AUTH_METHOD_SCOPE.SignAnything], [AUTH_METHOD_SCOPE.NoPermissions]], // permittedAuthMethodScopes
          true, // addPkpEthAddressAsPermittedAddress
          true, // sendPkpToItself
          { value: pkpMintCost }
        );
      const receipt = await tx.wait();

      return this.getPkpInfoFromMintReceipt(receipt, this.litContracts);
    } catch (error) {
      console.error(error);
    }
  };


  async getPkpSessionSigs (
    userId: string, token: string,
    mintedPkp: Pkp
  ) {

    if (!this.client || !this.ethersSigner) return
    try {
      const sessionSignatures = await this.client.getPkpSessionSigs({
        pkpPublicKey: mintedPkp.publicKey,
        litActionCode: Buffer.from(litActionCode).toString("base64"),
        jsParams: {
          userId,
          token,
          pkpTokenId: mintedPkp.tokenId,
        },
        resourceAbilityRequests: [
          {
            resource: new LitPKPResource("*"),
            ability: LIT_ABILITY.PKPSigning,
          },

        ],
        expiration: new Date(Date.now() + 1000 * 60 * 2).toISOString(), // 2 minutes
        chain: "ethereum"
      });


      return sessionSignatures;
    } catch (error) {
      console.error(error);
    }
  }

  async pkpSignMessage (
    litSessionSigs: any,
    pkpPublicKey: string,
    dataToSign: string
  ) {
    if (!this.client) return
    try {
      const wallet = new PKPEthersWallet({
        pkpPubKey: pkpPublicKey,
        litNodeClient: this.client,
        controllerSessionSigs: litSessionSigs
      });
      let body: string | Uint8Array

      try {
        const msg = new SiweMessage(dataToSign)
        body = msg.prepareMessage()

      } catch (error) {
        body = dataToSign
      }


      const res = await wallet.signMessage(body)
      return res

    } catch (error) {
      console.error(error);
    }
  };

  async pkpSignRawMessage (
    litSessionSigs: any,
    pkpPublicKey: string,
    dataToSign: string
  ) {
    if (!this.client) return
    try {

      const res = await this.client.pkpSign({
        pubKey: pkpPublicKey,
        sessionSigs: litSessionSigs,
        toSign: ethers.utils.arrayify(
          dataToSign
        )
      });

      return res.signature


    } catch (error) {
      console.error(error);
    }
  };


  async encryptToIpfs (props: ParameterType & { string?: string; file?: File | Blob; metadata: any }) {
    if (!this.client) throw new Error(`there's no litNodeClient`)
    if (props.string && props.file) throw new Error(`You can't encrypt a file and a string`);
    if (!props.string && !props.file) throw new Error(`File and String are both undefined`);

    await lit.connect();
    if (!lit.client) throw new Error(`Lit client is not connected`);

    let encryptionResult;

    // file
    if (props?.file !== undefined) {
      const encryptionProps = { ...props, file: props.file }; // Ensure file is not undefined
      encryptionResult = await encryptFile(encryptionProps, this.client);
    }
    // string
    else if (props.string) encryptionResult = await encryptString({ dataToEncrypt: props.string, ...props }, this.client);

    if (!encryptionResult) throw new Error(`Encryption failed`);

    const { ciphertext, dataToEncryptHash } = encryptionResult;

    const res = await pinata.upload.json({
      [props.file ? "encryptedFile" : "encryptedString"]: dataToEncryptHash,
      ciphertext: ciphertext,
      accessControlConditions: props.accessControlConditions,
      evmContractConditions: props.evmContractConditions,
      solRpcConditions: props.solRpcConditions,
      unifiedAccessControlConditions: props.unifiedAccessControlConditions,
      chain: props.chain,
      metadata: props.metadata,
    });


    return res.IpfsHash;
  };

  async decryptFromIpfs (props: decryptToIpfsProps) {
    if (!this.client) throw new Error("Lit not connected!!")
    try {

      const ipfsData = await (await fetch(`${ipfsPlublicClientUrl}${props.ipfsCid}`)).json();

      const data = {
        sessionSigs: props.sessionSigs,
        chain: ipfsData.chain,
        ciphertext: ipfsData.ciphertext,
        dataToEncryptHash: ipfsData.encryptedString || ipfsData.encryptedFile,
        evmContractConditions: ipfsData.evmContractConditions,
        solRpcConditions: ipfsData.solRpcConditions,
        unifiedAccessControlConditions: ipfsData.unifiedAccessControlConditions,
        accessControlConditions: ipfsData.accessControlConditions,
      };

      let decrypted;

      if (ipfsData.encryptedString) decrypted = await decryptToString(data, this.client);
      else if (ipfsData.encryptedFile) decrypted = await decryptToFile(data, this.client);
      return { data: decrypted, metadata: ipfsData.metadata };
    } catch (error) {
      console.log("decryptFromIpfs (error):");
      console.dir(error);
      throw error;
    }
  }


  // ------------------ UTILS ------------------ i hate oop

  async getPkpMintCost (litContracts: LitContracts) {
    const pkpMintCost = await litContracts.pkpNftContract.read.mintCost();
    return pkpMintCost;
  };
  getClerkAuthMethodInfo (userId: string) {
    const authMethodInfo = {
      authMethodType: ethers.utils.keccak256(
        ethers.utils.toUtf8Bytes("Etched clerk auth method")
      ),
      authMethodId: ethers.utils.keccak256(
        ethers.utils.toUtf8Bytes(`etched:clerk:${userId}`)
      ),
    };

    return authMethodInfo;
  };

  async getLitActionCodeIpfsCid () {
    const litActionIpfsCid = await IpfsHash.of(litActionCode);

    return litActionIpfsCid;
  };

  async getPkpInfoFromMintReceipt (
    txReceipt: ethers.ContractReceipt,
    litContractsClient: LitContracts
  ) {
    const pkpMintedEvent = txReceipt!.events!.find(
      (event) =>
        event.topics[0] ===
        "0x3b2cc0657d0387a736293d66389f78e4c8025e413c7a1ee67b7707d4418c46b8"
    );

    const publicKey = "0x" + pkpMintedEvent!.data.slice(130, 260);
    const tokenId = ethers.utils.keccak256(publicKey);
    const ethAddress = await litContractsClient.pkpNftContract.read.getEthAddress(
      tokenId
    );

    return {
      tokenId: ethers.BigNumber.from(tokenId).toString(),
      publicKey,
      ethAddress,
    };
  };

  async getCapacityCredit () {
    if (!this.litContracts) return
    try {

      const capacityTokenId = (
        await this.litContracts.mintCapacityCreditsNFT({
          requestsPerKilosecond: 10,
          daysUntilUTCMidnightExpiration: 1,
        })
      ).capacityTokenIdStr;


      return capacityTokenId;
    } catch (error) {
      console.error(error);
    }
  };


  async addUsersAsPayees (users: string[]) {
    if (litNetwork !== "datil") return
    const headers = {
      "api-key": env.LIT_RELAYER_API_KEY,
      "payer-secret-key": env.LIT_PAYER_SECRET_KEY,
      "Content-Type": "application/json",
    };

    try {
      const response = await fetch("https://datil-relayer.getlit.dev/add-users", {
        method: "POST",
        headers: headers,
        body: JSON.stringify(users),
      });

      if (!response.ok) {
        throw new Error(`Error: ${await response.text()}`);
      }

      const data = (await response.json()) as AddUserResponse;
      if (data.success !== true) {
        throw new Error(`Error: ${data.error}`);
      }

      return true;
    } catch (error) {
      console.error("Error registering payer:", error);
      throw error;
    }
  };



}

export const lit = new LitServerSide();

// TODO: remove this when lit fixed the issue
export const hashMessageForLit = (message: string): `0x${string}` => {
  // From rust code
  const hexMessage = toBytes(toHex(toBytes(message)).slice(2).toLowerCase());
  const hash = keccak256(hexMessage);

  return hash;
};

