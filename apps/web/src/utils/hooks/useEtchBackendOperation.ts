import { getSelectedTeam } from "@/components/team-selector";
import { toast } from "@/components/ui/use-toast";
import { useContext, useState } from "react";
import { z } from "zod";
import { api } from "../api";
import { useUploadThing } from "../uploadthing";
import { refetchContext } from "../urql";
import { useSignIn } from "./useSignIn";
import { getZodErrorMessages } from "../common";
import util from 'util'

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
  const { startUpload, isUploading } = useUploadThing("EtchUpload", {
    onUploadProgress: (progress) => setUploadProgress(progress),
  });
  const { addOperation, setOperation, refetchEtches } = useContext(refetchContext);
  const { regenerateAuthSig } = useSignIn();
  const [etchCreated, setEtchCreated] = useState(0);

  const onSubmit = async (data: FormData[]): Promise<void> => {
    enableBeforeUnload();

    const opId = addOperation({
      name: "Creation of " + data.length + " etch" + (data.length > 1 ? "es" : ""),
      status: "Uploading files",
      progress: 0,
      statusType: "loading",
      timestamp: Date.now(),
    });

    try {
      const uploaded = await startUpload(data.map((d) => d.file));

      if (!uploaded || !uploaded[0]) {
        toast({
          title: "Upload failed",
          description: "Please try again",
          variant: "destructive",
        });
        return;
      }

      setOperation(opId, {
        name: "Creation of " + data.length + " etch" + (data.length > 1 ? "es" : ""),
        status: "Generating Signatures",
        progress: 33,
        statusType: "loading",
      });
      const authSig = await regenerateAuthSig();

      setOperation(opId, {
        name: "Creation of " + data.length + " etch" + (data.length > 1 ? "es" : ""),
        status: "Minting Etch",
        progress: 66,
        statusType: "loading",
      });

      setEtchCreated(data.length);

      console.log(data);

      const res = await bulkMintEtch({
        blockchainMessage: localStorage.getItem("blockchainMessage")!,
        blockchainSignature: localStorage.getItem("blockchainSignature")!,
        authSig,
        team: BigInt(getSelectedTeam().id || 0n),

        files: data.map((d, i) => ({
          name: d.name,
          description: d.description,
          url: uploaded?.[i]?.url || "",
          type: d.file.type,
        })),
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
    }
  };

  const isLoading: boolean = isMintLoading || isUploading;

  return { onSubmit, isLoading, isUploading, etchCreated, setEtchCreated, uploadProgress };
};
