import { currentNetworkId, currentNode } from "@/contracts";


import { useAuth } from "@clerk/nextjs";
import { getWalletClient } from "@wagmi/core";
import { signOut as _signOut, signIn, useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import { SiweMessage } from "siwe";
import nacl from "tweetnacl";
import naclUtil from "tweetnacl-util";
import { Address, encodeAbiParameters, keccak256, parseAbiParameters, toBytes, toHex } from "viem";
import { useAccount, useBlockNumber, useSignMessage } from "wagmi";

import { toast } from "@/components/ui/use-toast";

import { api } from "../api";
import { useRouter } from "next/router";
import { Pkp } from "../litTypes";
import { ethers } from "ethers";



export function useSignOut() {
  const { signOut: clerkSignOut, sessionId } = useAuth();

  const signOut = async () => {
    try {
      if (sessionId) await clerkSignOut({ sessionId });

      localStorage.clear();

      _signOut({ callbackUrl: "/auth" });
    } catch (error) {
      console.error("signOut error: ", error);
    }
  };

  return { signOut };
}

export const useSignIn = () => {
  const [isLoading, setIsLoading] = useState(false);
  const { data: blockNumber } = useBlockNumber();
  const { address } = useAccount();
  const { signOut } = useSignOut();

  const { signMessageAsync } = useSignMessage();
  const { mutateAsync: signMessage } = api.lit.signMessage.useMutation();
  const { mutateAsync: signRawMessage } = api.lit.signRawMessage.useMutation();
  const { userId: _userId } = useAuth();
  const userId = _userId?.toLowerCase();
  const { mutateAsync: getPkp } = api.lit.getPkp.useMutation();
  const { mutateAsync: createPkp } = api.lit.createPkp.useMutation();
  const { data: nextAuthSession } = useSession();
  const { isSignedIn, getToken } = useAuth();
  const router = useRouter();



  useEffect(() => {
    if (nextAuthSession && nextAuthSession.isApproved === "Pending" && isSignedIn && !router.asPath.includes("auth"))
      router.push("/auth/waitlist");
  }, [nextAuthSession, isSignedIn]);

  const logIn = async ({ isPkp = false, callback }: { isPkp?: boolean; callback?: (status: string) => void }) => {
    try {
      if (!blockNumber) return;

      setIsLoading(true);

      callback?.("Preparing your Folders");

      const authSig = await regenerateAuthSig(undefined, { isPkp, userId });

      const blockchainMessage = await encodeAbiParameters(parseAbiParameters("uint256 blockNumber, address nodeAddress"), [
        10000000000n,
        currentNode! as Address,
      ]);

      callback?.("Tidying your workspace");

      const walletClient = await getWalletClient({ chainId: Number(currentNetworkId!) });

      let blockchainSignature;
      if (isPkp) {
        const token = await getToken()

        if (!token) throw new Error("No token provided");
        if (!userId) throw new Error("No user ID provided");
        const _blockchainSignature = await signRawMessage({
          message: ethers.utils.keccak256(
            ethers.utils.solidityPack(
              ["string", "bytes32"],
              ["\x19Ethereum Signed Message:\n32", keccak256(blockchainMessage)]
            )
          ),
          userId: userId,
          token,
          pkp: authSig.pkp
        });

        blockchainSignature = _blockchainSignature.signature;
      } else blockchainSignature = await walletClient!.signMessage({ message: { raw: keccak256(blockchainMessage) } });
      // TODO: Test if it works with metamask

      callback?.("Making sure everything is in order");

      // Send the signature to the server to be verified, and sign in or sign up the user
      const signedIn = await signIn("credentials", {
        message: authSig.signedMessage,
        signature: authSig.sig,
        userId: _userId,
        derivedVia: authSig.derivedVia,
        pkpAddress: authSig.pkp.ethAddress,
        blockchainMessage,
        blockchainSignature,
        redirect: false,
      });

      console.dir("signedIn", signedIn);
      if (!signedIn?.ok) {
        toast({
          title: "Error",
          description: "Unable to sign in. Please try again later.",
          variant: "destructive",
        });
        signOut();
      }

      localStorage.setItem("blockchainSignature", blockchainSignature);
      localStorage.setItem("blockchainMessage", blockchainMessage);
    } catch (error) {
      console.error("error login: ", error);
    }

    setIsLoading(false);
  };

  const regenerateAuthSig = async (
    _expiration?: string,
    {
      addressOverride,
      isPkp,
      userId,
    }: {
      addressOverride?: string;
      isPkp?: boolean;
      userId?: string;
    } = {}
  ) => {
    try {
      let pkp: Pkp | undefined
      if (isPkp && !addressOverride) {
        let user: {
          eoa: string;
          id: string;
          pkp: {
            tokenId: string;
            clerkId?: string;
            publicKey: string;
            ethAddress: string;
          };
        } | undefined = await getPkp({
          userId: userId!,
        })
        if (!user) {
          user = await createPkp({
            userId: userId!
          })
        }
        addressOverride = user.eoa;
        pkp = user.pkp
      }

      const expiration_time = 60 * 60 * 24 * 7; // 7 days
      const expiration_date = new Date(Date.now() + expiration_time * 1000);
      const expiration = _expiration ?? expiration_date.toISOString();

      const signature = JSON.parse(localStorage.getItem("lit-auth-signature")!);


      const expirationDateString = signature?.signedMessage
        .split("\n")
        .find((line: string) => line.startsWith("Expiration Time:"))
        .split(": ")[1];

      // cache
      if (signature && new Date(expirationDateString) > new Date()) return signature;

      // -- 1. prepare 'sign-in with ethereum' message
      const preparedMessage = {
        domain: globalThis.location.host,
        uri: globalThis.location.href,
        address: addressOverride ?? address,
        version: "1",
        statement: "This message will allow both Lit MPC Protocol, and etched, to verify your identity.",
        chainId: currentNetworkId,
        expirationTime: expiration,
      };

      const message = new SiweMessage(preparedMessage);
      const body = message.prepareMessage();

      // -- 2. sign the message

      let signedResult: string | undefined;


      if (isPkp) {
        const token = await getToken()

        if (!userId) throw new Error("No user ID provided");
        if (!token) throw new Error("No token provided");
        const litSignatureResult = await signMessage({
          userId: userId,
          message: body,
          pkp: pkp!,
          token
        });
        signedResult = litSignatureResult.signature;
      } else signedResult = await signMessageAsync({ message: body });

      if (!signedResult) throw new Error("Unable to sign message");

      let authSig = {
        sig: signedResult,
        derivedVia: "web3.eth.personal.sign",
        signedMessage: body,
        address: (addressOverride ?? address)?.toLowerCase(),
        pkp
      };



      if (authSig) localStorage.setItem("lit-auth-signature", JSON.stringify(authSig));

      const commsKeyPair = nacl.box.keyPair();
      if (commsKeyPair)
        localStorage.setItem(
          "lit-comms-keypair",
          JSON.stringify({
            publicKey: naclUtil.encodeBase64(commsKeyPair.publicKey),
            secretKey: naclUtil.encodeBase64(commsKeyPair.secretKey),
          })
        );

      return authSig;
    } catch (error) {
      console.error("error regenerateAuthSig: ", error);
      signOut();
    }
  };

  return { isLoading, logIn, regenerateAuthSig };
};

export const useLoggedInAddress = () => {
  const [loggedInAddress, setLoggedInAddress] = useState<string | null>(null);

  useEffect(() => {
    const authSignature = JSON.parse(localStorage.getItem("lit-auth-signature") ?? "{}");
    setLoggedInAddress(authSignature.address);
  }, []);

  return loggedInAddress || "";
};
