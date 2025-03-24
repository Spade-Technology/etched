import { getSelectedTeam } from "@/components/team-selector";
import { toast } from "@/components/ui/use-toast";
import { useContext, useState } from "react";
import { z } from "zod";
import { api } from "../api";
import { refetchContext } from "../urql";
import { useSignIn } from "./useSignIn";
import { getZodErrorMessages } from "../common";
import util from 'util'
import { lit } from "@/LitClientSide";
import { camelCaseNetwork } from "@/contracts";
import { defaultAccessControlConditions } from "../accessControlConditions";

import { Address, decodeEventLog, encodeFunctionData, encodePacked, keccak256 } from "viem";
import { useSession } from "next-auth/react";
const random = require("random-bigint");

const formSchema = z.object({
  name: z.string(),
  description: z.string(),
  file: z.any(),
});

type FormData = z.infer<typeof formSchema>;

function enableBeforeUnload() {
  window.onbeforeunload = function (e) {
    return "Discard changes?";
  };
}
function disableBeforeUnload() {
  window.onbeforeunload = null;
}

export const useCreateEtch = () => {
  const { mutateAsync: bulkMintEtch, isLoading: isMintLoading } = api.etch.bulkMintEtch.useMutation();
  const [uploadProgress, setUploadProgress] = useState<number>(0);
  const [isUploading, setIsUploading] = useState<boolean>(false);

  const { addOperation, setOperation, refetchEtches } = useContext(refetchContext);
  const { regenerateAuthSig } = useSignIn();
  const [etchCreated, setEtchCreated] = useState(0);

  const { data: session } = useSession();

  const onSubmit = async (data: FormData[]): Promise<void> => {
    let ipfsCids: string[] = [];
    let etchUIDs: string[] = [];
    enableBeforeUnload();
    setIsUploading(true);

    const authSig = await regenerateAuthSig();
    const team = BigInt(getSelectedTeam().id || 0n);
    const functionName = team ? "safeMintForTeam" : "safeMint";

    const opId = addOperation({
      name: "Creation of " + data.length + " etch" + (data.length > 1 ? "es" : ""),
      status: "Uploading files",
      progress: 0,
      statusType: "loading",
      timestamp: Date.now(),
    });

    try {
      const etchArgs = await Promise.all(data.map(async (d) => {
        const etchUID = BigInt(keccak256(encodePacked(["address"], [session?.user.address as Address]))) + random(48);
        etchUIDs.push(etchUID);
        setOperation(opId, {
          name: "Creation of " + d.file.name,
          status: "Generating Signatures",
          progress: 33,
          statusType: "loading",
        });
        const ipfsCid = await lit.encryptToIpfs({
          authSig,
          sessionSigs: {} as any,
          file: d.file,
          chain: camelCaseNetwork,
          evmContractConditions: defaultAccessControlConditions({ etchUID: etchUID.toString() }),
          metadata: { type: d.file.type, etchUID: etchUID.toString() },
        }).catch((err) => {
          console.error(err);
        });
        setOperation(opId, {
          name: "Creation of " + d.file.name,
          status: "Minting Etch",
          progress: 66,
          statusType: "loading",
        });
        ipfsCids.push(ipfsCid || "");

        const args = team ? [etchUID, team, d.file.name, ipfsCid] : [etchUID, session?.user.address as Address, d.file.name, ipfsCid];
        return args;
      }));


      setEtchCreated(data.length);



      const res = await bulkMintEtch({
        blockchainMessage: localStorage.getItem("blockchainMessage")!,
        blockchainSignature: localStorage.getItem("blockchainSignature")!,
        authSig,

        functionName,
        args: etchArgs,
      });

      setOperation(opId, {
        name: "Creation of " + data.length + " etch" + (data.length > 1 ? "es" : ""),
        description: "tx: " + res.tx + " -- etchId: " + res.ids,
        status: "Done",
        progress: 100,
        statusType: "success",
      });
      toast({
        title: "Etch created",
        description: "Your etch has been created, and will be visible shortly.",
        variant: "success",
      });
      disableBeforeUnload();

      const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

      await sleep(5000);

      refetchEtches();
    } catch (e: any) {
      console.error(e);
      // console.log(util.inspect(e, { showHidden: false, depth: null, colors: true }))
      toast({
        title: "Something went wrong",
        description: e.message || "Please try again",
        variant: "destructive",
      });
      setOperation(opId, {
        name: "Creation of " + data.length + " etch" + (data.length > 1 ? "es" : ""),
        status: "Something went wrong",
        statusType: "error",
        error: (e.message || e.code || "Unknown error") as string,
      });
      disableBeforeUnload();
    } finally {
      setIsUploading(false);
    }
  };

  const isLoading: boolean = isMintLoading || isUploading;

  return { onSubmit, isLoading, isUploading, etchCreated, setEtchCreated, uploadProgress };
};
