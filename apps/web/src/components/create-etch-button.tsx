import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { api } from "@/utils/api";
import { zodResolver } from "@hookform/resolvers/zod";
import React, { useEffect } from "react";
import { FieldValues, useForm } from "react-hook-form";
import * as z from "zod";
import { Button } from "./ui/button";
import { Label } from "./ui/label";
import { Switch } from "./ui/switch";

import { currentNetwork } from "@/contracts";
import * as LitJsSdk from "@lit-protocol/lit-node-client";

import { useUploadThing } from "@/utils/uploadthing";
import { useAccount } from "wagmi";
import { toast } from "./ui/use-toast";

const formSchema = z.object({
  etchTitle: z.string(),
  etchDescription: z.string(),
  etchFile: z.any(),
  etchVisibility: z.boolean(),
});

type FormData = z.infer<typeof formSchema>;

const previewFileTypes = ["pdf", "docx", "doc", "txt", "png", "jpg", "docx", "jpeg", "gif", "svg", "mp4", "mp3", "wav", "mpeg"];

export const CreateEtchButton = () => {
  const [fileBlobUrl, setFileBlobUrl] = React.useState<string>("");
  const { mutateAsync: mintAsync, isLoading: mintLoading } = api.etch.mintEtch.useMutation();
  const { mutateAsync: encryptAsync, isLoading: encryptLoading } = api.etch.uploadAndEncrypt.useMutation();
  const { mutateAsync: updateAsync, isLoading: updateLoading } = api.etch.setMetadata.useMutation();
  const { address } = useAccount();
  const { startUpload, isUploading } = useUploadThing("EtchUpload");

  const iframeRef = React.useRef<HTMLIFrameElement>(null);
  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      etchTitle: "",
      etchDescription: "",
      etchFile: null,
      etchVisibility: false,
    },
  });

  const onSubmit = async (data: FormData) => {
    const authSig = await LitJsSdk.checkAndSignAuthMessage({ chain: currentNetwork });

    const etchId = await mintAsync({
      fileName: data.etchTitle,
      fileDescription: data.etchDescription,

      // If the IpfsCid is empty, it can be set later.
      ipfsCid: "",
    });

    const uploaded = await startUpload([data.etchFile]);

    if (!uploaded || !uploaded[0])
      return toast({
        title: "Upload failed",
        description: "Please try again",
        variant: "destructive",
      });

    const { ipfsCid } = await encryptAsync({
      etchId: etchId.toString(),
      fileUrl: uploaded[0].fileUrl,
      authSig,
    });

    await updateAsync({
      etchId: etchId.toString(),
      fileName: data.etchTitle,
      ipfsCid,
      blockchainSignature: localStorage.getItem("blockchainSignature")!,
      blockchainMessage: localStorage.getItem("blockchainMessage")!,
    });
  };

  useEffect(() => {
    if (iframeRef.current)
      iframeRef.current.onload = () =>
        iframeRef.current?.contentWindow?.document?.body &&
        (iframeRef.current.contentWindow.document.body.style.backgroundColor = "transparent");
  }, [fileBlobUrl]);

  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button>Create Etch</Button>
      </AlertDialogTrigger>
      <AlertDialogContent className={"max-h-screen overflow-y-scroll lg:max-w-screen-lg"}>
        <AlertDialogHeader>
          <AlertDialogTitle>Create New Etch</AlertDialogTitle>
        </AlertDialogHeader>

        <div className="w-full">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)}>
              <div className="mb-2 flex flex-col gap-2 md:flex-row">
                <div className="flex w-full flex-col gap-5">
                  <FormField
                    control={form.control}
                    name="etchTitle"
                    render={({ field }: { field: FieldValues }) => (
                      <FormItem>
                        <FormLabel>Public Etch Title</FormLabel>
                        <FormControl>
                          <Input id="etchTitle" placeholder="Enter etch title" {...field} />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="etchDescription"
                    render={({ field }: { field: FieldValues }) => (
                      <FormItem>
                        <FormLabel>Public Etch Description (currently not in use)</FormLabel>
                        <FormControl>
                          <Input id="etchDescription" placeholder="Enter etch description" {...field} />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="etchFile"
                    render={({ field }: { field: FieldValues }) => (
                      <FormItem>
                        <FormLabel>Upload Etch</FormLabel>
                        <FormControl>
                          <Input
                            type="file"
                            id="etchFile"
                            multiple={false}
                            onChange={(event) => {
                              if (event.target.files?.[0]) {
                                field.onChange(event.target.files?.[0]);

                                if (previewFileTypes.includes(event.target.files?.[0].type.split("/").pop()!)) {
                                  setFileBlobUrl(URL.createObjectURL(event.target.files?.[0]));
                                } else {
                                  setFileBlobUrl("UNSUPPORTED");
                                }
                              }
                            }}
                          />
                        </FormControl>
                        <FormDescription>Etch File: Can be set to private through encryption</FormDescription>
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="etchVisibility"
                    render={({ field }: { field: FieldValues }) => (
                      <FormItem className="flex flex-row items-center justify-between rounded-lg">
                        <div className="space-y-0.5">
                          <FormLabel className="text-base">Etch Visibility</FormLabel>
                          <FormDescription>Choose whether your etch is public or private.</FormDescription>
                        </div>
                        <FormControl>
                          <Switch checked={field.value} onCheckedChange={field.onChange} />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                </div>
                {fileBlobUrl && fileBlobUrl !== "UNSUPPORTED" && (
                  <div>
                    <Label>Preview</Label>
                    <iframe src={fileBlobUrl} title="Preview" ref={iframeRef} className="border" />
                  </div>
                )}
              </div>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <Button isLoading={mintLoading || updateLoading || encryptLoading || isUploading} type="submit">
                  Create
                </Button>
              </AlertDialogFooter>
            </form>
          </Form>
        </div>
      </AlertDialogContent>
    </AlertDialog>
  );
};
