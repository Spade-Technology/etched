import * as LitJsSdk from "@lit-protocol/lit-node-client";
import { decryptToIpfsProps } from "./utils/litTypes";
import { decryptToFile, decryptToString, encryptFile, encryptString } from '@lit-protocol/encryption';

import { pinata } from "./ipfs";

export const litNetwork = process.env.NODE_ENV === "development" ? "datil-dev" : "datil";

const client = new LitJsSdk.LitNodeClient({
  litNetwork: litNetwork,
  // only on client
  alertWhenUnauthorized: typeof window !== "undefined" ? true : false,
  // Verbosity of the logging
  debug: false,

  checkNodeAttestation: process.env.NODE_ENV !== "development",
});

const ipfsPlublicClientUrl = process.env.NEXT_PUBLIC_IPFS_PUBLIC_GATEWAY + "ipfs/" || "https://gateway.pinata.cloud/ipfs/";


type ParameterType = Omit<Parameters<typeof encryptFile>[0], "file">;

class LitServerSide {
  public client?: LitJsSdk.LitNodeClient;
  private connectingLock?: Promise<LitJsSdk.LitNodeClient>;


  constructor() {

    this.connect()
  }

  async connect() {
    if (this.client) return this.client;

    if (!this.connectingLock) {
      this.connectingLock = new Promise(async (resolve, reject) => {
        console.log("connecting to lit node");

        try {
          await client.connect();
          if (!client) throw new Error(`Lit client is not connected`);

          console.log("connected to lit node: ", client.config.litNetwork);

          this.client = client;


          resolve(this.client);
        } catch (error) {
          reject(error);
        }
      });
    }

    return this.connectingLock;
  }

  async encryptToIpfs(props: ParameterType & { string?: string; file?: File | Blob; metadata: any }) {
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



  async decryptFromIpfs(props: decryptToIpfsProps) {
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



}

export const lit = new LitServerSide();


